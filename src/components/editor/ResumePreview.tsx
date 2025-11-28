import { forwardRef } from 'react';
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

  const TemplateComponent = templates[resume.template] || ModernTemplate;

  return (
    <div className="h-full overflow-y-auto p-8 bg-muted/20 custom-scrollbar">
      <div className="max-w-[210mm] mx-auto">
        <div
          ref={ref}
          className="resume-preview-container bg-white shadow-2xl min-h-[297mm]"
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
