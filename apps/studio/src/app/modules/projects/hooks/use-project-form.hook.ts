import { zodResolver } from '@hookform/resolvers/zod';
import type { ProjectDto } from '@portfolio/shared-models';
import type { BaseSyntheticEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { toast } from '../../ui/sonner';
import type { ProjectForm } from '../project.type';
import { projectFormSchema } from '../project.type';
import { useCreateProjectMutation } from './use-create-project-mutation.hook';
import { useUpdateProjectMutation } from './use-update-project-mutation.hook';

export type UseProjectFormProps = {
  project?: ProjectDto;
  onSuccess: () => void;
};

const defaultValues: ProjectForm = {
  title: '',
  description: '',
  tags: '',
  url: '',
  repoUrl: '',
};

const projectToFormValues = (project: ProjectDto): ProjectForm => ({
  title: project.title,
  description: project.description ?? '',
  tags: project.tags.join(', '),
  url: project.url ?? '',
  repoUrl: project.repoUrl ?? '',
});

export const useProjectForm = ({ project, onSuccess }: UseProjectFormProps) => {
  const { t } = useTranslation('studio');

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ProjectForm>({
    defaultValues: project ? projectToFormValues(project) : { ...defaultValues },
    resolver: zodResolver(projectFormSchema),
    mode: 'onChange',
  });

  const { createProjectMutation } = useCreateProjectMutation();
  const { updateProjectMutation } = useUpdateProjectMutation();

  const onSubmit = async (data: ProjectForm) => {
    const tags = (data.tags ?? '')
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);

    const payload = {
      title: data.title,
      description: data.description || undefined,
      tags,
      url: data.url || undefined,
      repoUrl: data.repoUrl || undefined,
    };

    try {
      if (project) {
        await updateProjectMutation.mutateAsync({ projectId: project.id, data: payload });
        toast.success(t('projects.toast.updated'));
      } else {
        await createProjectMutation.mutateAsync(payload);
        toast.success(t('projects.toast.created'));
      }
      reset({ ...defaultValues });
      onSuccess();
    } catch {
      toast.error(t('projects.toast.error'));
    }
  };

  return {
    control,
    isValid,
    isEditing: !!project,
    onSubmit: (form: BaseSyntheticEvent) => handleSubmit(onSubmit)(form),
    reset: (nextProject?: ProjectDto) => reset(nextProject ? projectToFormValues(nextProject) : { ...defaultValues }),
  };
};
