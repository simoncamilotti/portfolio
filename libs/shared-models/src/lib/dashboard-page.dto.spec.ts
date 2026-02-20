import { updateResumeSchema } from './dashboard-page.dto';
import { createResumeRequestDtoSchema } from './dashboard-page.dto';

describe('DashboardPageDto', () => {
  describe('createResumeSchema', () => {
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
});
