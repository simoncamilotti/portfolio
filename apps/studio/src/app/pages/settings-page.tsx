import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import type { BreadcrumbItemsProps } from '../modules/layout/page-breadcrumb.js';
import { PageBreadcrumb } from '../modules/layout/page-breadcrumb.js';
import { FeatureFlagList } from '../modules/settings/components/feature-flag-list.js';
import { RouteNames, RoutePaths } from '../routes/paths.const.js';

export const SettingsPage: FunctionComponent = () => {
  const { t } = useTranslation('studio');

  const breadcrumbItems: BreadcrumbItemsProps = [
    {
      title: t(RouteNames.HOME),
      to: RoutePaths.HOME,
    },
    {
      title: t(RouteNames.SETTINGS),
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
