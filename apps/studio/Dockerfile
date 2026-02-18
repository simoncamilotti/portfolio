# ---------- Stage 1: Install dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ---------- Stage 2: Build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx nx build studio --configuration=production

# ---------- Stage 3: Production ----------
FROM nginxinc/nginx-unprivileged:alpine AS prod

COPY ../../config/studio/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/studio/ /usr/share/nginx/html/

# Empty config.js placeholder — will be mounted via k3s volume at runtime
USER root
RUN touch /usr/share/nginx/html/config.js && chown nginx:nginx /usr/share/nginx/html/config.js
USER nginx

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
