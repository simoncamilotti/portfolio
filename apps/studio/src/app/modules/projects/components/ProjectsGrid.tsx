import type { ProjectDto } from '@portfolio/shared-models';
import {
  AllCommunityModule,
  type ColDef,
  type ICellRendererParams,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ExternalLink, Github, Pencil, Plus, Trash2 } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

ModuleRegistry.registerModules([AllCommunityModule]);

const agTheme = themeQuartz.withParams({
  backgroundColor: 'hsl(240 14% 6%)',
  foregroundColor: 'hsl(240 10% 93%)',
  headerTextColor: 'hsl(240 5% 50%)',
  borderColor: 'hsl(240 10% 13%)',
  rowHoverColor: 'hsl(240 12% 10%)',
  selectedRowBackgroundColor: 'hsl(245 58% 61% / 0.1)',
  fontFamily: 'Inter, sans-serif',
  fontSize: 13,
  headerFontSize: 12,
  headerFontWeight: 500,
  columnBorder: false,
  wrapperBorderRadius: 12,
  cellHorizontalPadding: 16,
});

const TagsCellRenderer = (params: ICellRendererParams<ProjectDto>) => {
  const tags = params.value as string[];
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1 items-center h-full">
      {tags.map((tag: string) => (
        <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
  );
};

const LinksCellRenderer = (params: ICellRendererParams<ProjectDto>) => {
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

type ProjectsGridProps = {
  projects: ProjectDto[];
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
  onCreateClick: () => void;
};

export const ProjectsGrid: FunctionComponent<ProjectsGridProps> = ({ projects, onEdit, onDelete, onCreateClick }) => {
  const { t } = useTranslation('studio');

  const ActionsCellRenderer = useCallback(
    (params: ICellRendererParams<ProjectDto>) => {
      const data = params.data;
      if (!data) return null;
      return (
        <div className="flex justify-end gap-1 items-center h-full">
          <button className="h-7 w-7" onClick={() => onEdit(data)}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(data)}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    },
    [onEdit, onDelete],
  );

  const columnDefs = useMemo<Array<ColDef<ProjectDto>>>(
    () => [
      {
        field: 'title',
        headerName: t('projects.grid.title'),
        flex: 2,
        minWidth: 200,
      },
      {
        field: 'description',
        headerName: t('projects.grid.description'),
        flex: 3,
        minWidth: 250,
      },
      {
        field: 'tags',
        headerName: t('projects.grid.tags'),
        flex: 2,
        minWidth: 180,
        cellRenderer: TagsCellRenderer,
        sortable: false,
        filter: false,
      },
      {
        headerName: t('projects.grid.links'),
        width: 100,
        cellRenderer: LinksCellRenderer,
        sortable: false,
        filter: false,
      },
      {
        headerName: '',
        width: 100,
        cellRenderer: ActionsCellRenderer,
        sortable: false,
        filter: false,
        resizable: false,
      },
    ],
    [ActionsCellRenderer, t],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  if (projects.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-sm">{t('projects.empty')}</p>
        <button
          onClick={onCreateClick}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          {t('projects.createFirst')}
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: Math.min(projects.length * 48 + 49 + 20, 500) }}>
      <AgGridReact<ProjectDto>
        theme={agTheme}
        rowData={projects}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={48}
        headerHeight={42}
        animateRows
        domLayout="normal"
      />
    </div>
  );
};
