import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

vi.mock('../../ui/Dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <button>{children}</button>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <div role="menuitem" onClick={onClick}>
      {children}
    </div>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

import { ResumeItemMenu } from './ResumeItemMenu';

const resume = {
  id: 'test-id',
  title: 'Test CV',
  description: undefined,
  isPublic: false,
  shareEnabled: false,
  views: 0,
  downloads: 0,
  updatedAt: '2026-01-01',
};

describe('ResumeItemMenu', () => {
  const renderMenu = (props = resume) =>
    render(
      <MemoryRouter>
        <ResumeItemMenu resume={props} />
      </MemoryRouter>,
    );

  it('should render the trigger button', () => {
    renderMenu();

    expect(screen.getByRole('button')).toBeDefined();
  });

  it('should render "Révoquer le lien" when share is enabled', () => {
    renderMenu({ ...resume, shareEnabled: true });

    expect(screen.getByText('Révoquer le lien')).toBeDefined();
  });

  it('should render "Générer un lien" when share is disabled', () => {
    renderMenu({ ...resume, shareEnabled: false });

    expect(screen.getByText('Générer un lien')).toBeDefined();
  });

  it('should render all menu actions', () => {
    renderMenu();

    expect(screen.getByText('Ouvrir')).toBeDefined();
    expect(screen.getByText('Définir comme public')).toBeDefined();
    expect(screen.getByText('Supprimer')).toBeDefined();
  });
});
