import React from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  className,
  align = 'center' 
}) => {
  return (
    <div className={cn(
      "mb-12 flex flex-col gap-2",
      align === 'center' ? "items-center text-center" : "items-start text-left",
      className
    )}>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
      <div className="h-1.5 w-12 bg-primary rounded-full mt-2" />
    </div>
  );
};

export default SectionTitle;
