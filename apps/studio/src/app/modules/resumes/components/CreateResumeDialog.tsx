import type { ResumeDto } from '@portfolio/shared-models';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateResumeForm } from './CreateResumeForm';

export type CreateResumeDialogProps = {
  resumes?: ResumeDto[];
  open: boolean;
  openChange: (open: boolean) => void;
};

export const CreateResumeDialog: FunctionComponent<CreateResumeDialogProps> = ({ resumes, open, openChange }) => {
  const { t } = useTranslation('studio');

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle>{t('resume.dialog.title')}</DialogTitle>
        </DialogHeader>
        <CreateResumeForm resumes={resumes} onSuccess={() => openChange(false)} onClose={() => openChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
