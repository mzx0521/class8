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
前端 (React) → Supabase Edge Function → Coze AI API
```

- **前端组件**：`src/components/chatbot/ChatBot.tsx`
- **Edge Function**：`supabase/functions/chat/index.ts`
- **流式处理**：`src/utils/stream.ts`
- **API 提供商**：Coze AI Assistant

### 2. 核心功能

#### Coze AI 集成
- **API 端点**：`https://hcrhmhftgn.coze.site/stream_run`
- **认证方式**：Bearer Token（需要在环境变量中配置）
- **项目 ID**：7603025396900184104
- **会话管理**：自动生成和维护 session_id

#### 多轮对话
- 通过 session_id 维护对话上下文
- 支持连续对话和上下文理解
- 自动管理会话状态

#### 流式响应
- 使用 SSE (Server-Sent Events) 实现实时流式输出
- 逐字显示 AI 回复，提升用户体验
- 支持请求中断（AbortController）

### 3. API 配置

#### 环境变量设置

**COZE_BEARER_TOKEN**（必需）
- 描述：Coze AI 助手的 Bearer Token
- 获取方式：在 Coze 平台获取您的 API Token
- 配置位置：Supabase 项目的环境变量（Secrets）

#### 请求格式

```json
{
  "content": {
    "query": {
      "prompt": [
        {
          "type": "text",
          "content": {
            "text": "用户输入的消息"
          }
        }
      ]
    }
  },
  "type": "query",
  "session_id": "自动生成的会话ID",
  "project_id": 7603025396900184104
}
```

### 4. 使用方式

#### 用户端
1. 点击页面右下角的聊天按钮（💬）
2. 在对话框中输入问题
3. 按回车或点击发送按钮
4. 实时查看 AI 的流式回复

#### 开发者端
如需修改 API 配置：
1. 编辑 `supabase/functions/chat/index.ts`
2. 更新 project_id 或 API 端点
3. 重新部署 Edge Function

## 配置 COZE_BEARER_TOKEN

### 步骤 1：获取 Token
1. 访问 Coze 平台
2. 登录您的账号
3. 在项目设置或 API 管理中找到 Bearer Token
4. 复制 Token 值

### 步骤 2：配置到 Supabase
1. 打开 Supabase 项目控制台
2. 进入 Settings → Edge Functions → Secrets
3. 添加新的 Secret：
   - Name: `COZE_BEARER_TOKEN`
   - Value: 粘贴您的 Token
4. 保存配置

### 步骤 3：验证配置
1. 打开应用页面
2. 点击右下角的 AI 助手按钮
3. 发送一条测试消息
4. 如果收到回复，说明配置成功

## 自定义配置

### 修改项目 ID

如果您使用的是不同的 Coze 项目，需要修改 `supabase/functions/chat/index.ts`：

```typescript
const cozeRequestBody = {
  // ... 其他配置
  project_id: 您的项目ID  // 修改这里
};
```

### 调整 UI 样式

编辑 `src/components/chatbot/ChatBot.tsx`：
- 修改对话框尺寸：`w-[380px] h-[600px]`
- 修改浮动按钮位置：`bottom-6 right-6`
- 修改主题色：使用 Tailwind 的 `primary` 等语义化颜色

### 自定义响应解析

如果 Coze API 返回的数据格式与预期不同，修改 `ChatBot.tsx` 中的 `onData` 回调：

```typescript
onData: (data) => {
  try {
    const parsed = JSON.parse(data);
    // 根据实际返回格式提取内容
    const chunk = parsed.你的字段名;
    if (chunk) {
      fullResponse += chunk;
      setStreamingContent(fullResponse);
    }
  } catch (e) {
    // 错误处理
  }
}
```

## 常见问题

### Q: 提示 "API Token 未配置" 怎么办？
A: 请按照上述步骤在 Supabase 中配置 `COZE_BEARER_TOKEN` 环境变量。

### Q: 如何查看对话历史？
A: 对话历史存储在组件的 `messages` 状态中，刷新页面后会清空。如需持久化，可以集成 Supabase 数据库。

### Q: 如何实现会话持久化？
A: 可以将 `sessionId` 存储到 localStorage：
```typescript
// 保存
localStorage.setItem('chatSessionId', sessionId);
// 读取
const savedSessionId = localStorage.getItem('chatSessionId');
```

### Q: API 请求失败怎么办？
A: 检查以下几点：
1. COZE_BEARER_TOKEN 是否正确配置
2. project_id 是否正确
3. 网络连接是否正常
4. 查看浏览器控制台的错误信息

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
- ✅ 前端组件已集成
- ⚠️ 需要手动配置 COZE_BEARER_TOKEN

配置完成后，直接部署到 Vercel 即可使用！
