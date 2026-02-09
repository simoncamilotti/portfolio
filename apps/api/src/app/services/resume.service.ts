import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@portfolio/core';
import { CreateResumeRequestDto, UpdateResumeRequestDto } from '@portfolio/shared-models';
import { Resume } from '@prisma/client';

@Injectable()
export class ResumeService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findAll(): Promise<Resume[]> {
    return this._prismaService.resume.findMany();
  }

  async findPublic(): Promise<Resume> {
    const resume = await this._prismaService.resume.findFirst({
      where: {
        isPublic: true,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Public resume not found`);
    }

    return resume;
  }

  async findOne(id: string): Promise<Resume> {
    const resume = await this._prismaService.resume.findUnique({
      where: {
        id,
      },
    });

    if (!resume) {
      throw new NotFoundException(`Resume #${id} not found`);
    }

    return resume;
  }

  async create(dto: CreateResumeRequestDto): Promise<Resume> {
    return this._prismaService.resume.create({
      data: dto,
    });
  }

  async update(id: string, dto: UpdateResumeRequestDto): Promise<Resume> {
    await this.findOne(id);
    return this._prismaService.resume.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this._prismaService.resume.delete({ where: { id: id } });
  }
}
