import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { calculateATSScore } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ATSSection() {
  const { resume, setAtsScore, setAtsFeedback } = useResumeStore();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateScore = async () => {
    setIsCalculating(true);
    try {
      const { data } = await calculateATSScore(resume);
      setAtsScore(data.score);
      setAtsFeedback(data.feedback);
      toast.success('ATS analysis complete!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to calculate ATS score. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          ATS Analysis
        </h3>
        <p className="text-sm text-muted-foreground">
          Analyze your resume against Applicant Tracking Systems to optimize for job applications.
        </p>
      </div>

      <div className="p-6 border border-border rounded-xl bg-card">
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className={cn(
            "w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold border-4",
            resume.atsScore !== undefined ? getScoreColor(resume.atsScore) : "text-muted-foreground border-border",
            resume.atsScore !== undefined && resume.atsScore >= 80 ? "border-green-500" :
            resume.atsScore !== undefined && resume.atsScore >= 60 ? "border-yellow-500" :
            resume.atsScore !== undefined ? "border-red-500" : ""
          )}>
            {resume.atsScore !== undefined ? resume.atsScore : '--'}
          </div>
          
          <button
            onClick={handleCalculateScore}
            disabled={isCalculating}
            className="btn-primary flex items-center gap-2"
          >
            {isCalculating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Target className="w-4 h-4" />
            )}
            <span>{isCalculating ? 'Analyzing...' : 'Calculate ATS Score'}</span>
          </button>
        </div>
      </div>

      {resume.atsFeedback && (
        <div className={cn("p-5 rounded-xl border", getScoreBg(resume.atsScore || 0))}>
          <h4 className={cn("font-semibold mb-3 flex items-center gap-2", getScoreColor(resume.atsScore || 0))}>
            {resume.atsScore && resume.atsScore >= 80 ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            Analysis Feedback
          </h4>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">
            {resume.atsFeedback}
          </p>
        </div>
      )}
    </motion.div>
  );
}
