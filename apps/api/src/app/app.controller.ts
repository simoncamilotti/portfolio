import { Controller, Get } from '@nestjs/common';

import type { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get()
  getData() {
    return this._appService.getData();
  }
}
