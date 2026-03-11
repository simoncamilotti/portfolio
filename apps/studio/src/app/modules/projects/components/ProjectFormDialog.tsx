import type { ProjectDto } from '@portfolio/shared-models';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { ProjectForm } from './ProjectForm';

export type ProjectFormDialogProps = {
  project?: ProjectDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const ProjectFormDialog: FunctionComponent<ProjectFormDialogProps> = ({ project, open, onOpenChange }) => {
  const { t } = useTranslation('studio');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle>{project ? t('projects.dialog.editTitle') : t('projects.dialog.createTitle')}</DialogTitle>
          <DialogDescription>
            {project ? t('projects.dialog.editDescription') : t('projects.dialog.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSuccess={() => onOpenChange(false)} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
