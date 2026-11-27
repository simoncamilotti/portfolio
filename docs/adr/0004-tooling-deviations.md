# 0004 — Écarts d'outillage avec le starter

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
  changement de déploiement, hors du périmètre de #55 (fait depuis par #77).

### Option B — Garder les écarts, chacun avec sa raison

- ✅ Rien ne régresse ; chaque écart a une issue de sortie.
- ❌ Quelques conflits attendus lors du report de la v1.0.4.

## Décision

Le projet garde les écarts suivants.

| Écart                                                                  | Raison                                                                                                                   | Sortie                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- |
| `apps/api/Dockerfile` : `TZ=Etc/UTC`                                   | L'API du portfolio refuse de démarrer sans (`src/config/env.ts`) : dates stockées en UTC                                 | Permanent                              |
| Dockerfiles : `pnpm install --prefer-offline` (au lieu de `--offline`) | Avec pnpm 12.18, la vérification `minimumReleaseAge` a besoin des métadonnées du registre, que `pnpm fetch` ne garde pas | À revoir au report du starter          |
| `.gitleaksignore`                                                      | Six faux positifs dans l'historique (identifiants factices de Keycloak dans d'anciens tests)                             | Permanent : l'historique ne change pas |
| `CLAUDE.md` non versionné                                              | Ignoré par la configuration git globale du mainteneur ; `AGENTS.md` porte les instructions                               | Permanent                              |

## Conséquences

- Le report de la v1.0.4 ([guide](../guides/update-from-starter.md)) a retiré cinq écarts,
  repris par le starter ou alignés sur lui : l'ordre des hooks de `lefthook.yml`, `.nvmrc` et
  l'image Node à `24.22.1`, `"mode": "full"` dans `renovate.json`, et le `node_version` de la
  CI (le starter laisse la valeur par défaut des workflows partagés, `24`).
- Les migrations au démarrage de l'API, un temps gardées faute de Job dans l'infra, ont été
  retirées par #77 : un Job Kubernetes les applique, comme dans le starter
  ([runbook](../runbooks/database-migrations.md)).
