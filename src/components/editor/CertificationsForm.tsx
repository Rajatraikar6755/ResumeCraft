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
import { useResumeStore, Certification } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

function SortableCertificationCard({
  certification,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete
}: {
  certification: Certification;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (cert: Partial<Certification>) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: certification.id });

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
            {certification.name || 'New Certification'}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {certification.organization || 'Issuing Organization'}
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
                  <label className="text-sm font-medium">Certificate Name</label>
                  <input
                    type="text"
                    value={certification.name}
                    onChange={(e) => onUpdate({ name: e.target.value })}
                    placeholder="e.g., AWS Certified Solutions Architect"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issuing Organization</label>
                  <input
                    type="text"
                    value={certification.organization}
                    onChange={(e) => onUpdate({ organization: e.target.value })}
                    placeholder="e.g., Amazon Web Services"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Issue Date</label>
                  <input
                    type="text"
                    value={certification.issueDate}
                    onChange={(e) => onUpdate({ issueDate: e.target.value })}
                    placeholder="Jan 2023"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiration Date</label>
                  <input
                    type="text"
                    value={certification.expirationDate || ''}
                    onChange={(e) => onUpdate({ expirationDate: e.target.value })}
                    placeholder="Does not expire"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Credential ID</label>
                  <input
                    type="text"
                    value={certification.credentialId || ''}
                    onChange={(e) => onUpdate({ credentialId: e.target.value })}
                    placeholder="e.g., AWS-12345"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Credential URL</label>
                  <input
                    type="text"
                    value={certification.credentialUrl || ''}
                    onChange={(e) => onUpdate({ credentialUrl: e.target.value })}
                    placeholder="https://..."
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea
                  value={certification.description || ''}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  placeholder="Additional details about the certification..."
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

export function CertificationsForm() {
  const { resume, addCertification, updateCertification, removeCertification, reorderCertifications } = useResumeStore();
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
      const oldIndex = resume.certifications.findIndex((c) => c.id === active.id);
      const newIndex = resume.certifications.findIndex((c) => c.id === over.id);
      reorderCertifications(arrayMove(resume.certifications, oldIndex, newIndex));
    }
  };

  const handleAddCertification = () => {
    const newCert: Certification = {
      id: crypto.randomUUID(),
      name: '',
      organization: '',
      issueDate: '',
    };
    addCertification(newCert);
    setExpandedId(newCert.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Certifications</h3>
          <p className="text-sm text-muted-foreground">
            Add your certifications and licenses. Drag to reorder.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddCertification}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </motion.button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={resume.certifications.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {resume.certifications.map((cert) => (
                <SortableCertificationCard
                  key={cert.id}
                  certification={cert}
                  isExpanded={expandedId === cert.id}
                  onToggle={() => setExpandedId(expandedId === cert.id ? null : cert.id)}
                  onUpdate={(updates) => updateCertification(cert.id, updates)}
                  onDelete={() => removeCertification(cert.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {resume.certifications.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No certifications added yet</p>
          <button onClick={handleAddCertification} className="btn-secondary">
            Add Your First Certification
          </button>
        </div>
      )}
    </motion.div>
  );
}
