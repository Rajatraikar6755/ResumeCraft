import { motion } from 'framer-motion';
import { 
  Sparkles, 
  FileCheck, 
  Palette, 
  Download,
  GitBranch,
  Shield
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Writing',
    description: 'Transform simple bullet points into powerful achievement statements using advanced AI that understands your industry.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: FileCheck,
    title: 'ATS-Optimized',
    description: 'Every resume is automatically optimized for Applicant Tracking Systems, ensuring your resume gets seen by recruiters.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Palette,
    title: 'Beautiful Templates',
    description: 'Choose from professionally designed templates that stand out while maintaining clean, readable formats.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Download,
    title: 'Instant Export',
    description: 'Download your resume as a perfectly formatted PDF, ready to send to employers or upload to job boards.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: GitBranch,
    title: 'GitHub Integration',
    description: 'Import your projects directly from GitHub. Showcase your best work automatically with commit stats.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and never shared. You control your information with complete transparency.',
    gradient: 'from-indigo-500 to-violet-500',
  },
];

export function Features() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need to{' '}
            <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create the perfect resume in minutes, not hours.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="card-bento group"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-4`}>
                <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-foreground" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
