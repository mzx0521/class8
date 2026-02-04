import React from 'react';
import SectionTitle from './SectionTitle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ASSETS_IMAGES } from '@/constants/images';
import { 
  Lightbulb, 
  Target, 
  Settings, 
  Rocket, 
  CheckCircle2,
  Mic,
  FileText,
  BrainCircuit,
  MousePointer2
} from 'lucide-react';

const ProjectRoadshow: React.FC = () => {
  return (
    <section id="roadshow" className="section-padding scroll-mt-16">
      <div className="container">
        <SectionTitle 
          title="项目路演" 
          subtitle="从痛点发现到 MVP 产品的完整迭代路径"
        />

        {/* 1. 痛点场景 */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">1.1 痛点场景：会议中的“隐形军师”</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-xl border-l-4 border-l-red-500">
                <h4 className="font-bold text-lg mb-2">深度辅助会议助手</h4>
                <p className="text-muted-foreground leading-relaxed">
                  像军师一样陪开会，不仅是记录，更是深度分析。针对需求调研、分析、交底会等关键场合，解决内容不完整、遗漏等核心问题。
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  场景来源与需求
                </h4>
                <ul className="space-y-3">
                  {[
                    '会前：快速了解背景资料、角色分工与预期目标',
                    '会中：实时 ASR 记录，AI 同步分析进度，查缺补漏',
                    '会后：一键生成标准格式的会议纪要或专业分析报告'
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
              <img 
                src={ASSETS_IMAGES.roadshow.painPoint} 
                alt="会议痛点场景" 
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge className="bg-white text-black">痛点场景模拟</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 2. 思路说明 */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">1.2 点子到产品的思路</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: 'Phase 01',
                title: '找场景',
                desc: '从工作中的痛点、爽点出发，头脑风暴并与同事验证确认长期价值。',
                icon: Target,
                color: 'bg-blue-500'
              },
              {
                step: 'Phase 02',
                title: '定方案',
                desc: '调研竞品（如飞书会议），与 AI 共创命名、定位及技术可行性规划，形成 PRD。',
                icon: Settings,
                color: 'bg-purple-500'
              },
              {
                step: 'Phase 03',
                title: '磨产品',
                desc: 'MVP 开发过程是“十几分钟开发，六小时改 Bug”的磨合过程，不断与 AI 对话。',
                icon: Rocket,
                color: 'bg-green-500'
              }
            ].map((phase, idx) => (
              <Card key={idx} className="relative overflow-hidden group hover:border-primary/50 transition-colors">
                <CardContent className="pt-8">
                  <div className={`absolute top-0 right-0 w-16 h-16 ${phase.color} opacity-10 rounded-bl-full`} />
                  <Badge variant="outline" className="mb-4">{phase.step}</Badge>
                  <phase.icon className={`w-10 h-10 ${phase.color.replace('bg-', 'text-')} mb-4`} />
                  <h4 className="text-xl font-bold mb-3">{phase.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{phase.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. MVP 方案 */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">1.3 MVP 产品方案</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: '产品目标', value: '主要针对网页版会议场景' },
                { label: '产品形式', value: 'Chrome 浏览器插件' },
                { label: '音频捕捉', value: 'chrome.tabCapture' },
                { label: 'ASR 方案', value: '阿里云通义听悟 + DeepSeek' },
                { label: '导出方案', value: 'docxtemplater 导出 docx' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm text-primary font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">1.4 MVP 核心功能</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: MousePointer2, text: '浏览器插件运行' },
                { icon: Mic, text: '在线音频实时捕捉' },
                { icon: BrainCircuit, text: '定期对话实时总结' },
                { icon: Lightbulb, text: '实时军师建议提醒' },
                { icon: FileText, text: '会议纪要智能整理' },
                { icon: Rocket, text: '支持 Docx 格式下载' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <item.icon className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. 产品展示 */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold">1.5 MVP 产品展示</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '安装与启动', desc: '安装插件，启动本地服务端', img: ASSETS_IMAGES.roadshow.pluginInstall },
              { title: '实时军师', desc: '给出建议（示例）：需求文档建议补充XX', img: ASSETS_IMAGES.roadshow.aiAdvice },
              { title: '一键生成', desc: '下载纪要（示例）：标准的 Docx 格式', img: ASSETS_IMAGES.roadshow.downloadDocx },
            ].map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 border bg-muted">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm">{item.desc}</p>
                  </div>
                </div>
                <h4 className="font-bold text-lg">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectRoadshow;
