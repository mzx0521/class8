import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Hero from '@/components/portfolio/Hero';
import ProjectRoadshow from '@/components/portfolio/ProjectRoadshow';
import LearningReview from '@/components/portfolio/LearningReview';
import OtherWorks from '@/components/portfolio/OtherWorks';
import ChatBot from '@/components/chatbot/ChatBot';
import PageMeta from '@/components/common/PageMeta';

const PortfolioHome: React.FC = () => {
  return (
    <MainLayout>
      <PageMeta 
        title="作品展示 - 第四期训练营毕业名片" 
        description="这是一个用于展示个人作品和学习成果的网页应用，作为第四期训练营毕业名片。"
      />
      <Hero />
      <ProjectRoadshow />
      <LearningReview />
      <OtherWorks />
      <ChatBot />
    </MainLayout>
  );
};

export default PortfolioHome;
