import type { FeatureFlagDto } from '@repo/contracts';
import { toast } from '@repo/ui';
import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { featureFlagsKey } from '../feature-flags.key.js';
import { FeatureFlagsService } from '../feature-flags.service.js';
import { useToggleFeatureFlagMutation } from '../hooks/use-toggle-feature-flag-mutation.hook.js';
import { FeatureFlagForm } from './FeatureFlagForm.js';
import { FeatureFlagItem } from './FeatureFlagItem.js';
import { FeatureFlagListSkeleton } from './FeatureFlagListSkeleton.js';

export const FeatureFlagList: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const { data: flags, isPending } = useQuery({
    queryKey: featureFlagsKey.getAll,
    queryFn: FeatureFlagsService.getAll,
  });

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
