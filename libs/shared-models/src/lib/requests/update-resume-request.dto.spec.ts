import { updateResumeSchema } from './update-resume-request.dto';

describe('updateResumeSchema', () => {
  const validInput = {
    title: 'Mon CV',
    content: 'Contenu du CV',
    description: 'Une description',
    isPublic: true,
  };

  it('should accept a valid input', () => {
    const result = updateResumeSchema.safeParse(validInput);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(validInput);
  });

  it('should default isPublic to false', () => {
    const { isPublic, ...input } = validInput;

    const result = updateResumeSchema.safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data?.isPublic).toBe(false);
  });

  it('should reject a title shorter than 3 characters', () => {
    const result = updateResumeSchema.safeParse({ ...validInput, title: 'AB' });

    expect(result.success).toBe(false);
  });

  it('should reject if content is missing', () => {
    const { content, ...input } = validInput;

    const result = updateResumeSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('should accept input with optional description omitted', () => {
    const { description, ...input } = validInput;

    const result = updateResumeSchema.safeParse(input);

    expect(result.success).toBe(true);
    expect(result.data).not.toHaveProperty('description');
  });
});
