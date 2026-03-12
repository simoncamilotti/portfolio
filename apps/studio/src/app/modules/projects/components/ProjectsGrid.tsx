import type { ProjectDto } from '@portfolio/shared-models';
import { AllCommunityModule, type ColDef, type ICellRendererParams, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import type { FunctionComponent } from 'react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { agTheme } from '../../ui/constants/ag-grid-theme';
import { LinksCellRenderer } from '../renderers/LinksCellRenderer';
import { TagsCellRenderer } from '../renderers/TagCellRenderer';

ModuleRegistry.registerModules([AllCommunityModule]);

type ProjectsGridProps = {
  projects: ProjectDto[];
  onEdit: (project: ProjectDto) => void;
  onDelete: (project: ProjectDto) => void;
  onCreateClick: () => void;
};

const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 42;
const MARGIN_AGGREGATION = 3;

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
    <div style={{ height: Math.min(projects.length, 10) * ROW_HEIGHT + HEADER_HEIGHT + MARGIN_AGGREGATION }}>
      <AgGridReact<ProjectDto>
        theme={agTheme}
        rowData={projects}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowHeight={ROW_HEIGHT}
        headerHeight={HEADER_HEIGHT}
        animateRows
        domLayout="normal"
      />
    </div>
  );
};
