# 0004 — Écarts d'outillage avec le starter v1.0.2

- **Statut** : Accepté
- **Date** : 2026-11-25

## Contexte

L'alignement sur [monorepo-starter](https://github.com/simoncamilotti/monorepo-starter) v1.0.2
(#55) demande que chaque fichier d'outillage soit identique à celui du starter, ou que l'écart
soit justifié par un ADR. Les écarts propres au projet sont traités ailleurs : thème
([0001](0001-portfolio-theme.md)), deux applications web ([0002](0002-two-web-applications.md)),
formulaire de contact ([0003](0003-contact-form.md)). Restent les écarts d'outillage.

## Options envisagées

### Option A — Revenir au starter v1.0.2 partout

- ✅ Aucun écart.
- ❌ Défait des réglages que le starter a lui-même adoptés depuis (v1.0.4).
- ❌ Les migrations au démarrage ne s'enlèvent pas sans un Job dans le dépôt GitOps : c'est un
  changement de déploiement, hors du périmètre de #55.

### Option B — Garder les écarts, chacun avec sa raison

- ✅ Rien ne régresse ; chaque écart a une issue de sortie.
- ❌ Quelques conflits attendus lors du report de la v1.0.4.

## Décision

Le projet garde les écarts suivants.

| Écart                                                                  | Raison                                                                                                                   | Sortie                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `lefthook.yml` : ESLint puis Prettier, en séquence (`piped`)           | Un `eslint --fix` lancé après Prettier pouvait laisser un fichier mal formaté                                            | Repris par le starter en v1.0.4        |
| `.nvmrc` à `24.22.1` (au lieu de `24`)                                 | Version exacte, la même en local, en CI et dans les images                                                               | Repris par le starter en v1.0.4        |
| `renovate.json` : `"mode": "full"`                                     | L'organisation est en _Scan Only_ dans Mend : sans ce réglage, Renovate n'ouvre aucune PR                                | Repris par le starter en v1.0.4        |
| `.github/workflows/main.yml` : `node_version: '24.22.1'`               | Même version que `.nvmrc`                                                                                                | À revoir au report de la v1.0.4        |
| `apps/api/Dockerfile` : image `node:24.22.1-alpine`                    | Même version que `.nvmrc`                                                                                                | Repris par le starter en v1.0.4        |
| `apps/api/Dockerfile` : `TZ=Etc/UTC`                                   | L'API du portfolio refuse de démarrer sans (`src/config/env.ts`) : dates stockées en UTC                                 | Permanent                              |
| Dockerfiles : `pnpm install --prefer-offline` (au lieu de `--offline`) | Avec pnpm 12.18, la vérification `minimumReleaseAge` a besoin des métadonnées du registre, que `pnpm fetch` ne garde pas | À revoir au report du starter          |
| `.gitleaksignore`                                                      | Six faux positifs dans l'historique (identifiants factices de Keycloak dans d'anciens tests)                             | Permanent : l'historique ne change pas |
| `apps/api/entrypoint.sh` : migrations au démarrage de l'API            | L'infra du portfolio n'a pas de Job de migration                                                                         | Temporaire : #77                       |
| `CLAUDE.md` non versionné                                              | Ignoré par la configuration git globale du mainteneur ; `AGENTS.md` porte les instructions                               | Permanent                              |

## Conséquences

- Le report de la v1.0.4 ([guide](../guides/update-from-starter.md)) retire les trois premiers
  écarts : garder la version du starter en cas de conflit, puis mettre ce tableau à jour.
- Tant que #77 n'est pas fait, une migration qui échoue empêche l'API de démarrer
  ([runbook](../runbooks/database-migrations.md)). L'API n'a qu'une réplique : la migration ne
  s'exécute pas en double.
