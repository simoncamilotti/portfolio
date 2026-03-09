import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import type { ContactRequestDto } from '@portfolio/shared-models/server';
import { firstValueFrom, map } from 'rxjs';

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
};

@Injectable()
export class ContactService {
  private readonly _logger = new Logger(ContactService.name);

  constructor(
    private readonly _httpService: HttpService,
    private readonly _mailerService: MailerService,
  ) {}

  async sendContactEmail(dto: ContactRequestDto): Promise<void> {
    await this._verifyCaptcha(dto.captchaToken);
    await this._sendEmail(dto);
  }

  private async _verifyCaptcha(token: string): Promise<void> {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      throw new BadRequestException('reCAPTCHA is not configured');
    }

    const response = await firstValueFrom(
      this._httpService
        .post<RecaptchaResponse>(
          'https://www.google.com/recaptcha/api/siteverify',
          new URLSearchParams({ secret: secretKey, response: token }),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .pipe(map(response => response.data)),
    );

    if (!response.success || (response.score !== undefined && response.score < 0.5)) {
      this._logger.warn(`reCAPTCHA verification failed: score=${response.score}, errors=${response['error-codes']}`);
      throw new BadRequestException('reCAPTCHA verification failed');
    }
  }

  private async _sendEmail(dto: ContactRequestDto): Promise<void> {
    const date = new Date().toLocaleDateString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    this._mailerService
      .sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.CONTACT_EMAIL_TO,
        subject: `[Portfolio] ${dto.subject}`,
        template: 'contact-template',
        context: {
          logo: '{}',
          date,
          subject: dto.subject,
          name: dto.name,
          email: dto.email,
          message: dto.message,
        },
      })
      .catch(err => {
        this._logger.error('Failed to send contact email', err);
      });
  }
}
