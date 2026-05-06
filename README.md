# Interactive Movie Game Director

一个革命性的AI驱动交互式电影游戏引擎，能够根据剧本开头自动续写剧情，并为视频生成AI（如Sora）生成精准的提示词，创造出真正交互式的电影游戏体验。

## 核心概念

### 问题陈述
传统电影是线性的，观众被动接受故事；传统游戏虽然有互动性，但内容是预先制作好的。我们想要创造一种全新的体验：

1. **无限故事可能** - AI根据初始剧本不断续写，创造无限可能的剧情分支
2. **动态视觉生成** - 将AI生成的剧本实时转化为视频提示词，驱动视频生成AI
3. **玩家选择驱动** - 每个选择都能改变故事走向，创造独特的观影体验

### 技术架构

```
┌─────────────────────────────────────────────────────────────┐
│                    用户交互层                               │
│  [选择界面] ←→ [视频播放] ←→ [决策节点]                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    内容生成引擎                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │ 剧本续写AI  │ →→ │ 提示词生成器  │ →→ │ 视频生成AI  │    │
│  │ (LLM)       │    │ (Prompt Gen) │    │ (Sora等)    │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    数据存储层                                │
│  [故事状态] [用户选择历史] [生成的视频片段]                   │
└─────────────────────────────────────────────────────────────┘
```

## 工作流程

### 1. 剧本续写模块

**输入**：
- 初始剧本片段或故事梗概
- 角色设定和世界观
- 之前的剧情历史

**输出**：
- 续写的剧本场景
- 包含对话、动作描述、场景转换
- 决策节点（供玩家选择）

**技术实现**：
```typescript
interface ScriptScene {
  id: string;
  sceneNumber: number;
  setting: string;
  characters: Character[];
  dialogue: Dialogue[];
  action: string;
  nextChoices: Choice[];
}

interface Choice {
  id: string;
  text: string;
  consequence: string; // 选择后的剧情方向
}
```

### 2. 提示词生成模块

将剧本转换为视频生成AI可理解的详细提示词：

**剧本输入示例**：
```
场景3：雨夜，主角站在废弃工厂门口，犹豫是否进入。
```

**生成的提示词**：
```
Cinematic scene, a lone protagonist standing at the entrance of an abandoned factory on a rainy night, moody atmosphere, dramatic lighting, film noir style, rain pouring down, neon lights reflecting on wet pavement, mysterious and suspenseful mood, 4K, ultra realistic, cinematic composition, dark color palette
```

**提示词生成逻辑**：
```typescript
function generateVideoPrompt(scene: ScriptScene): string {
  const promptElements = [
    "Cinematic scene",
    scene.setting,
    getCharacterDescriptions(scene.characters),
    getMoodFromScene(scene),
    "4K, ultra realistic, cinematic composition"
  ];
  return promptElements.join(", ");
}
```

### 3. 视频生成与播放

将生成的提示词发送到视频生成AI（如Sora、Runway ML等），获取视频片段后播放给用户。

### 4. 决策循环

播放完一段视频后，展示决策选项给用户，用户选择后：
1. 将选择记录到状态中
2. 触发新一轮剧本续写
3. 生成新的视频提示词
4. 获取并播放新视频

## 项目特点

### 创新性
- **无限叙事**：不再受限于预先编写的剧本，AI可以无限续写
- **即时视觉化**：文字剧本实时转化为视频内容
- **个性化体验**：每个玩家的选择都会创造独特的故事线

### 技术挑战
- **剧情连贯性**：确保AI续写保持故事的一致性和逻辑性
- **提示词质量**：生成足够详细的提示词以获得高质量视频
- **响应延迟**：优化从选择到视频播放的等待时间
- **内容安全**：确保AI生成内容符合安全准则

### 应用场景
- **交互式电影体验**：观众可以影响故事走向
- **个性化娱乐**：为每个用户创造独特的观影体验
- **教育应用**：交互式学习故事，通过选择学习历史或科学知识
- **创意写作辅助**：帮助作家探索不同的剧情可能性

## 未来发展

### 短期目标
- 实现基本的剧本续写功能
- 开发提示词生成引擎
- 整合视频生成API

### 中期目标
- 建立故事状态管理系统
- 实现多分支剧情树
- 添加用户界面和交互设计

### 长期愿景
- 创建完整的交互式电影游戏平台
- 支持多种视频生成AI服务
- 允许用户创建和分享自己的故事世界

## 技术栈

