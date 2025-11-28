import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { parseResume } from '@/lib/api';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

export const ImportResumeSection = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setResume } = useResumeStore();

    const handleFileSelect = async (file: File) => {
        // Validation
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a PDF or DOCX file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setIsUploading(true);
        try {
            const response = await parseResume(file);
            const parsedData = response.data;

            // Update store with parsed data
            const currentResume = useResumeStore.getState().resume;

            setResume({
                ...currentResume,
                personalInfo: { ...currentResume.personalInfo, ...parsedData.personalInfo },
                summary: parsedData.summary || currentResume.summary,
                experiences: parsedData.experiences || [], // Note: API returns 'experiences' (plural)
                education: parsedData.education || [],
                projects: parsedData.projects || [],
                skills: parsedData.skills?.map((s: any) => typeof s === 'object' ? s.name : s) || [],
            });

            toast.success('Resume imported successfully!');
        } catch (error) {
            console.error('Import error:', error);
            toast.error('Failed to parse resume. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <Upload className="w-6 h-6 text-primary" />
                    Import from Resume
                </h2>
                <p className="text-muted-foreground">
                    Upload your existing resume (PDF or DOCX) and we'll extract the details for you.
                </p>
            </div>

            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center gap-4 min-h-[300px]",
                    isDragging
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50",
                    isUploading && "pointer-events-none opacity-50"
                )}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.docx,.doc"
                    onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                            handleFileSelect(e.target.files[0]);
                        }
                    }}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                            <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium text-lg">Analyzing Resume...</h3>
                            <p className="text-sm text-muted-foreground">
                                Our AI is reading your document
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <FileText className="w-8 h-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-medium text-lg">
                                Click or drag file to upload
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Supports PDF and DOCX files up to 10MB
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
                            <AlertCircle className="w-3 h-3" />
                            <span>AI-powered extraction</span>
                        </div>
                    </>
                )}
            </div>

            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4">
                <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    What will be imported?
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-xs text-blue-700 dark:text-blue-300">
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Personal Information
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Professional Summary
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Work Experience
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Education History
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Projects
                    </li>
                    <li className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                        Skills
                    </li>
                </ul>
            </div>
        </div>
    );
};
