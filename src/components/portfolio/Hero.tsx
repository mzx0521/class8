import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Github, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden section-padding bg-gradient-to-b from-primary/5 to-transparent">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-1 flex items-center gap-2 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>2026 课程毕业作品展示</span>
          </Badge>
          
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 animate-fade-in">
            用 <span className="gradient-text">AI 思维</span> 打造
            <br />
            改变未来的 MVP 产品
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-fade-in [animation-delay:200ms]">
            从生活痛点出发，借助 AI 顶级程序员的能力，在极短时间内完成从点子到产品的跨越。这是我的学习总结与作品集展示。
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in [animation-delay:400ms]">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold" asChild>
              <a href="#roadshow">
                查看核心项目 <ChevronRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold" asChild>
              <a href="https://github.com/mzx0521" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" /> GitHub
              </a>
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 w-full animate-fade-in [animation-delay:600ms]">
            {[
              { label: '项目实战', value: '5+' },
              { label: 'AI 工具链', value: '10+' },
              { label: '学习时长', value: '300h+' },
              { label: '解决报错', value: '99+' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-primary">{stat.value}</span>
                <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
