# Natur' Au Feminin

Site vitrine de Natur' Au Feminin, développé avec Astro et alimenté par Sanity pour la gestion des contenus.

## Objectif du site

- Présenter l’activité et les prestations
- Publier les informations pratiques (tarifs, contact, mentions)
- Mettre en avant les actualités et événements

## Stack technique

- Astro (site statique)
- Sanity (CMS headless)
- Déploiement statique (dossier `dist/`)

## Arborescence utile

```text
/
├── public/                  # Assets statiques (images, favicon, etc.)
├── src/
│   ├── pages/               # Pages du site
│   ├── components/          # Composants UI
│   ├── layouts/             # Layouts partagés
│   └── data/                # Configuration et chargement de contenu
├── sanity/                  # Schémas CMS
├── scripts/                 # Scripts de vérification / migration contenu
└── package.json
```

## Prérequis

- Node.js `>= 22.12.0`
- npm

## Installation

```bash
npm install
```

## Variables d’environnement

Créer un fichier `.env` à partir de `.env.example` :

```bash
cp .env.example .env
```

Renseigner les valeurs nécessaires pour le CMS et la configuration du site.

## Commandes principales

```bash
npm run dev            # Lancer le site en local
npm run build          # Build de production dans dist/
npm run preview        # Prévisualiser le build localement
npm run sanity:check   # Vérifier la connexion et le contenu Sanity
```

## Mise en ligne (statique)

1. Générer le build :

```bash
npm run build
```

2. Déployer le contenu du dossier `dist/` sur l’hébergement.

## Contenu éditorial

- Le contenu de pages est géré dans Sanity.
- Les modèles de documents sont définis dans `sanity/schemaTypes/`.
- Certains scripts `scripts/` permettent de vérifier/synchroniser des contenus.

## Domaine de production

- `https://naturaufeminin.fr`

## Licence

Projet privé.
