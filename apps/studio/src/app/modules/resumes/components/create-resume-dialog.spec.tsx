import { render, screen } from '@testing-library/react';

import { CreateResumeDialog } from './create-resume-dialog.js';

vi.mock('@repo/ui/components/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
}));

vi.mock('./create-resume-form.js', () => ({
  CreateResumeForm: () => <div data-testid="create-resume-form" />,
}));

describe('CreateResumeDialog', () => {
  const defaultProps = {
    resumes: [],
    open: true,
    openChange: vi.fn(),
  };

  it('should render the dialog when open', () => {
    render(<CreateResumeDialog {...defaultProps} />);

    expect(screen.getByTestId('dialog')).toBeDefined();
  });

  it('should not render the dialog when closed', () => {
    render(<CreateResumeDialog {...defaultProps} open={false} />);

    expect(screen.queryByTestId('dialog')).toBeNull();
  });

  it('should render the title "Nouveau CV"', () => {
    render(<CreateResumeDialog {...defaultProps} />);

    expect(screen.getByTestId('dialog-title').textContent).toBe('Nouveau CV');
  });

  it('should render the CreateResumeForm', () => {
    render(<CreateResumeDialog {...defaultProps} />);

    expect(screen.getByTestId('create-resume-form')).toBeDefined();
  });
});
