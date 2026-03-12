import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath } from 'react-router';

import type { BreadcrumbItemsProps } from '../modules/layout/PageBreadcrumb';
import { PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import { CreateResumeDialog } from '../modules/resumes/components/CreateResumeDialog';
import { ResumeHeader } from '../modules/resumes/components/ResumeHeader';
import { ResumeList } from '../modules/resumes/components/ResumeList';
import { resumesKey } from '../modules/resumes/resumes.key';
import { ResumesService } from '../modules/resumes/resumes.service';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const ResumesPage: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: t(RouteNames.RESUMES),
    },
  ];

  const { data: resumes, isPending } = useQuery({
    queryKey: resumesKey.getAllResumes,
    queryFn: ResumesService.getAllResumes,
  });

  const orderedResumes = [...(resumes ?? [])].sort((e1, e2) => e2.updatedAt.localeCompare(e1.updatedAt));

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
      <div className="pt-20 pb-24 relative overflow-hidden">
        <ResumeHeader setCreateOpen={setCreateOpen} />

        {isPending ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 rounded-xl border border-border/50 bg-card animate-pulse" />
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
