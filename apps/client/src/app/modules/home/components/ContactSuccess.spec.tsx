import { fireEvent, render, screen } from '@testing-library/react';

import { ContactSuccess } from './ContactSuccess';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('ContactSuccess', () => {
  const setStatus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the success title', () => {
    render(<ContactSuccess setStatus={setStatus} />);

    expect(screen.getByText('contact.success.title')).toBeDefined();
  });

  it('should render the success description', () => {
    render(<ContactSuccess setStatus={setStatus} />);

    expect(screen.getByText('contact.success.description')).toBeDefined();
  });

  it('should render the "send another" button', () => {
    render(<ContactSuccess setStatus={setStatus} />);

    expect(screen.getByText('contact.success.another')).toBeDefined();
  });

  it('should call setStatus with idle when clicking the button', () => {
    render(<ContactSuccess setStatus={setStatus} />);

    fireEvent.click(screen.getByText('contact.success.another'));

    expect(setStatus).toHaveBeenCalledWith('idle');
  });
});
