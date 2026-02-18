import { fireEvent, render, screen } from '@testing-library/react';

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

vi.mock('../modules/layout/PageLayout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="page-layout">{children}</div>,
}));

import { DashboardPage } from './DashboardPage';

describe('DashboardPage', () => {
  it('should render within PageLayout', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('page-layout')).toBeDefined();
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
