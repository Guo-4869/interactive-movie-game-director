import OpenAI from 'openai';
import {
  StoryState,
  ScriptScene,
  Choice,
  Character,
  ScriptWriterConfig,
} from '../types';
import {
  buildStoryContinuationPrompt,
  buildInitialScriptPrompt,
} from '../utils/promptBuilder';

interface AIResponse {
  title: string;
  setting: string;
  timeOfDay: string;
  atmosphere: string;
  action: string;
  dialogue: { speaker: string; text: string }[];
  choices: { text: string; consequence: string }[];
}

export class ScriptWriterService {
  private openai: OpenAI;
  private config: ScriptWriterConfig;

  constructor(config: ScriptWriterConfig) {
    this.config = config;
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async callAI(prompt: string): Promise<AIResponse> {
    const completion = await this.openai.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    const responseText = completion.choices[0].message.content || '';

    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse AI response:', responseText);
      throw new Error('Failed to parse AI response as JSON');
    }
  }

  private mapToScriptScene(
    response: AIResponse,
    sceneNumber: number,
    characters: Character[]
  ): ScriptScene {
    const nextChoices: Choice[] = response.choices.map((choice) => ({
      id: this.generateId(),
      text: choice.text,
      consequence: choice.consequence,
    }));

    return {
      id: this.generateId(),
      sceneNumber,
      title: response.title,
      setting: response.setting,
      timeOfDay: response.timeOfDay,
      atmosphere: response.atmosphere,
      characters: characters.filter((char) =>
        response.dialogue.some((d) => d.speaker === char.name)
      ),
      dialogue: response.dialogue.map((d) => ({
        speaker: d.speaker,
        text: d.text,
      })),
      action: response.action,
      nextChoices,
    };
  }

  public async writeInitialScene(storyState: StoryState): Promise<ScriptScene> {
    const prompt = buildInitialScriptPrompt(storyState);
    const response = await this.callAI(prompt);
    return this.mapToScriptScene(response, 1, storyState.characters);
  }

  public async continueStory(
    storyState: StoryState,
    previousScenes: ScriptScene[],
    lastChoice?: Choice
  ): Promise<ScriptScene> {
    const prompt = buildStoryContinuationPrompt(storyState, previousScenes);
    const response = await this.callAI(prompt);
    
    if (lastChoice) {
      const consequencePrompt = `
根据之前的选择："${lastChoice.text}"，其后果是："${lastChoice.consequence}"。
请调整以下场景内容，使其符合这个选择的后果：

${JSON.stringify(response, null, 2)}

请仅返回调整后的JSON内容，不要添加额外说明。
      `.trim();
      
      const adjustedResponse = await this.callAI(consequencePrompt);
      return this.mapToScriptScene(
        adjustedResponse,
        previousScenes.length + 1,
        storyState.characters
      );
    }

    return this.mapToScriptScene(
      response,
      previousScenes.length + 1,
      storyState.characters
    );
  }

  public async writeMultipleScenes(
    storyState: StoryState,
    count: number
  ): Promise<ScriptScene[]> {
    const scenes: ScriptScene[] = [];
    let currentStoryState = { ...storyState };
    let previousScenes: ScriptScene[] = [];

    for (let i = 0; i < count; i++) {
      let scene: ScriptScene;
      
      if (i === 0) {
        scene = await this.writeInitialScene(currentStoryState);
      } else {
        scene = await this.continueStory(currentStoryState, previousScenes);
      }

      scenes.push(scene);
      previousScenes.push(scene);
    }

    return scenes;
  }
}

export const createScriptWriter = (config?: Partial<ScriptWriterConfig>) => {
  const defaultConfig: ScriptWriterConfig = {
    model: process.env.OPENAI_MODEL || 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  };

  return new ScriptWriterService({ ...defaultConfig, ...config });
};
