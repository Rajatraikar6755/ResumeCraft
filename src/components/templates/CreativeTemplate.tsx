import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { ResumeData } from '@/stores/resumeStore';

interface TemplateProps {
    resume: ResumeData;
}

export const CreativeTemplate = ({ resume }: TemplateProps) => {
    const { personalInfo, summary, experiences, education, projects, skills } = resume;

    return (
        <div className="h-full flex text-sm font-sans">
            {/* Sidebar */}
            <div className="w-1/3 bg-slate-900 text-white p-6 space-y-8">
                <div className="text-center">
                    {/* Placeholder for photo if we had one */}
                    <div className="w-24 h-24 mx-auto bg-slate-700 rounded-full mb-4 flex items-center justify-center text-2xl">
                        {personalInfo.fullName ? personalInfo.fullName[0] : 'U'}
                    </div>
                    <h1 className="text-xl font-bold leading-tight mb-4">{personalInfo.fullName}</h1>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 text-xs text-slate-300">
                    {personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="break-all">{personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span>{personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.linkedin && (
                        <div className="flex items-center gap-2">
                            <Linkedin className="w-3 h-3 shrink-0" />
                            <span className="break-all">{personalInfo.linkedin}</span>
                        </div>
                    )}
                    {personalInfo.github && (
                        <div className="flex items-center gap-2">
                            <Github className="w-3 h-3 shrink-0" />
                            <span className="break-all">{personalInfo.github}</span>
                        </div>
                    )}
                    {personalInfo.portfolio && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 shrink-0" />
                            <span className="break-all">{personalInfo.portfolio}</span>
                        </div>
                    )}
                </div>

                {/* Skills */}
                {skills.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => (
                                <span key={i} className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-200">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 border-b border-slate-700 pb-1">Education</h2>
                        <div className="space-y-4">
                            {education.map((edu) => (
                                <div key={edu.id}>
                                    <h3 className="font-bold text-white">{edu.degree}</h3>
                                    <p className="text-slate-400 text-xs">{edu.institution}</p>
                                    <p className="text-slate-500 text-xs italic">{edu.startDate} - {edu.endDate}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Main Content */}
            <div className="w-2/3 p-8 bg-white space-y-8">
                {/* Summary */}
                {summary && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <span className="w-8 h-1 bg-slate-900 rounded-full"></span>
                            Profile
                        </h2>
                        <p className="text-slate-600 leading-relaxed">{summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experiences.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-slate-900 rounded-full"></span>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {experiences.map((exp) => (
                                <div key={exp.id} className="relative pl-4 border-l-2 border-slate-100">
                                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-slate-900"></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-slate-800">{exp.position}</h3>
                                        <span className="text-xs font-bold text-slate-400">{exp.startDate} - {exp.endDate}</span>
                                    </div>
                                    <p className="text-slate-600 font-medium mb-2">{exp.company}</p>
                                    {exp.bullets?.length > 0 && (
                                        <ul className="space-y-1 text-slate-500">
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
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-slate-900 rounded-full"></span>
                            Projects
                        </h2>
                        <div className="grid gap-4">
                            {projects.map((proj) => (
                                <div key={proj.id} className="bg-slate-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800">{proj.name}</h3>
                                        {proj.url && <span className="text-xs text-blue-600">{proj.url}</span>}
                                    </div>
                                    {proj.description && <p className="text-slate-600 text-sm mb-2">{proj.description}</p>}
                                    {proj.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {proj.technologies.map((tech, i) => (
                                                <span key={i} className="text-[10px] uppercase font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};
