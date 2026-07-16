import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const MinimalTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills, certifications, achievements, sectionOrder } = resume;

    const label = (text: string) => (
        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">{text}</h2>
    );

    // Sections that go in the LEFT narrow column
    const leftSections = new Set(['skills', 'education', 'certifications']);
    // Sections that go in the RIGHT wide column
    const rightSections = new Set(['experience', 'projects', 'achievements']);

    const renderLeft = (id: string) => {
        switch (id) {
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <section key="skills" className="mb-7">
                        {label('Skills')}
                        <div className="flex flex-col gap-1.5">
                            {skills.map((s, i) => (
                                <span key={i} className="text-gray-700 text-sm leading-snug">{s}</span>
                            ))}
                        </div>
                    </section>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <section key="education" className="mb-7">
                        {label('Education')}
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="font-medium text-gray-900 text-sm leading-snug">{edu.institution}</h3>
                                    <p className="text-gray-500 text-xs mt-0.5">{edu.degree}{edu.field && ` in ${edu.field}`}</p>
                                    <p className="text-gray-400 text-xs">{edu.startDate} – {edu.endDate}</p>
                                    {edu.gpa && <p className="text-gray-400 text-xs">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <section key="certifications" className="mb-7">
                        {label('Certifications')}
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id}>
                                    <h3 className="font-medium text-gray-900 text-sm leading-snug">{cert.name}</h3>
                                    {cert.organization && <p className="text-gray-500 text-xs">{cert.organization}</p>}
                                    {cert.issueDate && <p className="text-gray-400 text-xs">{cert.issueDate}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    const renderRight = (id: string) => {
        switch (id) {
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <section key="experience" className="mb-7">
                        {label('Experience')}
                        <div className="space-y-5">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-medium text-gray-900 text-sm">{exp.position}</h3>
                                        <span className="text-xs text-gray-400 shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mb-1.5">{exp.company}</p>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="space-y-1">
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} className="text-gray-600 text-sm flex items-start gap-2">
                                                    <span className="text-gray-300 mt-1 shrink-0">—</span>
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
            case 'projects':
                if (!projects?.length) return null;
                return (
                    <section key="projects" className="mb-7">
                        {label('Projects')}
                        <div className="space-y-4">
                            {projects.map((proj) => (
                                <div key={proj.id} className="break-inside-avoid">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h3 className="font-medium text-gray-900 text-sm">{proj.name}</h3>
                                        {proj.url && <span className="text-xs text-gray-400 shrink-0">{proj.url}</span>}
                                    </div>
                                    {proj.description && <p className="text-gray-600 text-sm mt-0.5">{proj.description}</p>}
                                    {proj.technologies?.length > 0 && (
                                        <p className="text-xs text-gray-400 mt-1">{proj.technologies.join(', ')}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'achievements':
                if (!achievements?.length) return null;
                return (
                    <section key="achievements" className="mb-7">
                        {label('Achievements')}
                        <div className="space-y-3">
                            {achievements.map((ach) => (
                                <div key={ach.id} className="break-inside-avoid">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <h3 className="font-medium text-gray-900 text-sm">{ach.title}</h3>
                                        {ach.date && <span className="text-xs text-gray-400 shrink-0">{ach.date}</span>}
                                    </div>
                                    {ach.organization && <p className="text-gray-500 text-xs">{ach.organization}</p>}
                                    {ach.description && <p className="text-gray-600 text-sm mt-0.5">{ach.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    const order = sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'achievements'];
    const leftOrder = order.filter(id => leftSections.has(id));
    const rightOrder = order.filter(id => rightSections.has(id));

    return (
        <div className="px-10 py-8 text-sm font-sans text-gray-800">
            {/* ── Minimal header — name left-aligned, contact stacked ─ */}
            {personalInfo.fullName && (
                <header className="mb-8">
                    <h1 className="text-4xl font-light tracking-tight text-gray-900 mb-3">{personalInfo.fullName}</h1>
                    {personalInfo.jobTitle && (
                        <p className="text-gray-500 text-sm mb-2">{personalInfo.jobTitle}</p>
                    )}
                    <div className="flex flex-col gap-0.5 text-xs text-gray-400">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        <div className="flex gap-3 mt-1">
                            {personalInfo.linkedin && <span>in/{personalInfo.linkedin}</span>}
                            {personalInfo.github && <span>gh/{personalInfo.github}</span>}
                            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                        </div>
                    </div>
                    {/* thin rule */}
                    <div className="border-b border-gray-200 mt-5" />
                </header>
            )}

            {/* ── Summary (full-width above columns) ─────────────────── */}
            {summary && (
                <div className="mb-7">
                    {label('Profile')}
                    <p className="text-gray-600 leading-relaxed text-sm">{summary}</p>
                    <div className="border-b border-gray-100 mt-5" />
                </div>
            )}

            {/* ── Two-column body: narrow left, wide right ──────────── */}
            <div className="grid grid-cols-[1fr_2.2fr] gap-8">
                <div>{leftOrder.map(renderLeft)}</div>
                <div>{rightOrder.map(renderRight)}</div>
            </div>
        </div>
    );
};
