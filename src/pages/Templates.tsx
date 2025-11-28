import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { useResumeStore } from '@/stores/resumeStore';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle accents',
    popular: true,
    features: ['ATS-Optimized', 'Two-column layout', 'Skill bars'],
    preview: '/templates/modern.png',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional format trusted by recruiters',
    popular: false,
    features: ['ATS-Friendly', 'Single column', 'Serif typography'],
    preview: '/templates/classic.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple elegance with maximum readability',
    popular: false,
    features: ['Maximum compatibility', 'Clean spacing', 'Sans-serif'],
    preview: '/templates/minimal.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique and bold layout',
    popular: false,
    features: ['Eye-catching design', 'Color accents', 'Icon integration'],
    preview: '/templates/creative.png',
  },
];

const Templates = () => {
  const { setTemplate } = useResumeStore();
  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground />
      <Navbar />

      <main className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Choose Your <span className="gradient-text">Template</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All templates are fully customizable and optimized for ATS systems.
              Pick one that matches your style and industry.
            </p>
          </motion.div>

          {/* Templates grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-bento group relative overflow-hidden"
              >
                {template.popular && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                    <Star className="w-3 h-3 fill-primary" />
                    Popular
                  </div>
                )}

                {/* Preview */}
                <div
                  className="h-48 rounded-xl mb-6 flex items-center justify-center overflow-hidden bg-muted"
                >
                  <img
                    src={template.preview}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{template.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/editor"
                  onClick={() => {
                    useResumeStore.getState().resetResume();
                    setTemplate(template.id as any);
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Use This Template
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
