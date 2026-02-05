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

    console.log('收到用户消息:', userMessage);
    console.log('Session ID:', sessionId);

    // 验证消息格式
    if (!userMessage || typeof userMessage !== 'string') {
      console.error('消息格式错误:', userMessage);
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
    console.log('Token 状态:', bearerToken ? `已配置 (长度: ${bearerToken.length})` : '未配置');
    
    if (!bearerToken) {
      console.error('COZE_BEARER_TOKEN 未配置');
      return new Response(
        JSON.stringify({ error: 'API Token 未配置，请在 Supabase Secrets 中设置 COZE_BEARER_TOKEN' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 使用传入的 sessionId 或生成新的
    const finalSessionId = sessionId || generateSessionId();
    console.log('最终 Session ID:', finalSessionId);

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

    console.log('准备调用 Coze API...');
    console.log('请求体:', JSON.stringify(cozeRequestBody, null, 2));

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

    console.log('Coze API 响应状态:', response.status);
    console.log('响应头:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Coze API 请求失败:', response.status, errorText);
      
      // 返回更详细的错误信息
      return new Response(
        JSON.stringify({ 
          error: `API 请求失败 (状态码: ${response.status})`,
          details: errorText,
          hint: response.status === 401 ? '请检查 COZE_BEARER_TOKEN 是否正确' : '请检查 API 配置'
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('成功获取响应，开始流式传输...');

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
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息');
    
    return new Response(
      JSON.stringify({ 
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
