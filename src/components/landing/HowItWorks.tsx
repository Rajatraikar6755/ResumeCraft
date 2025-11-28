import { motion } from 'framer-motion';
import { Upload, Wand2, Download } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Input Your Details',
    description: 'Enter your experience, education, and skills. Import directly from GitHub or LinkedIn for faster setup.',
  },
  {
    number: '02',
    icon: Wand2,
    title: 'Let AI Enhance',
    description: 'Our AI transforms your content into compelling, achievement-focused bullet points that recruiters love.',
  },
  {
    number: '03',
    icon: Download,
    title: 'Export & Apply',
    description: 'Download your polished, ATS-optimized resume and start applying to your dream jobs with confidence.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      
      <div className="max-w-6xl mx-auto relative">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How it{' '}
            <span className="gradient-text">works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a professional resume in three simple steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="relative"
            >
              <div className="text-center">
                {/* Number badge */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-32 h-32 mx-auto mb-6 relative"
                >
                  <div className="absolute inset-0 bg-gradient-primary rounded-3xl opacity-20 blur-xl" />
                  <div className="relative w-full h-full bg-card rounded-3xl border border-border flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {step.number}
                  </div>
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
