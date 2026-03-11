import type { ProjectDto } from '@portfolio/shared-models';
import type { FunctionComponent } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useProjectForm } from '../hooks/use-project-form.hook';

type ProjectFormProps = {
  project?: ProjectDto;
  onSuccess: () => void;
  onClose: () => void;
};

export const ProjectForm: FunctionComponent<ProjectFormProps> = ({ project, onSuccess, onClose }) => {
  const { t } = useTranslation('studio');
  const { control, isValid, isEditing, onSubmit } = useProjectForm({ project, onSuccess });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('projects.form.title')} *</label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder={t('projects.form.titlePlaceholder')}
              required
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('projects.form.description')}</label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              placeholder={t('projects.form.descriptionPlaceholder')}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground resize-none"
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('projects.form.tags')}</label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder={t('projects.form.tagsPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          )}
        />
        <p className="text-[11px] text-muted-foreground">{t('projects.form.tagsHint')}</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('projects.form.repoUrl')}</label>
        <Controller
          name="repoUrl"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="https://github.com/..."
              type="url"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          )}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{t('projects.form.url')}</label>
        <Controller
          name="url"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="https://mon-projet.com"
              type="url"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          )}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('projects.form.cancel')}
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="px-3.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isEditing ? t('projects.form.update') : t('projects.form.create')}
        </button>
      </div>
    </form>
  );
};
