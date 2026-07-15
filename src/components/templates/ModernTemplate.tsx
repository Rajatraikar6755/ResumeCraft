import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const ModernTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills, certifications, achievements, sectionOrder } = resume;

    const renderSection = (id: string) => {
        switch (id) {
            case 'experience':
                if (!experiences || experiences.length === 0) return null;
                return (
                    <section key="experience" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Experience</h2>
                        <div className="space-y-3">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid ">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{exp.position}</h3>
                                            <p className="font-medium opacity-90">{exp.company}</p>
                                        </div>
                                        <span className="opacity-75">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    {exp.bullets && exp.bullets.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 opacity-80">
                                            {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'education':
                if (!education || education.length === 0) return null;
                return (
                    <section key="education" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Education</h2>
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid ">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                                            <p className="opacity-90">{edu.institution}</p>
                                        </div>
                                        <span className="opacity-75">{edu.startDate} - {edu.endDate}</span>
                                    </div>
                                    {edu.gpa && <p className="opacity-75 mt-0.5">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'projects':
                if (!projects || projects.length === 0) return null;
                return (
                    <section key="projects" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Projects</h2>
                        <div className="space-y-3">
                            {projects.map((proj) => (
                                <div key={proj.id} className="break-inside-avoid ">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold">{proj.name}</h3>
                                        {proj.url && <span className="opacity-75">{proj.url}</span>}
                                    </div>
                                    <p className="opacity-80 mt-1">{proj.description}</p>
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <p className="opacity-75 mt-0.5">Tech: {proj.technologies.join(', ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'skills':
                if (!skills || skills.length === 0) return null;
                return (
                    <section key="skills" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 bg-black/5 rounded opacity-90">{s}</span>
                            ))}
                        </div>
                    </section>
                );
            case 'certifications':
                if (!certifications || certifications.length === 0) return null;
                return (
                    <section key="certifications" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Certifications</h2>
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid ">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{cert.name}</h3>
                                            <p className="opacity-90">{cert.organization}</p>
                                        </div>
                                        <span className="opacity-75">{cert.issueDate}</span>
                                    </div>
                                    {cert.description && <p className="opacity-80 mt-1">{cert.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'achievements':
                if (!achievements || achievements.length === 0) return null;
                return (
                    <section key="achievements" className="mb-4">
                        <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Achievements</h2>
                        <div className="space-y-3">
                            {achievements.map((ach) => (
                                <div key={ach.id} className="break-inside-avoid ">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">{ach.title}</h3>
                                            <p className="opacity-90">{ach.organization}</p>
                                        </div>
                                        <span className="opacity-75">{ach.date}</span>
                                    </div>
                                    {ach.description && <p className="opacity-80 mt-1">{ach.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-12 text-gray-800" style={{ fontSize: '1em' }}>
            {/* Header */}
            {personalInfo.fullName && (
                <header className="pb-6 mb-6 border-b-2 border-primary/20 text-primary">
                    <div className="flex items-center gap-6 justify-between">
                        <div className="flex-1">
                            <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', lineHeight: 1.2, marginBottom: '0.25em' }}>{personalInfo.fullName}</h1>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 opacity-80" style={{ fontSize: '0.85em' }}>
                                {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {personalInfo.email}</span>}
                                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {personalInfo.phone}</span>}
                                {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {personalInfo.location}</span>}
                                {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {personalInfo.linkedin}</span>}
                                {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" /> {personalInfo.github}</span>}
                                {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {personalInfo.portfolio}</span>}
                            </div>
                        </div>
                        {personalInfo.photoUrl && (
                            <img src={personalInfo.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-current" />
                        )}
                    </div>
                </header>
            )}

            {/* Summary */}
            {summary && (
                <section className="mb-4">
                    <h2 className="font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">Professional Summary</h2>
                    <p className="opacity-90 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Dynamic Sections */}
            {(sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements']).map(renderSection)}
        </div>
    );
};
