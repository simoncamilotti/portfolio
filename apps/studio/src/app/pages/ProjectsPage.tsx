import type { ProjectDto } from '@portfolio/shared-models';
import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';

import type { BreadcrumbItemsProps } from '../modules/layout/PageBreadcrumb';
import { PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import { DeleteProjectDialog } from '../modules/projects/components/DeleteProjectDialog';
import { ProjectFormDialog } from '../modules/projects/components/ProjectFormDialog';
import { ProjectsGrid } from '../modules/projects/components/ProjectsGrid';
import { ProjectsHeader } from '../modules/projects/components/ProjectsHeader';
import { projectsKey } from '../modules/projects/projects.key';
import { ProjectsService } from '../modules/projects/projects.service';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const ProjectsPage: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: t(RouteNames.PROJECTS),
    },
  ];

  const { data: projects, isPending } = useQuery({
    queryKey: projectsKey.getAllProjects,
    queryFn: ProjectsService.getAllProjects,
  });

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectDto | null>(null);

  const openCreate = () => {
    setEditingProject(undefined);
    setFormDialogOpen(true);
  };

  const openEdit = useCallback((project: ProjectDto) => {
    setEditingProject(project);
    setFormDialogOpen(true);
  }, []);

  const openDelete = useCallback((project: ProjectDto) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  }, []);

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
      <div className="pt-20 pb-24 relative overflow-hidden">
        <ProjectsHeader onCreateClick={openCreate} />

        {isPending ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-12 rounded-xl border border-border/50 bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <ProjectsGrid projects={projects ?? []} onEdit={openEdit} onDelete={openDelete} onCreateClick={openCreate} />
        )}

        <ProjectFormDialog project={editingProject} open={formDialogOpen} onOpenChange={setFormDialogOpen} />
        <DeleteProjectDialog project={projectToDelete} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
      </div>
    </>
  );
};
