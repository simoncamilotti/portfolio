# 0002 — Deux applications web : `client` et `studio`

- **Statut** : Accepté
- **Date** : 2026-11-25

## Contexte

Le starter n'a qu'une application web, `apps/web`, avec ses e2e dans `apps/web-e2e`
([ADR 0005 du starter](https://github.com/simoncamilotti/monorepo-starter/blob/main/starter/adr/0005-structure.md)).
Le portfolio en a deux, antérieures au starter :

- `client` : le site public (CV, projets, contact), sans authentification ;
- `studio` : l'administration (CV, projets, feature flags), réservée aux utilisateurs connectés.

Elles n'ont ni le même public, ni la même authentification, ni le même cycle de mise en ligne.

## Options envisagées

### Option A — Une seule application, l'administration sous une route protégée

- ✅ Même structure que le starter.
- ❌ Le site public embarque le code et les dépendances de l'administration (éditeur, grille,
  client OIDC).
- ❌ Une seule image, un seul domaine : l'administration n'est plus isolable.

### Option B — Deux applications qui suivent chacune les conventions de `apps/web`

- ✅ Le site public reste léger et sans authentification ; le studio a son propre domaine.
- ❌ Ce que le starter fait pour `apps/web` est fait deux fois : e2e, image Docker, configuration.

## Décision

Le projet garde deux applications, `apps/client` et `apps/studio`. Chacune suit les conventions de
`apps/web` du starter (TanStack Router, `@repo/ui`, `@repo/api-client`, configuration d'exécution
`/config.js`, image Docker). Le code partagé vit dans les libs `@repo/ui` et `@repo/i18n`, qui ont
ainsi deux consommateurs.

## Conséquences

- Deux projets e2e, `apps/client-e2e` et `apps/studio-e2e`, sur le modèle de `apps/web-e2e`.
- `@repo/e2e-support` ajoute `E2E_STUDIO_PORT` (4903) à côté de `E2E_WEB_PORT` (4901, le client),
  et l'API e2e autorise les deux origines en CORS.
- Trois images dans la CI : `api`, `client`, `studio`.
- Lors d'un report du starter, ce qui touche `apps/web` ou `apps/web-e2e` s'applique aux deux
  applications.
