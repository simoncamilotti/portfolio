# syntax=docker/dockerfile:1
# API image. Build context: the repository root.
ARG NODE_IMAGE=node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53

FROM ${NODE_IMAGE} AS build
ENV NX_DAEMON=false NX_NO_CLOUD=true LEFTHOOK=0
WORKDIR /repo
RUN corepack enable
# Dependencies first: this layer is reused as long as the lockfile does not change.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm exec nx build api

# `generatePackageJson` emits a package.json and a lockfile holding only what the bundle imports.
# Added on top, pinned to the workspace versions: tslib (the tsc helpers of the bundle) and the
# Prisma CLI (entrypoint.sh runs `prisma migrate deploy`).
# Adding them installs the rest from the pruned lockfile.
WORKDIR /repo/dist/apps/api
RUN version() { node -p "require('/repo/node_modules/$1/package.json').version"; } \
 && pnpm --dir . add --workspace-root "tslib@$(version tslib)" "prisma@$(version prisma)"
RUN cp /repo/prisma.config.ts . \
 && mkdir -p libs/api/core/src \
 && cp -r /repo/libs/api/core/src/prisma libs/api/core/src/prisma \
 && node_modules/.bin/prisma generate

FROM ${NODE_IMAGE} AS runtime
# The Prisma schema engine, used by `prisma migrate deploy`, needs OpenSSL.
RUN apk add --no-cache openssl
ENV NODE_ENV=production TZ=Etc/UTC
WORKDIR /app
COPY --from=build --chown=node:node /repo/dist/apps/api ./
COPY --chmod=755 apps/api/entrypoint.sh entrypoint.sh
USER node
EXPOSE 3000
ENTRYPOINT ["./entrypoint.sh"]
