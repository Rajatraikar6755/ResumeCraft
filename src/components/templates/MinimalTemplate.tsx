import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const MinimalTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills } = resume;

    return (
        <div className="p-8 space-y-8 text-sm font-sans text-gray-800">
            {/* Header */}
            {personalInfo.fullName && (
                <header>
                    <h1 className="text-4xl font-light mb-4 tracking-tight">{personalInfo.fullName}</h1>
                    <div className="flex flex-col gap-1 text-gray-500 text-xs">
                        {personalInfo.email && <span>{personalInfo.email}</span>}
                        {personalInfo.phone && <span>{personalInfo.phone}</span>}
                        {personalInfo.location && <span>{personalInfo.location}</span>}
                        <div className="flex gap-3 mt-1">
                            {personalInfo.linkedin && <span>in/{personalInfo.linkedin}</span>}
                            {personalInfo.github && <span>gh/{personalInfo.github}</span>}
                            {personalInfo.portfolio && <span>{personalInfo.portfolio}</span>}
                        </div>
                    </div>
                </header>
            )}

            <div className="grid grid-cols-[1fr_2fr] gap-8">
                {/* Left Column */}
                <div className="space-y-8">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
                            <div className="flex flex-col gap-2">
                                {skills.map((skill, i) => (
                                    <span key={i} className="text-gray-700">{skill}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
                            <div className="space-y-4">
                                {education.map((edu) => (
                                    <div key={edu.id}>
                                        <h3 className="font-medium text-gray-900">{edu.institution}</h3>
                                        <p className="text-gray-600 text-xs mb-1">
                                            {edu.degree} {edu.field && `in ${edu.field}`}
                                        </p>
                                        <p className="text-gray-400 text-xs">{edu.startDate} - {edu.endDate}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Summary */}
                    {summary && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Profile</h2>
                            <p className="text-gray-600 leading-relaxed">{summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experiences.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
                            <div className="space-y-6">
                                {experiences.map((exp) => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="font-medium text-gray-900">{exp.position}</h3>
                                            <span className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <p className="text-gray-500 text-xs mb-2">{exp.company}</p>
                                        {exp.bullets?.length > 0 && (
                                            <ul className="space-y-1 text-gray-600">
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

                    {/* Projects */}
                    {projects.length > 0 && (
                        <section>
                            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
                            <div className="space-y-4">
                                {projects.map((proj) => (
                                    <div key={proj.id}>
                                        <h3 className="font-medium text-gray-900 mb-1">{proj.name}</h3>
                                        {proj.description && <p className="text-gray-600 mb-1">{proj.description}</p>}
                                        {proj.technologies.length > 0 && (
                                            <p className="text-xs text-gray-400">{proj.technologies.join(', ')}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
};
