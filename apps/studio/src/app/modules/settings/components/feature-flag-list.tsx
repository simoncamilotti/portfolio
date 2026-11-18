import { useFeatureFlagFindAll } from '@repo/api-client';
import type { FeatureFlagDto } from '@repo/contracts';
import { toast } from '@repo/ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { useToggleFeatureFlagMutation } from '../hooks/use-toggle-feature-flag-mutation.hook.js';
import { FeatureFlagForm } from './feature-flag-form.js';
import { FeatureFlagItem } from './feature-flag-item.js';
import { FeatureFlagListSkeleton } from './feature-flag-list-skeleton.js';

export const FeatureFlagList: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const { data: flags, isPending } = useFeatureFlagFindAll();

  const { toggleFeatureFlagMutation } = useToggleFeatureFlagMutation();

  const handleToggle = (flag: FeatureFlagDto) => {
    toggleFeatureFlagMutation.mutate(
      { key: flag.key, enabled: !flag.enabled },
      {
        onSuccess: (_, { key, enabled }) => {
          toast.success(
            t('featureFlags.toggled', {
              key,
              state: enabled ? t('featureFlags.enabled') : t('featureFlags.disabled'),
            }),
          );
        },
        onError: () => {
          toast.error(t('featureFlags.toggleError'));
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-foreground mb-1">{t('featureFlags.title')}</h2>
        <p className="text-xs text-muted-foreground">{t('featureFlags.description')}</p>
      </div>

      <FeatureFlagForm existingFlags={flags} />

      {isPending ? (
        <FeatureFlagListSkeleton />
      ) : flags?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          {t('featureFlags.empty')}
        </div>
      ) : (
        <div className="space-y-2">
          {flags?.map((flag) => (
            <FeatureFlagItem key={flag.key} flag={flag} handleToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
};
