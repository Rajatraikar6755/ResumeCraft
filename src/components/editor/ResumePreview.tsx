import { forwardRef, useEffect, useState } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const resume = useResumeStore((state) => state.resume);
  const hasContent = resume.personalInfo.fullName || resume.summary || resume.experiences.length > 0;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      // The width of an A4 paper in pixels (at 96 DPI) is approx 794px
      const a4Width = 794;
      const padding = 32; // 16px padding on each side
      
      // On mobile, the preview takes up full width (window.innerWidth)
      // On desktop, it takes up 50% of the screen (window.innerWidth / 2)
      // To be safe, we just check the parent container's width, but we can't easily do that without a ref.
      // We can just use window width.
      
      const availableWidth = window.innerWidth < 1024 ? window.innerWidth : window.innerWidth / 2;
      
      if (availableWidth < a4Width + padding) {
        setScale((availableWidth - padding) / a4Width);
      } else {
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const TemplateComponent = templates[resume.template] || ModernTemplate;

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-8 bg-muted/20 custom-scrollbar flex justify-center">
      <div 
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          width: '210mm',
          marginBottom: `calc(297mm * ${scale - 1})`
        }} 
        className="transition-transform duration-200"
      >
        <div
          ref={ref}
          style={{
            fontFamily: resume.fontFamily === 'calibri' ? 'Calibri, sans-serif' : 
                        resume.fontFamily === 'lato' ? 'Lato, sans-serif' :
                        resume.fontFamily === 'roboto' ? 'Roboto, sans-serif' :
                        resume.fontFamily === 'poppins' ? 'Poppins, sans-serif' : 'Inter, sans-serif',
            fontSize: `calc(14px * ${resume.fontSizeScale || 1.0})`
          }}
          className="resume-preview-container bg-white shadow-2xl w-full min-h-[297mm]"
        >
          {hasContent ? (
            <TemplateComponent resume={resume} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[297mm] text-muted-foreground">
              <p>Start editing to see your resume preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
