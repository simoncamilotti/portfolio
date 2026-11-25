# Déploiement

**Quand** : chaque fusion dans `main` (dev) et chaque release (prod).
**Risque** : faible en dev, moyen en prod.

Le déploiement passe par le dépôt GitOps `simoncamilotti/infra` (`apps/portfolio/`) : la CI y met
à jour le tag des images, ArgoCD applique le changement dans le cluster.

| Environnement | Site public                 | Studio                          | API                      |
| ------------- | --------------------------- | ------------------------------- | ------------------------ |
| dev           | https://cv.dev.camilotti.fr | https://studio.dev.camilotti.fr | `/api` des deux domaines |
| prod          | https://cv.camilotti.fr     | https://studio.camilotti.fr     | `/api` des deux domaines |

## Prérequis

- Le dossier `apps/portfolio/` existe dans le dépôt GitOps, avec ses overlays `dev` et `prod`.
- La variable de dépôt `GITOPS_DEPLOY` vaut `true`. Sans elle, la CI construit et publie les
  images mais ne déploie pas. Elle est lue au démarrage d'un run : un run déjà en cours ne
  déploie pas.

  ```sh
  gh variable set GITOPS_DEPLOY --body true
  gh workflow run main.yml --ref main
  ```

- Les secrets de l'application existent dans Infisical (projet `homelab`, dossier `/portfolio`,
  environnements `dev` et `prod`) : `DB_PASSWORD`, `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`,
  `SMTP_FROM`, `CONTACT_EMAIL_TO`, `RECAPTCHA_SECRET_KEY`. L'API refuse de démarrer sans eux
  ([ADR 0003](../adr/0003-contact-form.md)).
- Les secrets `GITOPS_PAT` et `SLACK_WEBHOOK_URL` sont définis sur le dépôt.
- Les autres variables de l'API et des applications (voir `.env.example`) sont fournies par les
  manifestes GitOps.

## Dev

Automatique à chaque fusion dans `main` :

1. la CI construit les images `ghcr.io/simoncamilotti/portfolio/api`, `…/client` et
   `…/studio`, taguées `main-<run>` ;
2. elle modifie `apps/portfolio/overlays/dev` dans le dépôt GitOps et pousse ;
3. ArgoCD déploie ; l'API applique les migrations à son démarrage
   ([runbook](database-migrations.md)) ; un message part sur Slack.

## Prod

1. Vérifier que la CI de `main` est verte et que dev fonctionne.
2. Créer la release :

   ```sh
   gh release create v1.2.0 --generate-notes
   ```

3. La CI construit les images taguées `1.2.0` et met à jour l'overlay `prod`.
4. Suivre la synchronisation dans ArgoCD ; un message part sur Slack.

Numérotation : majeure pour un changement incompatible (API publique, données), mineure pour
une fonctionnalité, correctif sinon.

### Première release après l'alignement sur le starter

La prod tourne encore une version 1.1.x, antérieure à l'alignement. Avec la release suivante,
dans le dépôt GitOps (`apps/portfolio/`) :

- **Configuration des applications** : les images 1.1.x lisent `config.js` dans des ConfigMaps
  (`overlays/prod/configmap.yaml`, `patch-config-mount.yaml`). Les nouvelles le génèrent à partir
  des variables `WEB_*` : les déclarer dans l'overlay `prod`, comme en dev, puis retirer les
  ConfigMaps et le patch.
- **API** : retirer `KEYCLOAK_ISSUER_URL` et `KEYCLOAK_CLIENT_ID` de `base/api.yaml`, remplacées
  par `OIDC_ISSUER_URL` et `OIDC_AUDIENCE`.

## Vérifier

- `GET /api/health/ready` répond `200`.
- Les pods de l'API, du client et du studio sont `Ready` dans ArgoCD.
- Le site public affiche le CV ; le studio redirige vers Keycloak puis affiche les CV.

## Revenir en arrière

- **Prod** : dans le dépôt GitOps, annuler le commit `deploy(prod): …` (`git revert`), ou
  remettre le tag de la version précédente dans `overlays/prod`. ArgoCD redéploie l'ancienne image.
- Une migration déjà appliquée n'est **pas** annulée : l'ancienne version doit rester
  compatible avec le nouveau schéma ([migrations](database-migrations.md#changements-incompatibles)).
