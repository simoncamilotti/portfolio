import { render, screen } from '@testing-library/react';

import { HomePage } from './HomePage';

describe('HomePage', () => {
  it('should render the homepage heading', () => {
    render(<HomePage />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe('Homepage');
  });
});
