import React from 'react';
import SectionTitle from './SectionTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Brain, 
  Hand, 
  TrendingUp, 
  Layout, 
  Code2, 
  Database, 
  Globe, 
  BarChart3, 
  Wrench,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const LearningReview: React.FC = () => {
  const mindsets = [
    { title: '顺势而为', desc: '抓住 AI Coding 趋势，将其作为时代元能力。' },
    { title: '行动胜于等待', desc: '先动手做起来，边做边学，别等学会再动。' },
    { title: '产品与工程思维', desc: '凡工程皆产品，面向用户用产品思维。' },
    { title: '把自己当老板', desc: 'AI 是 24h 待命的顶级程序员，你只需定方向。' },
    { title: '逻辑重于报错', desc: '报错是常态，只要逻辑清楚，Bug 都能解。' },
    { title: '先做“垃圾”', desc: '要有 MVP 意识，先跑起来就有信心。' },
    { title: 'AI 协同思维', desc: '万事不决问 AI，但要保持自己的判断力。' },
    { title: '拆解思维', desc: '学会将大项目拆解成可执行的小单元。' }
  ];

  const methods = [
    { step: 1, title: '想清楚到底要啥', desc: '明确具体功能和预期效果。' },
    { step: 2, title: '让 AI 先试水', desc: '快速 Demo 验证可行性。' },
    { step: 3, title: '商量怎么干', desc: '讨论可行性与版本规划。' },
    { step: 4, title: '写说明书 (PRD)', desc: '把想法喂给 AI，避免跑偏。' },
    { step: 5, title: '动手盖房子', desc: 'UI 设计与开发：搞装修 & 搭框架。' },
    { step: 6, title: '找茬儿与上线', desc: '测试没问题后一键发布。' }
  ];

  const skills = [
    { icon: Brain, label: '思维升级', desc: '产品思维解构' },
    { icon: TrendingUp, label: '产品流程', desc: '痛点到 MVP' },
    { icon: Layout, label: '需求分析', desc: 'PRD 文档编写' },
    { icon: Code2, label: '开发工具', desc: 'Claude Code / Cursor' },
    { icon: Database, label: '数据接入', desc: 'Supabase / API' },
    { icon: Globe, label: '发布部署', desc: 'Vercel / Enter.pro' },
    { icon: BarChart3, label: '数据分析', desc: 'PostHog / GA' },
    { icon: Wrench, label: '提效工具', desc: 'Skills 创建与应用' },
    { icon: Zap, label: '插件开发', desc: '浏览器扩展开发' }
  ];

  return (
    <section id="review" className="section-padding bg-muted/30 scroll-mt-16">
      <div className="container">
        <SectionTitle 
          title="学习复盘" 
          subtitle="在 AI 时代的自我进化之路：心法、方法与全栈收获"
        />

        {/* 心法篇 */}
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">心法篇：认知重塑</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mindsets.map((item, idx) => (
              <div key={idx} className="glass-card p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-bold mb-2">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 方法篇 */}
        <div className="mb-24 relative">
          <div className="flex items-center gap-3 mb-12">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Hand className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">方法篇：AI Coding 实践流</h3>
          </div>
          <div className="grid lg:grid-cols-6 gap-4 relative">
            {methods.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl border bg-card hover:border-primary/50 transition-colors h-full">
                  <span className="text-4xl font-black text-primary/10 mb-4 group-hover:text-primary/20 transition-colors">
                    {item.step}
                  </span>
                  <h4 className="font-bold text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                {idx < methods.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 收获篇 */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">收获篇：技能全图谱</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, idx) => (
              <Card key={idx} className="border-none bg-background shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary">
                    <skill.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{skill.label}</h4>
                    <p className="text-sm text-muted-foreground">{skill.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-bold mb-2">掌握 AI Coding 元能力</h4>
              <p className="opacity-90">不再只是“代码搬运工”，而是具有技术实现力的“产品经理”。</p>
            </div>
            <CheckCircle className="w-16 h-16 opacity-20 hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningReview;
