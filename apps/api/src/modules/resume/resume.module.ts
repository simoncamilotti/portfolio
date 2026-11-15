import { Module } from '@nestjs/common';

import { ResumeController } from './resume.controller.js';
import { ResumeMapper } from './resume.mapper.js';
import { ResumeService } from './resume.service.js';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService, ResumeMapper],
})
export class ResumeModule {}
