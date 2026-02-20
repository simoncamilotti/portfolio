import { Footer } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { Outlet } from 'react-router';

import { Toaster } from '../ui/sonner';
import { Navbar } from './Navbar';

export const Layout: FunctionComponent = () => {
  return (
    <div className="dark min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-181.5px)]">
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};
