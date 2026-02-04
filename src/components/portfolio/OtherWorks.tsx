import React from 'react';
import SectionTitle from './SectionTitle';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ASSETS_IMAGES } from '@/constants/images';
import { ExternalLink, Github } from 'lucide-react';

const OtherWorks: React.FC = () => {
  const works = [
    {
      title: '新春贺词生成器',
      desc: '随堂作业，支持生成个性化新春贺词并导出精美图片。',
      link: 'https://happy.madaochenggong.online/',
      img: ASSETS_IMAGES.works.greetingCard,
      tags: ['React', 'Canvas', 'AI Content']
    },
    {
      title: '图片拼接线稿生成器',
      desc: '根据上传图片形成拼接效果，并调用大模型生成线稿，适配 Sora2 故事板。',
      link: 'https://picture.madaochenggong.online/auth',
      img: ASSETS_IMAGES.works.lineArt,
      tags: ['Sora2 Storyboard', 'Image Processing', 'ML']
    },
    {
      title: '需求提取 Skills',
      desc: '将散乱文字、会议录音智能提取为标准化需求文档，大幅提升分析效率。',
      link: 'https://github.com/mzx0521/prd-extractor',
      img: ASSETS_IMAGES.works.prdExtractor,
      github: 'https://github.com/mzx0521/prd-extractor',
      tags: ['AI Agent', 'PRD', 'LLM']
    },
    {
      title: '个人主页',
      desc: '综合展示个人信息、作品、工具与文章的对外门户。',
      link: 'https://hello.madaochenggong.online/',
      img: ASSETS_IMAGES.works.personalHome,
      tags: ['Personal Brand', 'Portal', 'FullStack']
    }
  ];

  return (
    <section id="works" className="section-padding scroll-mt-16">
      <div className="container">
        <SectionTitle 
          title="其他课程作品" 
          subtitle="课堂沉淀与延伸练习，记录每一步技术成长"
        />

        <div className="grid md:grid-cols-2 gap-8">
          {works.map((work, idx) => (
            <Card key={idx} className="group overflow-hidden border-none shadow-lg hover:shadow-xl transition-all">
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img 
                  src={work.img} 
                  alt={work.title} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {work.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-black rounded backdrop-blur-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <CardContent className="pt-6">
                <h4 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {work.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {work.desc}
                </p>
              </CardContent>
              <CardFooter className="flex gap-3 pt-0 pb-6">
                <Button size="sm" className="gap-2" asChild>
                  <a href={work.link} target="_blank" rel="noopener noreferrer">
                    访问链接 <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                {work.github && (
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <a href={work.github} target="_blank" rel="noopener noreferrer">
                      源码仓库 <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherWorks;
