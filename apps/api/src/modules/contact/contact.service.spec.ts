import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { of } from 'rxjs';

import { ContactService } from './contact.service.js';

const mockDto = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test subject',
  message: 'This is a test message with enough characters',
  captchaToken: 'test-token',
};

const mockHttpService = {
  post: vi.fn(),
};

const config: Record<string, string> = {
  RECAPTCHA_SECRET_KEY: 'test-secret',
  CONTACT_EMAIL_TO: 'contact@example.com',
};

const mockConfigService = {
  get: (key: string) => config[key],
};

const mockMailerService = {
  sendMail: vi.fn().mockResolvedValue(undefined),
};

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    vi.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: MailerService, useValue: mockMailerService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  it('should throw BadRequestException when reCAPTCHA score is too low', async () => {
    mockHttpService.post.mockReturnValue(of({ data: { success: true, score: 0.3 } }));

    await expect(service.sendContactEmail(mockDto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when reCAPTCHA verification fails', async () => {
    mockHttpService.post.mockReturnValue(of({ data: { success: false } }));

    await expect(service.sendContactEmail(mockDto)).rejects.toThrow(BadRequestException);
  });

  it('should send email when captcha is valid', async () => {
    mockHttpService.post.mockReturnValue(of({ data: { success: true, score: 0.9 } }));

    await service.sendContactEmail(mockDto);

    expect(mockMailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'contact@example.com',
        subject: '[Portfolio] Test subject',
        template: 'contact-template',
      }),
    );
  });

  it('should call reCAPTCHA API with correct parameters', async () => {
    mockHttpService.post.mockReturnValue(of({ data: { success: true, score: 0.9 } }));

    await service.sendContactEmail(mockDto);

    expect(mockHttpService.post).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.any(URLSearchParams),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  });
});
