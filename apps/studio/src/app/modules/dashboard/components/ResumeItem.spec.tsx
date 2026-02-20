import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('./ResumeItemMenu', () => ({
  ResumeItemMenu: () => <div data-testid="resume-item-menu" />,
}));

import { ResumeItem } from './ResumeItem';

const baseResume = {
  id: '1',
  title: 'Mon CV',
  isPublic: false,
  shareEnabled: false,
  updatedAt: '2026-01-15T10:00:00.000Z',
  views: 42,
  downloads: 7,
};

const renderResumeItem = (resume = baseResume, resumeIndex = 0) =>
  render(
    <MemoryRouter>
      <ResumeItem resume={resume as any} resumeIndex={resumeIndex} />
    </MemoryRouter>,
  );

describe('ResumeItem', () => {
  it('should render the resume title', () => {
    renderResumeItem();

    expect(screen.getByText('Mon CV')).toBeDefined();
  });

  it('should render the formatted date', () => {
    renderResumeItem();

    expect(screen.getByText(/15 janv\. 2026/)).toBeDefined();
  });

  it('should render the views count', () => {
    renderResumeItem();

    expect(screen.getByText('42')).toBeDefined();
  });

  it('should render the downloads count', () => {
    renderResumeItem();

    expect(screen.getByText('7')).toBeDefined();
  });

  it('should render a link to the resume page', () => {
    renderResumeItem();

    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/resumes/1');
  });

  it('should show the Public badge when isPublic is true', () => {
    renderResumeItem({ ...baseResume, isPublic: true });

    expect(screen.getByText('Public')).toBeDefined();
  });

  it('should not show the Public badge when isPublic is false', () => {
    renderResumeItem();

    expect(screen.queryByText('Public')).toBeNull();
  });

  it('should show the Partagé badge when shareEnabled is true', () => {
    renderResumeItem({ ...baseResume, shareEnabled: true });

    expect(screen.getByText('Partagé')).toBeDefined();
  });

  it('should not show the Partagé badge when shareEnabled is false', () => {
    renderResumeItem();

    expect(screen.queryByText('Partagé')).toBeNull();
  });

  it('should render the ResumeItemMenu', () => {
    renderResumeItem();

    expect(screen.getByTestId('resume-item-menu')).toBeDefined();
  });
});
