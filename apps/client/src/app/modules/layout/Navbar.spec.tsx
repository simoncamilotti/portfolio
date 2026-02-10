import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Navbar } from './Navbar';

describe('Navbar', () => {
  const renderNavbar = () =>
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

  it('should render a link to home', () => {
    renderNavbar();

    const links = screen.getAllByRole('link');
    const homeLink = links.find(link => link.getAttribute('href') === '/');
    expect(homeLink).toBeDefined();
  });

  it('should render navigation anchors', () => {
    renderNavbar();

    expect(screen.getByText('Projets').getAttribute('href')).toBe('#projects');
    expect(screen.getByText('CV').getAttribute('href')).toBe('#resume');
  });

  it('should render a link to dashboard', () => {
    renderNavbar();

    const dashboardLink = screen.getByText('Dashboard');
    expect(dashboardLink.getAttribute('href')).toBe('/dashboard');
  });
});
