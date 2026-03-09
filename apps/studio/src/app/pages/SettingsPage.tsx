import type { FunctionComponent } from 'react';
import { generatePath } from 'react-router';

import type { BreadcrumbItemsProps } from '../modules/layout/PageBreadcrumb';
import { PageBreadcrumb } from '../modules/layout/PageBreadcrumb';
import { FeatureFlagList } from '../modules/settings/components/FeatureFlagList';
import { RouteNames, RoutePaths } from '../routes/paths.const';

export const SettingsPage: FunctionComponent = () => {
  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: RouteNames.HOME,
      to: generatePath(RoutePaths.HOME),
    },
    {
      title: RouteNames.SETTINGS,
    },
  ];

  return (
    <>
      <PageBreadcrumb breadcrumbItems={breadcrumbItems} />
      <div className="pt-20 pb-24 relative overflow-hidden">
        <div className="max-w-2xl mx-auto px-4">
          <FeatureFlagList />
        </div>
      </div>
    </>
  );
};
