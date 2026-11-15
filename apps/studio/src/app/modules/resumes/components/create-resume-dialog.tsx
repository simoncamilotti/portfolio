import type { ResumeDto } from '@repo/contracts';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { CreateResumeForm } from './create-resume-form.js';

export type CreateResumeDialogProps = {
  resumes?: ResumeDto[];
  open: boolean;
  openChange: (open: boolean) => void;
};

export const CreateResumeDialog: FunctionComponent<CreateResumeDialogProps> = ({
  resumes,
  open,
  openChange,
}) => {
  const { t } = useTranslation('studio');

  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle>{t('resume.dialog.title')}</DialogTitle>
        </DialogHeader>
        <CreateResumeForm
          resumes={resumes}
          onSuccess={() => openChange(false)}
          onClose={() => openChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
