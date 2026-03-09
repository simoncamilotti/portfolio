import { createResumeRequestDtoSchema, updateResumeRequestDtoSchema } from './resume.schema';

describe('ResumeSchema', () => {
  describe('createResumeRequestDtoSchema', () => {
    const validInput = {
      title: 'Mon CV',
      content: 'Contenu du CV',
      description: 'Une description',
      isPublic: true,
    };

    it('should accept a valid complete input', () => {
      const result = createResumeRequestDtoSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it('should accept input with optional description omitted', () => {
      const { description, ...input } = validInput;

      const result = createResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(expect.objectContaining({ title: 'Mon CV' }));
    });

    it('should default isPublic to false', () => {
      const { isPublic, ...input } = validInput;

      const result = createResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(true);
      expect(result.data?.isPublic).toBe(false);
    });

    it('should reject a title shorter than 3 characters', () => {
      const result = createResumeRequestDtoSchema.safeParse({ ...validInput, title: 'AB' });

      expect(result.success).toBe(false);
    });

    it('should reject a title longer than 50 characters', () => {
      const result = createResumeRequestDtoSchema.safeParse({ ...validInput, title: 'A'.repeat(51) });

      expect(result.success).toBe(false);
    });

    it('should reject if title is missing', () => {
      const { title, ...input } = validInput;

      const result = createResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(false);
    });

    it('should accept if content is missing (optional)', () => {
      const { content, ...input } = validInput;

      const result = createResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should reject if title is not a string', () => {
      const result = createResumeRequestDtoSchema.safeParse({ ...validInput, title: 123 });

      expect(result.success).toBe(false);
    });

    it('should reject if isPublic is not a boolean', () => {
      const result = createResumeRequestDtoSchema.safeParse({ ...validInput, isPublic: 'yes' });

      expect(result.success).toBe(false);
    });
  });

  describe('updateResumeRequestDtoSchema', () => {
    const validInput = {
      title: 'Mon CV',
      content: 'Contenu du CV',
      description: 'Une description',
      isPublic: true,
    };

    it('should accept a valid complete input', () => {
      const result = updateResumeRequestDtoSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it('should accept an empty object (all fields optional for PATCH)', () => {
      const result = updateResumeRequestDtoSchema.safeParse({});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });

    it('should accept input with only title', () => {
      const result = updateResumeRequestDtoSchema.safeParse({ title: 'Mon CV' });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ title: 'Mon CV' });
    });

    it('should accept input without content (optional for PATCH)', () => {
      const { content, ...input } = validInput;

      const result = updateResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(true);
    });

    it('should reject a title shorter than 3 characters', () => {
      const result = updateResumeRequestDtoSchema.safeParse({ ...validInput, title: 'AB' });

      expect(result.success).toBe(false);
    });

    it('should accept input with optional description omitted', () => {
      const { description, ...input } = validInput;

      const result = updateResumeRequestDtoSchema.safeParse(input);

      expect(result.success).toBe(true);
      expect(result.data).not.toHaveProperty('description');
    });
  });
});
