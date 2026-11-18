import { render, screen } from '@testing-library/react';

import { Navbar } from './navbar.js';

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({ signoutRedirect: vi.fn() }),
}));

describe('Navbar', () => {
  const renderNavbar = () => render(<Navbar />);

  it('should render a link to dashboard', () => {
    renderNavbar();

    const links = screen.getAllByRole('link');
    const homeLink = links.find((link) => link.getAttribute('href') === '/');
    expect(homeLink).toBeDefined();
  });

  it('should render the logout button', () => {
    renderNavbar();

    expect(screen.getByRole('button', { name: 'Déconnexion' })).toBeDefined();
  });

  it('should not render navigation anchors', () => {
    renderNavbar();

    expect(screen.queryByText('CV')).toBeNull();
  });
});
