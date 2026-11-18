import { useProjectFindAll } from '@repo/api-client';
import type { FunctionComponent } from 'react';

import { useFeatureFlags } from '../modules/feature-flags/hooks/use-feature-flags.hook.js';
import { ContactSection } from '../modules/home/components/contact-section.js';
import { HeroSection } from '../modules/home/components/hero-section.js';
import { ProjectsSection } from '../modules/home/components/project-section.js';
import { PublicResume } from '../modules/home/components/public-resume.js';

export const HomePage: FunctionComponent = () => {
  const { data: projects } = useProjectFindAll();

  const { isEnabled } = useFeatureFlags();
  const showProjects = isEnabled('projects') && projects != null && projects.length > 0;

  return (
    <>
      <HeroSection />
      {showProjects && <ProjectsSection projects={projects} />}
      <PublicResume />
      <ContactSection />
    </>
  );
};
