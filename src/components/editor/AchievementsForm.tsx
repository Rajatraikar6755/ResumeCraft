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
import { Plus, GripVertical, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResumeStore, Achievement } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

function SortableAchievementCard({
  achievement,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete
}: {
  achievement: Achievement;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (achieve: Partial<Achievement>) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: achievement.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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
            {achievement.title || 'New Achievement'}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {achievement.organization || 'Organization'}
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
                  <label className="text-sm font-medium">Achievement Title</label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    placeholder="e.g., Employee of the Month"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <input
                    type="text"
                    value={achievement.organization}
                    onChange={(e) => onUpdate({ organization: e.target.value })}
                    placeholder="e.g., Google"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="text"
                  value={achievement.date}
                  onChange={(e) => onUpdate({ date: e.target.value })}
                  placeholder="Oct 2023"
                  className="input-field w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={achievement.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Details about what you achieved..."
                  className="input-field w-full resize-none h-24"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AchievementsForm() {
  const { resume, addAchievement, updateAchievement, removeAchievement, reorderAchievements } = useResumeStore();
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
      const oldIndex = resume.achievements.findIndex((a) => a.id === active.id);
      const newIndex = resume.achievements.findIndex((a) => a.id === over.id);
      reorderAchievements(arrayMove(resume.achievements, oldIndex, newIndex));
    }
  };

  const handleAddAchievement = () => {
    const newAchieve: Achievement = {
      id: crypto.randomUUID(),
      title: '',
      organization: '',
      date: '',
      description: '',
    };
    addAchievement(newAchieve);
    setExpandedId(newAchieve.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Achievements</h3>
          <p className="text-sm text-muted-foreground">
            Add your awards and honors. Drag to reorder.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddAchievement}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </motion.button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resume.achievements.map((a) => a.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {resume.achievements.map((achieve) => (
                <SortableAchievementCard
                  key={achieve.id}
                  achievement={achieve}
                  isExpanded={expandedId === achieve.id}
                  onToggle={() => setExpandedId(expandedId === achieve.id ? null : achieve.id)}
                  onUpdate={(updates) => updateAchievement(achieve.id, updates)}
                  onDelete={() => removeAchievement(achieve.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {resume.achievements.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No achievements added yet</p>
          <button onClick={handleAddAchievement} className="btn-secondary">
            Add Your First Achievement
          </button>
        </div>
      )}
    </motion.div>
  );
}
