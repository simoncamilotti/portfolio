# Instructions pour les agents

Monorepo Nx (pnpm) : API NestJS (`apps/api`), deux applications React, `apps/client` (site
public) et `apps/studio` (administration), libs `@repo/*`.
Vue d'ensemble : [docs/architecture.md](docs/architecture.md). Règles de contribution :
[CONTRIBUTING.md](CONTRIBUTING.md).

## Environnement

- Node 24 (`.nvmrc`) et pnpm via corepack. Toujours passer par Nx : `pnpm nx <cible> <projet>`.
- `pnpm dev` : services docker-compose, migrations, API, client et studio. Ports dans `.env`.
- Avant de rendre la main : `pnpm nx affected -t lint typecheck test` ; `pnpm knip` si des
  exports ou dépendances ont changé.

## Langues

- Français : documentation, ADR, specs, issues.
- Anglais : code, commentaires, noms de fichiers, commits, PR.
- Textes affichés : i18n uniquement, en `fr` et `en`, jamais en dur.

## Règles de travail

- Commits Conventional Commits sur une ligne ; jamais de poussée sur `main` : branche et PR.
- Une PR qui change une structure, un endpoint, une variable d'environnement ou un
  comportement met à jour la doc dans la même PR : README, `.env.example`, `docs/`.
- Une décision d'architecture s'écrit en ADR (`docs/adr/`, modèle `_template.md`).
- Aucune mention d'outils d'IA dans les commits, issues et PR.
- Code métier dans les apps, par domaine (`src/modules/<domaine>/`). Une lib seulement si un
  deuxième projet en a besoin ou pour imposer une frontière.
- Nouveau module d'API ou nouvelle lib : générateurs du plugin local,
  `pnpm nx g @repo/workspace-plugin:api-module <nom>` et `…:lib <nom> --scope=<shared|web|api>`
  ([guides](docs/guides/)).
- Fichiers et dossiers en kebab-case, y compris les composants React.
- ESM partout : imports relatifs avec l'extension `.js` (même pour un fichier `.ts`).

## Pièges

### Dépendances

- Versions dans le catalogue de `pnpm-workspace.yaml` (`catalogMode: strict`) : ajouter la
  version au catalogue, puis `"catalog:"` dans le `package.json`.
- `minimumReleaseAge` : une version publiée depuis moins de 3 jours est refusée. Choisir la
  précédente, ne pas désactiver le réglage.
- Un paquet avec script d'installation doit figurer dans `allowBuilds`.

### API

- Toute route exige un jeton : `@Public()` pour l'ouvrir, `@Roles()` pour restreindre.
- Validation et sérialisation par les schémas Zod de `@repo/contracts` :
  `@Query({ schema })`, `@Body({ schema })`, `@ResponseSchema(schema)`. Pas de class-validator.
- Erreurs : exceptions Nest, rendues en Problem Details par le filtre global.
- Nouvelle variable d'environnement : `src/config/env.ts` **et** `.env.example`.
- Schéma Prisma modifié : `pnpm nx run api:migrate-dev --name=<slug>`, relire le SQL
  ([runbook](docs/runbooks/database-migrations.md)). Le client Prisma est généré, pas versionné.
- Formulaire de contact : SMTP par `SMTP_HOST`/`SMTP_PORT`, modèle Handlebars copié par
  `nest-cli.json`, reCAPTCHA vérifié par l'API ([ADR 0003](docs/adr/0003-contact-form.md)).

### Web

- Client de l'API généré par orval dans `@repo/api-client` (non versionné) : après un
  changement d'endpoint, `pnpm nx run @repo/api-client:codegen`. Ne jamais l'écrire à la main.
- Deux applications, mêmes conventions ([ADR 0002](docs/adr/0002-two-web-applications.md)) :
  `client` sans authentification, `studio` derrière OIDC (routes sous `_authenticated`).
- Routes fichiers dans `src/routes/` ; `route-tree.gen.ts` est généré et versionné.
- Composants shadcn dans `libs/web/ui` : imports relatifs à l'intérieur de la lib, imports par
  composant depuis les apps (`@repo/ui/components/<nom>`). Thème sombre fixe, sans
  `ThemeProvider` ([ADR 0001](docs/adr/0001-portfolio-theme.md)).
- Traductions dans `@repo/i18n` (`locales/{fr,en}/{common,client,studio}.ts`), partagées par
  les deux apps : le français fait référence, l'anglais doit avoir les mêmes clés.
- Configuration d'exécution dans `/config.js` (`src/config/config.ts`), pas de `import.meta.env`.
- Tests de composants avec les mocks MSW générés, jamais contre la vraie API.

### Tests e2e

- Vraie base (`E2E_DATABASE_URL`), faux émetteur OIDC, données uniques par test
  (`uniqueUser`, titres uniques) : ne jamais vider la base.
- Les trois suites (`api-e2e`, `client-e2e`, `studio-e2e`) partagent des ports fixes, les
  mêmes que les autres projets issus du starter : ne pas les lancer en parallèle.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
