import { motion } from 'framer-motion';
import {
  User,
  Briefcase,
  GraduationCap,
  Code,
  Wrench,
  FileText,
  ChevronRight,
  LayoutTemplate,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'import', label: 'Import Resume', icon: Upload },
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: Code },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
];

export function EditorSidebar({ activeSection, onSectionChange }: EditorSidebarProps) {
  return (
    <aside className="w-64 bg-card/50 border-r border-border p-4 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Resume Sections</h2>
        <p className="text-sm text-muted-foreground">Build your resume step by step</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {sections.map((section, i) => (
          <motion.button
            key={section.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
              activeSection === section.id
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
            </div>
            {activeSection === section.id && (
              <ChevronRight className="w-4 h-4" />
            )}
          </motion.button>
        ))}
      </nav>

      {/* ATS Score Preview */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">ATS Score</span>
            <span className="text-lg font-bold text-green-500">--</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-primary to-green-500 rounded-full transition-all duration-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Complete all sections to see your score
          </p>
        </div>
      </div>
    </aside>
  );
}
