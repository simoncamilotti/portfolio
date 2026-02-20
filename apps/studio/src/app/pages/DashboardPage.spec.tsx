import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({
    data: [
      {
        id: '1',
        title: 'Mon CV',
        isPublic: false,
        shareEnabled: false,
        updatedAt: '2026-01-01',
      },
    ],
    isPending: false,
  }),
}));

vi.mock('../modules/dashboard/components/DashboardHeader', () => ({
  DashboardHeader: ({ setCreateOpen }: { setCreateOpen: (v: boolean) => void }) => (
    <button data-testid="dashboard-header" onClick={() => setCreateOpen(true)}>
      Nouveau CV
    </button>
  ),
}));

vi.mock('../modules/dashboard/components/DashboardResumeList', () => ({
  DashboardResumeList: () => <div data-testid="resume-list" />,
}));

vi.mock('../modules/dashboard/components/CreateResumeDialog', () => ({
  CreateResumeDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog" data-testid="create-dialog" /> : null,
}));

vi.mock('../modules/layout/PageBreadcrumb', () => ({
  PageBreadcrumb: ({ breadcrumbItems }: { breadcrumbItems: Array<{ title: string }> }) => (
    <nav data-testid="page-breadcrumb">{breadcrumbItems.map(i => i.title).join(' / ')}</nav>
  ),
}));

import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  it('should render the PageBreadcrumb', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('page-breadcrumb')).toBeDefined();
  });

  it('should render the DashboardHeader', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-header')).toBeDefined();
  });

  it('should render the DashboardResumeList', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('resume-list')).toBeDefined();
  });

  it('should open the create dialog when header triggers it', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId('dashboard-header'));

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
