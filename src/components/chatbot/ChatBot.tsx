import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [sessionId, setSessionId] = useState<string>('');

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, streamingContent]);

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // 添加用户消息
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setIsLoading(true);
    setStreamingContent('');

    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    console.log('🚀 开始发送消息 (Supabase Edge Function 模式)');
    console.log('📨 用户消息:', userMessage);

    try {
      let fullResponse = '';
      let hasReceivedData = false;

      // 1. 构造请求体 (发给 Supabase Function)
      // 我们只需要传 userMessage 和 sessionId，Token 和其他复杂结构都在后端处理
      const payload = {
        userMessage: userMessage,
        sessionId: sessionId
      };

      // 2. 调用 Supabase Edge Function
      // URL: https://<project>.supabase.co/functions/v1/class8-AI
      const functionUrl = `${supabaseUrl}/functions/v1/class8-AI`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`, // 使用 Anon Key 调用 Function
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${errorText}`);
      }

      if (!response.body) throw new Error('No response body');

      // 3. 处理流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim();
            if (!dataStr) continue;
            
            // Coze 结束标志
            if (dataStr === '[DONE]') continue;

            try {
              const parsed = JSON.parse(dataStr);
              // console.log('📦 Stream chunk:', parsed); // Debug log

              let content = '';

              // 1. 处理 Coze Workflow 的 'answer' 事件
              if (parsed.type === 'answer' && parsed.content) {
                 // 如果 content 是字符串，直接使用
                 if (typeof parsed.content === 'string') {
                    content = parsed.content;
                 } 
                 // 如果 content 是对象且包含 answer 字段 (常见情况)
                 else if (typeof parsed.content === 'object' && parsed.content.answer && typeof parsed.content.answer === 'string') {
                    content = parsed.content.answer;
                 }
              }
              // 2. Coze Chat API 标准格式
              else if (parsed.event === 'conversation.message.delta' || parsed.event === 'conversation.message.completed') {
                 content = parsed.data?.content || '';
              }
              // 3. 其他可能的兜底逻辑 (必须确保是字符串)
              else if (typeof parsed.data === 'string') {
                 content = parsed.data;
              } else if (typeof parsed.content === 'string') {
                 content = parsed.content;
              }

              // ⚠️ 严防 [object Object]：最后再检查一次类型
              if (content && typeof content === 'string') {
                fullResponse += content;
                setStreamingContent(fullResponse);
                hasReceivedData = true;
              }
              
              // 更新 Session ID (如果 Coze 返回了)
              if (parsed.conversation_id && !sessionId) {
                setSessionId(parsed.conversation_id);
              } else if (parsed.session_id && !sessionId) {
                setSessionId(parsed.session_id);
              }

            } catch (e) {
              console.warn('解析错误:', e);
            }
          }
        }
      }
      if (!hasReceivedData) {
         console.warn('⚠️ 未收到任何响应内容');
         setMessages([
           ...newMessages,
           { role: 'assistant', content: '收到了您的消息，但暂时没有回复内容 😊' }
         ]);
      } else {
         // 将完整的 AI 回复添加到消息历史
         setMessages([
           ...newMessages,
           { role: 'assistant', content: fullResponse }
         ]);
      }

    } catch (error: any) {
      console.error('❌ 请求失败:', error);
      let errorMessage = `错误: ${error.message}`;
      if (error.name === 'AbortError') {
        errorMessage = '请求已取消';
      }
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setStreamingContent('');
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  // 处理回车发送
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <>
      {/* 浮动按钮 */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl z-50 transition-all duration-300",
          isOpen ? "scale-0" : "scale-100"
        )}
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* 对话框 */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[380px] h-[600px] shadow-2xl z-50 flex flex-col animate-fade-in">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                🤖
              </div>
              <div>
                <h3 className="font-bold">AI 助手</h3>
                <p className="text-xs opacity-90">随时为您解答</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* 消息区域 */}
          <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {/* 欢迎消息 */}
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-muted">
                    <p className="text-sm">
                      你好！👋 我是 AI 助手，可以为您介绍第四期训练营的作品和学习心得。有什么想了解的吗？
                    </p>
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] p-3 rounded-2xl",
                      message.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {/* 流式输出中的消息 */}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-muted">
                    <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
                    <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-1" />
                  </div>
                </div>
              )}

              {/* 加载状态 */}
              {isLoading && !streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-muted">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* 输入框 */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default ChatBot;
