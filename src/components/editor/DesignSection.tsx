import { motion } from 'framer-motion';
import { Type, Minus, Plus } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

const fonts = [
  { id: 'inter', name: 'Inter', className: 'font-sans' },
  { id: 'calibri', name: 'Calibri', className: 'font-sans' }, // Fallback in CSS if calibri not available
  { id: 'lato', name: 'Lato', className: 'font-sans' },
  { id: 'roboto', name: 'Roboto', className: 'font-sans' },
  { id: 'poppins', name: 'Poppins', className: 'font-sans' },
];

export function DesignSection() {
  const { resume, setFontFamily, setFontSizeScale } = useResumeStore();

  const handleDecreaseSize = () => {
    const currentSize = resume.fontSizeScale || 1.0;
    if (currentSize > 0.7) {
      setFontSizeScale(Math.max(0.7, currentSize - 0.1));
    }
  };

  const handleIncreaseSize = () => {
    const currentSize = resume.fontSizeScale || 1.0;
    if (currentSize < 1.5) {
      setFontSizeScale(Math.min(1.5, currentSize + 0.1));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Design & Typography</h3>
        <p className="text-sm text-muted-foreground">
          Customize the global typography of your resume.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-3 flex items-center gap-2">
            <Type className="w-4 h-4" />
            Font Family
          </label>
          <div className="grid grid-cols-2 gap-3">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => setFontFamily(font.id)}
                className={cn(
                  'p-3 rounded-lg border-2 text-left transition-all duration-200',
                  resume.fontFamily === font.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-transparent bg-secondary/50 hover:bg-secondary'
                )}
              >
                <span className="font-medium" style={{ fontFamily: font.id }}>
                  {font.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <label className="text-sm font-medium mb-3 block">
            Global Font Size
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDecreaseSize}
              className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2"
              disabled={(resume.fontSizeScale || 1.0) <= 0.7}
            >
              <Minus className="w-4 h-4" />
              <span>A-</span>
            </button>
            <div className="flex-1 text-center font-medium">
              {Math.round((resume.fontSizeScale || 1.0) * 100)}%
            </div>
            <button
              onClick={handleIncreaseSize}
              className="p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors flex items-center gap-2"
              disabled={(resume.fontSizeScale || 1.0) >= 1.5}
            >
              <Plus className="w-4 h-4" />
              <span>A+</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Adjusting this scales the entire document perfectly.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
