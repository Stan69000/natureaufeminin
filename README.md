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

## CI/CD GitHub vers O2Switch

Le repo inclut un workflow GitHub Actions :

- `.github/workflows/deploy-o2switch.yml`
- Build automatique à chaque push sur `main`
- Déploiement FTP vers O2Switch après validation environnement `production`

### Secrets GitHub à configurer

Dans `Settings > Secrets and variables > Actions` :

- `FTP_SERVER`
- `FTP_PORT` (ex: `21`)
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_VERSION`
- `PUBLIC_CONTACT_FORM_ENDPOINT`
- `PUBLIC_TURNSTILE_SITE_KEY`

### Activer l’approbation manuelle (auto + approve run)

Dans `Settings > Environments > production` :

1. Créer l’environnement `production`
2. Activer `Required reviewers`
3. Ajouter ton compte (ou vos comptes)

Ensuite :

- Le build démarre automatiquement sur push `main`
- Le job de déploiement attend l’approbation
- Après validation, la publication vers O2Switch se lance

## Contenu éditorial

- Le contenu de pages est géré dans Sanity.
- Les modèles de documents sont définis dans `sanity/schemaTypes/`.
- Certains scripts `scripts/` permettent de vérifier/synchroniser des contenus.

## Domaine de production

- `https://naturaufeminin.fr`

## Licence

Projet privé.
