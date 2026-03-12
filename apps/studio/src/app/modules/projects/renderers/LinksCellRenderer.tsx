import type { ProjectDto } from '@portfolio/shared-models';
import type { ICellRendererParams } from 'ag-grid-community';
import { ExternalLink, Github } from 'lucide-react';

export const LinksCellRenderer = (params: ICellRendererParams<ProjectDto>) => {
  const data = params.data;
  if (!data) return null;
  return (
    <div className="flex gap-2 items-center h-full">
      {data.repoUrl && (
        <a
          href={data.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
      )}
      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};
