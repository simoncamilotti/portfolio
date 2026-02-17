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

RUN npx nx build client --configuration=production

# ---------- Stage 3: Production ----------
FROM nginx:alpine AS prod

COPY ../../config/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/apps/client/ /usr/share/nginx/html/

# Empty config.js placeholder — will be mounted via k3s volume at runtime
RUN touch /usr/share/nginx/html/config.js

USER 1001
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
