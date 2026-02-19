import { render } from '@testing-library/react';

import { Braces } from './Braces';

describe('Braces', () => {
  it('should render an SVG element', () => {
    const { container } = render(<Braces />);

    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
    expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
  });
});
