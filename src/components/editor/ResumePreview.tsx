import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import { useResumeStore } from '@/stores/resumeStore';
import { cn } from '@/lib/utils';

export function ResumePreview() {
  const { resume } = useResumeStore();
  const { personalInfo, summary, experiences, education, projects, skills } = resume;

  const hasContent = personalInfo.fullName || summary || experiences.length > 0 || education.length > 0 || skills.length > 0;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border bg-card/50 flex items-center justify-between">
        <h3 className="font-medium">Live Preview</h3>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
          A4 Format
        </span>
      </div>
      
      <div className="flex-1 overflow-auto p-6 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background rounded-lg shadow-elevated mx-auto"
          style={{ 
            width: '100%', 
            maxWidth: '595px', // A4 width in points
            minHeight: '842px', // A4 height in points
            aspectRatio: '1 / 1.414' 
          }}
        >
          {!hasContent ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="font-medium mb-2">Your Resume Preview</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Start filling in your information on the left to see your resume take shape here.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-6 text-sm">
              {/* Header */}
              {personalInfo.fullName && (
                <header className="text-center border-b border-border pb-6">
                  <h1 className="text-2xl font-bold mb-2">{personalInfo.fullName}</h1>
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Professional Summary
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{summary}</p>
                </section>
              )}

              {/* Experience */}
              {experiences.length > 0 && (
                <section>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                    Experience
                  </h2>
                  <div className="space-y-4">
                    {experiences.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{exp.position}</h3>
                            <p className="text-muted-foreground">{exp.company}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        {exp.bullets.length > 0 && (
                          <ul className="mt-2 space-y-1 text-muted-foreground">
                            {exp.bullets.map((bullet, i) => (
                              <li key={i} className="flex">
                                <span className="mr-2">•</span>
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-muted-foreground">{edu.institution}</p>
                          {edu.gpa && (
                            <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3">
                    Projects
                  </h2>
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id}>
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold">{proj.name}</h3>
                          {proj.url && (
                            <span className="text-xs text-primary">{proj.url}</span>
                          )}
                        </div>
                        {proj.description && (
                          <p className="text-muted-foreground mt-1">{proj.description}</p>
                        )}
                        {proj.technologies.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-secondary text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
