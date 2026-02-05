# 🔧 Coze API 调试完成报告

## ✅ 已完成的优化

### 1. Edge Function 增强日志
- ✅ 添加了详细的 console.log 输出
- ✅ 记录 Token 状态（长度）
- ✅ 记录请求体和响应状态
- ✅ 增强错误信息提示
- ✅ 重新部署到 Supabase

### 2. 前端组件优化
- ✅ 添加详细的浏览器控制台日志
- ✅ 改进错误处理和用户提示
- ✅ 支持多种响应格式解析
- ✅ 显示具体的错误类型和解决建议

### 3. 测试工具
- ✅ 创建了 bash 测试脚本 (`test-coze-api.sh`)
- ✅ 创建了 Node.js 测试脚本 (`test-coze-api.js`)
- ✅ 创建了网页测试工具 (`public/test-coze.html`)

## 🔍 调试步骤

### 方法 1：使用网页测试工具（最简单）

1. 启动开发服务器：
   ```bash
   cd /workspace/app-9ejz1lg8hfcx
   npm run dev
   ```

2. 在浏览器中访问：
   ```
   http://localhost:5173/test-coze.html
   ```

3. 输入您的 Token（pat_ 开头）
4. 点击"开始测试"
5. 查看详细的测试结果

### 方法 2：使用命令行测试

```bash
cd /workspace/app-9ejz1lg8hfcx

# 使用 bash 脚本
./test-coze-api.sh pat_你的完整token

# 或使用 Node.js 脚本
COZE_BEARER_TOKEN=pat_你的完整token node test-coze-api.js
```

### 方法 3：使用 curl 直接测试

```bash
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

## 📋 问题排查清单

### 1. 验证 Token 是否有效
- [ ] 使用上述任一方法测试 Token
- [ ] 确认返回 200 状态码和流式数据
- [ ] 如果返回 401，说明 Token 无效或过期

### 2. 检查 Supabase 配置
- [ ] 打开 Supabase 控制台
- [ ] 进入 Settings → Edge Functions → Secrets
- [ ] 确认 `COZE_BEARER_TOKEN` 存在
- [ ] 确认值没有多余空格或换行符
- [ ] 如果修改了 Secret，需要等待几分钟生效

### 3. 查看浏览器日志
- [ ] 打开应用页面
- [ ] 按 F12 打开开发者工具
- [ ] 切换到 Console 标签
- [ ] 发送测试消息
- [ ] 查看详细日志：
  ```
  🚀 开始发送消息到 Edge Function
  📨 用户消息: ...
  📥 收到数据块: ...
  ✅ 请求完成
  ```

### 4. 常见错误及解决方案

#### 错误 1：Token 未配置
**现象：** "API Token 未配置，请在 Supabase Secrets 中设置 COZE_BEARER_TOKEN"

**解决：**
1. 在 Supabase 控制台配置 Secret
2. 等待 1-2 分钟让配置生效
3. 刷新页面重试

#### 错误 2：401 认证失败
**现象：** "API 请求失败 (状态码: 401)"

**解决：**
1. 检查 Token 是否正确（使用测试工具验证）
2. 确认 Token 没有过期
3. 在 Coze 平台重新生成 Token

#### 错误 3：404 项目未找到
**现象：** "API 请求失败 (状态码: 404)"

**解决：**
1. 检查 project_id 是否正确
2. 确认 Token 有访问该项目的权限

#### 错误 4：无响应内容
**现象：** "收到了您的消息，但暂时没有回复内容"

**解决：**
1. 查看浏览器控制台的 `📦 解析后的数据` 日志
2. 检查 Coze 项目是否正确配置
3. 确认项目有可用的 AI 模型

## 🎯 下一步操作

### 1. 测试 Token 有效性
使用任一测试工具验证您的 Token 是否能正常调用 Coze API。

### 2. 配置 Supabase Secret
如果 Token 有效，在 Supabase 中配置 `COZE_BEARER_TOKEN`。

### 3. 等待生效
配置后等待 1-2 分钟，让 Edge Function 重新加载环境变量。

### 4. 测试应用
在应用中测试 AI 助手功能，查看浏览器控制台的详细日志。

## 📞 获取帮助

如果问题仍未解决，请提供以下信息：

1. **测试工具的输出结果**
   - 使用 `test-coze.html` 或命令行工具的完整输出

2. **浏览器控制台日志**
   - 包含 🚀 📨 📥 等 emoji 的完整日志

3. **Token 信息**
   - Token 的前 10 个字符（例如：pat_xxxxxx）
   - Token 是否刚生成

4. **错误截图**
   - AI 助手的错误提示
   - Supabase Secret 配置页面

## 📚 相关文档

- `docs/CHATBOT.md` - AI 对话机器人使用指南
- `docs/COZE_DEBUG.md` - 详细调试指南
- `docs/FILE_MANAGEMENT.md` - 文件管理指南

## 🎉 预期效果

配置成功后，您应该能够：
- ✅ 点击右下角的 AI 助手按钮
- ✅ 发送消息并收到流式响应
- ✅ 进行多轮对话
- ✅ 在控制台看到详细的日志输出

祝调试顺利！🚀
