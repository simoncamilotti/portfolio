import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';

import { Navbar } from './Navbar';

export const Layout: FunctionComponent = () => {
  return (
    <div className="dark relative min-h-screen bg-background">
      <Navbar />
      <Outlet />
    </div>
  );
};
