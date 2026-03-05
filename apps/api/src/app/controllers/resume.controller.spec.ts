import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ResumeService } from '../services/resume.service';
import { ResumeController } from './resume.controller';

const mockResumeService = {
  findAll: jest.fn(),
  findPublic: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  setPublic: jest.fn(),
  remove: jest.fn(),
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

describe('ResumeController', () => {
  let controller: ResumeController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResumeController],
      providers: [{ provide: ResumeService, useValue: mockResumeService }],
    }).compile();

    controller = module.get<ResumeController>(ResumeController);
  });

  it('findAll() should delegate to service and return the result', async () => {
    mockResumeService.findAll.mockResolvedValue([mockResume]);

    const result = await controller.findAll();

    expect(result).toEqual([mockResume]);
    expect(mockResumeService.findAll).toHaveBeenCalled();
  });

  it('findPublic() should delegate to service', async () => {
    const publicResume = { ...mockResume, isPublic: true };
    mockResumeService.findPublic.mockResolvedValue(publicResume);

    const result = await controller.findPublic();

    expect(result).toEqual(publicResume);
    expect(mockResumeService.findPublic).toHaveBeenCalled();
  });

  it('findOne(id) should delegate with the id', async () => {
    mockResumeService.findOne.mockResolvedValue(mockResume);

    const result = await controller.findOne('uuid-1');

    expect(result).toEqual(mockResume);
    expect(mockResumeService.findOne).toHaveBeenCalledWith('uuid-1');
  });

  it('create(dto) should delegate with the dto', async () => {
    const dto = { title: 'Mon CV', content: 'Contenu', isPublic: false };
    mockResumeService.create.mockResolvedValue(mockResume);

    const result = await controller.create(dto);

    expect(result).toEqual(mockResume);
    expect(mockResumeService.create).toHaveBeenCalledWith(dto);
  });

  it('update(id, dto) should delegate with id and dto', async () => {
    const dto = { title: 'CV Mis à jour', content: 'Nouveau contenu', isPublic: true };
    const updatedResume = { ...mockResume, ...dto };
    mockResumeService.update.mockResolvedValue(updatedResume);

    const result = await controller.update('uuid-1', dto);

    expect(result).toEqual(updatedResume);
    expect(mockResumeService.update).toHaveBeenCalledWith('uuid-1', dto);
  });

  it('setPublic(id, dto) should delegate with id and dto', async () => {
    const dto = { isPublic: true };
    const updatedResume = { ...mockResume, isPublic: true };
    mockResumeService.setPublic.mockResolvedValue(updatedResume);

    const result = await controller.setPublic('uuid-1', dto);

    expect(result).toEqual(updatedResume);
    expect(mockResumeService.setPublic).toHaveBeenCalledWith('uuid-1', dto);
  });

  it('remove(id) should delegate with the id', async () => {
    mockResumeService.remove.mockResolvedValue(undefined);

    await controller.remove('uuid-1');

    expect(mockResumeService.remove).toHaveBeenCalledWith('uuid-1');
  });

  it('should propagate NotFoundException from service', async () => {
    mockResumeService.findOne.mockRejectedValue(new NotFoundException('Resume #uuid-999 not found'));

    await expect(controller.findOne('uuid-999')).rejects.toThrow(NotFoundException);
  });
});
