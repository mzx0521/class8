import React from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import Hero from '@/components/portfolio/Hero';
import ProjectRoadshow from '@/components/portfolio/ProjectRoadshow';
import LearningReview from '@/components/portfolio/LearningReview';
import OtherWorks from '@/components/portfolio/OtherWorks';
import PageMeta from '@/components/common/PageMeta';

const PortfolioHome: React.FC = () => {
  return (
    <MainLayout>
      <PageMeta 
        title="作品展示 - 课程毕业名片" 
        description="这是一个用于展示个人作品和学习成果的网页应用，作为课程毕业名片。"
      />
      <Hero />
      <ProjectRoadshow />
      <LearningReview />
      <OtherWorks />
    </MainLayout>
  );
};

export default PortfolioHome;
