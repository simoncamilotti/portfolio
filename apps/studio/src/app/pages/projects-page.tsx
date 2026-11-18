import { useProjectFindAll } from '@repo/api-client';
import type { ProjectDto } from '@repo/contracts';
import type { FunctionComponent } from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { BreadcrumbItemsProps } from '../modules/layout/page-breadcrumb.js';
import { PageBreadcrumb } from '../modules/layout/page-breadcrumb.js';
import { DeleteProjectDialog } from '../modules/projects/components/delete-project-dialog.js';
import { ProjectFormDialog } from '../modules/projects/components/project-form-dialog.js';
import { ProjectsGrid } from '../modules/projects/components/projects-grid.js';
import { ProjectsHeader } from '../modules/projects/components/projects-header.js';
import { RouteNames, RoutePaths } from '../routes/paths.const.js';

export const ProjectsPage: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: RoutePaths.HOME,
    },
    {
      title: t(RouteNames.PROJECTS),
    },
  ];

  const { data: projects, isPending } = useProjectFindAll();

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
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded-xl border border-border/50 bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ProjectsGrid
            projects={projects ?? []}
            onEdit={openEdit}
            onDelete={openDelete}
            onCreateClick={openCreate}
          />
        )}

        <ProjectFormDialog
          project={editingProject}
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
        />
        <DeleteProjectDialog
          project={projectToDelete}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </div>
    </>
  );
};
