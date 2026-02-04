import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendStreamRequest } from '@/utils/stream';
import { CHATBOT_SYSTEM_PROMPT } from '@/constants/chatbot';
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

    // 准备请求消息（包含 system prompt）
    const requestMessages = [
      { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
      ...newMessages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    try {
      let fullResponse = '';

      await sendStreamRequest({
        functionUrl: `${supabaseUrl}/functions/v1/chat`,
        requestBody: { messages: requestMessages },
        supabaseAnonKey,
        onData: (data) => {
          try {
            const parsed = JSON.parse(data);
            // 根据文心 API 返回格式提取内容
            const chunk = parsed.choices?.[0]?.delta?.content || '';
            if (chunk) {
              fullResponse += chunk;
              setStreamingContent(fullResponse);
            }
          } catch (e) {
            console.warn('解析数据失败:', e);
          }
        },
        onComplete: () => {
          // 将完整的 AI 回复添加到消息历史
          setMessages([
            ...newMessages,
            { role: 'assistant', content: fullResponse }
          ]);
          setStreamingContent('');
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('请求失败:', error);
          setMessages([
            ...newMessages,
            { role: 'assistant', content: '抱歉，我遇到了一些问题，请稍后再试 😅' }
          ]);
          setStreamingContent('');
          setIsLoading(false);
        },
        signal: abortControllerRef.current.signal
      });
    } catch (error) {
      console.error('发送消息失败:', error);
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
