// 文心大模型 API 的 CORS 头
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 定义消息接口
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// 定义请求体接口
interface ChatRequest {
  messages: Message[];
  enable_thinking?: boolean;
}

Deno.serve(async (req) => {
  // 处理 CORS 预检请求
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 解析请求体
    const { messages }: ChatRequest = await req.json();

    // 验证消息格式
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: '消息格式错误' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 获取 API 密钥
    const apiKey = Deno.env.get('INTEGRATIONS_API_KEY');
    if (!apiKey) {
      console.error('INTEGRATIONS_API_KEY 未配置');
      return new Response(
        JSON.stringify({ error: 'API 密钥未配置' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // 调用文心大模型 API
    const apiUrl = 'https://app-9ejz1lg8hfcx-api-zYkZz8qovQ1L-gateway.appmiaoda.com/v2/chat/completions';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages,
        enable_thinking: false,
      }),
    });

    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 请求失败:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `API 请求失败: ${response.status}` }),
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
