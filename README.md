# Simon Portfolio

Personal portfolio and SaaS CV management tool — an Nx monorepo with a NestJS API, a React client, and shared libraries.

## Technical Stack

| Layer        | Technology                         |
| :----------- | :--------------------------------- |
| **Monorepo** | Nx 23, pnpm workspaces (catalog)   |
| **Backend**  | NestJS 12, Prisma 7, PostgreSQL 17 |
| **Frontend** | React 19, TailwindCSS              |
| **Auth**     | Keycloak (OIDC)                    |
| **Tests**    | Vitest, Playwright                 |

Being aligned on [monorepo-starter](https://github.com/simoncamilotti/monorepo-starter) (#55).

## Architecture

```
apps/
  api/           → NestJS API (port 3000, prefix /api)
  client/        → React client — public portfolio (port 4200)
  studio/        → React client — CV management admin app (port 4201)
  api-e2e/       → E2E tests of the API (Vitest, local only: needs Postgres and Keycloak)
  client-e2e/    → E2E tests of the client (Playwright, mocked API)
  studio-e2e/    → E2E tests of the studio (Playwright, mocked API and Keycloak)

libs/
  shared/contracts/ → @repo/contracts: Zod schemas, nestjs-zod DTOs (`@repo/contracts/server`)
  web/ui/           → @repo/ui: shared React components (PageLayout, Footer, Braces, brand icons)
  web/i18n/         → @repo/i18n: translations (fr, en)
  web/query/        → @repo/query: React Query provider, axios instance (`@repo/query/api`)
```

Every project is a pnpm package (`package.json`, Nx configuration included). The API code is
organised by domain in `apps/api/src/modules/<domain>/`; authentication and database live in
`apps/api/src/common/`. ESM everywhere: relative imports end in `.js`.

## Prerequisites

- Node.js 24 (`.nvmrc`)
- pnpm through corepack (`corepack enable`): the version comes from `packageManager`
- Docker & Docker Compose

## Quick Start

```bash
# 1. Clone and install (also installs the git hooks)
git clone <repo-url>
cd portfolio
corepack enable
pnpm install

# 2. Environment
cp .env.exemple .env
# Edit .env with your environment values (database, etc.)
cp config/client/config.exemple.js apps/client/public/config.js
cp config/studio/config.exemple.js apps/studio/public/config.js
# Edit the config.js files to match your Keycloak values

# 3. Infrastructure, migrations, API, client and studio
pnpm dev
```

## Main Commands

Always through Nx: `pnpm nx <target> <project>`.

```bash
pnpm nx serve api                                   # API: http://localhost:3000
pnpm nx serve client                                # Client: http://localhost:4200
pnpm nx serve studio                                # Studio: http://localhost:4201

pnpm nx run-many -t lint typecheck test build e2e   # Everything the CI checks
pnpm nx affected -t lint typecheck test             # Only what the branch changed
pnpm nx e2e client-e2e --ui                         # Playwright UI mode
pnpm nx e2e-local api-e2e                           # API e2e: needs Postgres and Keycloak

pnpm knip                                           # Unused files, exports and dependencies
pnpm format                                         # Prettier
```

### Database

```bash
pnpm nx prisma-generate api   # Prisma client in apps/api/src/generated (also run before build, test, typecheck)
pnpm nx migrate-dev api       # Create or apply migrations (dev), schema in apps/api/prisma/
pnpm nx migrate-deploy api    # Apply migrations (prod)
pnpm nx studio api            # Database GUI
```

### Dependencies

Versions live in the catalog of `pnpm-workspace.yaml` (`catalogMode: strict`): add the version
there, then `"catalog:"` in `package.json`. A version published less than 3 days ago is refused
(`minimumReleaseAge`). Renovate proposes updates on Monday (`renovate.json`).

## Git hooks

Installed by `pnpm install` ([lefthook](lefthook.yml)):

| Moment     | Check                                                              |
| ---------- | ------------------------------------------------------------------ |
| pre-commit | ESLint then Prettier on staged files; gitleaks if installed        |
| commit-msg | commitlint (Conventional Commits)                                  |
| pre-push   | No push to `main`; `typecheck` and `test` of the affected projects |

## CI and deployment

`.github/workflows/main.yml` calls the shared workflows of
[shared-workflows](https://github.com/simoncamilotti/shared-workflows) (`@v1`):

- `ci`: lint, typecheck, test and build of the affected projects, knip and gitleaks;
- `e2e`: Playwright suites of the client and the studio;
- `docker`: builds the `api`, `client` and `studio` images; on `main` they are deployed to dev, on a
  GitHub Release to prod, through the GitOps repository (`GITOPS_DEPLOY` repository variable).

## Docker Infrastructure

| Service    | Port | Description         |
| ---------- | ---- | ------------------- |
| PostgreSQL | 5433 | Base de données     |
| Keycloak   | 8081 | Serveur OIDC/OAuth2 |
