import { Test, TestingModule } from '@nestjs/testing';

import { ProjectService } from '../services/project.service';
import { ProjectController } from './project.controller';

const mockProjectService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const makeMappedDto = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'My Project',
  description: 'A description',
  tags: ['TypeScript', 'NestJS'],
  url: 'https://example.com',
  repoUrl: 'https://github.com/example/repo',
  imageUrl: 'https://example.com/image.png',
  ...overrides,
});

describe('ProjectController', () => {
  let controller: ProjectController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectController],
      providers: [{ provide: ProjectService, useValue: mockProjectService }],
    }).compile();

    controller = module.get<ProjectController>(ProjectController);
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [makeMappedDto(), makeMappedDto({ id: '2', title: 'Project 2' })];
      mockProjectService.findAll.mockResolvedValue(projects);

      const result = await controller.findAll();

      expect(result).toEqual(projects);
      expect(mockProjectService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single project by id', async () => {
      const project = makeMappedDto();
      mockProjectService.findOne.mockResolvedValue(project);

      const result = await controller.findOne(project.id);

      expect(result).toEqual(project);
      expect(mockProjectService.findOne).toHaveBeenCalledWith(project.id);
    });

    it('should propagate errors from service', async () => {
      mockProjectService.findOne.mockRejectedValue(new Error('Not found'));

      await expect(controller.findOne('bad-id')).rejects.toThrow('Not found');
    });
  });

  describe('create', () => {
    it('should delegate creation to service and return the result', async () => {
      const createDto = { title: 'New', tags: ['TS'], description: 'Desc' };
      const created = makeMappedDto({ title: 'New', tags: ['TS'] });
      mockProjectService.create.mockResolvedValue(created);

      const result = await controller.create(createDto);

      expect(result).toEqual(created);
      expect(mockProjectService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should delegate update to service with id and dto', async () => {
      const updateDto = { title: 'Updated', tags: ['React'] };
      const updated = makeMappedDto({ title: 'Updated', tags: ['React'] });
      mockProjectService.update.mockResolvedValue(updated);

      const result = await controller.update('550e8400-e29b-41d4-a716-446655440000', updateDto);

      expect(result).toEqual(updated);
      expect(mockProjectService.update).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000', updateDto);
    });

    it('should propagate errors from service', async () => {
      mockProjectService.update.mockRejectedValue(new Error('DB error'));

      await expect(controller.update('id', { title: 'X', tags: [] })).rejects.toThrow('DB error');
    });
  });

  describe('remove', () => {
    it('should delegate removal to service', async () => {
      mockProjectService.remove.mockResolvedValue(undefined);

      await controller.remove('550e8400-e29b-41d4-a716-446655440000');

      expect(mockProjectService.remove).toHaveBeenCalledWith('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should propagate errors from service', async () => {
      mockProjectService.remove.mockRejectedValue(new Error('Not found'));

      await expect(controller.remove('bad-id')).rejects.toThrow('Not found');
    });
  });
});
