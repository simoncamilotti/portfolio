import { PageLayout } from '@portfolio/shared-ui';
import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';

import { useFeatureFlags } from '../modules/feature-flags/hooks/use-feature-flags.hook';
import { ContactSection } from '../modules/home/components/ContactSection';
import { HeroSection } from '../modules/home/components/HeroSection';
import { ProjectsSection } from '../modules/home/components/ProjectSection';
import { PublicResume } from '../modules/home/components/PublicResume';
import { projectsKey } from '../modules/projects/projects.key';
import { ProjectsService } from '../modules/projects/projects.service';

export const HomePage: FunctionComponent = () => {
  const { data: projects } = useQuery({
    queryKey: projectsKey.getAllProjects,
    queryFn: ProjectsService.getAllProjects,
  });

  const { isEnabled } = useFeatureFlags();
  const showProjects = isEnabled('projects') && projects != null && projects.length > 0;

  return (
    <PageLayout>
      <HeroSection />
      {showProjects && <ProjectsSection projects={projects} />}
      <PublicResume />
      <ContactSection />
    </PageLayout>
  );
};
