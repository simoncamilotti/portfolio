import type { FunctionComponent } from 'react';
import { generatePath, Link } from 'react-router';

import { RoutePaths } from '../../routes/paths.const';
import { logout } from '../auth/auth';
import { Braces } from '../ui/Braces';

export const Navbar: FunctionComponent = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 glass-nav no-print">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        <Link to={generatePath(RoutePaths.DASHBOARD)}>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            <Braces />
          </span>
        </Link>

        <div className="flex items-center gap-6">
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
