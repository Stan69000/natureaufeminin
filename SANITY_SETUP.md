# Sanity Migration (Runbook)

Le site lit désormais Sanity comme source unique de contenu en runtime.
Tu peux suivre ce runbook dans l'ordre.

## 1) Créer/Configurer Sanity

Dans un terminal local:

```bash
npx sanity@latest login
```

Puis crée un projet Sanity (si pas déjà fait) dans le dashboard Sanity, avec dataset `production`.

## 2) Préparer le contenu à importer

Le seed est déjà prêt dans ce repo: `sanity/seed.ndjson`.

Tu peux le régénérer si besoin:

```bash
npm run sanity:seed
```

## 3) Importer le seed

```bash
npx sanity@latest dataset import sanity/seed.ndjson production --replace
```

## 4) Configurer Astro pour lire Sanity

Copier `.env.example` vers `.env`, puis compléter:

```bash
SANITY_PROJECT_ID=xxxxxx
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
```

## 5) Vérifier la connexion et l'import

```bash
npm run sanity:check
npm run sanity:verify
npm run build
```

Attendu:
- `sanity:check` => connexion OK + liste de pages
- `sanity:verify` => toutes les pages attendues trouvées
- `build` => passe

## 6) Schéma minimum attendu dans Sanity

Type document `page`:
- `title` (string)
- `slug` (slug)
- `bodyHtml` (text)
- `seoTitle` (string, optionnel)
- `seoDescription` (text, optionnel)
- `legacyWp` (object, optionnel)

## 7) État actuel du projet

- import Sanity effectué (`13` pages)
- vérification seed OK
- build Astro OK avec Sanity
