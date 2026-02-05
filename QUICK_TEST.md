# 🚀 快速测试指南

## 立即开始测试（3 分钟）

### 步骤 1：获取您的 Token
从 Coze 平台复制您的 Bearer Token（pat_ 开头）

### 步骤 2：选择测试方式

#### 方式 A：网页测试工具（推荐 ⭐）

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 浏览器访问：
   ```
   http://localhost:5173/test-coze.html
   ```

3. 粘贴您的 Token，点击"开始测试"

#### 方式 B：命令行测试

```bash
# 使用 bash 脚本
./test-coze-api.sh pat_你的token

# 或使用 curl
curl -X POST "https://hcrhmhftgn.coze.site/stream_run" \
  -H "Authorization: Bearer pat_你的token" \
  -H "Content-Type: application/json" \
  -d '{"content":{"query":{"prompt":[{"type":"text","content":{"text":"你好"}}]}},"type":"query","session_id":"test","project_id":7603025396900184104}'
```

### 步骤 3：查看结果

✅ **成功：** 看到流式响应数据
- 说明 Token 有效
- 可以在 Supabase 中配置此 Token

❌ **失败：** 看到错误信息
- 401 错误 → Token 无效或过期
- 404 错误 → Project ID 不正确
- 其他错误 → 查看详细错误信息

### 步骤 4：配置 Supabase

如果测试成功：
1. 打开 Supabase 控制台
2. Settings → Edge Functions → Secrets
3. 添加 `COZE_BEARER_TOKEN` = 您的 Token
4. 等待 1-2 分钟生效

### 步骤 5：测试应用

1. 刷新应用页面
2. 点击右下角 AI 助手
3. 发送消息："你好"
4. 按 F12 查看控制台日志

## 预期日志输出

```
🚀 开始发送消息到 Edge Function
📨 用户消息: 你好
🔗 Session ID: (将自动生成)
📥 收到数据块: ...
📦 解析后的数据: {...}
✅ 请求完成
📝 完整响应长度: XXX
```

## 常见问题

**Q: Token 测试成功，但应用中仍报错？**
A: 等待 1-2 分钟让 Supabase Secret 生效，然后刷新页面。

**Q: 如何查看详细错误？**
A: 按 F12 打开浏览器控制台，查看 Console 标签。

**Q: 测试工具在哪里？**
A: 
- 网页版：`http://localhost:5173/test-coze.html`
- 脚本：`./test-coze-api.sh`
- 文档：`docs/DEBUG_SUMMARY.md`

## 需要帮助？

查看详细文档：
- `docs/DEBUG_SUMMARY.md` - 完整调试报告
- `docs/COZE_DEBUG.md` - 详细调试步骤
- `docs/CHATBOT.md` - AI 助手使用指南
