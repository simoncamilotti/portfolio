import type { AxiosError } from 'axios';
import axios from 'axios';

const validDto = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test subject',
  message: 'This is a test message with enough characters',
  captchaToken: 'test-token',
};

describe('POST /api/contact', () => {
  it('should be accessible without authentication', async () => {
    const error = await axios.post('/api/contact', validDto).catch((e: AxiosError) => e);

    // Should not be 401/403 since the route is public
    if (axios.isAxiosError(error)) {
      expect(error.response?.status).not.toBe(401);
      expect(error.response?.status).not.toBe(403);
    }
  });

  it('should return 400 when body is empty', async () => {
    const error = await axios.post('/api/contact', {}).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when name is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name: _, ...dto } = validDto;
    const error = await axios.post('/api/contact', dto).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when email is invalid', async () => {
    const error = await axios.post('/api/contact', { ...validDto, email: 'not-an-email' }).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when subject is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { subject: _, ...dto } = validDto;
    const error = await axios.post('/api/contact', dto).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when message is too short', async () => {
    const error = await axios.post('/api/contact', { ...validDto, message: 'short' }).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when captchaToken is missing', async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { captchaToken: _, ...dto } = validDto;
    const error = await axios.post('/api/contact', dto).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 when name exceeds max length', async () => {
    const error = await axios.post('/api/contact', { ...validDto, name: 'a'.repeat(101) }).catch((e: AxiosError) => e);

    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });

  it('should return 400 with an invalid captcha token', async () => {
    const error = await axios.post('/api/contact', validDto).catch((e: AxiosError) => e);

    // reCAPTCHA verification will fail with a fake token → 400
    expect(axios.isAxiosError(error)).toBe(true);
    expect((error as AxiosError).response?.status).toBe(400);
  });
});
