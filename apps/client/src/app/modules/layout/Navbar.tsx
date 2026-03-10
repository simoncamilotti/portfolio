import { Braces, LanguageSwitcher } from '@portfolio/shared-ui';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router';

import { RouteAnchors, RoutePaths } from '../../routes/paths.const';
import { useFeatureFlags } from '../feature-flags/hooks/use-feature-flags.hook';

export const Navbar: FunctionComponent = () => {
  const { isEnabled } = useFeatureFlags();
  const { t } = useTranslation('client');

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
              {t('nav.projects')}
            </a>
          )}
          <a
            href={`#${RouteAnchors.HOME.RESUME}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('nav.resume')}
          </a>
          <a
            href={`#${RouteAnchors.HOME.CONTACT}`}
            className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('nav.contact')}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};
