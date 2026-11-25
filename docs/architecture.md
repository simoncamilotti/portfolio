# Architecture

## Vue d'ensemble

```
             navigateur                                     serveur
┌───────────────────────────────┐            ┌─────────────────────────────┐
│ apps/client   site public     │ ─────────▶ │ apps/api          /api/*    │
│ CV, projets, contact          │   JSON     │ NestJS · Prisma             │──▶ PostgreSQL
├───────────────────────────────┤            │ Problem Details (RFC 9457)  │──▶ SMTP
│ apps/studio   administration  │ ─────────▶ │                             │──▶ reCAPTCHA
│ CV, projets, feature flags    │  Bearer    └──────────────┬──────────────┘
└──────────────┬────────────────┘                           │ JWKS (découverte)
               │ OIDC (PKCE)                                │
               └──────────────▶  fournisseur OIDC  ◀────────┘
                                 (Keycloak en local)
```

Monorepo Nx avec les workspaces pnpm : chaque app et chaque lib est un paquet `@repo/*`.
Le code métier vit dans les apps, organisé par domaine (`src/modules/<domaine>/`).
Un code passe dans `libs/` quand un deuxième projet en a besoin ou pour imposer une frontière.

Le portfolio a deux applications web là où le starter n'en a qu'une : le site public et
l'administration ([ADR 0002](adr/0002-two-web-applications.md)).

## Projets

| Projet                   | Chemin                   | Tags                            | Rôle                                                      |
| ------------------------ | ------------------------ | ------------------------------- | --------------------------------------------------------- |
| `api`                    | `apps/api`               | `type:app` `platform:node`      | API REST NestJS                                           |
| `client`                 | `apps/client`            | `type:app` `platform:browser`   | Site public : CV, projets, formulaire de contact          |
| `studio`                 | `apps/studio`            | `type:app` `platform:browser`   | Administration : CV, projets, feature flags               |
| `api-e2e`                | `apps/api-e2e`           | `type:e2e` `platform:node`      | Tests e2e de l'API (Vitest)                               |
| `client-e2e`             | `apps/client-e2e`        | `type:e2e` `platform:node`      | Tests e2e du client (Playwright)                          |
| `studio-e2e`             | `apps/studio-e2e`        | `type:e2e` `platform:node`      | Tests e2e du studio (Playwright)                          |
| `@repo/contracts`        | `libs/shared/contracts`  | `type:lib` `platform:universal` | Schémas Zod partagés par l'API et les applications        |
| `@repo/api-client`       | `libs/shared/api-client` | `type:lib` `platform:universal` | Client et mocks MSW générés depuis l'OpenAPI de l'API     |
| `@repo/ui`               | `libs/web/ui`            | `type:lib` `platform:browser`   | Composants shadcn (Base UI), thème Tailwind, mise en page |
| `@repo/i18n`             | `libs/web/i18n`          | `type:lib` `platform:browser`   | Traductions typées (fr, en) du client et du studio        |
| `@repo/e2e-support`      | `libs/api/e2e-support`   | `type:lib` `platform:node`      | Émetteur OIDC factice, démarrage de l'API, Mailpit        |
| `@repo/workspace-plugin` | `tools/workspace-plugin` | `type:tool` `platform:node`     | Générateurs Nx : module d'API, lib                        |

Frontières imposées par ESLint (`@nx/enforce-module-boundaries`) :

- une lib n'importe jamais une app ;
- `platform:universal` n'importe que `platform:universal` ;
- `platform:browser` n'importe jamais `platform:node` ;
- rien n'importe un projet `type:e2e`.

## Contrat entre l'API et le web

1. Les schémas Zod de `@repo/contracts` décrivent les entrées et les sorties ; `.meta({ id })`
   leur donne un nom dans l'OpenAPI.
2. L'API les applique : `@Query({ schema })` / `@Body({ schema })` valident les entrées,
   `@ResponseSchema(schema)` / `@ResponseListSchema(schema)` filtrent la réponse et la documentent.
3. `nx run api:openapi` produit `apps/api/openapi.json` à partir de la build.
4. `nx run @repo/api-client:codegen` (orval) génère les fonctions, les hooks TanStack Query et
   les mocks MSW (`@repo/api-client/mocks`). Les fichiers générés ne sont pas versionnés : les
   cibles `build`, `typecheck`, `test` et `lint` les produisent d'abord.

Les applications n'appellent l'API que par `@repo/api-client`. Une erreur arrive en `ApiError`,
avec les Problem Details de la réponse. Modifier un endpoint suffit : le client suit au
prochain build, et TypeScript signale les usages à adapter.

## API

| Sujet           | Mise en œuvre                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------- |
| Configuration   | Variables validées par Zod au démarrage (`src/config/env.ts`, documentées dans `.env.example`)      |
| Erreurs         | Problem Details (`application/problem+json`), champs invalides dans `errors`                        |
| Base de données | Prisma (`prisma/schema.prisma`), migrations versionnées dans `prisma/migrations/`                   |
| Domaines        | `resume`, `project`, `feature-flag`, `contact`, `users`, `health` (`src/modules/`)                  |
| Logs            | pino, JSON en production, lisibles en développement                                                 |
| Traces          | OpenTelemetry (traces et métriques OTLP), actif si `OTEL_EXPORTER_OTLP_ENDPOINT` est défini         |
| Santé           | `/api/health/live` (processus) et `/api/health/ready` (base de données)                             |
| Contact         | E-mail par SMTP (modèle Handlebars), jeton reCAPTCHA vérifié ([ADR 0003](adr/0003-contact-form.md)) |
| Sécurité        | helmet, CORS limité à `CORS_ORIGINS`, limitation de débit (100 requêtes par minute et client)       |
| Documentation   | `/api/docs` (Scalar) hors production                                                                |

