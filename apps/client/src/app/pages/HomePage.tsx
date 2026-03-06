import { PageLayout } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';

import { ContactSection } from '../modules/home/components/ContactSection';
import { HeroSection } from '../modules/home/components/HeroSection';
import { ProjectsSection } from '../modules/home/components/ProjectSection';
import { PublicResume } from '../modules/home/components/PublicResume';

export const HomePage: FunctionComponent = () => {
  const projects: any[] = [];

  return (
    <PageLayout>
      <HeroSection />
      <ProjectsSection projects={projects} />
      <PublicResume />
      <ContactSection />
    </PageLayout>
  );
};
