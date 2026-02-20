import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useState } from 'react';

import { CreateResumeDialog } from '../modules/dashboard/components/CreateResumeDialog';
import { DashboardHeader } from '../modules/dashboard/components/DashboardHeader';
import { DashboardResumeList } from '../modules/dashboard/components/DashboardResumeList';
import { resumesKey } from '../modules/dashboard/resumes.key';
import { ResumesService } from '../modules/dashboard/resumes.service';
import type { BreadcrumbItemsProps } from '../modules/layout/PageBreadcrumb';
import { PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import { RouteNames } from '../routes/paths.const';

export const DashboardPage: FunctionComponent = () => {
  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: RouteNames.HOME,
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
        <DashboardHeader setCreateOpen={setCreateOpen} />

        {isPending ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 rounded-xl border border-border/50 bg-card animate-pulse" />
            ))}
          </div>
        ) : (
          <DashboardResumeList resumes={orderedResumes} />
        )}
        <CreateResumeDialog resumes={orderedResumes} open={createOpen} openChange={setCreateOpen} />
      </div>
    </>
  );
};
