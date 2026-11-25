# 0003 — Formulaire de contact : SMTP et reCAPTCHA

- **Statut** : Accepté
- **Date** : 2026-11-25

## Contexte

Le formulaire de contact du site public envoie un e-mail au propriétaire du portfolio. Il existait
avant le starter, dont l'e-mail est configuré par `SMTP_URL` et `MAIL_FROM`
([ADR 0009 du starter](https://github.com/simoncamilotti/monorepo-starter/blob/main/starter/adr/0009-cross-cutting.md)).
Pour limiter le spam, l'API vérifie un jeton reCAPTCHA auprès de Google avant d'envoyer.

Les e2e du starter n'appellent aucun service externe
([ADR 0010 du starter](https://github.com/simoncamilotti/monorepo-starter/blob/main/starter/adr/0010-infra-and-dx.md)) :
la vérification auprès de Google ne peut pas y avoir lieu.

## Options envisagées

### Option A — Configuration du starter et clés de test de Google

- ✅ Configuration SMTP identique au starter.
- ❌ Changer les variables SMTP en production (secrets de l'infra) sans gain fonctionnel.
- ❌ Les e2e dépendent de Google et du réseau.

### Option B — Configuration existante, URL de vérification configurable

- ✅ Aucun changement en production.
- ✅ E2e hermétiques : le faux émetteur OIDC répond aussi à la vérification reCAPTCHA.
- ❌ `@repo/e2e-support` diffère du starter (`api-server.ts`, `fake-issuer.ts`, `global-setup.ts`).

## Décision

Le projet utilise l'option B :

- SMTP par `SMTP_HOST`, `SMTP_PORT` (465 en TLS implicite), `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` ;
  destinataire par `CONTACT_EMAIL_TO` ;
- reCAPTCHA vérifié par l'API avec `RECAPTCHA_SECRET_KEY`, à l'adresse `RECAPTCHA_VERIFY_URL`
  (celle de Google par défaut) ;
- en e2e, `api-server.ts` dérive `SMTP_HOST` et `SMTP_PORT` de `E2E_SMTP_URL` (Mailpit) et pointe
  `RECAPTCHA_VERIFY_URL` sur `/recaptcha/siteverify` du faux émetteur, qui accepte tout jeton sauf
  `invalid`.

## Conséquences

- Les e2e couvrent le parcours complet du formulaire : validation, captcha accepté ou refusé,
  e-mail reçu dans Mailpit.
- Lors d'un report du starter, `api-server.ts`, `fake-issuer.ts` et `global-setup.ts` de
  `@repo/e2e-support` entrent en conflit : garder les variables du portfolio, reprendre le reste.
- Adopter le module e-mail du starter (`MailSender`, React Email) reste possible plus tard ; il
  remplacerait `@nestjs-modules/mailer` et les modèles Handlebars.
