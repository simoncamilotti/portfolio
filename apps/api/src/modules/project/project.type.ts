import type { Prisma } from '../../generated/prisma/client.js';

export type ProjectWithTags = Prisma.ProjectGetPayload<{ include: { tags: true } }>;
