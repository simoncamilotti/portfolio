import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import { of } from 'rxjs';

import { ContactService } from './contact.service';

const mockDto = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test subject',
  message: 'This is a test message with enough characters',
  captchaToken: 'test-token',
};

const mockHttpService = {
  post: jest.fn(),
};

const mockMailerService = {
  sendMail: jest.fn().mockResolvedValue(undefined),
};

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    jest.clearAllMocks();

    process.env.RECAPTCHA_SECRET_KEY = 'test-secret';
    process.env.SMTP_FROM = 'test@example.com';
    process.env.CONTACT_EMAIL_TO = 'contact@example.com';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: MailerService, useValue: mockMailerService },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
  });

  afterEach(() => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    delete process.env.SMTP_FROM;
    delete process.env.CONTACT_EMAIL_TO;
  });

  it('should throw BadRequestException when reCAPTCHA secret key is not configured', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;

    await expect(service.sendContactEmail(mockDto)).rejects.toThrow(BadRequestException);
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
        from: 'test@example.com',
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
