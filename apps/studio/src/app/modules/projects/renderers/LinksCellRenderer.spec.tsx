import type { ProjectDto } from '@portfolio/shared-models';
import { render, screen } from '@testing-library/react';
import type { ICellRendererParams } from 'ag-grid-community';

import { LinksCellRenderer } from './LinksCellRenderer';

const makeParams = (data: Partial<ProjectDto> | undefined) => ({ data }) as ICellRendererParams<ProjectDto>;

describe('LinksCellRenderer', () => {
  it('should render nothing when data is undefined', () => {
    const { container } = render(<LinksCellRenderer {...makeParams(undefined)} />);

    expect(container.innerHTML).toBe('');
  });

  it('should render a GitHub link when repoUrl is set', () => {
    render(<LinksCellRenderer {...makeParams({ repoUrl: 'https://github.com/test' })} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://github.com/test');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('should render an external link when url is set', () => {
    render(<LinksCellRenderer {...makeParams({ url: 'https://example.com' })} />);

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://example.com');
  });

  it('should render both links when both urls are set', () => {
    render(<LinksCellRenderer {...makeParams({ repoUrl: 'https://github.com/test', url: 'https://example.com' })} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('should render no links when neither url is set', () => {
    render(<LinksCellRenderer {...makeParams({})} />);

    expect(screen.queryByRole('link')).toBeNull();
  });
});
