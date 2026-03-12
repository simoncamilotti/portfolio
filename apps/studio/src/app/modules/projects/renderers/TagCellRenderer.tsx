import type { ProjectDto } from '@portfolio/shared-models';
import type { ICellRendererParams } from 'ag-grid-community';

export const TagsCellRenderer = (params: ICellRendererParams<ProjectDto>) => {
  const tags = params.value as string[];
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {tags.map((tag: string) => (
        <span key={tag} className="px-2 py-2 text-xs/3 rounded bg-muted text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
  );
};
