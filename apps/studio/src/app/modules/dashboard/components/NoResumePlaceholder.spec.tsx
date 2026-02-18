import { render } from '@testing-library/react';

import { NoResumePlaceholder } from './NoResumePlaceholder';

describe('NoResumePlaceholder', () => {
  it('should render the placeholder container', () => {
    const { container } = render(<NoResumePlaceholder />);

    expect(container.firstChild).toBeDefined();
  });

  it('should render an SVG icon', () => {
    const { container } = render(<NoResumePlaceholder />);

    expect(container.querySelector('svg')).toBeDefined();
  });
});
