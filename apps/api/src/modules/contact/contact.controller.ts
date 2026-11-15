import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator.js';
import { ContactRequestDto } from '@repo/contracts/server';

import { ContactService } from './contact.service.js';

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
