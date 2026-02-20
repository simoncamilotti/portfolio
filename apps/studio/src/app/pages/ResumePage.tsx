import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { generatePath, useParams } from 'react-router';

import { resumesKey } from '../modules/dashboard/resumes.key';
import { ResumesService } from '../modules/dashboard/resumes.service';
import { type BreadcrumbItemsProps, PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import type { RoutePathParams } from '../routes/paths.const';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const ResumePage: FunctionComponent = () => {
  const { resumeId } = useParams<typeof RoutePathParams.RESUME_ID>() as {
    resumeId: string;
  };

  const { data: resume } = useQuery({
    queryKey: resumesKey.getResumeById(resumeId),
    queryFn: () => ResumesService.getResumeById(resumeId),
  });

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: RouteNames.HOME,
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: resume?.title ? `${RouteNames.RESUME} - ${resume.title}` : RouteNames.RESUME,
    },
  ];

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
    </>
  );
};
