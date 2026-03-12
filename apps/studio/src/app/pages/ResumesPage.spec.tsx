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

vi.mock('../modules/resumes/components/ResumeHeader', () => ({
  ResumeHeader: ({ setCreateOpen }: { setCreateOpen: (v: boolean) => void }) => (
    <button data-testid="resumes-header" onClick={() => setCreateOpen(true)}>
      Nouveau CV
    </button>
  ),
}));

vi.mock('../modules/resumes/components/ResumeList', () => ({
  ResumeList: () => <div data-testid="resume-list" />,
}));

vi.mock('../modules/resumes/components/CreateResumeDialog', () => ({
  CreateResumeDialog: ({ open }: { open: boolean }) =>
    open ? <div role="dialog" data-testid="create-dialog" /> : null,
}));

vi.mock('../modules/layout/PageBreadcrumb', () => ({
  PageBreadcrumb: ({ breadcrumbItems }: { breadcrumbItems: Array<{ title: string }> }) => (
    <nav data-testid="page-breadcrumb">{breadcrumbItems.map(i => i.title).join(' / ')}</nav>
  ),
}));

import { ResumesPage } from './ResumesPage';

describe('ResumesPage', () => {
  it('should render the PageBreadcrumb', () => {
    render(<ResumesPage />);

    expect(screen.getByTestId('page-breadcrumb')).toBeDefined();
  });

  it('should render the ResumeHeader', () => {
    render(<ResumesPage />);

    expect(screen.getByTestId('resumes-header')).toBeDefined();
  });

  it('should render the ResumeList', () => {
    render(<ResumesPage />);

    expect(screen.getByTestId('resume-list')).toBeDefined();
  });

  it('should open the create dialog when header triggers it', () => {
    render(<ResumesPage />);

    fireEvent.click(screen.getByTestId('resumes-header'));

    expect(screen.getByRole('dialog')).toBeDefined();
  });
});
