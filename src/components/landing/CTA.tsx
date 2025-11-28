import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CTA() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto relative">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial opacity-30" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative card-glass p-12 md:p-16 text-center overflow-hidden"
        >
          {/* Decorative gradient */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-primary opacity-10 blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 blur-3xl" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to land your{' '}
              <span className="gradient-text">dream job?</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals who've transformed their careers with AI-powered resumes.
            </p>
            
            <Link to="/editor">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary text-lg px-10 py-5 flex items-center gap-3 mx-auto"
              >
                Start Building Now
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            
            <p className="text-sm text-muted-foreground mt-6">
              No credit card required • Free forever plan
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
