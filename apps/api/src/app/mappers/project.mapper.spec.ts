import { ProjectMapper } from './project.mapper';

const makeProject = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'My Project',
  description: 'A description',
  url: 'https://example.com',
  repoUrl: 'https://github.com/example/repo',
  imageUrl: 'https://example.com/image.png',
  tags: [{ title: 'TypeScript' }, { title: 'NestJS' }],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('ProjectMapper', () => {
  let mapper: ProjectMapper;

  beforeEach(() => {
    mapper = new ProjectMapper();
  });

  describe('toProjectDto', () => {
    it('should map a project with tags to a DTO', () => {
      const project = makeProject();

      const result = mapper.toProjectDto(project);

      expect(result).toEqual({
        id: project.id,
        title: project.title,
        description: project.description,
        tags: ['TypeScript', 'NestJS'],
        url: project.url,
        repoUrl: project.repoUrl,
        imageUrl: project.imageUrl,
      });
    });

    it('should map tags to an array of tag titles', () => {
      const project = makeProject({ tags: [{ title: 'React' }, { title: 'Vite' }] });

      const result = mapper.toProjectDto(project);

      expect(result.tags).toEqual(['React', 'Vite']);
    });

    it('should handle an empty tags array', () => {
      const project = makeProject({ tags: [] });

      const result = mapper.toProjectDto(project);

      expect(result.tags).toEqual([]);
    });

    it('should map null optional fields as null', () => {
      const project = makeProject({ description: null, url: null, repoUrl: null, imageUrl: null });

      const result = mapper.toProjectDto(project);

      expect(result.description).toBeNull();
      expect(result.url).toBeNull();
      expect(result.repoUrl).toBeNull();
      expect(result.imageUrl).toBeNull();
    });
  });

  describe('toProjectDtoList', () => {
    it('should map an array of projects to DTOs', () => {
      const projects = [makeProject({ id: '1', title: 'Project 1' }), makeProject({ id: '2', title: 'Project 2' })];

      const result = mapper.toProjectDtoList(projects);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Project 1');
      expect(result[1].title).toBe('Project 2');
    });

    it('should return an empty array when given an empty array', () => {
      const result = mapper.toProjectDtoList([]);

      expect(result).toEqual([]);
    });
  });
});
