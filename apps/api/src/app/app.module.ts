import { Module } from '@nestjs/common';
import { CoreModule } from '@portfolio/core';

import { ResumeController } from './controlles/resume.controller';
import { ResumeService } from './services/resume.service';

@Module({
  imports: [CoreModule],
  controllers: [ResumeController],
  providers: [ResumeService],
})
export class AppModule {}
