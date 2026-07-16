import { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
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

// A4 dimensions in pixels at 96 DPI
const A4_HEIGHT_PX = 1122; // 297mm × 3.7795 px/mm
const A4_WIDTH_MM = 210;

export const ResumePreview = forwardRef<HTMLDivElement>((props, ref) => {
  const resume = useResumeStore((state) => state.resume);
  const hasContent =
    resume.personalInfo.fullName ||
    resume.summary ||
    resume.experiences.length > 0;

  const [scale, setScale] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  // Hidden div used purely to measure the rendered template height
  const measureRef = useRef<HTMLDivElement>(null);
  // Outer container used for scale calculation
  const containerRef = useRef<HTMLDivElement>(null);

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

  // ── Page count calculation ─────────────────────────────────────
  useEffect(() => {
    if (!measureRef.current) return;
    const ro = new ResizeObserver(() => {
      if (!measureRef.current) return;
      const h = measureRef.current.scrollHeight;
      setPageCount(Math.max(1, Math.ceil(h / A4_HEIGHT_PX)));
    });
    ro.observe(measureRef.current);
    return () => ro.disconnect();
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

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 lg:p-8 bg-muted/20 custom-scrollbar flex flex-col items-center"
    >
      {/* ── Hidden measurement node (renders at full 1:1 scale, off-screen) ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: `${(A4_WIDTH_MM / 25.4) * 96}px`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={measureRef} style={fontStyle}>
          {hasContent && <TemplateComponent resume={resume} />}
        </div>
      </div>

      {/* ── Visible paginated output ─────────────────────────────── */}
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          /* push siblings down so the scaled content doesn't overlap */
          marginBottom: `calc(${pageCount} * 297mm * ${scale} - ${pageCount} * 297mm)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0,
        }}
      >
        {Array.from({ length: pageCount }).map((_, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Page gap (not shown on first page) */}
            {i > 0 && <div className="resume-page-gap" />}

            {/* A4 page */}
            <div
              ref={i === 0 ? (ref as React.RefObject<HTMLDivElement>) : undefined}
              className="a4-page"
              style={{
                ...fontStyle,
                overflow: 'hidden',
                height: '297mm',
              }}
            >
              {/* Clip content to the correct page using a shifted inner wrapper */}
              <div
                style={{
                  position: 'relative',
                  top: `-${i * 100}%`,          // shift by one page height per page
                  height: `${pageCount * 100}%`, // total content height spans all pages
                  overflow: 'hidden',
                }}
              >
                {hasContent ? (
                  <TemplateComponent resume={resume} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">Start editing to see your resume</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
