import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';

const suggestedSkills = {
  'Frontend': ['React', 'Vue.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
  'Backend': ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB'],
  'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
  'Soft Skills': ['Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Agile'],
};

export function SkillsForm() {
  const { resume, setSkills } = useResumeStore();
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !resume.skills.includes(trimmed)) {
      setSkills([...resume.skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(resume.skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Skills</h3>
        <p className="text-sm text-muted-foreground">
          Add your technical and soft skills. Use keywords relevant to your target roles.
        </p>
      </div>

      {/* Current skills */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Your Skills</label>
        <div className="flex flex-wrap gap-2 min-h-[60px] p-4 rounded-xl bg-secondary/30 border border-border">
          <AnimatePresence>
            {resume.skills.map((skill) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          {resume.skills.length === 0 && (
            <span className="text-muted-foreground text-sm">No skills added yet</span>
          )}
        </div>
      </div>

      {/* Add skill input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="input-field flex-1"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => addSkill(skillInput)}
          disabled={!skillInput.trim()}
          className="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Suggested skills */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          Suggested Skills
        </div>
        
        {Object.entries(suggestedSkills).map(([category, skills]) => (
          <div key={category} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.button
                  key={skill}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addSkill(skill)}
                  disabled={resume.skills.includes(skill)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    resume.skills.includes(skill)
                      ? 'bg-primary/20 text-primary cursor-not-allowed'
                      : 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {resume.skills.includes(skill) ? '✓ ' : '+ '}{skill}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="text-sm font-medium mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-muted-foreground">
          Include a mix of technical skills and soft skills. Match your skills to keywords in job descriptions for better ATS scores.
        </p>
      </div>
    </motion.div>
  );
}
