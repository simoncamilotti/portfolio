# portfolio

Portfolio de Simon Camilotti : un site public (CV, projets, contact) et une application
d'administration pour les gérer.

Monorepo Nx : une API NestJS, deux applications React et leurs bibliothèques partagées, issu de
[monorepo-starter](https://github.com/simoncamilotti/monorepo-starter). L'architecture est
décrite dans [docs/architecture.md](docs/architecture.md).

## Démarrer

Prérequis : Node 24 ([`.nvmrc`](.nvmrc)), pnpm via corepack, Docker.

```sh
corepack enable
pnpm install
cp -n .env.example .env
pnpm dev
```

`pnpm dev` démarre PostgreSQL, Keycloak et Mailpit, applique les migrations, puis lance
l'API, le client et le studio en mode watch.

| Service            | Adresse                        | Accès                             |
| ------------------ | ------------------------------ | --------------------------------- |
| Client (public)    | http://localhost:4200          |                                   |
| Studio             | http://localhost:4201          | utilisateurs du realm `portfolio` |
| API                | http://localhost:3000/api      |                                   |
| Référence de l'API | http://localhost:3000/api/docs | hors production                   |
| Keycloak (console) | http://localhost:8081          | `admin` / `admin`                 |
| Mailpit (e-mails)  | http://localhost:8025          | e-mails du formulaire de contact  |

Les ports viennent de `.env` : changez-les pour faire tourner plusieurs projets côte à côte.
Arrêt des services : `docker compose down` (ajouter `-v` efface les données).
Clone antérieur à l'alignement sur le starter : [runbook](docs/runbooks/local-setup-migration.md).

## Commandes

| Commande                                                    | Rôle                                                             |
| ----------------------------------------------------------- | ---------------------------------------------------------------- |
| `pnpm dev`                                                  | Environnement local complet                                      |
| `pnpm nx run-many -t lint typecheck test`                   | Vérifications rapides                                            |
| `pnpm nx run-many -t build`                                 | Builds de production                                             |
| `pnpm nx run-many -t e2e`                                   | Tests e2e (API, client, studio) contre la base `portfolio_e2e`   |
| `pnpm nx affected -t lint typecheck test`                   | Vérifications limitées aux projets modifiés                      |
| `pnpm nx run api:migrate-dev`                               | Créer une migration après une modification du schéma             |
| `pnpm nx run @repo/api-client:codegen`                      | Régénérer le client de l'API (fait par les builds)               |
| `pnpm nx g @repo/workspace-plugin:api-module <nom>`         | Nouveau module de l'API ([guide](docs/guides/add-api-module.md)) |
| `pnpm nx g @repo/workspace-plugin:lib <nom> --scope=shared` | Nouvelle lib ([guide](docs/guides/add-lib.md))                   |
| `pnpm format`                                               | Formater tout le dépôt                                           |
| `pnpm knip`                                                 | Fichiers, exports et dépendances inutilisés                      |
| `pnpm nx graph`                                             | Graphe des projets                                               |

Les tests e2e du client et du studio demandent Chromium :
`pnpm --filter @repo/client-e2e exec playwright install chromium`.

## Structure

```
apps/
  api/        API NestJS            api-e2e/      tests e2e de l'API (Vitest)
  client/     site public (React)   client-e2e/   tests e2e du client (Playwright)
  studio/     administration        studio-e2e/   tests e2e du studio (Playwright)
libs/
  shared/     contracts (schémas Zod), api-client (client généré)
  web/        ui (composants shadcn, mise en page), i18n (traductions fr et en)
  api/        e2e-support (émetteur OIDC factice, démarrage de l'API)
tools/        plugin Nx local (générateurs)
docker/       configuration des services locaux
docs/         documentation du projet
```

## Documentation

- [Index de la documentation](docs/README.md)
- [Contribuer](CONTRIBUTING.md) : branches, commits, PR, fusion, releases
