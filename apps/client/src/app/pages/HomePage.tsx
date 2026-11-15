import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';

import { useFeatureFlags } from '../modules/feature-flags/hooks/use-feature-flags.hook.js';
import { ContactSection } from '../modules/home/components/ContactSection.js';
import { HeroSection } from '../modules/home/components/HeroSection.js';
import { ProjectsSection } from '../modules/home/components/ProjectSection.js';
import { PublicResume } from '../modules/home/components/PublicResume.js';
import { projectsKey } from '../modules/projects/projects.key.js';
import { ProjectsService } from '../modules/projects/projects.service.js';

export const HomePage: FunctionComponent = () => {
  const { data: projects } = useQuery({
    queryKey: projectsKey.getAllProjects,
    queryFn: ProjectsService.getAllProjects,
  });

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
