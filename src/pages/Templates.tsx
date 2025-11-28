import { motion } from 'framer-motion';
import { ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { AnimatedBackground } from '@/components/ui/animated-background';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and contemporary design with subtle accents',
    popular: true,
    features: ['ATS-Optimized', 'Two-column layout', 'Skill bars'],
    preview: 'linear-gradient(135deg, hsl(238 83% 67% / 0.1), hsl(280 80% 60% / 0.1))',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional format trusted by recruiters',
    popular: false,
    features: ['ATS-Friendly', 'Single column', 'Serif typography'],
    preview: 'linear-gradient(135deg, hsl(220 13% 15%), hsl(220 13% 10%))',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple elegance with maximum readability',
    popular: false,
    features: ['Maximum compatibility', 'Clean spacing', 'Sans-serif'],
    preview: 'linear-gradient(135deg, hsl(0 0% 98%), hsl(0 0% 94%))',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with a unique and bold layout',
    popular: false,
    features: ['Eye-catching design', 'Color accents', 'Icon integration'],
    preview: 'linear-gradient(135deg, hsl(280 80% 60% / 0.2), hsl(320 80% 60% / 0.2))',
  },
];

const Templates = () => {
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
                  className="h-48 rounded-xl mb-6 flex items-center justify-center"
                  style={{ background: template.preview }}
                >
                  <div className="w-32 h-44 bg-background/80 rounded-lg shadow-card p-3 space-y-2">
                    <div className="h-3 w-16 bg-secondary rounded shimmer" />
                    <div className="h-2 w-full bg-secondary/50 rounded" />
                    <div className="h-2 w-4/5 bg-secondary/50 rounded" />
                    <div className="mt-3 h-2 w-12 bg-primary/20 rounded" />
                    <div className="h-2 w-full bg-secondary/50 rounded" />
                    <div className="h-2 w-3/4 bg-secondary/50 rounded" />
                  </div>
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
                <Link to="/editor">
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
