import type { ResumeDto } from '@portfolio/shared-models';
import { ExternalLink, Globe, Link as LinkIcon, MoreHorizontal, Trash2 } from 'lucide-react';
import type { FunctionComponent } from 'react';
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
  const { deleteResumeByIdMutation } = useDeleteResumeById(resume.id);
  const { setResumeIsPublic } = useSetResumeIsPublic(resume.id);

  const handleSetPublic = async () => {
    await setResumeIsPublic.mutateAsync();
    toast.success('CV défini comme public');
  };

  const handleDelete = async () => {
    await deleteResumeByIdMutation.mutateAsync();
    toast.success('CV supprimé');
  };

  const handleToggleShare = async (id: string) => {
    /*
    const result = await api.toggleShare(id);
    if (result.shareEnabled && result.shareToken) {
      const url = `${window.location.origin}/cv/${result.shareToken}`;
      await navigator.clipboard.writeText(url);
      toast.success('Lien copié dans le presse-papier');
    } else {
      toast.success('Lien de partage révoqué');
    }
    */

    toast.success('Lien de partage révoqué');
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
            <ExternalLink className="w-3.5 h-3.5" /> Ouvrir
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSetPublic()} className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5" /> Définir comme public
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleShare(resume.id)} className="flex items-center gap-2">
          <LinkIcon className="w-3.5 h-3.5" />
          {resume.shareEnabled ? 'Révoquer le lien' : 'Générer un lien'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleDelete()}
          className="flex items-center gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="w-3.5 h-3.5" /> Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
