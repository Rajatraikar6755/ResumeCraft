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
  Upload,
  Award,
  Medal,
  GripVertical,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useResumeStore } from '@/stores/resumeStore';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditorSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  atsScore?: number;
  className?: string;
}

const SECTION_ICONS: Record<string, any> = {
  experience: Briefcase,
  education: GraduationCap,
  projects: Code,
  skills: Wrench,
  certifications: Award,
  achievements: Medal,
};

const SECTION_LABELS: Record<string, string> = {
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  achievements: 'Achievements',
};

function SortableNavItem({ id, label, icon: Icon, isActive, onClick }: { id: string, label: string, icon: any, isActive: boolean, onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("relative z-0", isDragging && "z-10")}
    >
      <div
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
          isDragging && 'shadow-elevated opacity-80'
        )}
      >
        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={onClick}>
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {isActive && <ChevronRight className="w-4 h-4" />}
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:bg-secondary/80 p-1 rounded">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditorSidebar({ activeSection, onSectionChange, atsScore, className }: EditorSidebarProps) {
  const { resume, setSectionOrder } = useResumeStore();
  const sectionOrder = resume.sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements'];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string);
      const newIndex = sectionOrder.indexOf(over.id as string);
      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500 from-green-500 to-emerald-400';
    if (score >= 60) return 'text-yellow-500 from-yellow-500 to-orange-400';
    return 'text-red-500 from-red-500 to-rose-400';
  };

  const getScoreColorText = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const renderStaticButton = (id: string, label: string, icon: any) => {
    const Icon = icon;
    const isActive = activeSection === id;
    return (
      <button
        key={id}
        onClick={() => onSectionChange(id)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
          isActive
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4" />}
      </button>
    );
  };

  return (
    <aside className={cn("w-64 bg-card/50 border-r border-border p-4 flex flex-col h-full overflow-y-auto", className)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Resume Sections</h2>
        <p className="text-sm text-muted-foreground">Drag items with <GripVertical className="inline w-3 h-3"/> to reorder</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {renderStaticButton('import', 'Import Resume', Upload)}
        {renderStaticButton('personal', 'Personal Info', User)}
        {renderStaticButton('summary', 'Summary', FileText)}

        <div className="my-2 border-t border-border/50 pt-2" />
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sectionOrder.map((sectionId) => (
                <SortableNavItem
                  key={sectionId}
                  id={sectionId}
                  label={SECTION_LABELS[sectionId]}
                  icon={SECTION_ICONS[sectionId]}
                  isActive={activeSection === sectionId}
                  onClick={() => onSectionChange(sectionId)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <div className="my-2 border-t border-border/50 pt-2" />
        
        {renderStaticButton('design', 'Design & Fonts', Palette)}
        {renderStaticButton('templates', 'Templates', LayoutTemplate)}
      </nav>

      {/* ATS Score Preview */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="p-3 rounded-xl bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">ATS Score</span>
            <span className={cn("text-lg font-bold", atsScore !== undefined ? getScoreColorText(atsScore) : "text-muted-foreground")}>
              {atsScore !== undefined ? atsScore : '--'}
            </span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <div 
              className={cn("h-full rounded-full transition-all duration-500 bg-gradient-to-r", atsScore !== undefined ? getScoreColor(atsScore) : "w-0")}
              style={{ width: `${atsScore || 0}%` }}
            />
          </div>
          <button 
            onClick={() => onSectionChange('ats')} 
            className="w-full btn-primary py-1.5 text-xs rounded-md"
          >
            Calculate ATS Score
          </button>
        </div>
      </div>
    </aside>
  );
}
