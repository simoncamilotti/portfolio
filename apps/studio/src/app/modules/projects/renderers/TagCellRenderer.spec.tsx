import type { ProjectDto } from '@portfolio/shared-models';
import { render, screen } from '@testing-library/react';
import type { ICellRendererParams } from 'ag-grid-community';

import { TagsCellRenderer } from './TagCellRenderer';

const makeParams = (value: string[] | undefined) => ({ value }) as ICellRendererParams<ProjectDto>;

describe('TagsCellRenderer', () => {
  it('should render nothing when tags is undefined', () => {
    const { container } = render(<TagsCellRenderer {...makeParams(undefined)} />);

    expect(container.innerHTML).toBe('');
  });

  it('should render nothing when tags is empty', () => {
    const { container } = render(<TagsCellRenderer {...makeParams([])} />);

    expect(container.innerHTML).toBe('');
  });

  it('should render all tags', () => {
    render(<TagsCellRenderer {...makeParams(['react', 'typescript', 'node'])} />);

    expect(screen.getByText('react')).toBeDefined();
    expect(screen.getByText('typescript')).toBeDefined();
    expect(screen.getByText('node')).toBeDefined();
  });

  it('should render a single tag', () => {
    render(<TagsCellRenderer {...makeParams(['react'])} />);

    expect(screen.getByText('react')).toBeDefined();
  });
});
