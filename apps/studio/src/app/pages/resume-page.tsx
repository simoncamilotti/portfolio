import { useResumeFindOne } from '@repo/api-client';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from '@tanstack/react-router';

import { type BreadcrumbItemsProps, PageBreadcrumb } from '../modules/layout/page-breadcrumb.js';
import { RouteNames, RoutePaths } from '../routes/paths.const.js';

export const ResumePage: FunctionComponent = () => {
  const { t } = useTranslation('studio');
  const { resumeId } = useParams({ from: '/_authenticated/resumes/$resumeId' });

  const { data: resume } = useResumeFindOne(resumeId);

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: RoutePaths.HOME,
    },
    {
      title: t(RouteNames.RESUMES),
      to: RoutePaths.RESUMES,
    },
    {
      title: resume?.title ? `${t(RouteNames.RESUME)} - ${resume.title}` : t(RouteNames.RESUME),
    },
  ];

  return <PageBreadcrumb breadcrumbItems={breadcrumbItems} />;
};
