export interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  background: string;
}

export interface Dialogue {
  speaker: string;
  text: string;
  emotion?: string;
}

export interface Choice {
  id: string;
  text: string;
  consequence: string;
  nextSceneId?: string;
}

export interface ScriptScene {
  id: string;
  sceneNumber: number;
  title: string;
  setting: string;
  timeOfDay: string;
  atmosphere: string;
  characters: Character[];
  dialogue: Dialogue[];
  action: string;
  nextChoices: Choice[];
  isEnding?: boolean;
}

export interface StoryState {
  id: string;
  title: string;
  premise: string;
  characters: Character[];
  currentSceneId: string;
  scenes: ScriptScene[];
  choicesHistory: { choiceId: string; sceneId: string }[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface ScriptWriterConfig {
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface WriteScriptRequest {
  storyState: StoryState;
  previousChoices?: string[];
  targetSceneCount?: number;
}

export interface WriteScriptResponse {
  success: boolean;
  scenes: ScriptScene[];
  error?: string;
}
