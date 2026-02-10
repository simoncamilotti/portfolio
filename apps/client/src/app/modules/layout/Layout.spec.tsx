import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Layout } from './Layout';

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

    expect(screen.getByText('Dashboard').getAttribute('href')).toBe('/dashboard');
    expect(screen.getByText('Projets').getAttribute('href')).toBe('#projects');
  });
});
