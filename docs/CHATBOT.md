# AI 对话机器人使用指南

## 功能概述

本项目集成了一个智能 AI 对话机器人，位于页面右下角。它能够：
- 介绍第四期训练营的项目背景和作品
- 分享学习心得和技能收获
- 回答关于项目的各种问题
- 提供多轮对话支持

## 技术实现

### 1. 架构设计

```
前端 (React) → Supabase Edge Function → 文心大模型 API
```

- **前端组件**：`src/components/chatbot/ChatBot.tsx`
- **Edge Function**：`supabase/functions/chat/index.ts`
- **流式处理**：`src/utils/stream.ts`
- **System Prompt**：`src/constants/chatbot.ts`

### 2. 核心功能

#### System Prompt（注入灵魂）
在 `src/constants/chatbot.ts` 中定义了详细的 System Prompt，包含：
- 项目背景（AI 会议军师）
- 其他作品介绍
- 学习心得和技能收获
- 个人信息和联系方式
- 语气风格设定（友好、专业、略带幽默）

#### 多轮对话
- 维护完整的对话历史（`conversationHistory`）
- 每次请求都包含之前的所有对话记录
- 支持上下文理解和连贯对话

#### 流式响应
- 使用 SSE (Server-Sent Events) 实现实时流式输出
- 逐字显示 AI 回复，提升用户体验
- 支持请求中断（AbortController）

### 3. API 接入

#### 文心大模型 API
- **端点**：`https://app-9ejz1lg8hfcx-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions`
- **认证**：通过 `INTEGRATIONS_API_KEY` 环境变量
- **请求格式**：
```json
{
  "messages": [
    {"role": "system", "content": "System Prompt"},
    {"role": "user", "content": "用户问题"},
    {"role": "assistant", "content": "AI 回复"}
  ],
  "enable_thinking": false
}
```

#### Edge Function 部署
已自动部署到 Supabase，函数名：`chat`

### 4. 使用方式

#### 用户端
1. 点击页面右下角的聊天按钮（💬）
2. 在对话框中输入问题
3. 按回车或点击发送按钮
4. 实时查看 AI 的流式回复

#### 开发者端
如需修改 System Prompt：
1. 编辑 `src/constants/chatbot.ts`
2. 更新项目背景、个人信息等内容
3. 调整语气风格和回答原则

## 自定义配置

### 修改 System Prompt

编辑 `src/constants/chatbot.ts`，可以自定义：

```typescript
export const CHATBOT_SYSTEM_PROMPT = `
你是一个专业且友好的 AI 助手...

【项目背景】
// 在这里添加你的项目介绍

【个人信息】
// 在这里添加你的个人信息

【语气风格】
// 在这里定义对话风格
`;
```

### 调整 UI 样式

编辑 `src/components/chatbot/ChatBot.tsx`：
- 修改对话框尺寸：`w-[380px] h-[600px]`
- 修改浮动按钮位置：`bottom-6 right-6`
- 修改主题色：使用 Tailwind 的 `primary` 等语义化颜色

### 更换 AI 模型

如需使用其他 AI 模型：
1. 修改 `supabase/functions/chat/index.ts` 中的 API 端点
2. 调整请求格式以匹配新模型的要求
3. 更新响应解析逻辑（`onData` 回调）

## 常见问题

### Q: 如何查看对话历史？
A: 对话历史存储在组件的 `messages` 状态中，刷新页面后会清空。如需持久化，可以集成 Supabase 数据库。

### Q: 如何限制对话轮数？
A: 在 `handleSendMessage` 函数中添加判断：
```typescript
if (messages.length > 20) {
  // 提示用户对话轮数过多
  return;
}
```

### Q: 如何添加预设问题？
A: 在欢迎消息下方添加快捷按钮：
```typescript
<div className="flex flex-wrap gap-2">
  <Button size="sm" onClick={() => setInputValue("介绍一下核心项目")}>
    核心项目
  </Button>
  <Button size="sm" onClick={() => setInputValue("有哪些作品？")}>
    作品集
  </Button>
</div>
```

## 效果验证

### 测试问题示例

1. **项目介绍**
   - "你好，能介绍一下这个项目吗？"
   - "AI 会议军师是什么？"
   - "这个项目解决了什么问题？"

2. **技术实现**
   - "这个项目是怎么实现的？"
   - "用了哪些技术栈？"
   - "开发过程中遇到了什么困难？"

3. **学习心得**
   - "有什么学习心得可以分享吗？"
   - "学到了哪些技能？"
   - "对 AI Coding 有什么看法？"

4. **其他作品**
   - "还有其他作品吗？"
   - "新春贺词生成器是什么？"
   - "能介绍一下需求提取 Skills 吗？"

5. **个人信息**
   - "如何联系你？"
   - "你的 GitHub 是什么？"
   - "有个人主页吗？"

## 截图建议

为了提交作业，建议截取以下对话场景：
1. 欢迎界面 + 第一个问题
2. 多轮对话展示（至少 3 轮）
3. 流式输出过程（显示打字效果）
4. 不同类型问题的回答（项目、技术、个人）

## 部署说明

项目已配置好所有必要的环境：
- ✅ Supabase 项目已初始化
- ✅ Edge Function 已部署
- ✅ API 密钥已配置
- ✅ 前端组件已集成

直接部署到 Vercel 即可使用！
