import { useResumeFindAll } from '@repo/api-client';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { BreadcrumbItemsProps } from '../modules/layout/page-breadcrumb.js';
import { PageBreadcrumb } from '../modules/layout/page-breadcrumb.js';
import { CreateResumeDialog } from '../modules/resumes/components/create-resume-dialog.js';
import { ResumeHeader } from '../modules/resumes/components/resume-header.js';
import { ResumeList } from '../modules/resumes/components/resume-list.js';
import { RouteNames, RoutePaths } from '../routes/paths.const.js';

export const ResumesPage: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: RoutePaths.HOME,
    },
    {
      title: t(RouteNames.RESUMES),
    },
  ];

  const { data: resumes, isPending } = useResumeFindAll();

  const orderedResumes = [...(resumes ?? [])].sort((e1, e2) =>
    e2.updatedAt.localeCompare(e1.updatedAt),
  );

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
      <div className="pt-20 pb-24 relative overflow-hidden">
        <ResumeHeader setCreateOpen={setCreateOpen} />

        {isPending ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl border border-border/50 bg-card animate-pulse"
              />
            ))}
          </div>
        ) : (
          <ResumeList resumes={orderedResumes} />
        )}
        <CreateResumeDialog resumes={orderedResumes} open={createOpen} openChange={setCreateOpen} />
      </div>
    </>
  );
};
