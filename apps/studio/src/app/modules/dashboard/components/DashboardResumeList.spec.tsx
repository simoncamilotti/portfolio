import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('../hooks/use-delete-resume-by-id-mutation.hook', () => ({
  useDeleteResumeById: () => ({
    deleteResumeByIdMutation: { mutateAsync: vi.fn() },
  }),
}));

vi.mock('../hooks/use-set-resume-is-public.hook', () => ({
  useSetResumeIsPublic: () => ({
    setResumeIsPublic: { mutateAsync: vi.fn() },
  }),
}));

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

import { DashboardResumeList } from './DashboardResumeList';

const mockResumes = [
  {
    id: 'mon-super-id',
    title: 'CV number 1',
    isPublic: true,
    shareEnabled: true,
    views: 12,
    downloads: 6,
    updatedAt: '2026-01-01',
  },
];

describe('DashboardResumeList', () => {
  const renderList = (resumes = mockResumes) =>
    render(
      <MemoryRouter>
        <DashboardResumeList resumes={resumes} />
      </MemoryRouter>,
    );

  it('should render the resume title', () => {
    renderList();

    expect(screen.getByText('CV number 1')).toBeDefined();
  });

  it('should render the public badge when resume is public', () => {
    renderList();

    expect(screen.getByText('Public')).toBeDefined();
  });

  it('should render the shared badge when share is enabled', () => {
    renderList();

    expect(screen.getByText('Partagé')).toBeDefined();
  });

  it('should render the views count', () => {
    renderList();

    expect(screen.getByText('12')).toBeDefined();
  });

  it('should render the downloads count', () => {
    renderList();

    expect(screen.getByText('6')).toBeDefined();
  });

  it('should render a link to the CV detail page', () => {
    renderList();

    const links = screen.getAllByRole('link');
    const cvLink = links.find(l => l.getAttribute('href') === '/resumes/mon-super-id');
    expect(cvLink).toBeDefined();
  });
});
