import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';

import { FeatureFlagsProvider } from '../feature-flags/providers/FeatureFlagsContext';
import { Navbar } from './Navbar';

export const Layout: FunctionComponent = () => {
  return (
    <FeatureFlagsProvider>
      <div className="dark relative min-h-screen bg-background">
        <Navbar />
        <Outlet />
      </div>
    </FeatureFlagsProvider>
  );
};
