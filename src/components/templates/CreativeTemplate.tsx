import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const CreativeTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills, certifications, achievements, sectionOrder } = resume;

    const sidebarLabel = (text: string) => (
        <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 border-b border-slate-700 pb-1">{text}</h2>
    );

    const mainLabel = (text: string) => (
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span className="w-6 h-0.5 bg-slate-800 rounded-full shrink-0" />
            {text}
        </h2>
    );

    // Sections that live in the dark sidebar
    const sidebarSections = new Set(['skills', 'education', 'certifications']);
    // Sections that live in the white main area
    const mainAreaSections = new Set(['experience', 'projects', 'achievements']);

    const renderSidebar = (id: string) => {
        switch (id) {
            case 'skills':
                if (!skills?.length) return null;
                return (
                    <section key="skills" className="mb-6">
                        {sidebarLabel('Skills')}
                        <div className="flex flex-wrap gap-1.5">
                            {skills.map((s, i) => (
                                <span key={i} className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded">{s}</span>
                            ))}
                        </div>
                    </section>
                );
            case 'education':
                if (!education?.length) return null;
                return (
                    <section key="education" className="mb-6">
                        {sidebarLabel('Education')}
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-white text-xs leading-snug">{edu.degree}{edu.field && ` in ${edu.field}`}</h3>
                                    <p className="text-slate-400 text-[10px] mt-0.5">{edu.institution}</p>
                                    <p className="text-slate-500 text-[10px] italic">{edu.startDate} – {edu.endDate}</p>
                                    {edu.gpa && <p className="text-slate-500 text-[10px]">GPA: {edu.gpa}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'certifications':
                if (!certifications?.length) return null;
                return (
                    <section key="certifications" className="mb-6">
                        {sidebarLabel('Certifications')}
                        <div className="space-y-3">
                            {certifications.map((cert) => (
                                <div key={cert.id}>
                                    <h3 className="font-bold text-white text-xs leading-snug">{cert.name}</h3>
                                    {cert.organization && <p className="text-slate-400 text-[10px]">{cert.organization}</p>}
                                    {cert.issueDate && <p className="text-slate-500 text-[10px] italic">{cert.issueDate}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            default:
                return null;
        }
    };

    const renderMain = (id: string) => {
        switch (id) {
            case 'experience':
                if (!experiences?.length) return null;
                return (
                    <section key="experience" className="mb-6">
                        {mainLabel('Experience')}
                        <div className="space-y-5">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="break-inside-avoid relative pl-5 border-l-2 border-slate-100">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900 border-2 border-white" />
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                                        <span className="text-xs font-semibold text-slate-400 shrink-0 ml-2">{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <p className="text-slate-600 text-xs font-medium mb-1.5">{exp.company}</p>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="space-y-1">
                                            {exp.bullets.map((b, i) => (
                                                <li key={i} className="text-slate-500 text-xs flex items-start gap-1.5">
                                                    <span className="text-slate-300 shrink-0 mt-0.5">›</span>
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
                    <section key="projects" className="mb-6">
                        {mainLabel('Projects')}
                        <div className="grid gap-3">
                            {projects.map((proj) => (
                                <div key={proj.id} className="break-inside-avoid bg-slate-50 rounded-lg p-3">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                                        {proj.url && <span className="text-xs text-blue-500 shrink-0">{proj.url}</span>}
                                    </div>
                                    {proj.description && <p className="text-slate-600 text-xs mb-2">{proj.description}</p>}
                                    {proj.technologies?.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {proj.technologies.map((t, i) => (
                                                <span key={i} className="text-[9px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                );
            case 'achievements':
                if (!achievements?.length) return null;
                return (
                    <section key="achievements" className="mb-6">
                        {mainLabel('Achievements')}
                        <div className="space-y-3">
                            {achievements.map((ach) => (
                                <div key={ach.id} className="break-inside-avoid flex items-start gap-3">
                                    <div className="w-1 h-1 bg-slate-400 rounded-full shrink-0 mt-2" />
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            <h3 className="font-bold text-slate-900 text-sm">{ach.title}</h3>
                                            {ach.date && <span className="text-xs text-slate-400">{ach.date}</span>}
                                        </div>
                                        {ach.organization && <p className="text-slate-500 text-xs">{ach.organization}</p>}
                                        {ach.description && <p className="text-slate-600 text-xs mt-0.5">{ach.description}</p>}
                                    </div>
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
    const sidebarOrder = order.filter(id => sidebarSections.has(id));
    const mainOrder = order.filter(id => mainAreaSections.has(id));

    // Avatar initials
    const initials = personalInfo.fullName
        ? personalInfo.fullName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        : 'CV';

    return (
        <div className="flex min-h-full text-sm">
            {/* ── Dark sidebar (1/3) ───────────────────────────────── */}
            <aside className="w-[35%] bg-slate-900 text-slate-200 px-6 py-8 flex flex-col gap-0">
                {/* Avatar */}
                <div className="text-center mb-6">
                    {personalInfo.photoUrl ? (
                        <img
                            src={personalInfo.photoUrl}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-slate-700"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-slate-700 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                            {initials}
                        </div>
                    )}
                    <h1 className="text-lg font-bold leading-tight text-white">{personalInfo.fullName}</h1>
                    {personalInfo.jobTitle && (
                        <p className="text-slate-400 text-xs mt-1">{personalInfo.jobTitle}</p>
                    )}
                </div>

                {/* Contact info */}
                <div className="space-y-2 text-xs text-slate-300 mb-6">
                    {personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 shrink-0 text-slate-500" />
                            <span className="break-all">{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 shrink-0 text-slate-500" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-3 h-3 shrink-0 text-slate-500" />
                            <span className="break-all">{personalInfo.linkedin}</span>
                        </div>
                    )}
                    {personalInfo.github && (
                        <div className="flex items-center gap-2">
                            <Github className="w-3 h-3 shrink-0 text-slate-500" />
                            <span className="break-all">{personalInfo.github}</span>
                        </div>
                    )}
                    {personalInfo.portfolio && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 shrink-0 text-slate-500" />
                            <span className="break-all">{personalInfo.portfolio}</span>
                        </div>
                    )}
                </div>

                {/* Sidebar sections */}
                {sidebarOrder.map(renderSidebar)}
            </aside>

            {/* ── White main content (2/3) ─────────────────────────── */}
            <main className="flex-1 bg-white px-8 py-8 space-y-0">
                {/* Summary */}
                {summary && (
                    <section className="mb-6">
                        {mainLabel('Profile')}
                        <p className="text-slate-600 leading-relaxed text-sm">{summary}</p>
                    </section>
                )}

                {mainOrder.map(renderMain)}
            </main>
        </div>
    );
};
