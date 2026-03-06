import { render, screen } from '@testing-library/react';

import { HomePage } from './HomePage';

vi.mock('../modules/home/components/HeroSection', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('../modules/home/components/ProjectSection', () => ({
  ProjectsSection: () => <div data-testid="projects-section" />,
}));

vi.mock('../modules/home/components/PublicResume', () => ({
  PublicResume: () => <div data-testid="public-resume" />,
}));

vi.mock('../modules/home/components/ContactSection', () => ({
  ContactSection: () => <div data-testid="contact-section" />,
}));

vi.mock('@portfolio/shared-ui', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="page-layout">{children}</div>,
}));

describe('HomePage', () => {
  it('should render within a PageLayout', () => {
    render(<HomePage />);

    expect(screen.getByTestId('page-layout')).toBeDefined();
  });

  it('should render the HeroSection', () => {
    render(<HomePage />);

    expect(screen.getByTestId('hero-section')).toBeDefined();
  });

  it('should render the ProjectsSection', () => {
    render(<HomePage />);

    expect(screen.getByTestId('projects-section')).toBeDefined();
  });

  it('should render the PublicResume section', () => {
    render(<HomePage />);

    expect(screen.getByTestId('public-resume')).toBeDefined();
  });

  it('should render the ContactSection', () => {
    render(<HomePage />);

    expect(screen.getByTestId('contact-section')).toBeDefined();
  });
});
