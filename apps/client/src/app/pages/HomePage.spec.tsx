import { render, screen } from '@testing-library/react';

import { HomePage } from './HomePage.js';

const mockIsEnabled = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn().mockReturnValue({ data: undefined }),
}));

vi.mock('../modules/feature-flags/hooks/use-feature-flags.hook.js', () => ({
  useFeatureFlags: () => ({ isEnabled: mockIsEnabled, loading: false }),
}));

vi.mock('../modules/home/components/HeroSection.js', () => ({
  HeroSection: () => <div data-testid="hero-section" />,
}));

vi.mock('../modules/home/components/ProjectSection.js', () => ({
  ProjectsSection: () => <div data-testid="projects-section" />,
}));

vi.mock('../modules/home/components/PublicResume.js', () => ({
  PublicResume: () => <div data-testid="public-resume" />,
}));

vi.mock('../modules/home/components/ContactSection.js', () => ({
  ContactSection: () => <div data-testid="contact-section" />,
}));

describe('HomePage', () => {
  beforeEach(() => {
    mockIsEnabled.mockReturnValue(false);
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
