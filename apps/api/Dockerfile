# ---------- Stage 1: Install dependencies ----------
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY libs/api/core/src/prisma/schema.prisma libs/api/core/src/prisma/schema.prisma
COPY prisma.config.ts prisma.config.ts
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --schema=libs/api/core/src/prisma/schema.prisma

# ---------- Stage 2: Build ----------
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build api --configuration=production

# ---------- Stage 3: Production ----------
FROM node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV TZ=Etc/UTC

COPY --from=build /app/dist/apps/api ./
COPY --from=build /app/package-lock.json ./
RUN npm ci --omit=dev

# Prisma client (runtime)
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Prisma CLI (needed for migrate deploy at startup), pinned to the lockfile versions
RUN npm install --no-save \
  prisma@$(node -p "require('./package-lock.json').packages['node_modules/prisma'].version") \
  dotenv@$(node -p "require('./package-lock.json').packages['node_modules/dotenv'].version")

# Prisma schema, config & migrations
COPY prisma.config.ts prisma.config.ts
COPY libs/api/core/src/prisma/schema.prisma libs/api/core/src/prisma/schema.prisma
COPY libs/api/core/src/prisma/migrations libs/api/core/src/prisma/migrations

COPY apps/api/entrypoint.sh entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./entrypoint.sh"]
