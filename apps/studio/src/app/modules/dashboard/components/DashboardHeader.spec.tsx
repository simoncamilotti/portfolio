import { fireEvent, render, screen } from '@testing-library/react';

import { DashboardHeader } from './DashboardHeader';

describe('DashboardHeader', () => {
  it('should render the title', () => {
    render(<DashboardHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByText('Mes CVs')).toBeDefined();
  });

  it('should render the subtitle', () => {
    render(<DashboardHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByText('Créez, modifiez et partagez vos CVs')).toBeDefined();
  });

  it('should render the "Nouveau CV" button', () => {
    render(<DashboardHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Nouveau CV/ })).toBeDefined();
  });

  it('should call setCreateOpen(true) when button is clicked', () => {
    const setCreateOpen = vi.fn();
    render(<DashboardHeader setCreateOpen={setCreateOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /Nouveau CV/ }));

    expect(setCreateOpen).toHaveBeenCalledWith(true);
  });
});
