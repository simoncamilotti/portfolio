import { render, screen } from '@testing-library/react';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: undefined }),
}));

vi.mock('react-router', () => ({
  useParams: vi.fn().mockReturnValue({ resumeId: '42' }),
  generatePath: vi.fn((path: string) => path),
}));

vi.mock('../modules/layout/PageBreadcrumb', () => ({
  PageBreadcrumb: ({ breadcrumbItems }: { breadcrumbItems: Array<{ title: string; to?: string }> }) => (
    <nav data-testid="page-breadcrumb">
      {breadcrumbItems.map((item, i) => (
        <span key={i} data-testid={`breadcrumb-${i}`}>
          {item.title}
        </span>
      ))}
    </nav>
  ),
}));

import { useQuery } from '@tanstack/react-query';

import { ResumePage } from './ResumePage';

const mockedUseQuery = vi.mocked(useQuery);

describe('ResumePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseQuery.mockReturnValue({ data: undefined } as any);
  });

  it('should render the PageBreadcrumb', () => {
    render(<ResumePage />);

    expect(screen.getByTestId('page-breadcrumb')).toBeDefined();
  });

  it('should show "Accueil" as the first breadcrumb item', () => {
    render(<ResumePage />);

    expect(screen.getByTestId('breadcrumb-0').textContent).toBe('Accueil');
  });

  it('should show "CVs" as the second breadcrumb item', () => {
    render(<ResumePage />);

    expect(screen.getByTestId('breadcrumb-1').textContent).toBe('CVs');
  });

  it('should show fallback breadcrumb title when resume is not loaded', () => {
    render(<ResumePage />);

    expect(screen.getByTestId('breadcrumb-2').textContent).toBe('Cv');
  });

  it('should show resume title in breadcrumb when loaded', () => {
    mockedUseQuery.mockReturnValue({
      data: { id: '42', title: 'Mon CV', isPublic: false, shareEnabled: false, updatedAt: '2026-01-01' },
    } as any);

    render(<ResumePage />);

    expect(screen.getByTestId('breadcrumb-2').textContent).toBe('Cv - Mon CV');
  });
});
