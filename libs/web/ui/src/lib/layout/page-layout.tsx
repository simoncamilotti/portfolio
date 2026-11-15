import type { FunctionComponent, ReactNode } from 'react';

import { Footer } from './footer.js';

type PageLayoutProps = {
  children?: ReactNode;
};

export const PageLayout: FunctionComponent<PageLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-background">{children}</div>
      <Footer />
    </>
  );
};
