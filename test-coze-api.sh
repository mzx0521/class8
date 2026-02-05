#!/bin/bash

# Coze API 快速测试脚本
# 使用 curl 直接测试 API 连接

echo "🔧 Coze API 快速测试"
echo "=================================================="

# 检查是否提供了 Token
if [ -z "$1" ]; then
  echo "❌ 错误：未提供 COZE_BEARER_TOKEN"
  echo ""
  echo "使用方法："
  echo "  ./test-coze-api.sh your_token_here"
  echo ""
  echo "示例："
  echo "  ./test-coze-api.sh pat_xxxxxxxxxxxxx"
  exit 1
fi

BEARER_TOKEN="$1"
API_URL="https://hcrhmhftgn.coze.site/stream_run"
PROJECT_ID=7603025396900184104
SESSION_ID="test_$(date +%s)"

echo "📍 API 端点: $API_URL"
echo "🔑 Token: ${BEARER_TOKEN:0:10}..."
echo "📦 Project ID: $PROJECT_ID"
echo "🔗 Session ID: $SESSION_ID"
echo "=================================================="
echo ""
echo "📨 发送测试消息..."
echo ""

# 构建请求体
REQUEST_BODY=$(cat <<EOF
{
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
  "session_id": "$SESSION_ID",
  "project_id": $PROJECT_ID
}
EOF
)

echo "📤 请求体:"
echo "$REQUEST_BODY"
echo ""
echo "⏳ 正在发送请求..."
echo ""
echo "=================================================="

# 发送请求
curl -v -X POST "$API_URL" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$REQUEST_BODY"

echo ""
echo "=================================================="
echo "✅ 测试完成"
