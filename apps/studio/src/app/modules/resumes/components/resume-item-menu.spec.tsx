import { cloneElement } from 'react';
import { render, screen } from '@testing-library/react';

import { ResumeItemMenu } from './resume-item-menu.js';

vi.mock('sonner', () => ({
  toast: { success: vi.fn() },
}));

vi.mock('../hooks/use-delete-resume-by-id-mutation.hook.js', () => ({
  useDeleteResumeById: () => ({
    deleteResumeByIdMutation: { mutateAsync: vi.fn() },
  }),
}));

vi.mock('../hooks/use-set-resume-is-public.hook.js', () => ({
  useSetResumeIsPublic: () => ({
    setResumeIsPublic: { mutateAsync: vi.fn() },
  }),
}));

vi.mock('@repo/ui/components/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <button>{children}</button>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  // Base UI renders the item as its `render` element when one is given (a router link).
  DropdownMenuItem: ({ children, onClick, render }: any) =>
    render ? (
      cloneElement(render, { role: 'menuitem', onClick }, children)
    ) : (
      <div role="menuitem" onClick={onClick}>
        {children}
      </div>
    ),
  DropdownMenuSeparator: () => <hr />,
}));

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
  const renderMenu = (props = resume) => render(<ResumeItemMenu resume={props} />);

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
