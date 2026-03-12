import { render, screen } from '@testing-library/react';

vi.mock('@portfolio/shared-ui', () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
}));

vi.mock('./CreateResumeForm', () => ({
  CreateResumeForm: () => <div data-testid="create-resume-form" />,
}));

import { CreateResumeDialog } from './CreateResumeDialog';

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
