import { render } from '@testing-library/react';

import { NoResumePlaceholder } from './NoResumePlaceholder';

describe('NoResumePlaceholder', () => {
  it('should render a placeholder element', () => {
    const { container } = render(<NoResumePlaceholder />);

    expect(container.querySelector('svg')).toBeDefined();
  });
});
