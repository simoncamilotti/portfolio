import { fireEvent, render, screen } from '@testing-library/react';

const mockOnSubmit = vi.fn((e: any) => e.preventDefault());

vi.mock('../hooks/use-create-resume-form.hook', () => ({
  useCreateResumeForm: vi.fn(() => ({
    control: {} as any,
    isValid: true,
    onSubmit: mockOnSubmit,
  })),
}));

vi.mock('react-hook-form', () => ({
  Controller: ({ render: renderFn }: any) =>
    renderFn({ field: { value: '', onChange: vi.fn(), onBlur: vi.fn(), name: 'title', ref: vi.fn() } }),
}));

import { useCreateResumeForm } from '../hooks/use-create-resume-form.hook';
import { CreateResumeForm } from './CreateResumeForm';

const mockedUseCreateResumeForm = vi.mocked(useCreateResumeForm);

describe('CreateResumeForm', () => {
  const defaultProps = {
    resumes: [{ id: '1', title: 'Existing', isPublic: false, shareEnabled: false, updatedAt: '2026-01-01' }] as any[],
    onSuccess: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseCreateResumeForm.mockReturnValue({
      control: {} as any,
      isValid: true,
      onSubmit: mockOnSubmit,
    });
  });

  it('should render the title input', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Titre du CV...')).toBeDefined();
  });

  it('should render the description textarea', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByPlaceholderText('Description (optionnelle)...')).toBeDefined();
  });

  it('should render the submit button', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Créer' })).toBeDefined();
  });

  it('should render the cancel button', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Annuler' })).toBeDefined();
  });

  it('should call onClose when cancel is clicked', () => {
    render(<CreateResumeForm {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: 'Annuler' }));

    expect(defaultProps.onClose).toHaveBeenCalledOnce();
  });

  it('should disable submit button when form is invalid', () => {
    mockedUseCreateResumeForm.mockReturnValue({
      control: {} as any,
      isValid: false,
      onSubmit: mockOnSubmit,
    });

    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Créer' }).hasAttribute('disabled')).toBe(true);
  });

  it('should enable submit button when form is valid', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'Créer' }).hasAttribute('disabled')).toBe(false);
  });

  it('should pass already taken resume names to the hook', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(mockedUseCreateResumeForm).toHaveBeenCalledWith(
      expect.objectContaining({
        alreadyTakenResumeNames: ['Existing'],
      }),
    );
  });

  it('should pass onSuccess to the hook', () => {
    render(<CreateResumeForm {...defaultProps} />);

    expect(mockedUseCreateResumeForm).toHaveBeenCalledWith(
      expect.objectContaining({
        onSuccess: defaultProps.onSuccess,
      }),
    );
  });

  it('should handle empty resumes list', () => {
    render(<CreateResumeForm {...defaultProps} resumes={undefined} />);

    expect(mockedUseCreateResumeForm).toHaveBeenCalledWith(
      expect.objectContaining({
        alreadyTakenResumeNames: [],
      }),
    );
  });
});
