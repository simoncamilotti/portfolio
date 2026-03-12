import { fireEvent, render, screen } from '@testing-library/react';

const mockMutateAsync = vi.fn().mockResolvedValue(undefined);

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, string>) => (params ? `${key} ${JSON.stringify(params)}` : key),
  }),
}));

vi.mock('@portfolio/shared-ui', () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('../hooks/use-delete-project-mutation.hook', () => ({
  useDeleteProjectMutation: () => ({
    deleteProjectMutation: { mutateAsync: mockMutateAsync },
  }),
}));

import { DeleteProjectDialog } from './DeleteProjectDialog';

const project = { id: '1', title: 'My Project', description: '', tags: [], repoUrl: '', url: '' };

describe('DeleteProjectDialog', () => {
  const onOpenChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when open is false', () => {
    render(<DeleteProjectDialog project={project} open={false} onOpenChange={onOpenChange} />);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('should render dialog content when open', () => {
    render(<DeleteProjectDialog project={project} open={true} onOpenChange={onOpenChange} />);

    expect(screen.getByTestId('dialog')).toBeDefined();
    expect(screen.getByText('projects.dialog.deleteTitle')).toBeDefined();
  });

  it('should render cancel and confirm buttons', () => {
    render(<DeleteProjectDialog project={project} open={true} onOpenChange={onOpenChange} />);

    expect(screen.getByText('projects.form.cancel')).toBeDefined();
    expect(screen.getByText('projects.dialog.deleteConfirm')).toBeDefined();
  });

  it('should call onOpenChange with false when clicking cancel', () => {
    render(<DeleteProjectDialog project={project} open={true} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByText('projects.form.cancel'));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should call mutateAsync and close dialog when confirming delete', async () => {
    render(<DeleteProjectDialog project={project} open={true} onOpenChange={onOpenChange} />);

    fireEvent.click(screen.getByText('projects.dialog.deleteConfirm'));

    await vi.waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });
});
