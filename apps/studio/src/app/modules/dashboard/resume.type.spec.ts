import { createResumeFormSchema } from './resume.type';

describe('createResumeFormSchema', () => {
  it('should accept a valid form with title and description', () => {
    const result = createResumeFormSchema.safeParse({ title: 'Mon CV', description: 'Description' });

    expect(result.success).toBe(true);
  });

  it('should accept a form with title only', () => {
    const result = createResumeFormSchema.safeParse({ title: 'Mon CV' });

    expect(result.success).toBe(true);
  });

  it('should reject a form with empty title', () => {
    const result = createResumeFormSchema.safeParse({ title: '' });

    expect(result.success).toBe(false);
  });

  it('should reject a form without title', () => {
    const result = createResumeFormSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('should accept an empty description', () => {
    const result = createResumeFormSchema.safeParse({ title: 'CV', description: '' });

    expect(result.success).toBe(true);
  });
});
