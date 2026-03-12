import type { ResumeDto } from '@portfolio/shared-models';
import { ExternalLink, Globe, Link as LinkIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router';

import { RoutePaths } from '../../../routes/paths.const';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../ui/Dropdown-menu';
import { toast } from '../../ui/sonner';
import { useDeleteResumeById } from '../hooks/use-delete-resume-by-id-mutation.hook';
import { useSetResumeIsPublic } from '../hooks/use-set-resume-is-public.hook';

type ResumeItemMenuProps = {
  resume: ResumeDto;
};

export const ResumeItemMenu: FunctionComponent<ResumeItemMenuProps> = ({ resume }) => {
  const { t } = useTranslation('studio');
  const { deleteResumeByIdMutation } = useDeleteResumeById(resume.id);
  const { setResumeIsPublic } = useSetResumeIsPublic(resume.id);

  const handleSetPublic = async () => {
    await setResumeIsPublic.mutateAsync();
    toast.success(t('resume.toast.setPublic'));
  };

  const handleDelete = async () => {
    await deleteResumeByIdMutation.mutateAsync();
    toast.success(t('resume.toast.deleted'));
  };

  const handleToggleShare = async (id: string) => {
    /*
    const result = await api.toggleShare(id);
    if (result.shareEnabled && result.shareToken) {
      const url = `${window.location.origin}/cv/${result.shareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success(t('resume.toast.linkCopied'));
    } else {
      toast.success(t('resume.toast.linkRevoked'));
    }
    */

    toast.success(t('resume.toast.linkRevoked'));
    // await loadCVs();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-accent transition-all">
        <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link to={generatePath(RoutePaths.RESUME, { resumeId: resume.id })} className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> {t('resume.menu.open')}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetPublic()} className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> {t('resume.menu.setPublic')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleShare(resume.id)} className="flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5" />
          {resume.shareEnabled ? t('resume.menu.revokeLink') : t('resume.menu.generateLink')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete()}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" /> {t('resume.menu.delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
