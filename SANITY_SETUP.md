# Sanity Migration (Astro)

Ce projet peut maintenant lire le contenu depuis Sanity, avec fallback local sur `src/data/wp-pages.json`.

## 1) Variables d'environnement

Copier `.env.example` vers `.env` puis remplir:

```bash
SANITY_PROJECT_ID=xxxxxx
SANITY_DATASET=production
SANITY_API_VERSION=2025-01-01
```

Sans ces variables, le site continue d'utiliser le contenu local (fallback).

## 2) Seed Sanity depuis le contenu actuel

Générer le fichier NDJSON:

```bash
npm run sanity:seed
```

Fichier généré: `sanity/seed.ndjson`

Importer ensuite dans Sanity (CLI):

```bash
sanity dataset import sanity/seed.ndjson production --replace
```

## 3) Schéma Sanity minimal recommandé

Type de document `page`:

- `title` (string)
- `slug` (slug)
- `bodyHtml` (text)
- `seoTitle` (string, optionnel)
- `seoDescription` (text, optionnel)

Optionnel: objet `legacyWp` (pour traçabilité migration).

## 4) Fonctionnement côté Astro

Source de contenu: `src/data/content.ts`

- tente Sanity si env configuré
- fallback local en cas d'absence/env invalide/erreur réseau
- normalise les liens internes + médias hérités WP

## 5) Objectif final

Quand Sanity est complètement alimenté et validé:

1. supprimer le fallback WP (`src/data/wp-pages.json`, `src/data/wp.ts`)
2. garder uniquement `src/data/content.ts` branché Sanity
