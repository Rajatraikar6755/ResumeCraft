import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, FileText, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Spotlight effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] spotlight" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Resume Builder</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="text-foreground">Craft resumes that</span>
          <br />
          <span className="gradient-text">land interviews</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Transform your experience into ATS-optimized, professionally written resumes
          with the power of AI. Stand out from the crowd in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/editor">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
          <Link to="/templates">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-secondary flex items-center gap-2 text-lg px-8 py-4"
            >
              View Templates
            </motion.button>
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { icon: FileText, text: 'ATS-Optimized' },
            { icon: Zap, text: 'Instant Generation' },
            { icon: Sparkles, text: 'AI-Enhanced Writing' },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-gradient-radial opacity-50" />
          <div className="relative card-glass p-2 md:p-4 rounded-2xl shadow-elevated">
            <div className="bg-card rounded-xl overflow-hidden border border-border">
              {/* Mock editor UI */}
              <div className="flex h-[400px] md:h-[500px]">
                {/* Sidebar */}
                <div className="w-16 md:w-64 bg-secondary/30 border-r border-border p-4 hidden md:block">
                  <div className="space-y-2">
                    {['Personal Info', 'Experience', 'Education', 'Skills', 'Projects'].map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          i === 1 ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Editor */}
                <div className="flex-1 p-4 md:p-6 space-y-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="space-y-3"
                  >
                    <div className="h-8 w-48 bg-secondary rounded-lg shimmer" />
                    <div className="h-4 w-full bg-secondary rounded shimmer" />
                    <div className="h-4 w-4/5 bg-secondary rounded shimmer" />
                    <div className="h-4 w-3/5 bg-secondary rounded shimmer" />
                  </motion.div>
                </div>
                
                {/* Preview */}
                <div className="w-1/2 bg-secondary/20 border-l border-border p-4 md:p-6 hidden md:block">
                  <div className="bg-background rounded-lg h-full p-4 space-y-3">
                    <div className="h-6 w-32 bg-secondary rounded shimmer" />
                    <div className="h-3 w-full bg-secondary/50 rounded shimmer" />
                    <div className="h-3 w-4/5 bg-secondary/50 rounded shimmer" />
                    <div className="mt-4 h-4 w-24 bg-secondary rounded shimmer" />
                    <div className="h-3 w-full bg-secondary/50 rounded shimmer" />
                    <div className="h-3 w-3/4 bg-secondary/50 rounded shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-8 -right-4 md:right-8 p-3 rounded-xl bg-card border border-border shadow-card"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">ATS Score</div>
                <div className="text-sm font-semibold text-green-500">98/100</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
