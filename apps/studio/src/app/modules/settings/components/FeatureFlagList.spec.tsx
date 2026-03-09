import { fireEvent, render, screen } from '@testing-library/react';

const mockFlags = [
  { key: 'projects', enabled: true },
  { key: 'blog', enabled: false },
];

const mockMutate = vi.fn();
const mockUseQuery = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: (...args: unknown[]) => mockUseQuery(...args),
  useMutation: ({ mutationFn, onMutate, onSuccess }: any) => ({
    mutate: (vars: any) => {
      onMutate?.(vars);
      onSuccess?.(vars, vars);
      mockMutate(vars);
    },
    isPending: false,
  }),
  useQueryClient: () => ({
    setQueryData: vi.fn(),
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock('../../ui/sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { FeatureFlagList } from './FeatureFlagList';

describe('FeatureFlagList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQuery.mockReturnValue({ data: mockFlags, isPending: false });
  });

  it('should render the list of feature flags', () => {
    render(<FeatureFlagList />);

    expect(screen.getByText('projects')).toBeDefined();
    expect(screen.getByText('blog')).toBeDefined();
  });

  it('should render toggle switches with correct state', () => {
    render(<FeatureFlagList />);

    const switches = screen.getAllByRole('switch');
    expect(switches[0].getAttribute('aria-checked')).toBe('true');
    expect(switches[1].getAttribute('aria-checked')).toBe('false');
  });

  it('should call mutation when toggling a flag', () => {
    render(<FeatureFlagList />);

    const switches = screen.getAllByRole('switch');
    fireEvent.click(switches[0]);

    expect(mockMutate).toHaveBeenCalledWith({ key: 'projects', enabled: false });
  });

  it('should render the add form', () => {
    render(<FeatureFlagList />);

    expect(screen.getByPlaceholderText('Nom du flag (ex: projects)')).toBeDefined();
    expect(screen.getByText('Ajouter')).toBeDefined();
  });

  it('should submit the new flag form', () => {
    render(<FeatureFlagList />);

    const input = screen.getByPlaceholderText('Nom du flag (ex: projects)');
    fireEvent.change(input, { target: { value: 'new-flag' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockMutate).toHaveBeenCalledWith('new-flag');
  });

  it('should show empty state when no flags exist', () => {
    mockUseQuery.mockReturnValue({ data: [], isPending: false });

    render(<FeatureFlagList />);

    expect(screen.getByText('Aucun feature flag configuré.')).toBeDefined();
  });

  it('should show loading skeleton while fetching', () => {
    mockUseQuery.mockReturnValue({ data: undefined, isPending: true });

    render(<FeatureFlagList />);

    expect(screen.queryByText('projects')).toBeNull();
  });
});
