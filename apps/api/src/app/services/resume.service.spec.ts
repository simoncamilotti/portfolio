import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@portfolio/core';

import { ResumeMapper } from '../mappers/resume.mapper';
import { ResumeService } from './resume.service';

const mockPrismaService = {
  resume: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockResumeMapper = {
  toResumeDto: jest.fn(),
  toResumeDtoList: jest.fn(),
  toResumeDetailDto: jest.fn(),
};

const mockResume = {
  id: 'uuid-1',
  title: 'Mon CV',
  description: 'Description',
  content: 'Contenu',
  isPublic: false,
  shareEnabled: false,
  views: 0,
  downloads: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockResumeDetailDto = {
  id: 'uuid-1',
  title: 'Mon CV',
  description: 'Description',
  content: 'Contenu',
  isPublic: false,
  shareEnabled: false,
  updatedAt: '2026-01-01T00:00:00.000Z',
  views: 0,
  downloads: 0,
};

describe('ResumeService', () => {
  let service: ResumeService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResumeService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ResumeMapper, useValue: mockResumeMapper },
      ],
    }).compile();

    service = module.get<ResumeService>(ResumeService);
  });

  describe('findAll', () => {
    it('should return an array of resumes', async () => {
      const mappedResult = [
        {
          id: 'uuid-1',
          title: 'Mon CV',
          description: 'Description',
          isPublic: false,
          shareEnabled: false,
          updatedAt: '2026-01-01',
        },
      ];
      mockPrismaService.resume.findMany.mockResolvedValue([mockResume]);
      mockResumeMapper.toResumeDtoList.mockReturnValue(mappedResult);

      const result = await service.findAll();

      expect(result).toEqual(mappedResult);
      expect(mockPrismaService.resume.findMany).toHaveBeenCalled();
      expect(mockResumeMapper.toResumeDtoList).toHaveBeenCalledWith([mockResume]);
    });

    it('should return an empty array', async () => {
      mockPrismaService.resume.findMany.mockResolvedValue([]);
      mockResumeMapper.toResumeDtoList.mockReturnValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockResumeMapper.toResumeDtoList).toHaveBeenCalledWith([]);
    });
  });

  describe('findPublic', () => {
    it('should return the first public resume as detail DTO', async () => {
      const publicResume = { ...mockResume, isPublic: true };
      mockPrismaService.resume.findFirst.mockResolvedValue(publicResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValue({ ...mockResumeDetailDto, isPublic: true });

      const result = await service.findPublic();

      expect(result).toEqual({ ...mockResumeDetailDto, isPublic: true });
      expect(mockPrismaService.resume.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true },
      });
      expect(mockResumeMapper.toResumeDetailDto).toHaveBeenCalledWith(publicResume);
    });

    it('should throw NotFoundException if no public resume exists', async () => {
      mockPrismaService.resume.findFirst.mockResolvedValue(null);

      await expect(service.findPublic()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a resume detail DTO by id', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValue(mockResumeDetailDto);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockResumeDetailDto);
      expect(mockPrismaService.resume.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(mockResumeMapper.toResumeDetailDto).toHaveBeenCalledWith(mockResume);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.findOne('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a resume detail DTO', async () => {
      const dto = { title: 'Mon CV', content: 'Contenu', isPublic: false };
      mockPrismaService.resume.create.mockResolvedValue(mockResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValue(mockResumeDetailDto);

      const result = await service.create(dto);

      expect(result).toEqual(mockResumeDetailDto);
      expect(mockPrismaService.resume.create).toHaveBeenCalledWith({ data: dto });
      expect(mockResumeMapper.toResumeDetailDto).toHaveBeenCalledWith(mockResume);
    });
  });

  describe('update', () => {
    it('should update and return the resume detail DTO', async () => {
      const dto = { title: 'CV Mis à jour', content: 'Nouveau contenu', isPublic: false };
      const updatedResume = { ...mockResume, ...dto };
      const updatedDto = { ...mockResumeDetailDto, ...dto };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue(updatedResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValueOnce(mockResumeDetailDto).mockReturnValueOnce(updatedDto);

      const result = await service.update('uuid-1', dto);

      expect(result).toEqual(updatedDto);
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: dto,
      });
    });

    it('should throw NotFoundException if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.update('uuid-999', { title: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('setPublic', () => {
    it('should unpublish existing public resume and publish the target', async () => {
      const dto = { isPublic: true };
      const currentPublicResume = { ...mockResume, id: 'uuid-public', isPublic: true };
      const updatedResume = { ...mockResume, ...dto };
      const updatedDto = { ...mockResumeDetailDto, isPublic: true };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.findFirst.mockResolvedValue(currentPublicResume);
      mockPrismaService.resume.update.mockResolvedValue(updatedResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValueOnce(mockResumeDetailDto).mockReturnValueOnce(updatedDto);

      const result = await service.setPublic('uuid-1', dto);

      expect(result).toEqual(updatedDto);
      expect(mockPrismaService.resume.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true },
      });
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: currentPublicResume.id },
        data: { isPublic: false },
      });
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: dto,
      });
    });

    it('should publish even when no current public resume exists', async () => {
      const dto = { isPublic: true };
      const updatedResume = { ...mockResume, ...dto };
      const updatedDto = { ...mockResumeDetailDto, isPublic: true };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.findFirst.mockResolvedValue(null);
      mockPrismaService.resume.update.mockResolvedValue(updatedResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValueOnce(mockResumeDetailDto).mockReturnValueOnce(updatedDto);

      const result = await service.setPublic('uuid-1', dto);

      expect(result).toEqual(updatedDto);
      expect(mockPrismaService.resume.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true },
      });
      expect(mockPrismaService.resume.update).toHaveBeenCalledTimes(1);
    });

    it('should unpublish without looking for current public resume', async () => {
      const dto = { isPublic: false };
      const updatedResume = { ...mockResume, isPublic: false };
      const updatedDto = { ...mockResumeDetailDto, isPublic: false };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue(updatedResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValueOnce(mockResumeDetailDto).mockReturnValueOnce(updatedDto);

      const result = await service.setPublic('uuid-1', dto);

      expect(result).toEqual(updatedDto);
      expect(mockPrismaService.resume.findFirst).not.toHaveBeenCalled();
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: dto,
      });
    });

    it('should throw NotFoundException if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.setPublic('uuid-999', { isPublic: true })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.delete.mockResolvedValue(mockResume);
      mockResumeMapper.toResumeDetailDto.mockReturnValue(mockResumeDetailDto);

      await service.remove('uuid-1');

      expect(mockPrismaService.resume.delete).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    });

    it('should throw NotFoundException if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.remove('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });
});
