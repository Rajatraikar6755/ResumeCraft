import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { useResumeStore, Education } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

function EducationCard({
  education,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  education: Education;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (edu: Partial<Education>) => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-secondary/30">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">
            {education.degree || 'Degree'} {education.field && `in ${education.field}`}
          </h4>
          <p className="text-sm text-muted-foreground truncate">
            {education.institution || 'Institution Name'}
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Institution</label>
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => onUpdate({ institution: e.target.value })}
                  placeholder="Stanford University"
                  className="input-field w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Degree</label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => onUpdate({ degree: e.target.value })}
                    placeholder="Bachelor of Science"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Field of Study</label>
                  <input
                    type="text"
                    value={education.field}
                    onChange={(e) => onUpdate({ field: e.target.value })}
                    placeholder="Computer Science"
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <input
                    type="text"
                    value={education.startDate}
                    onChange={(e) => onUpdate({ startDate: e.target.value })}
                    placeholder="Sep 2018"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <input
                    type="text"
                    value={education.endDate}
                    onChange={(e) => onUpdate({ endDate: e.target.value })}
                    placeholder="May 2022"
                    className="input-field w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">GPA (Optional)</label>
                  <input
                    type="text"
                    value={education.gpa || ''}
                    onChange={(e) => onUpdate({ gpa: e.target.value })}
                    placeholder="3.8/4.0"
                    className="input-field w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
    };
    addEducation(newEdu);
    setExpandedId(newEdu.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Education</h3>
          <p className="text-sm text-muted-foreground">
            Add your educational background
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddEducation}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume.education.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              isExpanded={expandedId === edu.id}
              onToggle={() => setExpandedId(expandedId === edu.id ? null : edu.id)}
              onUpdate={(updates) => updateEducation(edu.id, updates)}
              onDelete={() => removeEducation(edu.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {resume.education.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No education added yet</p>
          <button onClick={handleAddEducation} className="btn-secondary">
            Add Your Education
          </button>
        </div>
      )}
    </motion.div>
  );
}
