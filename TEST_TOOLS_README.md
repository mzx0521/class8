# 🎯 Coze API 集成 - 测试与调试工具包

## 📦 包含的工具

### 1. 网页测试工具 ⭐ 推荐
**文件：** `public/test-coze.html`

**特点：**
- 🎨 可视化界面
- 📊 实时显示测试结果
- 🔍 详细的错误信息
- 💡 无需命令行

**使用方法：**
```bash
npm run dev
# 然后访问 http://localhost:5173/test-coze.html
```

### 2. Bash 测试脚本
**文件：** `test-coze-api.sh`

**特点：**
- ⚡ 快速测试
- 📝 详细的 curl 输出
- 🔧 适合命令行用户

**使用方法：**
```bash
chmod +x test-coze-api.sh
./test-coze-api.sh pat_你的token
```

### 3. Node.js 测试脚本
**文件：** `test-coze-api.js`

**特点：**
- 🌊 流式响应处理
- 📊 格式化输出
- 🎯 适合开发调试

**使用方法：**
```bash
COZE_BEARER_TOKEN=pat_你的token node test-coze-api.js
# 或
node test-coze-api.js pat_你的token
```

### 4. 直接 curl 测试
**特点：**
- 🚀 最简单直接
- 🔍 原始响应
- 💻 任何环境可用

**使用方法：**
```bash
curl -X POST "https://hcrhmhftgn.coze.site/stream_run" \
  -H "Authorization: Bearer pat_你的token" \
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

## 📚 文档指南

### 快速开始
- **QUICK_TEST.md** - 3 分钟快速测试指南

### 详细文档
- **docs/DEBUG_SUMMARY.md** - 完整调试报告和问题排查
- **docs/COZE_DEBUG.md** - 详细的调试步骤
- **docs/CHATBOT.md** - AI 对话机器人使用指南
- **docs/FILE_MANAGEMENT.md** - 文件管理指南

## 🔍 调试流程

```
1. 测试 Token 有效性
   ↓
   使用任一测试工具验证
   ↓
2. 配置 Supabase Secret
   ↓
   在 Supabase 控制台添加 COZE_BEARER_TOKEN
   ↓
3. 等待生效（1-2 分钟）
   ↓
4. 测试应用
   ↓
   打开 AI 助手，发送消息
   ↓
5. 查看日志
   ↓
   浏览器控制台 (F12)
```

## ✅ 成功标志

### Token 测试成功
```
✅ 响应状态: 200 OK
✅ 收到流式数据
✅ 内容正常显示
```

### 应用运行成功
```
✅ AI 助手可以打开
✅ 发送消息有响应
✅ 流式输出正常
✅ 控制台无错误
```

## ❌ 常见错误

### 401 Unauthorized
**原因：** Token 无效或过期
**解决：** 重新生成 Token

### 404 Not Found
**原因：** Project ID 不正确
**解决：** 检查 project_id 配置

### Token 未配置
**原因：** Supabase Secret 未设置或未生效
**解决：** 配置 Secret 并等待生效

## 🎯 推荐测试顺序

1. **首先** - 使用网页测试工具验证 Token
2. **然后** - 在 Supabase 配置 Secret
3. **等待** - 1-2 分钟让配置生效
4. **最后** - 在应用中测试 AI 助手

## 💡 提示

- Token 必须以 `pat_` 开头
- Project ID 是 `7603025396900184104`
- 配置 Secret 后需要等待生效
- 查看浏览器控制台获取详细日志
- Edge Function 日志在 Supabase 控制台

## 📞 获取帮助

如果遇到问题，请提供：
1. 测试工具的完整输出
2. 浏览器控制台日志
3. Token 的前 10 个字符
4. 错误截图

查看 `docs/DEBUG_SUMMARY.md` 获取更多帮助。

---

**祝调试顺利！** 🚀
