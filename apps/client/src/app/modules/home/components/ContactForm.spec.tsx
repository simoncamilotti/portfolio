import { render, screen } from '@testing-library/react';

import { ContactForm } from './ContactForm';

const mockOnSubmit = vi.fn((e: Event) => e.preventDefault());

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../hooks/use-contact-form.hook', () => ({
  useContactForm: () => ({
    isValid: true,
    recaptchaLoaded: { current: false },
    control: undefined,
    onSubmit: mockOnSubmit,
  }),
}));

vi.mock('react-hook-form', () => ({
  Controller: ({ render: renderFn, name }: any) =>
    renderFn({
      field: { name, value: '', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() },
      fieldState: {},
    }),
}));

describe('ContactForm', () => {
  beforeAll(() => {
    window.config = { captcha: { siteKey: '' } };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<ContactForm status="idle" setStatus={vi.fn()} />);

    expect(screen.getByPlaceholderText('contact.form.name')).toBeDefined();
    expect(screen.getByPlaceholderText('contact.form.email')).toBeDefined();
    expect(screen.getByPlaceholderText('contact.form.subject')).toBeDefined();
    expect(screen.getByPlaceholderText('contact.form.message')).toBeDefined();
  });

  it('should render the submit button', () => {
    render(<ContactForm status="idle" setStatus={vi.fn()} />);

    expect(screen.getByText('contact.form.submit')).toBeDefined();
  });

  it('should disable the submit button when status is loading', () => {
    render(<ContactForm status="loading" setStatus={vi.fn()} />);

    expect(screen.getByText('contact.form.submit').closest('button')!.disabled).toBe(true);
  });

  it('should show error message when status is error', () => {
    render(<ContactForm status="error" setStatus={vi.fn()} />);

    expect(screen.getByText('contact.error')).toBeDefined();
  });

  it('should not show error message when status is idle', () => {
    render(<ContactForm status="idle" setStatus={vi.fn()} />);

    expect(screen.queryByText('contact.error')).toBeNull();
  });
});
