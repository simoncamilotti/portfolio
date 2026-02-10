import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('DashboardResumeList', () => {
  it('should render the resume title', async () => {
    const { DashboardResumeList } = await import('./DashboardResumeList');

    render(
      <MemoryRouter>
        <DashboardResumeList />
      </MemoryRouter>,
    );

    expect(screen.getByText('CV number 1')).toBeDefined();
  });

  it('should display the public badge', async () => {
    const { DashboardResumeList } = await import('./DashboardResumeList');

    render(
      <MemoryRouter>
        <DashboardResumeList />
      </MemoryRouter>,
    );

    expect(screen.getByText('Public')).toBeDefined();
  });

  it('should display the shared badge', async () => {
    const { DashboardResumeList } = await import('./DashboardResumeList');

    render(
      <MemoryRouter>
        <DashboardResumeList />
      </MemoryRouter>,
    );

    expect(screen.getByText('Partagé')).toBeDefined();
  });

  it('should display the formatted date', async () => {
    const { DashboardResumeList } = await import('./DashboardResumeList');

    render(
      <MemoryRouter>
        <DashboardResumeList />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Modifié le/)).toBeDefined();
  });
});
