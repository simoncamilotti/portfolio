import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('../auth/auth', () => ({
  logout: vi.fn(),
}));

import { Layout } from './Layout';

describe('Layout', () => {
  const renderLayout = () =>
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );

  it('should render the navbar', () => {
    renderLayout();

    expect(screen.getByRole('navigation')).toBeDefined();
  });

  it('should render the logout button', () => {
    renderLayout();

    expect(screen.getByRole('button', { name: 'Logout' })).toBeDefined();
  });
});
