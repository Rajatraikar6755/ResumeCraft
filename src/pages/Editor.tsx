import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { EditorSidebar } from '@/components/editor/EditorSidebar';
import { ImportResumeSection } from '@/components/editor/ImportResumeSection';
import { PersonalInfoForm } from '@/components/editor/PersonalInfoForm';
import { SummaryForm } from '@/components/editor/SummaryForm';
import { ExperienceForm } from '@/components/editor/ExperienceForm';
import { EducationForm } from '@/components/editor/EducationForm';
import { ProjectsForm } from '@/components/editor/ProjectsForm';
import { SkillsForm } from '@/components/editor/SkillsForm';
import { TemplatesSection } from '@/components/editor/TemplatesSection';
import { ResumePreview } from '@/components/editor/ResumePreview';
import { useResumeStore } from '@/stores/resumeStore';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const sectionComponents: Record<string, React.ComponentType> = {
  import: ImportResumeSection,
  personal: PersonalInfoForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  templates: TemplatesSection,
};

const Editor = () => {
  const { resume, setAtsScore, saveResume } = useResumeStore();
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [resumeName, setResumeName] = useState('');
  const [user, setUser] = useState<{ name: string } | null>(null);
  const isMobile = useIsMobile();
  const resumeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: resume.title || 'Resume',
  });

  const handleSaveClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to save your resume');
      navigate('/login');
      return;
    }
    setResumeName(resume.title || 'Untitled Resume');
    setIsSaveDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await saveResume(token, resumeName);
      setIsSaveDialogOpen(false);
    }
  };

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

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="relative group flex items-center gap-2 font-medium transition-all duration-300"
            >
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                {user ? `My Resume (${user.name})` : 'My Resume'}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <div className="h-6 w-px bg-border" />

            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn-ghost flex items-center gap-2 text-sm"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>

            <button
              onClick={handleSaveClick}
              className="btn-primary text-xs"
            >
              Save Resume
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrint}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeSection === section
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

                {activeSection === 'templates' ? (
                  <button
                    onClick={async () => {
                      setShowPreview(true);
                      const { resume, setAtsScore } = useResumeStore.getState();
                      try {
                        // Calculate ATS Score
                        const { calculateATSScore } = await import('@/lib/api');
                        const { data } = await calculateATSScore(resume);
                        setAtsScore(data.score);
                        toast.success('Resume created and ATS score calculated!');
                      } catch (e) {
                        console.error(e);
                        toast.error('Failed to calculate ATS score');
                      }
                    }}
                    className="btn-primary"
                  >
                    Create Resume
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const sections = Object.keys(sectionComponents);
                      const currentIndex = sections.indexOf(activeSection);
                      if (currentIndex < sections.length - 1) {
                        setActiveSection(sections[currentIndex + 1]);
                      }
                    }}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Section
                  </button>
                )}
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
            className="hidden lg:block border-l border-border bg-muted/20 relative"
          >
            {resume.atsScore !== undefined && (
              <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur p-2 rounded-lg border border-border shadow-sm">
                <div className="text-xs font-medium text-muted-foreground">ATS Score</div>
                <div className={`text-2xl font-bold ${(resume.atsScore || 0) >= 80 ? 'text-green-500' :
                  (resume.atsScore || 0) >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                  {resume.atsScore}/100
                </div>
              </div>
            )}

            <ResumePreview ref={resumeRef} />
          </motion.div>
        )}
      </div>

      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to easily identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleConfirmSave}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Editor;
