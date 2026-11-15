import { Module } from '@nestjs/common';

import { ProjectController } from './project.controller.js';
import { ProjectMapper } from './project.mapper.js';
import { ProjectService } from './project.service.js';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, ProjectMapper],
})
export class ProjectModule {}
