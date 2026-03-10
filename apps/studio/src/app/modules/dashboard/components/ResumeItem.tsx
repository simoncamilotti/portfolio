import type { ResumeDto } from '@portfolio/shared-models';
import { motion } from 'framer-motion';
import { Download, Eye, Globe, Link as LinkIcon } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router';

import { RoutePaths } from '../../../routes/paths.const';
import { ResumeItemMenu } from './ResumeItemMenu';

type ResumeItemProps = {
  resume: ResumeDto;
  resumeIndex: number;
};

export const ResumeItem: FunctionComponent<ResumeItemProps> = ({ resume, resumeIndex }) => {
  const { t, i18n } = useTranslation('studio');

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));

  return (
    <motion.div
      key={resume.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: resumeIndex * 0.05 }}
      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card hover:bg-surface-hover hover:border-primary/10 transition-all"
    >
      <Link to={generatePath(RoutePaths.RESUME, { resumeId: resume.id })} className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-medium text-foreground truncate">{resume.title}</h3>
          {resume.isPublic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              <Globe className="w-3 h-3" />
              {t('resume.public')}
            </span>
          )}
          {resume.shareEnabled && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-success/10 text-success border border-success/20">
              <LinkIcon className="w-3 h-3" />
              {t('resume.shared')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4 mt-1.5">
          <span className="text-xs text-muted-foreground">
            {t('resume.modifiedOn', { date: formatDate(resume.updatedAt) })}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Eye className="w-3 h-3" /> {resume.views}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Download className="w-3 h-3" /> {resume.downloads}
          </span>
        </div>
      </Link>
      <ResumeItemMenu resume={resume} />
    </motion.div>
  );
};
