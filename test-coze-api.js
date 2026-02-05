#!/usr/bin/env node

/**
 * Coze API 测试脚本
 * 用于验证 API 配置是否正确
 */

const COZE_API_URL = 'https://hcrhmhftgn.coze.site/stream_run';
const PROJECT_ID = 7603025396900184104;

// 从命令行参数获取 Token
const bearerToken = process.env.COZE_BEARER_TOKEN || process.argv[2];

if (!bearerToken) {
  console.error('❌ 错误：未提供 COZE_BEARER_TOKEN');
  console.log('\n使用方法：');
  console.log('  COZE_BEARER_TOKEN=your_token node test-coze-api.js');
  console.log('  或');
  console.log('  node test-coze-api.js your_token');
  process.exit(1);
}

console.log('🔧 Coze API 测试工具');
console.log('='.repeat(50));
console.log(`📍 API 端点: ${COZE_API_URL}`);
console.log(`🔑 Token: ${bearerToken.substring(0, 10)}...`);
console.log(`📦 Project ID: ${PROJECT_ID}`);
console.log('='.repeat(50));

// 生成随机 session_id
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// 测试消息
const testMessage = '你好，能介绍一下这个项目吗？';
const sessionId = generateSessionId();

console.log(`\n📨 发送测试消息: "${testMessage}"`);
console.log(`🔗 Session ID: ${sessionId}\n`);

// 构建请求体
const requestBody = {
  content: {
    query: {
      prompt: [
        {
          type: "text",
          content: {
            text: testMessage
          }
        }
      ]
    }
  },
  type: "query",
  session_id: sessionId,
  project_id: PROJECT_ID
};

console.log('📤 请求体:');
console.log(JSON.stringify(requestBody, null, 2));
console.log('\n⏳ 正在发送请求...\n');

// 发送请求
fetch(COZE_API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${bearerToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestBody),
})
  .then(async (response) => {
    console.log(`📊 响应状态: ${response.status} ${response.statusText}`);
    console.log('📋 响应头:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 请求失败:');
      console.error(errorText);
      process.exit(1);
    }

    console.log('✅ 请求成功！开始接收流式响应:\n');
    console.log('-'.repeat(50));

    // 读取流式响应
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      process.stdout.write(chunk);
      fullResponse += chunk;
    }

    console.log('\n' + '-'.repeat(50));
    console.log('\n✅ 测试完成！');
    console.log(`📝 总共接收: ${fullResponse.length} 字符`);
  })
  .catch((error) => {
    console.error('\n❌ 请求失败:');
    console.error(error);
    process.exit(1);
  });
