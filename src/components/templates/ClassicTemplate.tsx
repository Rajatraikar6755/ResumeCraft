import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const ClassicTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills } = resume;

    return (
        <div className="p-8 space-y-6 text-sm font-serif text-gray-900">
            {/* Header */}
            {personalInfo.fullName && (
                <header className="text-center border-b-2 border-black pb-4">
                    <h1 className="text-2xl font-bold mb-2 uppercase tracking-widest">{personalInfo.fullName}</h1>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 text-xs">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-gray-700 text-xs mt-1">
                        {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                        {personalInfo.github && <span>{personalInfo.github}</span>}
                        {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                    </div>
                </header>
            )}

            {/* Summary */}
            {summary && (
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Summary</h2>
                    <p className="text-justify leading-relaxed">{summary}</p>
                </section>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Experience</h2>
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold">{exp.company}</h3>
                                    <span className="text-xs italic">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div className="italic mb-1">{exp.position}</div>
                                {exp.bullets?.length > 0 && (
                                    <ul className="list-disc list-outside ml-4 space-y-0.5">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i}>{bullet}</li>
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
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Education</h2>
                    <div className="space-y-2">
                        {education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold">{edu.institution}</h3>
                                    <span className="text-xs italic">{edu.startDate} - {edu.endDate}</span>
                                </div>
                                <div>
                                    {edu.degree} {edu.field && `in ${edu.field}`}
                                    {edu.gpa && <span className="ml-2 text-xs">(GPA: {edu.gpa})</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
                <section>
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-3">Projects</h2>
                    <div className="space-y-3">
                        {projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="font-bold">{proj.name}</h3>
                                    {proj.url && <span className="text-xs text-gray-600">({proj.url})</span>}
                                </div>
                                {proj.description && <p className="mt-0.5">{proj.description}</p>}
                                {proj.technologies.length > 0 && (
                                    <p className="text-xs italic mt-0.5">
                                        Tech: {proj.technologies.join(', ')}
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
                    <h2 className="text-sm font-bold uppercase border-b border-black mb-2">Skills</h2>
                    <p className="leading-relaxed">{skills.join(' • ')}</p>
                </section>
            )}
        </div>
    );
};
