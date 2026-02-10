import { render, screen } from '@testing-library/react';

import { ResumePage } from './ResumePage';

describe('ResumePage', () => {
  it('should render the resumes heading', () => {
    render(<ResumePage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Resumes');
  });
});
