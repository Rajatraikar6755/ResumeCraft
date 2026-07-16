import { forwardRef, useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { useResumeStore } from '@/stores/resumeStore';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

const templates = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const resume = useResumeStore((state) => state.resume);
  const hasContent =
    resume.personalInfo.fullName ||
    resume.summary ||
    resume.experiences.length > 0;

  const [scale, setScale] = useState(1);
  const [contentHeightPx, setContentHeightPx] = useState(1122); // Default 1 page height approx
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // ── Scale calculation ──────────────────────────────────────────
  const calcScale = useCallback(() => {
    if (!containerRef.current) return;
    const available = containerRef.current.clientWidth - 32; // 16px padding each side
    const a4Px = (A4_WIDTH_MM / 25.4) * 96; // 210mm → px at 96 DPI ≈ 794px
    setScale(available < a4Px ? available / a4Px : 1);
  }, []);

  useEffect(() => {
    calcScale();
    const ro = new ResizeObserver(calcScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [calcScale]);

  // ── JS Pagination ────────────────────────────────────────────────
  const getTopRelativeTo = (el: HTMLElement, container: HTMLElement) => {
    let top = 0;
    let current: HTMLElement | null = el;
    while (current && current !== container) {
      top += current.offsetTop;
      current = current.offsetParent as HTMLElement;
    }
    return top;
  };

  useLayoutEffect(() => {
    if (!contentRef.current) return;
    const container = contentRef.current;
    
    const elements = container.querySelectorAll('.break-inside-avoid');
    
    // 1. Reset dynamic margins
    elements.forEach((el: any) => {
      if (!el.hasAttribute('data-orig-mt')) {
        el.setAttribute('data-orig-mt', window.getComputedStyle(el).marginTop);
      }
      el.style.marginTop = el.getAttribute('data-orig-mt');
      el.removeAttribute('data-pushed');
    });

    // Force layout
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    container.offsetHeight; 

    const a4HeightPx = (A4_HEIGHT_MM / 25.4) * 96; // 1122.52px
    
    // 2. Measure and push elements
    elements.forEach((el: any) => {
      const top = getTopRelativeTo(el, container);
      const height = el.offsetHeight;
      
      const bottomMargin = 40; 
      const topMargin = 40;    
      
      const startPage = Math.floor(top / a4HeightPx);
      const pageEnd = (startPage + 1) * a4HeightPx - bottomMargin;
      
      if (top + height > pageEnd) {
        const nextPageStart = (startPage + 1) * a4HeightPx + topMargin;
        const requiredPush = Math.max(0, nextPageStart - top);
        
        if (requiredPush > 0) {
          const origMt = parseFloat(el.getAttribute('data-orig-mt')) || 0;
          el.style.setProperty('--orig-mt', `${origMt}px`);
          el.style.setProperty('--dynamic-mt', `${origMt + requiredPush}px`);
          el.style.marginTop = 'var(--dynamic-mt)';
          el.setAttribute('data-pushed', 'true');
        }
      }
    });

    // 3. Measure total pages
    const totalHeight = container.scrollHeight;
    setContentHeightPx(Math.max(a4HeightPx, totalHeight));
  }, [resume]);

  const TemplateComponent = templates[resume.template] || ModernTemplate;

  const fontStyle: React.CSSProperties = {
    fontFamily:
      resume.fontFamily === 'calibri' ? 'Calibri, sans-serif' :
      resume.fontFamily === 'lato'    ? 'Lato, sans-serif' :
      resume.fontFamily === 'roboto'  ? 'Roboto, sans-serif' :
      resume.fontFamily === 'poppins' ? 'Poppins, sans-serif' : 'Inter, sans-serif',
    fontSize: `calc(14px * ${resume.fontSizeScale || 1.0})`,
  };

  const a4HeightPx = (A4_HEIGHT_MM / 25.4) * 96;
  const numPages = Math.max(1, Math.ceil(contentHeightPx / a4HeightPx));

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 lg:p-8 bg-slate-200 custom-scrollbar flex flex-col items-center"
    >
      <div
        className="print-shadow-wrapper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          marginBottom: `calc(${contentHeightPx}px * ${scale} - ${contentHeightPx}px)`, // Adjust container height for scale
        }}
      >
        <div
          ref={ref as any}
          className="resume-preview-container page-mask"
          style={{
            ...fontStyle,
            width: `${A4_WIDTH_MM}mm`,
            minHeight: `${A4_HEIGHT_MM}mm`,
            position: 'relative',
            backgroundColor: 'white',
          }}
        >
          <div ref={contentRef} className="h-full relative">
            {hasContent ? (
              <TemplateComponent resume={resume} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[297mm] text-gray-400">
                <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm">Start editing to see your resume</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
