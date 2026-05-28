import { ResumeData } from '@/stores/resumeStore';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

const templates: Record<string, React.ElementType> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

interface ResumeThumbnailProps {
  resume: ResumeData;
}

export const ResumeThumbnail = ({ resume }: ResumeThumbnailProps) => {
  const TemplateComponent = templates[resume.template] || ModernTemplate;
  const hasContent = resume.personalInfo?.fullName || resume.summary || (resume.experiences && resume.experiences.length > 0);

  return (
    <div className="w-full h-32 relative overflow-hidden bg-white rounded-md border border-border group-hover:border-primary/50 transition-colors">
      <div 
        className="absolute top-0 left-0 w-[210mm] min-h-[297mm] bg-white origin-top-left pointer-events-none"
        style={{ transform: 'scale(0.18)' }}
      >
        {hasContent ? (
          <TemplateComponent resume={resume} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[297mm] text-muted-foreground text-4xl">
            <p>Blank Resume</p>
          </div>
        )}
      </div>
      {/* Overlay to prevent interactions and add subtle fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none" />
    </div>
  );
};
