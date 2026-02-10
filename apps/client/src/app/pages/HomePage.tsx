import type { FunctionComponent } from 'react';

import { HeroSection } from '../modules/home/components/HeroSection';
import { ProjectsSection } from '../modules/home/components/ProjectSection';
import { PublicResume } from '../modules/home/components/PublicResume';
import { PageLayout } from '../modules/layout/PageLayout';

export const HomePage: FunctionComponent = () => {
  const projects: any[] = [];

  return (
    <PageLayout>
      <HeroSection />
      <ProjectsSection projects={projects} />
      <PublicResume />
    </PageLayout>
  );
};
