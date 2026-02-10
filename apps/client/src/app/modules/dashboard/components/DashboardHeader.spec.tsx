import { fireEvent, render, screen } from '@testing-library/react';

import { DashboardHeader } from './DashboardHeader';

describe('DashboardHeader', () => {
  it('should render the title', () => {
    render(<DashboardHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Mes CVs');
  });

  it('should render the description', () => {
    render(<DashboardHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByText('Créez, modifiez et partagez vos CVs')).toBeDefined();
  });

  it('should call setCreateOpen when clicking the create button', () => {
    const setCreateOpen = vi.fn();
    render(<DashboardHeader setCreateOpen={setCreateOpen} />);

    fireEvent.click(screen.getByText('Nouveau CV'));

    expect(setCreateOpen).toHaveBeenCalledWith(true);
  });
});
