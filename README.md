# Simon Portfolio

Portfolio personnel et outil SaaS de gestion de CV — un monorepo Nx avec une API NestJS, un client Next.js, et des librairies partagées.

## Technical Stack

| Layer        | Technology                         |
|:-------------|:-----------------------------------|
| **Monorepo** | Nx 22                              |
| **Backend**  | NestJS 11, Prisma 7, PostgreSQL 17 |
| **Frontend** | React 19, TailwindCSS              |

## Architecture

```
apps/
  api/           → NestJS API (port 3000, prefix /api)
  client/        → React client (port 4200)
  api-e2e/       → E2E Tests API (Jest)
  client-e2e/    → E2E Tests client (Playwright)

libs/
  core/          → Global NestJS module (Prisma, Health, Logger)
```


## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm

## Quick Start

```bash
# 1. Clone and setup
git clone <repo-url>
cd portfolio
npm install


# 2. Environment
cp .env.exemple .env
# Edit .env file with your real environment values (database, etc.)

# 3. Start infrastructure
docker compose up -d

# 4. Generate the Prisma client and deploy the migrations
npm run prisma:generate
npm run prisma:migrate:deploy

# 5. Start applications
npm run serve:api      # API: http://localhost:3000
npm run serve:client   # Client: http://localhost:4200
```

## Main Commands

### Development

```bash
npm run serve:api              # Start API
npm run serve:client           # Start client
docker compose up -d      # Start infrastructure (Postgres)
```

### Build

```bash
npm run build:api              # Build API
npm run build:client           # Build client
npm run build:all              # Build all (API + client + libs)
```

### Tests

```bash
npm run test:api               # API unit tests
npm run test:client            # Client unit tests
npm run test:all               # All unit tests (API + client + libs) 

npm run e2e:api                # E2E tests API
npm run e2e:client             # E2E tests client (Playwright)
```

### Lint & Format

```bash
npm run lint:api               # Lint API
npm run lint:client            # Lint client
npm run lint:all               # Lint all (API + client + libs)
npm run format                 # Format code
```

### Database

```bash
npm run prisma:generate       # Generate Prisma client
npm run prisma:migrate:dev    # Create or apply migrations (dev)
npm run prisma:migrate:deploy # Apply migrations (prod)
npm run prisma:studio         # Interface graphique BDD
```

## Docker Infrastructure

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Base de données |
