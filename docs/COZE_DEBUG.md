# Coze AI 调试指南

## 问题现象

AI 助手返回错误："抱歉，我遇到了一些问题，请稍后再试 😅 提示：请确保已在环境变量中配置 COZE_BEARER_TOKEN"

## 已完成的配置

✅ 在 Supabase Secrets 中配置了 `COZE_BEARER_TOKEN`（pat_ 开头的个人令牌）
✅ Edge Function 已重新部署
✅ 添加了详细的日志输出

## 调试步骤

### 步骤 1：验证 Token 是否正确

使用提供的测试脚本直接测试 Coze API：

```bash
# 方法 1：使用 bash 脚本（推荐）
cd /workspace/app-9ejz1lg8hfcx
./test-coze-api.sh pat_你的完整token

# 方法 2：使用 Node.js 脚本
COZE_BEARER_TOKEN=pat_你的完整token node test-coze-api.js

# 方法 3：使用 curl 直接测试
curl -X POST "https://hcrhmhftgn.coze.site/stream_run" \
  -H "Authorization: Bearer pat_你的完整token" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "query": {
        "prompt": [
          {
            "type": "text",
            "content": {
              "text": "你好"
            }
          }
        ]
      }
    },
    "type": "query",
    "session_id": "test123",
    "project_id": 7603025396900184104
  }'
```

**预期结果：**
- ✅ 如果返回流式数据，说明 Token 正确
- ❌ 如果返回 401 错误，说明 Token 无效或过期
- ❌ 如果返回 404 错误，说明 project_id 不正确

### 步骤 2：检查 Supabase Secret 配置

1. 打开 Supabase 控制台
2. 进入项目设置 → Edge Functions → Secrets
3. 确认 `COZE_BEARER_TOKEN` 存在且值正确
4. **重要**：确保 Token 值没有多余的空格或换行符

### 步骤 3：查看浏览器控制台日志

1. 打开应用页面
2. 按 F12 打开开发者工具
3. 切换到 Console 标签
4. 点击 AI 助手并发送消息
5. 查看详细的日志输出：

```
🚀 开始发送消息到 Edge Function
📨 用户消息: 你是谁？
🔗 Session ID: (将自动生成)
📥 收到数据块: ...
📦 解析后的数据: {...}
✅ 请求完成
```

### 步骤 4：检查 Edge Function 日志

由于 Supabase 日志查询有限制，我们在代码中添加了详细的 console.log。

**如何查看 Edge Function 日志：**

1. 在 Supabase 控制台中：
   - 进入 Edge Functions → chat
   - 点击 "Logs" 标签
   - 查看最近的调用记录

2. 关键日志信息：
   ```
   收到用户消息: ...
   Token 状态: 已配置 (长度: XX)
   准备调用 Coze API...
   Coze API 响应状态: 200 OK
   ```

### 步骤 5：常见问题排查

#### 问题 1：Token 未生效

**可能原因：**
- Supabase Secret 配置后需要重新部署 Edge Function
- Token 值包含多余的空格或特殊字符

**解决方法：**
```bash
# 重新部署 Edge Function
cd /workspace/app-9ejz1lg8hfcx
# 在 Supabase 控制台中手动重新部署，或等待自动部署完成
```

#### 问题 2：401 认证失败

**可能原因：**
- Token 已过期
- Token 格式不正确
- Token 权限不足

**解决方法：**
1. 在 Coze 平台重新生成 Token
2. 确保 Token 以 `pat_` 开头
3. 确保 Token 有访问该项目的权限

#### 问题 3：404 项目未找到

**可能原因：**
- project_id 不正确
- Token 没有访问该项目的权限

**解决方法：**
1. 检查 Coze 项目 ID 是否为 `7603025396900184104`
2. 确保 Token 对应的账号有该项目的访问权限

#### 问题 4：流式响应格式不匹配

**可能原因：**
- Coze API 返回的数据格式与预期不同

**解决方法：**
1. 查看浏览器控制台的 `📦 解析后的数据` 日志
2. 根据实际格式调整 `ChatBot.tsx` 中的解析逻辑

### 步骤 6：手动测试 API 调用

使用以下 curl 命令测试（替换 YOUR_TOKEN）：

```bash
curl -v -X POST "https://hcrhmhftgn.coze.site/stream_run" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "query": {
        "prompt": [
          {
            "type": "text",
            "content": {
              "text": "你好，能介绍一下这个项目吗？"
            }
          }
        ]
      }
    },
    "type": "query",
    "session_id": "test_session_123",
    "project_id": 7603025396900184104
  }'
```

**成功的响应示例：**
```
< HTTP/2 200
< content-type: text/event-stream
< ...

data: {"content": "你好！..."}
data: {"content": "这是..."}
...
```

## 快速修复清单

- [ ] 确认 COZE_BEARER_TOKEN 在 Supabase Secrets 中正确配置
- [ ] 确认 Token 值没有多余空格或换行符
- [ ] 使用测试脚本验证 Token 是否有效
- [ ] 重新部署 Edge Function（已完成）
- [ ] 查看浏览器控制台日志
- [ ] 查看 Supabase Edge Function 日志
- [ ] 确认 project_id 正确
- [ ] 测试 API 直接调用

## 联系支持

如果以上步骤都无法解决问题，请提供以下信息：

1. 浏览器控制台的完整日志
2. Supabase Edge Function 日志截图
3. 使用 curl 测试的完整输出
4. Token 的前 10 个字符（例如：pat_xxxxxx）

## 下一步

完成调试后，请：
1. 在浏览器中测试 AI 助手
2. 发送几条测试消息
3. 确认流式响应正常工作
4. 验证多轮对话功能
