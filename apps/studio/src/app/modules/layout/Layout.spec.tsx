import { render, screen } from '@testing-library/react';

vi.mock('react-router', () => ({
  Outlet: () => <div data-testid="outlet" />,
}));

vi.mock('./Navbar', () => ({
  Navbar: () => <nav data-testid="navbar" />,
}));

vi.mock('@portfolio/shared-ui', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

vi.mock('../ui/sonner', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

import { Layout } from './Layout';

describe('Layout', () => {
  it('should render the Navbar', () => {
    render(<Layout />);

    expect(screen.getByTestId('navbar')).toBeDefined();
  });

  it('should render the Outlet', () => {
    render(<Layout />);

    expect(screen.getByTestId('outlet')).toBeDefined();
  });

  it('should render the Footer', () => {
    render(<Layout />);

    expect(screen.getByTestId('footer')).toBeDefined();
  });
});
