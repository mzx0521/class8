import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // 1. 处理 CORS 跨域请求
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 2. 接收前端发来的消息
    const { userMessage, sessionId } = await req.json();
    
    // 3. 构造 Coze Workflow 请求体 (严格匹配测试成功的格式)
    const cozePayload = {
      "content": {
        "query": {
          "prompt": [
            {
              "type": "text",
              "content": {
                "text": userMessage
              }
            }
          ]
        }
      },
      "type": "query",
      "session_id": sessionId || "session_" + Date.now(),
      "project_id": 7603025396900184104 // 保持为数字
    };

    // 4. 从环境变量获取 Token (更安全)
    const token = Deno.env.get('COZE_API_TOKEN');
    if (!token) {
      throw new Error('Missing COZE_API_TOKEN environment variable');
    }

    // 5. 转发给 Coze Workflow API
    // 目标地址: https://hcrhmhftgn.coze.site/stream_run
    const response = await fetch('https://hcrhmhftgn.coze.site/stream_run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(cozePayload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: `Coze API Error: ${response.status}`, details: errorText }), {
            status: response.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // 6. 把 Coze 的流式回复直接透传给前端
    return new Response(response.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream'
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
