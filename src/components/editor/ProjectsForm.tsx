import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronDown, ChevronUp, Code, ExternalLink, X, Github } from 'lucide-react';
import { useResumeStore, Project } from '@/stores/resumeStore';
import { MagicWriter } from '@/components/ui/magic-writer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { importFromGithub } from '@/lib/api';

function ProjectCard({
  project,
  isExpanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  project: Project;
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (proj: Partial<Project>) => void;
  onDelete: () => void;
}) {
  const [techInput, setTechInput] = useState('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const addTech = () => {
    if (techInput.trim()) {
      onUpdate({ technologies: [...project.technologies, techInput.trim()] });
      setTechInput('');
    }
  };

  const removeTech = (index: number) => {
    onUpdate({ technologies: project.technologies.filter((_, i) => i !== index) });
  };

  const handleGenerateDescription = async (prompt: string): Promise<string> => {
    try {
      const { data } = await import('@/lib/api').then(m => m.generateContent(
        `Generate a concise project description with 2 to 5 bullet points based on this input. Use action verbs and focus on technical achievements. Do not include any introductory text. Input: "${prompt}"`
      ));
      return data.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate content');
    }
  };

  const handleImport = async () => {
    if (!importUrl) return;
    setIsImporting(true);
    try {
      const { data } = await importFromGithub(importUrl);
      onUpdate({
        name: data.name,
        description: data.description,
        technologies: data.technologies,
        url: data.url
      });
      setIsImportDialogOpen(false);
      setImportUrl('');
      toast.success('Project imported successfully');
      if (!isExpanded) onToggle(); // Expand to show imported details
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to import project. Please check the URL.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-secondary/30">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Code className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">
              {project.name || 'Project Name'}
            </h4>
            <p className="text-sm text-muted-foreground truncate">
              {project.technologies.slice(0, 3).join(', ') || 'No technologies'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsImportDialogOpen(true);
              }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              title="Import from GitHub"
            >
              <Github className="w-4 h-4" />
            </button>
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
                    <label className="text-sm font-medium">Project Name</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => onUpdate({ name: e.target.value })}
                      placeholder="E-Commerce Platform"
                      className="input-field w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      URL (Optional)
                      <ExternalLink className="w-3 h-3" />
                    </label>
                    <input
                      type="url"
                      value={project.url || ''}
                      onChange={(e) => onUpdate({ url: e.target.value })}
                      placeholder="https://github.com/..."
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <MagicWriter
                  value={project.description}
                  onChange={(desc) => onUpdate({ description: desc })}
                  onGenerate={handleGenerateDescription}
                  placeholder="Describe your project... (e.g., 'A full-stack e-commerce app with React and Node')"
                  label="Description"
                  rows={3}
                />

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Technologies</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.technologies.map((tech, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {tech}
                        <button
                          onClick={() => removeTech(index)}
                          className="hover:text-destructive transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      placeholder="Add technology (press Enter)"
                      className="input-field flex-1"
                    />
                    <button onClick={addTech} className="btn-secondary px-4">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Import from GitHub
            </DialogTitle>
            <DialogDescription>
              Enter the repository URL to automatically extract project details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Repository URL
              </label>
              <Input
                id="url"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? 'Importing...' : 'Import Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function ProjectsForm() {
  const { resume, addProject, updateProject, removeProject } = useResumeStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      technologies: [],
    };
    addProject(newProj);
    setExpandedId(newProj.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">Projects</h3>
          <p className="text-sm text-muted-foreground">
            Showcase your best work and side projects
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddProject}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {resume.projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              isExpanded={expandedId === proj.id}
              onToggle={() => setExpandedId(expandedId === proj.id ? null : proj.id)}
              onUpdate={(updates) => updateProject(proj.id, updates)}
              onDelete={() => removeProject(proj.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {resume.projects.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <button onClick={handleAddProject} className="btn-secondary">
            Add Your First Project
          </button>
        </div>
      )}
    </motion.div>
  );
}
