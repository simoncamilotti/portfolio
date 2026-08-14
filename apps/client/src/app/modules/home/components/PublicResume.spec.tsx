import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, transition, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

describe('PublicResume', () => {
  it('should render the CV heading', async () => {
    const { PublicResume } = await import('./PublicResume');

    render(<PublicResume />);

    expect(screen.getByText('Curriculum Vitae')).toBeDefined();
  });

  it('should set the correct section id', async () => {
    const { PublicResume } = await import('./PublicResume');

    const { container } = render(<PublicResume />);

    expect(container.querySelector('#resume')).toBeDefined();
  });

  it('should render the CV content', async () => {
    const { PublicResume } = await import('./PublicResume');

    render(<PublicResume />);

    expect(screen.getByText('Simon Camilotti')).toBeDefined();
    expect(screen.getByText('Développeur Full Stack Senior')).toBeDefined();
    expect(screen.getByText('Expériences')).toBeDefined();
    expect(screen.getByText('Formation')).toBeDefined();
  });
});
