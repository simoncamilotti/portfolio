import { Prisma } from '@prisma/client';

const prismaProjectWithTags = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: {
    tags: true,
  },
});

export type ProjectWithTags = Prisma.ProjectGetPayload<typeof prismaProjectWithTags>;
