import type { ProjectDto } from '@repo/contracts';
import { render, screen } from '@testing-library/react';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, whileInView, viewport, transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
}));

describe('ProjectsSection', () => {
  it('should render the projects heading', async () => {
    const { ProjectsSection } = await import('./ProjectSection.js');

    render(<ProjectsSection projects={[]} />);

    expect(screen.getByText('Projets')).toBeDefined();
  });

  it('should render project items', async () => {
    const { ProjectsSection } = await import('./ProjectSection.js');
    const projects = [{ title: 'Project A' }, { title: 'Project B' }] as ProjectDto[];

    render(<ProjectsSection projects={projects} />);

    expect(screen.getByText('Project A')).toBeDefined();
    expect(screen.getByText('Project B')).toBeDefined();
  });

  it('should set the correct section id', async () => {
    const { ProjectsSection } = await import('./ProjectSection.js');

    const { container } = render(<ProjectsSection projects={[]} />);

    expect(container.querySelector('#projects')).toBeDefined();
  });
});
