import { Braces } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { generatePath, Link } from 'react-router';

import { RouteNames, RoutePaths } from '../../routes/paths.const';
import { logout } from '../auth/auth';

export const Navbar: FunctionComponent = () => {
  return (
    <nav className="sticky top-0 z-[9999] w-full border-b border-border/50 glass-nav no-print">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        <Link to={generatePath(RoutePaths.HOME)}>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            <Braces />
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to={generatePath(RoutePaths.HOME)}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {RouteNames.HOME}
          </Link>

          <Link
            to={generatePath(RoutePaths.PROJECTS)}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {RouteNames.PROJECTS}
          </Link>

          <Link
            to={generatePath(RoutePaths.SETTINGS)}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {RouteNames.SETTINGS}
          </Link>

          <button
            onClick={() => logout()}
            className="text-[13px] px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
