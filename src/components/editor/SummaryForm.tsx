import { motion } from 'framer-motion';
import { MagicWriter } from '@/components/ui/magic-writer';
import { useResumeStore } from '@/stores/resumeStore';

export function SummaryForm() {
  const { resume, setSummary } = useResumeStore();

  // AI generation
  const handleGenerate = async (prompt: string): Promise<string> => {
    try {
      const { data } = await import('@/lib/api').then(m => m.generateContent(
        `Rewrite the following professional summary for a resume. Keep it concise, professional, and impactful. Use action verbs. Text: "${prompt}"`
      ));
      return data.content;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to generate content');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold mb-2">Professional Summary</h3>
        <p className="text-sm text-muted-foreground">
          Write a brief overview of your professional background. Click the ✨ button to enhance with AI.
        </p>
      </div>

      <MagicWriter
        value={resume.summary}
        onChange={setSummary}
        onGenerate={handleGenerate}
        placeholder="Describe your professional background, key skills, and career goals... (e.g., 'React developer with 5 years of experience')"
        rows={6}
      />

      <div className="p-4 rounded-xl bg-secondary/50 border border-border">
        <h4 className="text-sm font-medium mb-2">💡 Tips for a great summary</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Keep it concise (3-4 sentences)</li>
          <li>• Highlight your most impressive achievements</li>
          <li>• Include relevant keywords for ATS optimization</li>
          <li>• Tailor it to the job you're applying for</li>
        </ul>
      </div>
    </motion.div>
  );
}
