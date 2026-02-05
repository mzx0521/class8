import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendStreamRequest } from '@/utils/stream';
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

    console.log('🚀 开始发送消息到 Edge Function');
    console.log('📨 用户消息:', userMessage);
    console.log('🔗 Session ID:', sessionId || '(将自动生成)');

    try {
      let fullResponse = '';
      let hasReceivedData = false;

      await sendStreamRequest({
        functionUrl: `${supabaseUrl}/functions/v1/chat`,
        requestBody: { 
          userMessage,
          sessionId: sessionId || undefined
        },
        supabaseAnonKey,
        onData: (data) => {
          hasReceivedData = true;
          console.log('📥 收到数据块:', data.substring(0, 100));
          
          try {
            // Coze API 可能返回不同格式，需要根据实际情况调整
            const parsed = JSON.parse(data);
            console.log('📦 解析后的数据:', parsed);
            
            // 尝试多种可能的响应格式
            let chunk = '';
            if (parsed.content) {
              chunk = parsed.content;
            } else if (parsed.text) {
              chunk = parsed.text;
            } else if (parsed.delta) {
              chunk = parsed.delta;
            } else if (parsed.message) {
              chunk = parsed.message;
            } else if (parsed.choices?.[0]?.delta?.content) {
              chunk = parsed.choices[0].delta.content;
            } else if (typeof parsed === 'string') {
              chunk = parsed;
            }
            
            if (chunk) {
              fullResponse += chunk;
              setStreamingContent(fullResponse);
            }
          } catch (e) {
            // 如果不是 JSON，直接作为文本处理
            console.log('⚠️ 非 JSON 数据，直接作为文本处理');
            if (typeof data === 'string' && data.trim()) {
              fullResponse += data;
              setStreamingContent(fullResponse);
            }
          }
        },
        onComplete: () => {
          console.log('✅ 请求完成');
          console.log('📝 完整响应长度:', fullResponse.length);
          console.log('📊 是否收到数据:', hasReceivedData);
          
          // 将完整的 AI 回复添加到消息历史
          if (fullResponse) {
            setMessages([
              ...newMessages,
              { role: 'assistant', content: fullResponse }
            ]);
          } else {
            // 如果没有收到内容，显示默认消息
            console.warn('⚠️ 未收到任何响应内容');
            setMessages([
              ...newMessages,
              { role: 'assistant', content: '收到了您的消息，但暂时没有回复内容 😊\n\n请检查：\n1. COZE_BEARER_TOKEN 是否正确配置\n2. Coze 项目 ID 是否正确\n3. 查看浏览器控制台的详细日志' }
            ]);
          }
          setStreamingContent('');
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('❌ 请求失败:', error);
          console.error('错误详情:', error.message);
          
          let errorMessage = '抱歉，我遇到了一些问题，请稍后再试 😅\n\n';
          
          // 根据错误类型提供更具体的提示
          if (error.message.includes('Token')) {
            errorMessage += '提示：请确保已在 Supabase Secrets 中正确配置 COZE_BEARER_TOKEN';
          } else if (error.message.includes('401')) {
            errorMessage += '提示：Token 认证失败，请检查 COZE_BEARER_TOKEN 是否正确';
          } else if (error.message.includes('404')) {
            errorMessage += '提示：API 端点未找到，请检查 Coze 项目配置';
          } else if (error.message.includes('500')) {
            errorMessage += '提示：服务器错误，请查看 Edge Function 日志';
          } else {
            errorMessage += `错误信息：${error.message}`;
          }
          
          setMessages([
            ...newMessages,
            { role: 'assistant', content: errorMessage }
          ]);
          setStreamingContent('');
          setIsLoading(false);
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      console.error('💥 发送消息失败:', error);
      setIsLoading(false);
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
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
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
