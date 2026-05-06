import { StoryState, ScriptScene } from '../types';

export function buildStoryContinuationPrompt(
  storyState: StoryState,
  previousScenes: ScriptScene[] = []
): string {
  const charactersDesc = storyState.characters
    .map(
      (char) =>
        `${char.name}: ${char.description} - ${char.personality} - ${char.background}`
    )
    .join('\n');

  const previousScenesDesc = previousScenes
    .map(
      (scene, index) =>
        `场景${index + 1}：${scene.title}\n地点：${scene.setting}\n时间：${scene.timeOfDay}\n氛围：${scene.atmosphere}\n动作：${scene.action}\n对话：${scene.dialogue.map((d) => `${d.speaker}: "${d.text}"`).join('\n')}`
    )
    .join('\n\n');

  return `
你是一位专业的编剧和交互式故事创作者。请根据以下信息续写故事。

## 故事背景
标题：${storyState.title}
设定：${storyState.premise}

## 角色介绍
${charactersDesc}

## 已发生的剧情
${previousScenesDesc || '暂无'}

## 创作要求
1. 续写一个新的场景，场景编号为 ${previousScenes.length + 1}
2. 场景应包含：场景标题、地点、时间、氛围、动作描述、对话
3. 对话要符合角色性格和故事背景
4. 结尾提供2-3个玩家选择，每个选择要能显著影响故事走向
5. 保持故事的连贯性和逻辑性
6. 语言生动，具有画面感

## 输出格式
请以JSON格式输出，包含以下字段：
- "title": 场景标题
- "setting": 场景地点描述
- "timeOfDay": 时间描述（如：深夜、黄昏、清晨）
- "atmosphere": 氛围描述（如：紧张、神秘、温馨）
- "action": 动作描述
- "dialogue": 对话数组，每个元素包含"speaker"和"text"字段
- "choices": 选择数组，每个元素包含"text"（显示给玩家的选项文本）和"consequence"（选择后的剧情方向描述）

示例输出格式：
{
  "title": "场景标题",
  "setting": "详细的地点描述",
  "timeOfDay": "时间",
  "atmosphere": "氛围",
  "action": "动作描述",
  "dialogue": [
    {"speaker": "角色名", "text": "对话内容"}
  ],
  "choices": [
    {"text": "选项1", "consequence": "选择后的剧情方向"},
    {"text": "选项2", "consequence": "选择后的剧情方向"}
  ]
}
  `.trim();
}

export function buildInitialScriptPrompt(storyState: StoryState): string {
  const charactersDesc = storyState.characters
    .map(
      (char) =>
        `${char.name}: ${char.description} - ${char.personality} - ${char.background}`
    )
    .join('\n');

  return `
你是一位专业的编剧和交互式故事创作者。请根据以下信息创作故事的开篇场景。

## 故事设定
标题：${storyState.title}
梗概：${storyState.premise}

## 角色介绍
${charactersDesc}

## 创作要求
1. 创作故事的第一个场景
2. 场景应包含：场景标题、地点、时间、氛围、动作描述、对话
3. 对话要符合角色性格和故事背景
4. 结尾提供2-3个玩家选择，每个选择要能显著影响故事走向
5. 保持故事的连贯性和逻辑性
6. 语言生动，具有画面感

## 输出格式
请以JSON格式输出，包含以下字段：
- "title": 场景标题
- "setting": 场景地点描述
- "timeOfDay": 时间描述（如：深夜、黄昏、清晨）
- "atmosphere": 氛围描述（如：紧张、神秘、温馨）
- "action": 动作描述
- "dialogue": 对话数组，每个元素包含"speaker"和"text"字段
- "choices": 选择数组，每个元素包含"text"（显示给玩家的选项文本）和"consequence"（选择后的剧情方向描述）

示例输出格式：
{
  "title": "场景标题",
  "setting": "详细的地点描述",
  "timeOfDay": "时间",
  "atmosphere": "氛围",
  "action": "动作描述",
  "dialogue": [
    {"speaker": "角色名", "text": "对话内容"}
  ],
  "choices": [
    {"text": "选项1", "consequence": "选择后的剧情方向"},
    {"text": "选项2", "consequence": "选择后的剧情方向"}
  ]
}
  `.trim();
}
