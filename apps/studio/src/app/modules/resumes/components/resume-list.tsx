import type { ResumeDto } from '@repo/contracts';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { NoResumePlaceholder } from './no-resume-placeholder.js';
import { ResumeItem } from './resume-item.js';

type ResumeListProps = {
  resumes?: ResumeDto[];
};

export const ResumeList: FunctionComponent<ResumeListProps> = ({ resumes }) => {
  const { t } = useTranslation('studio');

  return (
    <>
      {resumes?.length === 0 ? (
        <section className="max-w-7xl mx-auto">
          <div className="text-center py-20 text-muted-foreground">
            <NoResumePlaceholder />
            <p className="mt-4 text-sm">{t('resumes.empty')}</p>
          </div>
        </section>
      ) : (
        <section className="max-w-7xl mx-auto">
          <div className="space-y-1.5">
            {resumes?.map((resume, index) => (
              <ResumeItem key={resume.id} resumeIndex={index} resume={resume} />
            ))}
          </div>
        </section>
      )}
    </>
  );
};
