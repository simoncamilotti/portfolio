import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('HeroSection', () => {
  it('should render the main heading', async () => {
    const { HeroSection } = await import('./HeroSection');

    render(<HeroSection />);

    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getByText('Software Engineer')).toBeDefined();
  });

  it('should render the availability badge', async () => {
    const { HeroSection } = await import('./HeroSection');

    render(<HeroSection />);

    expect(screen.getByText('Disponible')).toBeDefined();
  });

  it('should render the CV link', async () => {
    const { HeroSection } = await import('./HeroSection');

    render(<HeroSection />);

    expect(screen.getByText('Voir mon CV').getAttribute('href')).toBe('#resume');
  });

  it('should render social links', async () => {
    const { HeroSection } = await import('./HeroSection');

    render(<HeroSection />);

    const links = screen.getAllByRole('link');
    const githubLink = links.find(l => l.getAttribute('href')?.includes('github.com'));
    const linkedinLink = links.find(l => l.getAttribute('href')?.includes('linkedin.com'));

    expect(githubLink).toBeDefined();
    expect(linkedinLink).toBeDefined();
  });
});
