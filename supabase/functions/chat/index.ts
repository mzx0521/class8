// Coze AI API 的 CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 定义请求体接口
interface CozeRequest {
  userMessage: string;
  sessionId?: string;
}

// 生成随机 session_id
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 解析请求体
    const { userMessage, sessionId }: CozeRequest = await req.json();

    // 验证消息格式
    if (!userMessage || typeof userMessage !== 'string') {
      return new Response(
        JSON.stringify({ error: '消息格式错误' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 获取 Bearer Token
    const bearerToken = Deno.env.get('COZE_BEARER_TOKEN');
    if (!bearerToken) {
      console.error('COZE_BEARER_TOKEN 未配置');
      return new Response(
        JSON.stringify({ error: 'API Token 未配置，请在环境变量中设置 COZE_BEARER_TOKEN' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 使用传入的 sessionId 或生成新的
    const finalSessionId = sessionId || generateSessionId();

    // 构建 Coze API 请求体
    const cozeRequestBody = {
      content: {
        query: {
          prompt: [
            {
              type: "text",
              content: {
                text: userMessage
              }
            }
          ]
        }
      },
      type: "query",
      session_id: finalSessionId,
      project_id: 7603025396900184104
    };

    // 调用 Coze AI API
    const apiUrl = 'https://hcrhmhftgn.coze.site/stream_run';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cozeRequestBody),
    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coze API 请求失败:', response.status, errorText);
      return new Response(
        JSON.stringify({ 
          error: `API 请求失败: ${response.status}`,
          details: errorText
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 返回流式响应
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Session-Id': finalSessionId, // 返回 session_id 供前端使用
      },
    });

  } catch (error) {
    console.error('Edge Function 错误:', error);
    return new Response(
      JSON.stringify({ 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error)
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
