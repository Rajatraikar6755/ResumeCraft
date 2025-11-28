import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useResumeStore, Experience } from '@/stores/resumeStore';
import { MagicWriter } from '@/components/ui/magic-writer';
import { cn } from '@/lib/utils';

function SortableExperienceCard({
  experience,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
  onGenerateBullet
}: {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (exp: Partial<Experience>) => void;
  onDelete: () => void;
  onGenerateBullet: (text: string) => Promise<string>;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [bulletInput, setBulletInput] = useState('');

  const addBullet = async (generated?: string) => {
    const text = generated || bulletInput.trim();
    if (text) {
      onUpdate({
        bullets: [...experience.bullets, text],
      });
      setBulletInput('');
    }
  };

  const removeBullet = (index: number) => {
    onUpdate({
      bullets: experience.bullets.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'bg-card border border-border rounded-xl overflow-hidden transition-shadow',
        isDragging && 'shadow-elevated z-10'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-secondary/30">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {experience.position || 'New Position'}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {experience.company || 'Company Name'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Position</label>
                  <input
                    type="text"
                    value={experience.position}
                    onChange={(e) => onUpdate({ position: e.target.value })}
                    placeholder="Software Engineer"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => onUpdate({ company: e.target.value })}
                    placeholder="Google"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="text"
                    value={experience.startDate}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    placeholder="Jan 2022"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="text"
                    value={experience.endDate}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    placeholder="Present"
                    className="input-field w-full"
                  />
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Achievements & Responsibilities</label>

                {experience.bullets.map((bullet, index) => (
                  <div key={index} className="flex items-start gap-2 group">
                    <span className="text-muted-foreground mt-3">•</span>
                    <div className="flex-1 p-2 rounded-lg bg-secondary/50 text-sm">
                      {bullet}
                    </div>
                    <button
                      onClick={() => removeBullet(index)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <MagicWriter
                  value={bulletInput}
                  onChange={setBulletInput}
                  onGenerate={async (prompt) => {
                    const generated = await onGenerateBullet(prompt);
                    await addBullet(generated);
                    return generated;
                  }}
                  placeholder="Describe what you did... (e.g., 'Built a dashboard for analytics')"
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience, reorderExperiences } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = resume.experiences.findIndex((e) => e.id === active.id);
      const newIndex = resume.experiences.findIndex((e) => e.id === over.id);
      reorderExperiences(arrayMove(resume.experiences, oldIndex, newIndex));
    }
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      bullets: [],
    };
    addExperience(newExp);
    setExpandedId(newExp.id);
  };

  const handleGenerateBullet = async (prompt: string): Promise<string> => {
    try {
      const { data } = await import('@/lib/api').then(m => m.generateContent(
        `Write a professional resume bullet point based on this input. Use strong action verbs, quantify results if possible, and keep it concise. Input: "${prompt}"`
      ));
      return data.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate content');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Work Experience</h3>
          <p className="text-sm text-muted-foreground">
            Add your work history. Drag to reorder. Click ✨ to enhance bullet points with AI.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddExperience}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </motion.button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resume.experiences.map((e) => e.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {resume.experiences.map((exp) => (
                <SortableExperienceCard
                  key={exp.id}
                  experience={exp}
                  isExpanded={expandedId === exp.id}
                  onToggle={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                  onUpdate={(updates) => updateExperience(exp.id, updates)}
                  onDelete={() => removeExperience(exp.id)}
                  onGenerateBullet={handleGenerateBullet}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {resume.experiences.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No experience added yet</p>
          <button onClick={handleAddExperience} className="btn-secondary">
            Add Your First Experience
          </button>
        </div>
      )}
    </motion.div>
  );
}
