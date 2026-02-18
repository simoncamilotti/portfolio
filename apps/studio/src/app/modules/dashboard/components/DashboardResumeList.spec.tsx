import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

import { DashboardResumeList } from './DashboardResumeList';

describe('DashboardResumeList', () => {
  const renderList = () =>
    render(
      <MemoryRouter>
        <DashboardResumeList />
      </MemoryRouter>,
    );

  it('should render the resume title', () => {
    renderList();

    expect(screen.getByText('CV number 1')).toBeDefined();
  });

  it('should render the public badge when resume is public', () => {
    renderList();

    expect(screen.getByText('Public')).toBeDefined();
  });

  it('should render the shared badge when share is enabled', () => {
    renderList();

    expect(screen.getByText('Partagé')).toBeDefined();
  });

  it('should render the views count', () => {
    renderList();

    expect(screen.getByText('12')).toBeDefined();
  });

  it('should render the downloads count', () => {
    renderList();

    expect(screen.getByText('6')).toBeDefined();
  });

  it('should render a link to the CV detail page', () => {
    renderList();

    const links = screen.getAllByRole('link');
    const cvLink = links.find(l => l.getAttribute('href') === '/cv/mon-super-id');
    expect(cvLink).toBeDefined();
  });
});
