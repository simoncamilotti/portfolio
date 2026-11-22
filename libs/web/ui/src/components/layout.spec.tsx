import { render, screen } from '@testing-library/react';

import { Layout } from './layout.js';

vi.mock('./footer.js', () => ({
  Footer: () => <footer data-testid="footer" />,
}));

vi.mock('./sonner.js', () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe('Layout', () => {
  it('should render the Navbar', () => {
    render(<Layout navBar={<nav data-testid="navbar" />} />);

    expect(screen.getByTestId('navbar')).toBeDefined();
  });

  it('should render the page', () => {
    render(
      <Layout navBar={<nav data-testid="navbar" />}>
        <div data-testid="page" />
      </Layout>,
    );

    expect(screen.getByTestId('page')).toBeDefined();
  });

  it('should render the Footer', () => {
    render(<Layout navBar={<nav data-testid="navbar" />} />);

    expect(screen.getByTestId('footer')).toBeDefined();
  });
});
