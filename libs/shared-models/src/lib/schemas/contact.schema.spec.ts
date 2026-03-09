import { contactRequestDtoSchema } from './contact.schema';

describe('ContactRequestDto', () => {
  const validInput = {
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Test subject',
    message: 'This is a test message with enough characters',
    captchaToken: 'test-token',
  };

  it('should accept a valid complete input', () => {
    const result = contactRequestDtoSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it('should reject if name is missing', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name: _, ...input } = validInput;

    const result = contactRequestDtoSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should reject if name is empty', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, name: '' });

    expect(result.success).toBe(false);
  });

  it('should reject if name exceeds 100 characters', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, name: 'a'.repeat(101) });

    expect(result.success).toBe(false);
  });

  it('should reject if email is missing', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { email: _, ...input } = validInput;

    const result = contactRequestDtoSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should reject if email is invalid', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, email: 'not-an-email' });

    expect(result.success).toBe(false);
  });

  it('should reject if email exceeds 255 characters', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, email: `${'a'.repeat(244)}@example.com` });

    expect(result.success).toBe(false);
  });

  it('should reject if subject is missing', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { subject: _, ...input } = validInput;

    const result = contactRequestDtoSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should reject if subject is empty', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, subject: '' });

    expect(result.success).toBe(false);
  });

  it('should reject if subject exceeds 200 characters', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, subject: 'a'.repeat(201) });

    expect(result.success).toBe(false);
  });

  it('should reject if message is missing', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { message: _, ...input } = validInput;

    const result = contactRequestDtoSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should reject if message is too short', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, message: 'short' });

    expect(result.success).toBe(false);
  });

  it('should reject if message exceeds 5000 characters', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, message: 'a'.repeat(5001) });

    expect(result.success).toBe(false);
  });

  it('should reject if captchaToken is missing', () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { captchaToken: _, ...input } = validInput;

    const result = contactRequestDtoSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should reject if captchaToken is empty', () => {
    const result = contactRequestDtoSchema.safeParse({ ...validInput, captchaToken: '' });

    expect(result.success).toBe(false);
  });
});
