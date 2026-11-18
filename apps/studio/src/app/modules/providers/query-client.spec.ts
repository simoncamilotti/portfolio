import { ApiError } from '@repo/api-client';

import { createQueryClient } from './query-client.js';

const problem = (status: number) => new ApiError({ type: 'about:blank', title: 'Error', status });

describe('createQueryClient', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { pathname: '/resumes', href: '/resumes' },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('should redirect to /forbidden when a query gets a 401', async () => {
    const queryClient = createQueryClient();

    await queryClient
      .fetchQuery({ queryKey: ['x'], queryFn: () => Promise.reject(problem(401)) })
      .catch(() => undefined);

    expect(window.location.href).toBe('/forbidden');
  });

  it('should not redirect on other errors', async () => {
    const queryClient = createQueryClient();

    await queryClient
      .fetchQuery({ queryKey: ['x'], queryFn: () => Promise.reject(problem(500)) })
      .catch(() => undefined);

    expect(window.location.href).toBe('/resumes');
  });

  it('should not redirect when already on /forbidden', async () => {
    window.location.pathname = '/forbidden';
    window.location.href = '/forbidden?from=x';
    const queryClient = createQueryClient();

    await queryClient
      .fetchQuery({ queryKey: ['x'], queryFn: () => Promise.reject(problem(401)) })
      .catch(() => undefined);

    expect(window.location.href).toBe('/forbidden?from=x');
  });
});
