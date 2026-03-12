import { fireEvent, render, screen } from '@testing-library/react';

import { ResumeHeader } from './ResumeHeader';

describe('ResumeHeader', () => {
  it('should render the title', () => {
    render(<ResumeHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByText('Mes CVs')).toBeDefined();
  });

  it('should render the subtitle', () => {
    render(<ResumeHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByText('Créez, modifiez et partagez vos CVs')).toBeDefined();
  });

  it('should render the "Nouveau CV" button', () => {
    render(<ResumeHeader setCreateOpen={vi.fn()} />);

    expect(screen.getByRole('button', { name: /Nouveau CV/ })).toBeDefined();
  });

  it('should call setCreateOpen(true) when button is clicked', () => {
    const setCreateOpen = vi.fn();
    render(<ResumeHeader setCreateOpen={setCreateOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /Nouveau CV/ }));

    expect(setCreateOpen).toHaveBeenCalledWith(true);
  });
});
