import { useQuery } from '@tanstack/react-query';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useParams } from 'react-router';

import { resumesKey } from '../modules/dashboard/resumes.key';
import { ResumesService } from '../modules/dashboard/resumes.service';
import { type BreadcrumbItemsProps, PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import type { RoutePathParams } from '../routes/paths.const';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const ResumePage: FunctionComponent = () => {
  const { t } = useTranslation('studio');
  const { resumeId } = useParams<typeof RoutePathParams.RESUME_ID>() as {
    resumeId: string;
  };

  const { data: resume } = useQuery({
    queryKey: resumesKey.getResumeById(resumeId),
    queryFn: () => ResumesService.getResumeById(resumeId),
  });

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: resume?.title ? `${t(RouteNames.RESUME)} - ${resume.title}` : t(RouteNames.RESUME),
    },
  ];

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
    </>
  );
};
