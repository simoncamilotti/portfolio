import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CoreModule } from '@portfolio/core';

import { ContactController } from './controllers/contact.controller';
import { FeatureFlagController } from './controllers/feature-flag.controller';
import { ProjectController } from './controllers/project.controller';
import { ResumeController } from './controllers/resume.controller';
import { FeatureFlagMapper } from './mappers/feature-flag.mapper';
import { ProjectMapper } from './mappers/project.mapper';
import { ResumeMapper } from './mappers/resume.mapper';
import { ContactService } from './services/contact.service';
import { FeatureFlagService } from './services/feature-flag.service';
import { ProjectService } from './services/project.service';
import { ResumeService } from './services/resume.service';

@Module({
  imports: [CoreModule, HttpModule],
  controllers: [ResumeController, ContactController, FeatureFlagController, ProjectController],
  providers: [
    ResumeService,
    ResumeMapper,
    ContactService,
    FeatureFlagService,
    FeatureFlagMapper,
    ProjectService,
    ProjectMapper,
  ],
})
export class AppModule {}
