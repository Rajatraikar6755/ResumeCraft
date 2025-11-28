import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-4">
        <div className="glass rounded-2xl px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">ResumeCraft</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Templates
              </Link>
              <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="btn-ghost text-sm">
                Sign In
              </Link>
              <Link to="/editor">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Get Started
                </motion.button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mx-4 mt-2"
          >
            <div className="glass rounded-2xl p-6 space-y-4">
              <Link 
                to="/templates" 
                onClick={() => setIsOpen(false)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </Link>
              <Link 
                to="/pricing" 
                onClick={() => setIsOpen(false)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                onClick={() => setIsOpen(false)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <hr className="border-border" />
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link to="/editor" onClick={() => setIsOpen(false)}>
                <button className="w-full btn-primary">Get Started</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
