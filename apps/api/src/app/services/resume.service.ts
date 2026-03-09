import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@portfolio/core';
import type {
  CreateResumeRequestDto,
  ResumeDetailDto,
  ResumeDto,
  SetPublicResumeRequestDto,
  UpdateResumeRequestDto,
} from '@portfolio/shared-models/server';

import { ResumeMapper } from '../mappers/resume.mapper';

@Injectable()
export class ResumeService {
  constructor(
    private readonly _prismaService: PrismaService,
    private readonly _resumeMapper: ResumeMapper,
  ) {}

  async findAll(): Promise<ResumeDto[]> {
    const resumes = await this._prismaService.resume.findMany();

    return this._resumeMapper.toResumeDtoList(resumes);
  }

  async findPublic(): Promise<ResumeDetailDto> {
    const resume = await this._prismaService.resume.findFirst({
      where: {
        isPublic: true,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Public resume not found`);
    }

    return this._resumeMapper.toResumeDetailDto(resume);
  }

  async findOne(id: string): Promise<ResumeDetailDto> {
    const resume = await this._prismaService.resume.findUnique({
      where: {
        id,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Resume #${id} not found`);
    }

    return this._resumeMapper.toResumeDetailDto(resume);
  }

  async create(dto: CreateResumeRequestDto): Promise<ResumeDetailDto> {
    const resume = await this._prismaService.resume.create({
      data: dto,
    });

    return this._resumeMapper.toResumeDetailDto(resume);
  }

  async update(id: string, dto: UpdateResumeRequestDto): Promise<ResumeDetailDto> {
    await this.findOne(id);

    const resume = await this._prismaService.resume.update({
      where: {
        id,
      },
      data: dto,
    });

    return this._resumeMapper.toResumeDetailDto(resume);
  }

  async setPublic(id: string, dto: SetPublicResumeRequestDto): Promise<ResumeDetailDto> {
    await this.findOne(id);

    if (dto.isPublic) {
      const currentPublicResume = await this._prismaService.resume.findFirst({
        where: {
          isPublic: true,
        },
      });

      if (currentPublicResume) {
        await this._prismaService.resume.update({
          where: {
            id: currentPublicResume.id,
          },
          data: {
            isPublic: false,
          },
        });
      }
    }

    const resume = await this._prismaService.resume.update({
      where: {
        id,
      },
      data: dto,
    });

    return this._resumeMapper.toResumeDetailDto(resume);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this._prismaService.resume.delete({ where: { id: id } });
  }
}
