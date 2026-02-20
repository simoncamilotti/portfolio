import type { ResumeDto } from '@portfolio/shared-models';
import type { FunctionComponent } from 'react';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { useCreateResumeForm } from '../hooks/use-create-resume-form.hook';

type CreateResumeFormProps = {
  resumes?: ResumeDto[];
  onSuccess: () => void;
};

export const CreateResumeForm: FunctionComponent<CreateResumeFormProps> = ({ resumes, onSuccess }) => {
  const alreadyTakenResumeNames = useMemo(() => resumes?.map(resume => resume.title) ?? [], [resumes]);

  const { control, isValid, onSubmit } = useCreateResumeForm({
    alreadyTakenResumeNames,
    onSuccess,
  });

  const onCancel = () => {
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid w-full gap-4">
        <Controller
          name={'title'}
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              required
              placeholder="Titre du CV..."
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          )}
        />
        <Controller
          name={'description'}
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder="Description (optionnelle)..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
            />
          )}
        />
      </div>
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Créer
        </button>
      </div>
    </form>
  );
};
