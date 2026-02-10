import { RouteAnchors, RoutePaths } from './paths.const';

describe('RoutePaths', () => {
  it('should define the correct paths', () => {
    expect(RoutePaths.HOME).toBe('/');
    expect(RoutePaths.RESUME).toBe('/resumes');
    expect(RoutePaths.DASHBOARD).toBe('/dashboard');
  });
});

describe('RouteAnchors', () => {
  it('should define home anchors', () => {
    expect(RouteAnchors.HOME.HOME).toBe('home');
    expect(RouteAnchors.HOME.PROJECTS).toBe('projects');
    expect(RouteAnchors.HOME.RESUME).toBe('resume');
  });
});
