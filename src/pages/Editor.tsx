import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, EyeOff, ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { PersonalInfoForm } from '@/components/editor/PersonalInfoForm';
import { SummaryForm } from '@/components/editor/SummaryForm';
import { ExperienceForm } from '@/components/editor/ExperienceForm';
import { EducationForm } from '@/components/editor/EducationForm';
import { ProjectsForm } from '@/components/editor/ProjectsForm';
import { SkillsForm } from '@/components/editor/SkillsForm';
import { ResumePreview } from '@/components/editor/ResumePreview';
import { useResumeStore } from '@/stores/resumeStore';
import { useIsMobile } from '@/hooks/use-mobile';

const sectionComponents: Record<string, React.ComponentType> = {
  personal: PersonalInfoForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  projects: ProjectsForm,
  skills: SkillsForm,
};

const Editor = () => {
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const isMobile = useIsMobile();

  const ActiveComponent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Back</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold hidden sm:inline">ResumeCraft</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export PDF</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <EditorSidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Editor panel */}
        <div className={`flex-1 flex ${showPreview && !isMobile ? 'lg:w-1/2' : 'w-full'}`}>
          {/* Mobile section tabs */}
          <div className="lg:hidden border-b border-border bg-card/50 overflow-x-auto">
            <div className="flex p-2 gap-1">
              {Object.keys(sectionComponents).map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    activeSection === section
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-auto p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <ActiveComponent />
              </motion.div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => {
                    const sections = Object.keys(sectionComponents);
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex > 0) {
                      setActiveSection(sections[currentIndex - 1]);
                    }
                  }}
                  disabled={activeSection === Object.keys(sectionComponents)[0]}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    const sections = Object.keys(sectionComponents);
                    const currentIndex = sections.indexOf(activeSection);
                    if (currentIndex < sections.length - 1) {
                      setActiveSection(sections[currentIndex + 1]);
                    }
                  }}
                  disabled={activeSection === Object.keys(sectionComponents)[Object.keys(sectionComponents).length - 1]}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Section
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview panel */}
        {showPreview && !isMobile && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '50%', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden lg:block border-l border-border bg-muted/20"
          >
            <ResumePreview />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Editor;
