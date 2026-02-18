import { render, screen } from '@testing-library/react';

import { PageLayout } from './PageLayout';

describe('PageLayout', () => {
  it('should render children', () => {
    render(
      <PageLayout>
        <div data-testid="child">Content</div>
      </PageLayout>,
    );

    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('should render the footer', () => {
    render(<PageLayout />);

    expect(screen.getByText(/Tous droits réservés/)).toBeDefined();
  });
});
