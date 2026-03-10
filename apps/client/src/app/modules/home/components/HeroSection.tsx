import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Github, Linkedin } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteAnchors } from '../../../routes/paths.const';

export const HeroSection: FunctionComponent = () => {
  const { t } = useTranslation('client');

  return (
    <section className="pt-40 pb-24 relative overflow-hidden">
      <div className="gradient-hero absolute inset-0 pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface/50 text-xs text-muted-foreground mb-8 hover:border-primary/30 transition-colors cursor-default">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            {t('hero.available')}
            <ChevronRight className="w-3 h-3" />
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] text-foreground mb-6 leading-[1.05]">
            {t('hero.title')}
            <br />
            <span className="glow-text">{t('hero.subtitle')}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">{t('hero.description')}</p>
          <div className="flex items-center gap-4">
            <a
              href={`#${RouteAnchors.HOME.RESUME}`}
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_-5px_hsl(245_58%_61%_/_0.4)]"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <div className="flex items-center gap-1">
              <a
                href="https://github.com/scamilotti1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/simon-camilotti-a6952937"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
