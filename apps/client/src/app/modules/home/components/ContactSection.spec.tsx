import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';

import { ContactSection } from './ContactSection';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui: ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

describe('ContactSection', () => {
  beforeAll(() => {
    window.config = { captcha: { siteKey: 'test-site-key' } };
  });
  it('should render the Contact heading', () => {
    renderWithProviders(<ContactSection />);

    expect(screen.getByText('Contact')).toBeDefined();
  });

  it('should have the correct section id', () => {
    renderWithProviders(<ContactSection />);

    const section = document.getElementById('contact');
    expect(section).toBeDefined();
  });

  it('should render form fields', () => {
    renderWithProviders(<ContactSection />);

    expect(screen.getByPlaceholderText('Votre nom')).toBeDefined();
    expect(screen.getByPlaceholderText('Votre email')).toBeDefined();
    expect(screen.getByPlaceholderText('Sujet')).toBeDefined();
    expect(screen.getByPlaceholderText('Votre message')).toBeDefined();
  });

  it('should render the submit button', () => {
    renderWithProviders(<ContactSection />);

    expect(screen.getByText('Envoyer')).toBeDefined();
  });
});
