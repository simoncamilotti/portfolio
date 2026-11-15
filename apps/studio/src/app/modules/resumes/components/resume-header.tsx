import { Plus } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

type ResumeHeaderProps = {
  setCreateOpen: (open: boolean) => void;
};

export const ResumeHeader: FunctionComponent<ResumeHeaderProps> = ({ setCreateOpen }) => {
  const { t } = useTranslation('studio');

  return (
    <section className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t('resumes.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('resumes.subtitle')}</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_-5px_hsl(245_58%_61%_/_0.4)]"
        >
          <Plus className="w-4 h-4" />
          {t('resumes.newResume')}
        </button>
      </div>
    </section>
  );
};
