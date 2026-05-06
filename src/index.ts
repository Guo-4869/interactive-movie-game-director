import dotenv from 'dotenv';
import { createScriptWriter } from './services/scriptWriter';
import { StoryState, Character } from './types';

dotenv.config();

const demoCharacters: Character[] = [
  {
    id: '1',
    name: '林晓',
    description: '28岁的年轻侦探，眼神锐利，思维敏捷',
    personality: '冷静理智，善于观察，有时过于执着',
    background: '曾是警校高材生，因一次失误离开警队，现为私家侦探',
  },
  {
    id: '2',
    name: '神秘女子',
    description: '身穿黑色风衣，面容姣好但神情冷漠',
    personality: '神秘莫测，说话隐晦，似乎隐藏着秘密',
    background: '身份不明，总是在关键时刻出现',
  },
];

const demoStoryState: StoryState = {
  id: 'story-1',
  title: '雨夜谜案',
  premise: '在一个暴雨之夜，侦探林晓接到一个神秘电话，前往一栋废弃的旧宅调查一起失踪案。他不知道，这将揭开一个埋藏多年的秘密。',
  characters: demoCharacters,
  currentSceneId: '',
  scenes: [],
  choicesHistory: [],
  createdAt: new Date(),
  lastUpdated: new Date(),
};

async function main() {
  try {
    const scriptWriter = createScriptWriter();
    
    console.log('=== 交互式电影游戏导演 - 剧本续写模块 ===');
    console.log('故事标题:', demoStoryState.title);
    console.log('故事梗概:', demoStoryState.premise);
    console.log('');

    const firstScene = await scriptWriter.writeInitialScene(demoStoryState);
    console.log('--- 场景 1:', firstScene.title, '---');
    console.log('地点:', firstScene.setting);
    console.log('时间:', firstScene.timeOfDay);
    console.log('氛围:', firstScene.atmosphere);
    console.log('动作:', firstScene.action);
    
    if (firstScene.dialogue.length > 0) {
      console.log('');
      console.log('对话:');
      firstScene.dialogue.forEach((line) => {
        console.log(`${line.speaker}: "${line.text}"`);
      });
    }

    console.log('');
    console.log('选择:');
    firstScene.nextChoices.forEach((choice, index) => {
      console.log(`${index + 1}. ${choice.text}`);
      console.log(`   → ${choice.consequence}`);
    });

    const secondScene = await scriptWriter.continueStory(
      demoStoryState,
      [firstScene],
      firstScene.nextChoices[0]
    );
    
    console.log('');
    console.log('--- 场景 2:', secondScene.title, '---');
    console.log('地点:', secondScene.setting);
    console.log('时间:', secondScene.timeOfDay);
    console.log('氛围:', secondScene.atmosphere);
    console.log('动作:', secondScene.action);
    
    if (secondScene.dialogue.length > 0) {
      console.log('');
      console.log('对话:');
      secondScene.dialogue.forEach((line) => {
        console.log(`${line.speaker}: "${line.text}"`);
      });
    }

    console.log('');
    console.log('选择:');
    secondScene.nextChoices.forEach((choice, index) => {
      console.log(`${index + 1}. ${choice.text}`);
      console.log(`   → ${choice.consequence}`);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

if (require.main === module) {
  main();
}

export { createScriptWriter } from './services/scriptWriter';
export * from './types';
