import { motion } from 'framer-motion';
import { Check, LayoutTemplate } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and contemporary design',
        preview: '/templates/modern.png',
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional professional format',
        preview: '/templates/classic.png',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple elegance with maximum readability',
        preview: '/templates/minimal.png',
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Stand out with a unique layout',
        preview: '/templates/creative.png',
    },
] as const;

export const TemplatesSection = () => {
    const { resume, setTemplate } = useResumeStore();

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <LayoutTemplate className="w-6 h-6 text-primary" />
                    Choose Template
                </h2>
                <p className="text-muted-foreground">
                    Select a template to instantly change the look of your resume.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {templates.map((template) => (
                    <motion.button
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setTemplate(template.id)}
                        className={cn(
                            "relative group rounded-xl border-2 overflow-hidden text-left transition-all",
                            resume.template === template.id
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-border hover:border-primary/50"
                        )}
                    >
                        {/* Selection Indicator */}
                        {resume.template === template.id && (
                            <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                                <Check className="w-3 h-3" />
                            </div>
                        )}

                        {/* Preview Image */}
                        <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                            <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Info */}
                        <div className="p-3 bg-card">
                            <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                                {template.description}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};
