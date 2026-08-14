import { motion } from 'framer-motion';
import { Briefcase, Globe, GraduationCap, Heart, MapPin, Wrench } from 'lucide-react';
import type { FunctionComponent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const PublicCV: FunctionComponent = () => {
  const { t } = useTranslation('client');

  const skills = t('cv.skills', { returnObjects: true }) as Array<{ label: string; value: string }>;
  const languages = t('cv.languages', { returnObjects: true }) as string[];
  const experiences = t('cv.experiences', { returnObjects: true }) as Array<{
    role: string;
    company: string;
    location: string;
    period: string;
    summary?: string;
    tasks: string[];
    stack: string[];
  }>;
  const education = t('cv.education', { returnObjects: true }) as Array<{
    title: string;
    school: string;
    year: string;
  }>;
  const interests = t('cv.interests', { returnObjects: true }) as Array<{ title: string; description: string }>;

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border no-print">
        <span></span>
        <a
          href="/cv-simon-camilotti.pdf"
          download="Simon Camilotti.pdf"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-surface-hover transition-colors text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-download w-3.5 h-3.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" x2="12" y1="15" y2="3"></line>
          </svg>
          {t('cv.downloadPdf')}
        </a>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-[320px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface">
          {/* Identity */}
          <div className="p-8 border-b border-border">
            <div className="w-[128px] h-[128px] rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-2xl font-bold text-primary mb-5">
              <img className="rounded-full" src="/Portrait.jpg" alt="SC" />
            </div>
            <h3 className="text-xl font-bold text-foreground tracking-tight">Simon Camilotti</h3>
            <p className="text-sm text-primary font-medium mt-1">{t('cv.jobTitle')}</p>
          </div>

          {/* Contact */}
          <div className="p-8 border-b border-border space-y-3">
            <SidebarHeading icon={<MapPin className="w-3.5 h-3.5" />} label={t('cv.sections.contact')} />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span>{t('cv.location')}</span>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="p-8 border-b border-border">
            <SidebarHeading icon={<Globe className="w-3.5 h-3.5" />} label={t('cv.sections.languages')} />
            <div className="mt-3 space-y-1">
              {languages.map(language => (
                <p key={language} className="text-sm text-muted-foreground">
                  {language}
                </p>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="p-8 border-b border-border">
            <SidebarHeading icon={<Wrench className="w-3.5 h-3.5" />} label={t('cv.sections.skills')} />
            <div className="mt-3 space-y-3">
              {skills.map(s => (
                <div key={s.label}>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{s.label}</span>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="p-8 border-b border-border lg:border-b-0">
            <SidebarHeading icon={<Heart className="w-3.5 h-3.5" />} label={t('cv.sections.interests')} />
            <div className="mt-3 space-y-3">
              {interests.map(interest => (
                <div key={interest.title}>
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    {interest.title}
                  </span>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{interest.description}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Description */}
          <div className="p-8 border-b border-border">
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{t('cv.bio')}</p>
          </div>

          {/* Experiences */}
          <div className="p-8 border-b border-border">
            <SectionHeading icon={<Briefcase className="w-4 h-4" />} label={t('cv.sections.experience')} />
            <motion.div
              className="mt-6 space-y-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {experiences.map(exp => (
                <motion.div key={`${exp.company}-${exp.period}`} variants={fadeUp} className="group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{exp.role}</h4>
                      <p className="text-xs text-primary">
                        {exp.company} · {exp.location}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{exp.period}</span>
                  </div>
                  {exp.summary && <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{exp.summary}</p>}
                  <ul className="space-y-1 ml-3.5">
                    {exp.tasks.map(task => (
                      <li key={task} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {exp.stack.map(item => (
                      <span
                        key={item}
                        className="px-2 py-0.5 text-[11px] rounded-md border border-border bg-surface text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Education */}
          <div className="p-8">
            <SectionHeading icon={<GraduationCap className="w-4 h-4" />} label={t('cv.sections.education')} />
            <motion.div
              className="mt-6 space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {education.map(f => (
                <motion.div key={`${f.school}`} variants={fadeUp}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">{f.title}</h4>
                      <p className="text-xs text-primary">{f.school}</p>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{f.year}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarHeading: FunctionComponent<{ icon: ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-widest">
    <span className="text-primary">{icon}</span>
    {label}
  </div>
);

const SectionHeading: FunctionComponent<{ icon: ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2.5">
    <span className="text-primary">{icon}</span>
    <h3 className="text-sm font-semibold text-foreground uppercase tracking-widest">{label}</h3>
  </div>
);
