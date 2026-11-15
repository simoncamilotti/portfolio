import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiNoContentResponse } from '@nestjs/swagger';
import { type ContactRequestDto, contactRequestDtoSchema } from '@repo/contracts';

import { Public } from '../../common/auth/public.decorator.js';
import { ContactService } from './contact.service.js';

@Controller('contact')
export class ContactController {
  constructor(private readonly _contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async sendMessage(
    @Body({ schema: contactRequestDtoSchema }) dto: ContactRequestDto,
  ): Promise<void> {
    await this._contactService.sendContactEmail(dto);
  }
}
