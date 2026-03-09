import type { FunctionComponent } from 'react';
import { generatePath } from 'react-router';

import type { BreadcrumbItemsProps } from '../modules/layout/PageBreadcrumb';
import { PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const ProjectsPage: FunctionComponent = () => {
  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: RouteNames.HOME,
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: RouteNames.PROJECTS,
    },
  ];

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
    </>
  );
};
