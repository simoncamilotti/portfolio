# syntax=docker/dockerfile:1
# Client image. Build context: the repository root.
ARG NODE_IMAGE=node:24.22.1-alpine@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.30-alpine@sha256:4714e0b1b2577eaa1a6131d07c958b67f0eb68e6d0521e90c6e5287db8cf0bc5

FROM ${NODE_IMAGE} AS build
ENV NX_DAEMON=false NX_NO_CLOUD=true LEFTHOOK=0
WORKDIR /repo
RUN corepack enable
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
RUN pnpm exec nx build client

FROM ${NGINX_IMAGE} AS runtime
COPY config/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/dist/apps/client/ /usr/share/nginx/html/
# Empty config.js placeholder: the real one is mounted by the k3s deployment.
USER root
RUN touch /usr/share/nginx/html/config.js && chown nginx:nginx /usr/share/nginx/html/config.js
USER nginx
EXPOSE 8080
