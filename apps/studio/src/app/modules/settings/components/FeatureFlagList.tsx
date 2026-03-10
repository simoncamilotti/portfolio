import type { FeatureFlagDto } from '@portfolio/shared-models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Flag, Loader2, Plus } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { toast } from '../../ui/sonner';
import { featureFlagsKey } from '../feature-flags.key';
import { FeatureFlagsService } from '../feature-flags.service';

export const FeatureFlagList: FunctionComponent = () => {
  const { t } = useTranslation('studio');
  const queryClient = useQueryClient();
  const [newKey, setNewKey] = useState('');

  const { data: flags, isPending } = useQuery({
    queryKey: featureFlagsKey.getAll,
    queryFn: FeatureFlagsService.getAll,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ key, enabled }: { key: string; enabled: boolean }) => FeatureFlagsService.update(key, enabled),
    onMutate: ({ key, enabled }) => {
      queryClient.setQueryData<FeatureFlagDto[]>(featureFlagsKey.getAll, data =>
        data?.map(f => (f.key === key ? { ...f, enabled } : f)),
      );
    },
    onSuccess: (_, { key, enabled }) => {
      toast.success(
        t('featureFlags.toggled', { key, state: enabled ? t('featureFlags.enabled') : t('featureFlags.disabled') }),
      );
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: featureFlagsKey.getAll });
      toast.error(t('featureFlags.toggleError'));
    },
  });

  const createMutation = useMutation({
    mutationFn: (key: string) => FeatureFlagsService.update(key, false),
    onSuccess: created => {
      queryClient.setQueryData<FeatureFlagDto[]>(featureFlagsKey.getAll, data => [...(data ?? []), created]);
      setNewKey('');
      toast.success(t('featureFlags.created', { key: created.key }));
    },
    onError: () => {
      toast.error(t('featureFlags.createError'));
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newKey.trim();
    if (!trimmed) return;
    if (flags?.some(f => f.key === trimmed)) {
      toast.error(t('featureFlags.alreadyExists'));
      return;
    }
    createMutation.mutate(trimmed);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-medium text-foreground mb-1">{t('featureFlags.title')}</h2>
        <p className="text-xs text-muted-foreground">{t('featureFlags.description')}</p>
      </div>

      <form onSubmit={handleCreate} className="flex items-center gap-2">
        <input
          type="text"
          value={newKey}
          onChange={e => setNewKey(e.target.value)}
          placeholder={t('featureFlags.placeholder')}
          className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!newKey.trim() || createMutation.isPending}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {t('featureFlags.add')}
        </button>
      </form>

      {isPending ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="h-14 rounded-xl border border-border/50 bg-card animate-pulse" />
          ))}
        </div>
      ) : flags?.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">{t('featureFlags.empty')}</div>
      ) : (
        <div className="space-y-2">
          {flags?.map(flag => (
            <div
              key={flag.key}
              className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-surface-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <Flag className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{flag.key}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={flag.enabled}
                onClick={() => toggleMutation.mutate({ key: flag.key, enabled: !flag.enabled })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  flag.enabled ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                    flag.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