Les migrations sont appliquées au démarrage du conteneur de l'API, un écart temporaire avec le
starter ([ADR 0004](adr/0004-tooling-deviations.md), [runbook](runbooks/database-migrations.md)).

## Applications web

| Sujet         | Mise en œuvre                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| Routage       | TanStack Router, routes fichiers dans `src/routes/` ; `route-tree.gen.ts` est versionné               |
| Données       | TanStack Query via le client généré ; un `QueryClient` par application                                |
| Formulaires   | react-hook-form avec les schémas de `@repo/contracts`                                                 |
| UI            | `@repo/ui` (shadcn, Base UI), Tailwind 4, thème sombre fixe ([ADR 0001](adr/0001-portfolio-theme.md)) |
| i18n          | i18next, `@repo/i18n` partagée, clés typées : le français fait référence, l'anglais suit              |
| Configuration | `/config.js` généré au démarrage du conteneur : une même image pour tous les environnements           |

`/config.js` est validé au démarrage par `src/config/config.ts`. Les images le génèrent à partir
des variables `WEB_*` (`docker-entrypoint.sh`, `config.js.template`) ; en développement, les
serveurs Vite le servent à partir des mêmes variables de `.env`.

| Variable                 | Application    | Description                                          |
| ------------------------ | -------------- | ---------------------------------------------------- |
| `WEB_API_URL`            | client, studio | Origine de l'API (les chemins commencent par `/api`) |
| `WEB_OIDC_AUTHORITY`     | studio         | Émetteur OIDC                                        |
| `WEB_OIDC_CLIENT_ID`     | studio         | Client OIDC public                                   |
| `WEB_RECAPTCHA_SITE_KEY` | client         | Clé de site reCAPTCHA v3, facultative                |
| `WEB_UMAMI_SRC`          | client         | URL du script Umami, facultative                     |
| `WEB_UMAMI_WEBSITE_ID`   | client         | Identifiant du site dans Umami, facultatif           |

Le client affiche la section et le lien « Projets » quand le feature flag `projects` est actif.

## Authentification

- Le client est public : aucune connexion.
- Le studio suit le flux OIDC Authorization Code avec PKCE (`oidc-client-ts`). La session est
  gardée dans `sessionStorage`. Les pages sous `routes/_authenticated/` redirigent vers le
  fournisseur, puis ramènent sur la page demandée ; un `401` de l'API mène à `/forbidden`, qui
  propose de se reconnecter.
- L'API vérifie les jetons d'accès (`jose`) avec les clés trouvées par découverte OIDC :
  émetteur `OIDC_ISSUER_URL`, audience `OIDC_AUDIENCE`.
- Toute route exige un jeton, sauf `@Public()` : lectures du CV public, des projets et des
  feature flags, formulaire de contact, santé. `@Roles()` lit le claim `roles` ; `@CurrentUser()`
  donne l'appelant.
- Au premier appel de `/api/users/me`, l'API crée le compte local à partir des claims du jeton.
- Rien ne dépend de Keycloak : n'importe quel fournisseur OIDC convient. En local, le realm est
  importé depuis `docker/keycloak/realm.json`.

## Tests

| Niveau     | Outil      | Où                                                                       |
| ---------- | ---------- | ------------------------------------------------------------------------ |
| Unitaires  | Vitest     | `*.spec.ts(x)` à côté du code ; les applications simulent l'API avec MSW |
| e2e API    | Vitest     | `apps/api-e2e` : API buildée, vraie base, faux émetteur OIDC, Mailpit    |
| e2e client | Playwright | `apps/client-e2e` : build de production du client contre l'API           |
| e2e studio | Playwright | `apps/studio-e2e` : build du studio, session du faux émetteur            |

Les e2e utilisent la base `E2E_DATABASE_URL` et des données uniques par test ; la base n'est
jamais vidée. La session du navigateur est injectée à partir d'un jeton du faux émetteur, qui
répond aussi à la vérification reCAPTCHA.

## Livraison

- CI ([`.github/workflows/main.yml`](../.github/workflows/main.yml)), par les workflows
  partagés `simoncamilotti/shared-workflows@v1` : lint, typecheck, test, build, knip, gitleaks,
  puis e2e avec PostgreSQL et Mailpit. Projets modifiés seulement sur les PR, tout le dépôt sur
  `main`.
- Images `ghcr.io/simoncamilotti/portfolio/api`, `…/client` et `…/studio`, déployées par GitOps
  ([runbook](runbooks/deployment.md)).

## Starter

Projet issu de [monorepo-starter](https://github.com/simoncamilotti/monorepo-starter) **v1.0.2**.
Les choix de socle sont justifiés dans les
[ADR du starter](https://github.com/simoncamilotti/monorepo-starter/tree/v1.0.2/starter/adr).
Les décisions propres au projet, et ses écarts au starter, sont dans [adr/](adr/).
Reporter une nouvelle version : [guide](guides/update-from-starter.md).
