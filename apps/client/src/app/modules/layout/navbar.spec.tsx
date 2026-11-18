import { render, screen } from '@testing-library/react';

import { Navbar } from './navbar.js';

const mockIsEnabled = vi.fn();

vi.mock('../feature-flags/hooks/use-feature-flags.hook.js', () => ({
  useFeatureFlags: () => ({ isEnabled: mockIsEnabled, loading: false }),
}));

describe('Navbar', () => {
  const renderNavbar = () => render(<Navbar />);

  beforeEach(() => {
    mockIsEnabled.mockReturnValue(false);
  });

  it('should render a link to home', () => {
    renderNavbar();

    const links = screen.getAllByRole('link');
    const homeLink = links.find((link) => link.getAttribute('href') === '/');
    expect(homeLink).toBeDefined();
  });

  it('should render CV and Contact anchors', () => {
    renderNavbar();

    expect(screen.getByText('CV').getAttribute('href')).toBe('#resume');
    expect(screen.getByText('Contact').getAttribute('href')).toBe('#contact');
  });

  it('should not render Projets link when projects flag is disabled', () => {
    renderNavbar();

    expect(screen.queryByText('Projets')).toBeNull();
  });

  it('should render Projets link when projects flag is enabled', () => {
    mockIsEnabled.mockImplementation((key: string) => key === 'projects');

    renderNavbar();

    expect(screen.getByText('Projets').getAttribute('href')).toBe('#projects');
  });
});
