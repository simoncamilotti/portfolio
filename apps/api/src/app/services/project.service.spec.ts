import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@portfolio/core';

import { ProjectMapper } from '../mappers/project.mapper';
import { ProjectService } from './project.service';

const mockPrismaService = {
  project: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tag: {
    deleteMany: jest.fn(),
  },
};

const mockProjectMapper = {
  toProjectDto: jest.fn(),
  toProjectDtoList: jest.fn(),
};

const makeDbProject = (overrides = {}) => ({
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

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ProjectMapper, useValue: mockProjectMapper },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  describe('findAll', () => {
    it('should return all projects via mapper', async () => {
      const dbProjects = [makeDbProject(), makeDbProject({ id: '2', title: 'Project 2' })];
      const mappedDtos = [makeMappedDto(), makeMappedDto({ id: '2', title: 'Project 2' })];
      mockPrismaService.project.findMany.mockResolvedValue(dbProjects);
      mockProjectMapper.toProjectDtoList.mockReturnValue(mappedDtos);

      const result = await service.findAll();

      expect(result).toEqual(mappedDtos);
      expect(mockPrismaService.project.findMany).toHaveBeenCalledWith({ include: { tags: true } });
      expect(mockProjectMapper.toProjectDtoList).toHaveBeenCalledWith(dbProjects);
    });

    it('should return an empty array when no projects exist', async () => {
      mockPrismaService.project.findMany.mockResolvedValue([]);
      mockProjectMapper.toProjectDtoList.mockReturnValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a project by id via mapper', async () => {
      const dbProject = makeDbProject();
      const mappedDto = makeMappedDto();
      mockPrismaService.project.findUnique.mockResolvedValue(dbProject);
      mockProjectMapper.toProjectDto.mockReturnValue(mappedDto);

      const result = await service.findOne(dbProject.id);

      expect(result).toEqual(mappedDto);
      expect(mockPrismaService.project.findUnique).toHaveBeenCalledWith({
        where: { id: dbProject.id },
        include: { tags: true },
      });
      expect(mockProjectMapper.toProjectDto).toHaveBeenCalledWith(dbProject);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a project with tags and return it via mapper', async () => {
      const createDto = {
        title: 'New Project',
        description: 'Desc',
        tags: ['TypeScript', 'NestJS'],
        url: 'https://example.com',
        repoUrl: 'https://github.com/example',
        imageUrl: 'https://example.com/img.png',
      };
      const dbProject = makeDbProject({ title: 'New Project' });
      const mappedDto = makeMappedDto({ title: 'New Project' });
      mockPrismaService.project.create.mockResolvedValue(dbProject);
      mockProjectMapper.toProjectDto.mockReturnValue(mappedDto);

      const result = await service.create(createDto);

      expect(result).toEqual(mappedDto);
      expect(mockPrismaService.project.create).toHaveBeenCalledWith({
        data: {
          title: createDto.title,
          description: createDto.description,
          url: createDto.url,
          repoUrl: createDto.repoUrl,
          imageUrl: createDto.imageUrl,
          tags: {
            connectOrCreate: [
              { where: { title: 'TypeScript' }, create: { title: 'TypeScript' } },
              { where: { title: 'NestJS' }, create: { title: 'NestJS' } },
            ],
          },
        },
        include: { tags: true },
      });
    });
  });

  describe('update', () => {
    it('should update a project with tags using set + connectOrCreate', async () => {
      const updateDto = {
        title: 'Updated Project',
        tags: ['React'],
      };
      const existingProject = makeDbProject();
      const updatedProject = makeDbProject({ title: 'Updated Project', tags: [{ title: 'React' }] });
      const mappedDto = makeMappedDto({ title: 'Updated Project', tags: ['React'] });

      mockPrismaService.project.findUnique.mockResolvedValue(existingProject);
      mockPrismaService.project.update.mockResolvedValue(updatedProject);
      mockProjectMapper.toProjectDto
        .mockReturnValueOnce(makeMappedDto()) // findOne check
        .mockReturnValueOnce(mappedDto); // update return

      const result = await service.update(existingProject.id, updateDto);

      expect(result).toEqual(mappedDto);
      expect(mockPrismaService.project.update).toHaveBeenCalledWith({
        where: { id: existingProject.id },
        data: {
          title: updateDto.title,
          description: undefined,
          url: undefined,
          repoUrl: undefined,
          imageUrl: undefined,
          tags: {
            set: [],
            connectOrCreate: [{ where: { title: 'React' }, create: { title: 'React' } }],
          },
        },
        include: { tags: true },
      });
    });

    it('should not touch tags when tags field is not provided', async () => {
      const updateDto = { title: 'Only Title Updated' };
      const existingProject = makeDbProject();
      const updatedProject = makeDbProject({ title: 'Only Title Updated' });
      const mappedDto = makeMappedDto({ title: 'Only Title Updated' });

      mockPrismaService.project.findUnique.mockResolvedValue(existingProject);
      mockPrismaService.project.update.mockResolvedValue(updatedProject);
      mockProjectMapper.toProjectDto.mockReturnValueOnce(makeMappedDto()).mockReturnValueOnce(mappedDto);

      await service.update(existingProject.id, updateDto);

      expect(mockPrismaService.project.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ tags: undefined }),
        }),
      );
    });

    it('should clean orphan tags after update', async () => {
      const existingProject = makeDbProject();
      mockPrismaService.project.findUnique.mockResolvedValue(existingProject);
      mockPrismaService.project.update.mockResolvedValue(existingProject);
      mockProjectMapper.toProjectDto.mockReturnValue(makeMappedDto());

      await service.update(existingProject.id, { tags: ['React'] });

      expect(mockPrismaService.tag.deleteMany).toHaveBeenCalledWith({
        where: { projects: { none: {} } },
      });
    });

    it('should throw NotFoundException if project to update does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent-id', { title: 'X' })).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.project.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete the project and clean orphan tags', async () => {
      const dbProject = makeDbProject();
      mockPrismaService.project.findUnique.mockResolvedValue(dbProject);
      mockProjectMapper.toProjectDto.mockReturnValue(makeMappedDto());

      await service.remove(dbProject.id);

      expect(mockPrismaService.project.delete).toHaveBeenCalledWith({ where: { id: dbProject.id } });
      expect(mockPrismaService.tag.deleteMany).toHaveBeenCalledWith({
        where: { projects: { none: {} } },
      });
    });

    it('should throw NotFoundException if project to delete does not exist', async () => {
      mockPrismaService.project.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.project.delete).not.toHaveBeenCalled();
    });
  });
});
