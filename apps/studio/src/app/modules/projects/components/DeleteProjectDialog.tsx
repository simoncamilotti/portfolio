import type { ProjectDto } from '@portfolio/shared-models';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { useDeleteProjectMutation } from '../hooks/use-delete-project-mutation.hook';

type DeleteProjectDialogProps = {
  project: ProjectDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DeleteProjectDialog: FunctionComponent<DeleteProjectDialogProps> = ({ project, open, onOpenChange }) => {
  const { t } = useTranslation('studio');
  const { deleteProjectMutation } = useDeleteProjectMutation(project?.id ?? '');

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync();
      toast.success(t('projects.toast.deleted'));
      onOpenChange(false);
    } catch {
      toast.error(t('projects.toast.error'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm border-border/50">
        <DialogHeader>
          <DialogTitle>{t('projects.dialog.deleteTitle')}</DialogTitle>
          <DialogDescription>{t('projects.dialog.deleteDescription', { title: project?.title })}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('projects.form.cancel')}
          </button>
          <button
            onClick={handleDelete}
            className="px-3.5 py-1.5 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            {t('projects.dialog.deleteConfirm')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
