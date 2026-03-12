import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@portfolio/shared-ui';
import type { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import type { CreateResumeForm } from '../resume.type';
import { createResumeFormSchema } from '../resume.type';
import { useCreateResumeMutationHook } from './use-create-resume-mutation.hook';

export type UseCreateResumeFormProps = {
  alreadyTakenResumeNames: string[];
  onSuccess: () => void;
};

const defaultValues: CreateResumeForm = {
  title: '',
  description: '',
};

export const useCreateResumeForm = ({ alreadyTakenResumeNames, onSuccess }: UseCreateResumeFormProps) => {
  const { t } = useTranslation('studio');

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { isValid },
  } = useForm<CreateResumeForm>({
    defaultValues: { ...defaultValues },
    resolver: zodResolver(createResumeFormSchema),
    mode: 'onChange',
  });

  const { createResumeMutation } = useCreateResumeMutationHook();

  const onSubmit = async (data: CreateResumeForm) => {
    if (alreadyTakenResumeNames.includes(data.title)) {
      setError('title', {
        type: 'validate',
        message: t('resume.form.titleTaken'),
      });
      return;
    }
    await createResumeMutation.mutateAsync({ ...data, isPublic: false });
    toast.success(t('resume.toast.created'));
    reset({ ...defaultValues });
    clearErrors();
    onSuccess();
  };

  return {
    control,
    isValid,
    onSubmit: (form: BaseSyntheticEvent) => handleSubmit(onSubmit)(form),
  };
};
