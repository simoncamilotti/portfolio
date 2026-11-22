# 0001 — Thème du portfolio : sombre, indigo, Inter

- **Statut** : Accepté
- **Date** : 2026-11-22

## Contexte

Le passage de `@repo/ui` à shadcn, Base UI et Tailwind 4 (#55, étape 4) reprend `libs/web/ui`
du starter v1.0.2. Le starter fournit un thème neutre (noir et blanc, police Geist), en mode clair
et sombre par variables CSS, avec un `ThemeProvider` qui pose `.light` ou `.dark` sur `<html>` et
bascule à la touche « d » ([ADR 0008 du starter](https://github.com/simoncamilotti/monorepo-starter/blob/main/starter/adr/0008-frontend.md)).

Le portfolio a sa propre identité, antérieure au starter : primaire indigo, police Inter, couleurs
`surface`, `success` et `warning`, effets « glow » ; le site public et le studio sont sombres
uniquement (`Layout` applique `.dark` à la page).

## Options envisagées

### Option A — Thème du starter

`globals.css` et `sonner.tsx` identiques au starter, `ThemeProvider` monté dans les deux
applications.

- ✅ Aucun écart : les reports du starter s'appliquent sans conflit.
- ❌ Le site public change d'apparence ; couleurs et effets propres au portfolio à réécrire.
- ❌ La touche « d » bascule le site public en clair, que ses pages ne prévoient pas.

### Option B — Structure du starter, valeurs du portfolio

`globals.css` garde les imports, `@custom-variant`, `@theme inline` et `@layer base` du starter ;
seules les valeurs changent.

- ✅ Rendu du site inchangé.
- ❌ `globals.css` et `sonner.tsx` diffèrent du starter : à reprendre à la main lors des reports.

## Décision

Le projet utilise l'option B :

- `libs/web/ui/src/styles/globals.css` porte les couleurs du portfolio (converties de HSL en
  oklch), la police Inter (`@fontsource-variable/inter`), les tokens `surface`, `success`,
  `warning` et `destructive-foreground`, et l'échelle de rayons du portfolio avant Tailwind 4
  (`--radius: 0.5rem`, `sm` = 4 px, `md` = 6 px, `xl` = 12 px…) ;
- les boutons gardent le curseur `pointer` (Tailwind 4 le remet à `default`) ;
- pas de `ThemeProvider` : `sonner.tsx` fixe `theme="dark"` ;
- les autres composants du starter (`button`, `card`, `dropdown-menu`, `field`, `input`, `label`,
  `separator`) et `components.json` restent identiques ; `theme-provider.tsx` n'est pas repris.

## Conséquences

- Lors d'un report du starter, `globals.css` et `sonner.tsx` entrent en conflit : garder les
  valeurs du portfolio, reprendre le reste.
- Les composants en portail (menus, dialogs) sont rendus hors du `.dark` de `Layout` et prennent
  donc les variables claires de `:root`, comme avant la migration.
- Passer le site en clair et sombre demanderait de monter le `ThemeProvider` du starter et de
  reprendre ses `sonner.tsx` et `theme-provider.tsx`.
