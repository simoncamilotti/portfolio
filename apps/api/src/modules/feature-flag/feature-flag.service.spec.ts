import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../common/database/prisma.service.js';

import { FeatureFlagMapper } from './feature-flag.mapper.js';
import { FeatureFlagService } from './feature-flag.service.js';

const mockPrismaService = {
  featureFlag: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

const mockFeatureFlagMapper = {
  toFeatureFlagDto: vi.fn(),
  toFeatureFlagDtoList: vi.fn(),
};

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: FeatureFlagMapper, useValue: mockFeatureFlagMapper },
      ],
    }).compile();

    service = module.get<FeatureFlagService>(FeatureFlagService);
  });

  describe('findAll', () => {
    it('should return all feature flags via mapper', async () => {
      const dbFlags = [
        { key: 'projects', enabled: true, createdAt: new Date(), updatedAt: new Date() },
        { key: 'blog', enabled: false, createdAt: new Date(), updatedAt: new Date() },
      ];
      const mappedFlags = [
        { key: 'projects', enabled: true },
        { key: 'blog', enabled: false },
      ];
      mockPrismaService.featureFlag.findMany.mockResolvedValue(dbFlags);
      mockFeatureFlagMapper.toFeatureFlagDtoList.mockReturnValue(mappedFlags);

      const result = await service.findAll();

      expect(result).toEqual(mappedFlags);
      expect(mockPrismaService.featureFlag.findMany).toHaveBeenCalled();
      expect(mockFeatureFlagMapper.toFeatureFlagDtoList).toHaveBeenCalledWith(dbFlags);
    });

    it('should return an empty array when no flags exist', async () => {
      mockPrismaService.featureFlag.findMany.mockResolvedValue([]);
      mockFeatureFlagMapper.toFeatureFlagDtoList.mockReturnValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a feature flag and return it via mapper', async () => {
      const dbFlag = {
        key: 'projects',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mappedFlag = { key: 'projects', enabled: true };
      mockPrismaService.featureFlag.findUnique.mockResolvedValue(dbFlag);
      mockPrismaService.featureFlag.update.mockResolvedValue(dbFlag);
      mockFeatureFlagMapper.toFeatureFlagDto.mockReturnValue(mappedFlag);

      const result = await service.update('projects', { enabled: true });

      expect(result).toEqual(mappedFlag);
      expect(mockPrismaService.featureFlag.findUnique).toHaveBeenCalledWith({
        where: { key: 'projects' },
      });
      expect(mockPrismaService.featureFlag.update).toHaveBeenCalledWith({
        where: { key: 'projects' },
        data: { enabled: true },
      });
      expect(mockFeatureFlagMapper.toFeatureFlagDto).toHaveBeenCalledWith(dbFlag);
    });

    it('should throw NotFoundException if flag does not exist', async () => {
      mockPrismaService.featureFlag.findUnique.mockResolvedValue(null);

      await expect(service.update('unknown', { enabled: true })).rejects.toThrow(NotFoundException);
    });
  });
});
