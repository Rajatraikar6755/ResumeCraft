import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface MagicWriterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onGenerate?: (prompt: string) => Promise<string>;
  className?: string;
  label?: string;
  rows?: number;
}

export function MagicWriter({
  value,
  onChange,
  placeholder = 'Describe your experience...',
  onGenerate,
  className,
  label,
  rows = 4,
}: MagicWriterProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMagicGenerate = async () => {
    if (!onGenerate || isGenerating) return;

    if (!value.trim()) {
      toast.error("Please enter some text first to enhance it with AI");
      return;
    }

    setIsGenerating(true);
    setStreamedText('');

    try {
      const result = await onGenerate(value);

      // Simulate streaming effect
      for (let i = 0; i <= result.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 15));
        setStreamedText(result.slice(0, i));
      }

      onChange(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
      setStreamedText('');
    }
  };

  useEffect(() => {
    if (streamedText && textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [streamedText]);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div className="relative group">
        <div
          className={cn(
            'magic-border rounded-xl transition-all duration-300',
            isGenerating && 'animate-pulse-glow'
          )}
        >
          <textarea
            ref={textareaRef}
            value={isGenerating ? streamedText : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            disabled={isGenerating}
            className={cn(
              'w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground',
              'placeholder:text-muted-foreground resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50',
              'transition-all duration-200 relative z-10',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isGenerating && 'font-mono text-sm'
            )}
          />
        </div>

        {/* Magic button */}
        <AnimatePresence>
          {onGenerate && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMagicGenerate}
              disabled={isGenerating}
              type="button"
              className={cn(
                'absolute bottom-3 right-3 p-2 rounded-lg',
                'bg-gradient-primary text-primary-foreground',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-200 z-20',
                'hover:shadow-glow'
              )}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Generating indicator */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -bottom-8 left-0 flex items-center gap-2 text-sm text-primary"
            >
              <motion.div
                className="flex gap-1"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              </motion.div>
              <span>AI is crafting your content...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
