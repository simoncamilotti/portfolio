import { fireEvent, render, screen } from '@testing-library/react';

import { DashboardPage } from './DashboardPage';

vi.mock('../modules/layout/PageLayout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('../modules/dashboard/components/DashboardHeader', () => ({
  DashboardHeader: ({ setCreateOpen }: { setCreateOpen: (open: boolean) => void }) => (
    <button onClick={() => setCreateOpen(true)}>Nouveau CV</button>
  ),
}));

vi.mock('../modules/dashboard/components/DashboardResumeList', () => ({
  DashboardResumeList: () => <div data-testid="resume-list" />,
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

describe('DashboardPage', () => {
  it('should render the resume list', () => {
    render(<DashboardPage />);

    expect(screen.getByTestId('resume-list')).toBeDefined();
  });

  it('should open the create dialog when clicking the create button', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText('Nouveau CV'));

    expect(screen.getByText('Nouveau CV', { selector: 'h2' })).toBeDefined();
  });

  it('should close the dialog when clicking cancel', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText('Nouveau CV'));
    fireEvent.click(screen.getByText('Annuler'));

    expect(screen.queryByText('Annuler')).toBeNull();
  });

  it('should disable the create button when input is empty', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText('Nouveau CV'));

    const createButton = screen.getByText('Créer');
    expect(createButton.hasAttribute('disabled')).toBe(true);
  });

  it('should enable the create button when input has value', () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByText('Nouveau CV'));
    fireEvent.change(screen.getByPlaceholderText('Titre du CV...'), { target: { value: 'Mon CV' } });

    const createButton = screen.getByText('Créer');
    expect(createButton.hasAttribute('disabled')).toBe(false);
  });
});
