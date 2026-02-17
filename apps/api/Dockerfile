# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY libs/api/core/src/prisma/schema.prisma libs/api/core/src/prisma/schema.prisma
COPY prisma.config.ts prisma.config.ts
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --schema=libs/api/core/src/prisma/schema.prisma

# ---------- Stage 2: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build api --configuration=production

# ---------- Stage 3: Production ----------
FROM node:20-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Etc/UTC

COPY --from=build /app/dist/apps/api ./
RUN npm ci --omit=dev

COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

CMD ["node", "main.js"]
