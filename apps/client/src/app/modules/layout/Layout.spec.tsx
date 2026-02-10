import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Layout } from './Layout';

describe('Layout', () => {
  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const cvLink = screen.getByRole('link', { name: 'CV' });

    expect(homeLink.getAttribute('href')).toBe('/');
    expect(cvLink.getAttribute('href')).toBe('/resumes');
  });
});
