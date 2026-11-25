# Mettre à jour un environnement local antérieur à l'alignement

**Quand** : un clone qui date d'avant l'alignement sur le starter (#55) ne démarre plus avec
`pnpm dev`.
**Durée** : quelques minutes. **Risque** : faible (données locales uniquement).

## Prérequis

- Les services de `docker-compose.yml` arrêtés ou démarrés, peu importe.
- Le `.env` local à portée de main.

## Procédure

1. **Variables d'environnement** : comparer `.env` à `.env.example` et ajouter ce qui manque
   (notamment `OIDC_ISSUER_URL`, `OIDC_AUDIENCE`, `CORS_ORIGINS`, `SMTP_PORT`, les `WEB_*` et
   `E2E_DATABASE_URL`). Lister les noms manquants :

   ```sh
   comm -23 <(grep -oE '^[A-Z_0-9]+=' .env.example | sort -u) <(grep -oE '^[A-Z_0-9]+=' .env | sort -u)
   ```

   Ancien setup (Keycloak 23 sur un fichier H2) : renommer aussi `DB_USER`, `DB_PASSWORD`,
   `DB_NAME` et `DB_PORT` en `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` et
   `POSTGRES_PORT`.

2. **Bases de données** : le script d'initialisation de PostgreSQL ne crée les bases `keycloak`
   et `portfolio_e2e` que sur un volume vide. Sur un volume existant, les créer une fois :

   ```sh
   docker compose up -d postgres
   docker compose exec postgres psql -U postgres -c 'CREATE DATABASE keycloak' -c 'CREATE DATABASE portfolio_e2e'
   docker compose up -d --wait
   ```

3. **Fichiers résiduels** : supprimer les anciennes configurations d'exécution, désormais
   servies par les serveurs Vite à partir des variables `WEB_*` :

   ```sh
   rm -f apps/client/public/config.js apps/studio/public/config.js
   ```

4. Lancer `pnpm dev`.

## Vérifier

- `http://localhost:3000/api/health/ready` répond `200`.
- Le client (`http://localhost:4200`) et le studio (`http://localhost:4201`) s'affichent ; le
  studio redirige vers Keycloak (`http://localhost:8081`).

## Revenir en arrière

Rien à annuler : les bases ajoutées sont vides et le `.env` n'est pas versionné.

## Pièges

- **Ports déjà pris par un autre projet** : les projets issus du starter utilisent les mêmes
  ports par défaut. Les changer dans `.env` (`POSTGRES_PORT`, `KEYCLOAK_PORT`,
  `MAILPIT_SMTP_PORT`, `MAILPIT_UI_PORT`) ; `SMTP_PORT`, et pour les e2e `E2E_SMTP_URL` et
  `E2E_MAILPIT_URL`, suivent les ports de Mailpit.
- **Realm Keycloak modifié** : Keycloak n'importe le realm que s'il n'existe pas encore. Après
  un changement de `docker/keycloak/realm.json`, supprimer le realm `portfolio` dans la console
  (`admin` / `admin`) et redémarrer Keycloak.
