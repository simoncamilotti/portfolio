import { PageLayout } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';

import { useFeatureFlags } from '../modules/feature-flags/hooks/use-feature-flags.hook';
import { ContactSection } from '../modules/home/components/ContactSection';
import { HeroSection } from '../modules/home/components/HeroSection';
import { ProjectsSection } from '../modules/home/components/ProjectSection';
import { PublicResume } from '../modules/home/components/PublicResume';

export const HomePage: FunctionComponent = () => {
  const projects: any[] = [];

  const { isEnabled } = useFeatureFlags();
  const showProjects = isEnabled('projects') && projects.length > 0;

  return (
    <PageLayout>
      <HeroSection />
      {showProjects && <ProjectsSection projects={projects} />}
      <PublicResume />
      <ContactSection />
    </PageLayout>
  );
};
