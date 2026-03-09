import { Braces } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { generatePath, Link } from 'react-router';

import { RouteAnchors, RoutePaths } from '../../routes/paths.const';
import { useFeatureFlags } from '../feature-flags/hooks/use-feature-flags.hook';

export const Navbar: FunctionComponent = () => {
  const { isEnabled } = useFeatureFlags();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 glass-nav no-print">
      <div className="max-w-7xl mx-auto h-14 flex items-center justify-between">
        <Link to={generatePath(RoutePaths.HOME)}>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            <Braces />
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {isEnabled('projects') && (
            <a
              href={`#${RouteAnchors.HOME.PROJECTS}`}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Projets
            </a>
          )}
          <a
            href={`#${RouteAnchors.HOME.RESUME}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            CV
          </a>
          <a
            href={`#${RouteAnchors.HOME.CONTACT}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};
