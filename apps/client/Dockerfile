# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---------- Stage 2: Build ----------
FROM node:20-alpine@sha256:fb4cd12c85ee03686f6af5362a0b0d56d50c58a04632e6c0fb8363f609372293 AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build client --configuration=production

# ---------- Stage 3: Production ----------
FROM nginxinc/nginx-unprivileged:alpine@sha256:378d0c32f6562f7fd9629170797f57d2b953aa09be983b3daaf4809bb039ca00 AS prod

COPY ../../config/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/client/ /usr/share/nginx/html/

# Empty config.js placeholder — will be mounted via k3s volume at runtime
USER root
RUN touch /usr/share/nginx/html/config.js && chown nginx:nginx /usr/share/nginx/html/config.js
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
