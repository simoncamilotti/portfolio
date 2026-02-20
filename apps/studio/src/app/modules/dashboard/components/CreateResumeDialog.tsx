import type { ResumeDto } from '@portfolio/shared-models';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';

import { CreateResumeForm } from './CreateResumeForm';

export type CreateResumeDialogProps = {
  resumes?: ResumeDto[];
  open: boolean;
  openChange: (open: boolean) => void;
};

export const CreateResumeDialog: FunctionComponent<CreateResumeDialogProps> = ({ resumes, open, openChange }) => {
  return (
    <Dialog open={open} onOpenChange={openChange}>
      <DialogContent className="sm:max-w-md border-border/50">
        <DialogHeader>
          <DialogTitle>Nouveau CV</DialogTitle>
        </DialogHeader>
        <CreateResumeForm resumes={resumes} onSuccess={() => openChange(false)} onClose={() => openChange(false)} />
      </DialogContent>
    </Dialog>
  );
};
