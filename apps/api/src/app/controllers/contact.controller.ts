import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@portfolio/core';
import { ContactRequestDto } from '@portfolio/shared-models/server';

import { ContactService } from '../services/contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly _contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async sendMessage(@Body() dto: ContactRequestDto): Promise<void> {
    await this._contactService.sendContactEmail(dto);
  }
}
