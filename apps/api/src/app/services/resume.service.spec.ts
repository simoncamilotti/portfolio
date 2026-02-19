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
  toGetAllResumesResponseDto: jest.fn(),
};

const mockResume = {
  id: 'uuid-1',
  title: 'Mon CV',
  description: 'Description',
  content: 'Contenu',
  isPublic: false,
  createdAt: new Date(),
  updatedAt: new Date(),
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
      mockResumeMapper.toGetAllResumesResponseDto.mockReturnValue(mappedResult);

      const result = await service.findAll();

      expect(result).toEqual(mappedResult);
      expect(mockPrismaService.resume.findMany).toHaveBeenCalled();
      expect(mockResumeMapper.toGetAllResumesResponseDto).toHaveBeenCalledWith([mockResume]);
    });

    it('should return an empty array', async () => {
      mockPrismaService.resume.findMany.mockResolvedValue([]);
      mockResumeMapper.toGetAllResumesResponseDto.mockReturnValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(mockResumeMapper.toGetAllResumesResponseDto).toHaveBeenCalledWith([]);
    });
  });

  describe('findPublic', () => {
    it('should return the first public resume', async () => {
      const publicResume = { ...mockResume, isPublic: true };
      mockPrismaService.resume.findFirst.mockResolvedValue(publicResume);

      const result = await service.findPublic();

      expect(result).toEqual(publicResume);
      expect(mockPrismaService.resume.findFirst).toHaveBeenCalledWith({
        where: { isPublic: true },
      });
    });

    it('should throw NotFoundException if no public resume exists', async () => {
      mockPrismaService.resume.findFirst.mockResolvedValue(null);

      await expect(service.findPublic()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a resume by id', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(mockResume);
      expect(mockPrismaService.resume.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.findOne('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a resume', async () => {
      const dto = { title: 'Mon CV', content: 'Contenu', isPublic: false };
      mockPrismaService.resume.create.mockResolvedValue(mockResume);

      const result = await service.create(dto);

      expect(result).toEqual(mockResume);
      expect(mockPrismaService.resume.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('update', () => {
    it('should update and return the resume', async () => {
      const dto = { title: 'CV Mis à jour', content: 'Nouveau contenu', isPublic: true };
      const updatedResume = { ...mockResume, ...dto };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.update.mockResolvedValue(updatedResume);

      const result = await service.update('uuid-1', dto);

      expect(result).toEqual(updatedResume);
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: dto,
      });
    });

    it('should throw NotFoundException if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.update('uuid-999', { title: 'Test', content: 'C', isPublic: false })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the resume', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);
      mockPrismaService.resume.delete.mockResolvedValue(mockResume);

      await service.remove('uuid-1');

      expect(mockPrismaService.resume.delete).toHaveBeenCalledWith({ where: { id: 'uuid-1' } });
    });

    it('should throw NotFoundException if resume not found', async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);

      await expect(service.remove('uuid-999')).rejects.toThrow(NotFoundException);
    });
  });
});