- **语言**：TypeScript
- **框架**：Node.js
- **AI服务**：OpenAI API (GPT-4)
- **数据库**：MongoDB/PostgreSQL (存储剧情状态)

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境

1. 创建环境变量文件：

```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 OpenAI API Key：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
```

### 运行演示

```bash
npm run dev
```

## 使用指南

### 核心API

#### 1. 创建剧本续写器

```typescript
import { createScriptWriter } from './src/services/scriptWriter';

const scriptWriter = createScriptWriter({
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 2000,
});
```

#### 2. 定义故事状态

```typescript
import { StoryState, Character } from './src/types';

const characters: Character[] = [
  {
    id: '1',
    name: '林晓',
    description: '28岁的年轻侦探，眼神锐利，思维敏捷',
    personality: '冷静理智，善于观察，有时过于执着',
    background: '曾是警校高材生，因一次失误离开警队，现为私家侦探',
  },
];

const storyState: StoryState = {
  id: 'story-1',
  title: '雨夜谜案',
  premise: '在一个暴雨之夜，侦探林晓接到一个神秘电话，前往一栋废弃的旧宅调查一起失踪案。',
  characters,
  currentSceneId: '',
  scenes: [],
  choicesHistory: [],
  createdAt: new Date(),
  lastUpdated: new Date(),
};
```

#### 3. 生成初始场景

```typescript
const firstScene = await scriptWriter.writeInitialScene(storyState);
console.log('场景标题:', firstScene.title);
console.log('地点:', firstScene.setting);
console.log('选择:', firstScene.nextChoices);
```

#### 4. 续写故事

```typescript
// 根据玩家选择续写
const playerChoice = firstScene.nextChoices[0];
const nextScene = await scriptWriter.continueStory(
  storyState,
  [firstScene],
  playerChoice
);
```

#### 5. 批量生成场景

```typescript
const scenes = await scriptWriter.writeMultipleScenes(storyState, 5);
```

### 输出格式

每个场景返回以下结构：

```typescript
interface ScriptScene {
  id: string;                    // 场景唯一标识
  sceneNumber: number;           // 场景编号
  title: string;                 // 场景标题
  setting: string;               // 地点描述
  timeOfDay: string;             // 时间描述（如：深夜、黄昏）
  atmosphere: string;            // 氛围描述（如：紧张、神秘）
  characters: Character[];       // 出场角色
  dialogue: Dialogue[];          // 对话列表
  action: string;                // 动作描述
  nextChoices: Choice[];         // 玩家选择选项
  isEnding?: boolean;            // 是否为结局
}
```

### 决策循环示例

```typescript
async function runStoryLoop(storyState: StoryState) {
  const scriptWriter = createScriptWriter();
  let currentScene = await scriptWriter.writeInitialScene(storyState);
  let previousScenes = [currentScene];

  while (!currentScene.isEnding) {
    displayScene(currentScene);
    
    const playerChoice = await getPlayerChoice(currentScene.nextChoices);
    
    currentScene = await scriptWriter.continueStory(
      storyState,
      previousScenes,
      playerChoice
    );
    previousScenes.push(currentScene);
  }
  
  displayEnding(currentScene);
}
```

## 项目结构

```
.
├── README.md              # 项目说明文档
├── package.json           # 依赖配置
├── tsconfig.json          # TypeScript配置
├── .env.example           # 环境变量模板
└── src/
    ├── index.ts           # 入口文件（含演示）
    ├── types/
    │   └── index.ts       # 类型定义
    ├── services/
    │   └── scriptWriter.ts # 剧本续写服务
    └── utils/
        └── promptBuilder.ts # AI提示词构建器
```

## API参考

### ScriptWriterService

| 方法 | 功能 | 参数 | 返回值 |
|------|------|------|--------|
| `writeInitialScene` | 生成初始场景 | `storyState: StoryState` | `Promise<ScriptScene>` |
| `continueStory` | 续写剧情 | `storyState, previousScenes, lastChoice?` | `Promise<ScriptScene>` |
| `writeMultipleScenes` | 批量生成场景 | `storyState, count` | `Promise<ScriptScene[]>` |

### 配置选项

| 选项 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `model` | string | `gpt-4` | AI模型名称 |
| `temperature` | number | `0.7` | 创意程度（0-1） |
| `maxTokens` | number | `2000` | 最大token数 |

## 贡献

欢迎提交Issue和Pull Request！我们正在寻找：
- AI提示词工程师
- 前端/后端开发者
- 游戏设计师
- 编剧和故事创作者

## 许可证

MIT License

---

*想象无限，故事永不止息* 🎬
