import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const ClassicTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills, certifications, achievements, sectionOrder } = resume;

    const sectionHeading = (title: string) => (
        <h2 className="text-xs font-bold uppercase tracking-widest border-b border-black pb-0.5 mb-3 mt-0">
            {title}
        </h2>
    );

    const renderSection = (id: string) => {
        switch (id) {
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <section key="experience" className="mb-5">
                        {sectionHeading('Professional Experience')}
                        <div className="space-y-4">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{exp.company}</h3>
                                        <span className="text-xs italic text-gray-600 shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <p className="italic text-gray-700 mb-1.5">{exp.position}</p>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="list-disc list-outside ml-4 space-y-0.5 text-gray-700">
                                            {exp.bullets.map((b, i) => (
                                                <li key={i}>{b}</li>
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
                        <div className="space-y-2">
                            {education.map((edu) => (
                                <div key={edu.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                                        <span className="text-xs italic text-gray-600 shrink-0 ml-2">{edu.startDate} – {edu.endDate}</span>
                                    </div>
                                    <p className="text-gray-700">
                                        {edu.degree}{edu.field && ` in ${edu.field}`}
                                        {edu.gpa && <span className="ml-2 text-xs">(GPA: {edu.gpa})</span>}
                                    </p>
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
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                        {proj.url && <span className="text-xs text-gray-500 italic">({proj.url})</span>}
                                    </div>
                                    {proj.description && <p className="mt-0.5 text-gray-700">{proj.description}</p>}
                                    {proj.technologies?.length > 0 && (
                                        <p className="text-xs italic mt-0.5 text-gray-600">Tech: {proj.technologies.join(', ')}</p>
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
                        <p className="text-gray-800 leading-relaxed">{skills.join(' • ')}</p>
                    </section>
                );

            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <section key="certifications" className="mb-5">
                        {sectionHeading('Certifications')}
                        <div className="space-y-1.5">
                            {certifications.map((cert) => (
                                <div key={cert.id} className="break-inside-avoid flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-gray-900">{cert.name}</span>
                                        {cert.organization && <span className="text-gray-600 italic ml-2">— {cert.organization}</span>}
                                    </div>
                                    {cert.issueDate && <span className="text-xs italic text-gray-500 shrink-0 ml-2">{cert.issueDate}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                );

            case 'achievements':
                if (!achievements?.length) return null;
                return (
                    <section key="achievements" className="mb-5">
                        {sectionHeading('Honors & Achievements')}
                        <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700">
                            {achievements.map((ach) => (
                                <li key={ach.id} className="break-inside-avoid">
                                    <span className="font-bold">{ach.title}</span>
                                    {ach.organization && <span className="italic"> — {ach.organization}</span>}
                                    {ach.date && <span className="text-xs text-gray-500"> ({ach.date})</span>}
                                    {ach.description && <span className="block text-gray-600">{ach.description}</span>}
                                </li>
                            ))}
                        </ul>
                    </section>
                );

            default:
                return null;
        }
    };

    return (
        <div className="px-10 py-8 text-sm font-serif text-gray-900">
            {/* ── Centered header with double rule ─────────────────── */}
            {personalInfo.fullName && (
                <header className="text-center mb-6">
                    <h1 className="text-2xl font-bold uppercase tracking-widest mb-3">{personalInfo.fullName}</h1>
                    <div className="border-t-2 border-b border-black py-1.5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs text-gray-700">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                        {personalInfo.github && <span>{personalInfo.github}</span>}
                        {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                    </div>
                </header>
            )}

            {/* ── Summary ───────────────────────────────────────────── */}
            {summary && (
                <section className="mb-5">
                    {sectionHeading('Summary')}
                    <p className="text-justify leading-relaxed text-gray-800">{summary}</p>
                </section>
            )}

            {(sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements']).map(renderSection)}
        </div>
    );
};
