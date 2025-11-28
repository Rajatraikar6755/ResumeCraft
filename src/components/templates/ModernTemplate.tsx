import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const ModernTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills } = resume;

    return (
        <div className="p-12 space-y-6 text-sm font-sans text-gray-800">
            {/* Header */}
            {personalInfo.fullName && (
                <header className="text-center border-b-2 border-primary/20 pb-6">
                    <h1 className="text-3xl font-bold mb-2 text-primary">{personalInfo.fullName}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground text-xs">
                        {personalInfo.email && (
                            <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {personalInfo.email}
                            </span>
                        )}
                        {personalInfo.phone && (
                            <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {personalInfo.phone}
                            </span>
                        )}
                        {personalInfo.location && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {personalInfo.location}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-muted-foreground text-xs mt-2">
                        {personalInfo.linkedin && (
                            <span className="flex items-center gap-1">
                                <Linkedin className="w-3 h-3" />
                                {personalInfo.linkedin}
                            </span>
                        )}
                        {personalInfo.github && (
                            <span className="flex items-center gap-1">
                                <Github className="w-3 h-3" />
                                {personalInfo.github}
                            </span>
                        )}
                        {personalInfo.portfolio && (
                            <span className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                {personalInfo.portfolio}
                            </span>
                        )}
                    </div>
                </header>
            )}

            {/* Summary */}
            {summary && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 border-b border-gray-200 pb-1">
                        Professional Summary
                    </h2>
                    <p className="text-gray-600 leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">
                        Experience
                    </h2>
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="break-inside-avoid">
                                <div className="flex items-start justify-between mb-1">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                                        <p className="text-primary font-medium">{exp.company}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                                        {exp.startDate} - {exp.endDate}
                                    </span>
                                </div>
                                {exp.bullets?.length > 0 && (
                                    <ul className="mt-2 space-y-1 text-gray-600">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start">
                                                <span className="mr-2 mt-1.5 w-1 h-1 bg-primary rounded-full shrink-0"></span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu) => (
                            <div key={edu.id} className="flex items-start justify-between break-inside-avoid">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className="text-gray-600">{edu.institution}</p>
                                    {edu.gpa && (
                                        <p className="text-xs text-gray-500 mt-0.5">GPA: {edu.gpa}</p>
                                    )}
                                </div>
                                <span className="text-xs text-gray-500 font-medium">
                                    {edu.startDate} - {edu.endDate}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3 border-b border-gray-200 pb-1">
                        Projects
                    </h2>
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id} className="break-inside-avoid">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                    {proj.url && (
                                        <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                                            {proj.url}
                                        </a>
                                    )}
                                </div>
                                {proj.description && (
                                    <p className="text-gray-600 mt-1">{proj.description}</p>
                                )}
                                {proj.technologies.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        <span className="font-medium">Technologies:</span>{' '}
                                        {proj.technologies.join(', ')}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-2 border-b border-gray-200 pb-1">
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
