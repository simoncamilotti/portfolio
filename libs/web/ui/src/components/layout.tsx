import type { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

import { Toaster } from './sonner.js';
import { Footer } from './footer.js';
type LayoutProps = {
  navBar: ReactNode;
};

/** Page frame: the router of each application renders the page as `children`. */
export const Layout: FunctionComponent<PropsWithChildren<LayoutProps>> = ({ navBar, children }) => {
  return (
    <div className="dark min-h-screen bg-background">
      {navBar}
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-100.5px)]">{children}</div>
      <Footer />
      <Toaster />
    </div>
  );
};
