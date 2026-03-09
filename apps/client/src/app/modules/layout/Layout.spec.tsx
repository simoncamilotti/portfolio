import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Layout } from './Layout';

vi.mock('../feature-flags/providers/FeatureFlagsContext', () => ({
  FeatureFlagsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../feature-flags/hooks/use-feature-flags.hook', () => ({
  useFeatureFlags: () => ({ isEnabled: () => false, loading: false }),
}));

describe('Layout', () => {
  it('should render the navbar', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );

    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );

    expect(screen.getByText('CV').getAttribute('href')).toBe('#resume');
    expect(screen.getByText('Contact').getAttribute('href')).toBe('#contact');
  });
});
