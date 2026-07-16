import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const ModernTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills, certifications, achievements, sectionOrder } = resume;

    const sectionHeading = (title: string) => (
        <h2 className="font-bold uppercase tracking-widest text-xs mb-3 pb-1.5 border-b-2 border-indigo-500 text-indigo-700 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-indigo-500 rounded-full" />
            {title}
        </h2>
    );

    const renderSection = (id: string) => {
        switch (id) {
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <section key="experience" className="mb-5">
                        {sectionHeading('Experience')}
                        <div className="space-y-4">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                            <p className="text-indigo-600 font-medium text-sm">{exp.company}</p>
                                        </div>
                                        <span className="shrink-0 text-xs bg-indigo-50 text-indigo-600 font-medium px-2 py-0.5 rounded-full border border-indigo-100 whitespace-nowrap mt-0.5">
                                            {exp.startDate} – {exp.endDate}
                                        </span>
                                    </div>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="mt-2 space-y-1">
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-indigo-400 rounded-full shrink-0" />
                                                    {b}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'education':
                if (!education?.length) return null;
                return (
                    <section key="education" className="mb-5">
                        {sectionHeading('Education')}
                        <div className="space-y-3">
                            {education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                                        <p className="text-gray-600 text-sm">{edu.institution}</p>
                                        {edu.gpa && <p className="text-xs text-gray-400 mt-0.5">GPA: {edu.gpa}</p>}
                                    </div>
                                    <span className="shrink-0 text-xs text-gray-500 whitespace-nowrap mt-0.5">{edu.startDate} – {edu.endDate}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'projects':
                if (!projects?.length) return null;
                return (
                    <section key="projects" className="mb-5">
                        {sectionHeading('Projects')}
                        <div className="space-y-3">
                            {projects.map((proj) => (
                                <div key={proj.id} className="break-inside-avoid">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                        {proj.url && <a href={proj.url} className="text-xs text-indigo-500 hover:underline shrink-0">{proj.url}</a>}
                                    </div>
                                    {proj.description && <p className="text-sm text-gray-600 mt-1">{proj.description}</p>}
                                    {proj.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {proj.technologies.map((t, i) => (
                                                <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'skills':
                if (!skills?.length) return null;
                return (
                    <section key="skills" className="mb-5">
                        {sectionHeading('Skills')}
                        <div className="flex flex-wrap gap-2">
                            {skills.map((s, i) => (
                                <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </section>
                );

            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <section key="certifications" className="mb-5">
                        {sectionHeading('Certifications')}
                        <div className="space-y-2">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                                        <p className="text-indigo-600 text-xs">{cert.organization}</p>
                                    </div>
                                    {cert.issueDate && <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap mt-0.5">{cert.issueDate}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                if (!achievements?.length) return null;
                return (
                    <section key="achievements" className="mb-5">
                        {sectionHeading('Achievements')}
                        <div className="space-y-2">
                            {achievements.map((ach) => (
                                <div key={ach.id} className="break-inside-avoid">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{ach.title}</h3>
                                            {ach.organization && <p className="text-gray-500 text-xs">{ach.organization}</p>}
                                        </div>
                                        {ach.date && <span className="shrink-0 text-xs text-gray-400 whitespace-nowrap mt-0.5">{ach.date}</span>}
                                    </div>
                                    {ach.description && <p className="text-sm text-gray-600 mt-1">{ach.description}</p>}
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
        <div className="text-sm text-gray-800">
            {/* ── Colored header band ──────────────────────────────── */}
            {personalInfo.fullName && (
                <header className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-10 py-7">
                    <div className="flex items-center gap-6 justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-bold tracking-tight leading-tight">{personalInfo.fullName}</h1>
                            {personalInfo.jobTitle && (
                                <p className="text-indigo-200 text-sm mt-1 font-medium">{personalInfo.jobTitle}</p>
                            )}
                            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-xs text-indigo-100">
                                {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                                {personalInfo.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{personalInfo.location}</span>}
                                {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
                                {personalInfo.github && <span className="flex items-center gap-1"><Github className="w-3 h-3" />{personalInfo.github}</span>}
                                {personalInfo.portfolio && <span className="flex items-center gap-1"><Globe className="w-3 h-3" />{personalInfo.portfolio}</span>}
                            </div>
                        </div>
                        {personalInfo.photoUrl && (
                            <img src={personalInfo.photoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shrink-0" />
                        )}
                    </div>
                </header>
            )}

            {/* ── Body content ─────────────────────────────────────── */}
            <div className="px-10 py-7">
                {summary && (
                    <section className="mb-5">
                        {sectionHeading('Professional Summary')}
                        <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
                    </section>
                )}
                {(sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements']).map(renderSection)}
            </div>
        </div>
    );
};
