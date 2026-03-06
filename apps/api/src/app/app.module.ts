import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from '@portfolio/core';

import { ContactController } from './controllers/contact.controller';
import { ResumeController } from './controllers/resume.controller';
import { ResumeMapper } from './mappers/resume.mapper';
import { ContactService } from './services/contact.service';
import { ResumeService } from './services/resume.service';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [ResumeController, ContactController],
  providers: [ResumeService, ResumeMapper, ContactService],
})
export class AppModule {}
