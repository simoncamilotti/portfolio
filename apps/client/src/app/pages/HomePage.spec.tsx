import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { HomePage } from './HomePage';

const mockIsEnabled = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: undefined }),
}));

vi.mock('../modules/feature-flags/hooks/use-feature-flags.hook', () => ({
  useFeatureFlags: () => ({ isEnabled: mockIsEnabled, loading: false }),
}));

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
  PageLayout: ({ children }: { children: ReactNode }) => <div data-testid="page-layout">{children}</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    mockIsEnabled.mockReturnValue(false);
  });

  it('should render within a PageLayout', () => {
    render(<HomePage />);

    expect(screen.getByTestId('page-layout')).toBeDefined();
  });

  it('should render the HeroSection', () => {
    render(<HomePage />);

    expect(screen.getByTestId('hero-section')).toBeDefined();
  });

  it('should not render ProjectsSection when projects flag is disabled', () => {
    render(<HomePage />);

    expect(screen.queryByTestId('projects-section')).toBeNull();
  });

  it('should not render ProjectsSection when projects flag is enabled but no projects', () => {
    mockIsEnabled.mockReturnValue(true);
    render(<HomePage />);

    expect(screen.queryByTestId('projects-section')).toBeNull();
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
