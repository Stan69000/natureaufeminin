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
- Déploiement FTP en parallèle vers `/` (racine du compte FTP utilisé)
- Possibilité de déployer en production via `workflow_dispatch` avec `target=production`
- Déclenchement auto possible depuis Sanity via `repository_dispatch` (`sanity_content_updated`)

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
- Le déploiement se fait vers `/naturaufeminin-next/` (site parallèle)
- Pour publier en prod (`/naturaufeminin.fr/`), lancer manuellement le workflow avec `target=production`

## Stratégie recommandée : nouveau site en parallèle puis bascule

### 1) Déployer le nouveau site en parallèle

- Push sur `main` (ou lancement manuel sans `target=production`)
- Le workflow déploie sur `/naturaufeminin-next/`

### 2) Vérifier le nouveau site

- Ouvrir une URL de test pointant vers ce dossier (selon ta config O2Switch)
- Valider formulaires, SEO, images, liens, performances

### 3) Basculer le domaine principal sur le nouveau dossier

Dans ton cas (racine domaine sur dossier `naturaufeminin.fr`), la bascule la plus simple est un swap de dossiers côté hébergement :

1. Sauvegarder l’ancien :
   - `/naturaufeminin.fr/` -> `/naturaufeminin.fr_backup_YYYYMMDD/`
2. Promouvoir le nouveau :
   - `/naturaufeminin-next/` -> `/naturaufeminin.fr/`

La bascule est quasi instantanée (pas de propagation DNS si on garde le même hébergement).

### 4) Rollback rapide si besoin

1. `/naturaufeminin.fr/` (nouveau) -> `/naturaufeminin.fr_failed_YYYYMMDD/`
2. `/naturaufeminin.fr_backup_YYYYMMDD/` -> `/naturaufeminin.fr/`

## Déploiement auto après modification Sanity

Le workflow accepte l'événement GitHub `repository_dispatch` avec le type:

- `sanity_content_updated`

Quand cet événement est reçu, le workflow déploie automatiquement en cible `production`.

### Configuration webhook Sanity (une fois)

1. Dans Sanity Manage: `API > Webhooks > Create webhook`
2. URL:
   - `https://api.github.com/repos/Stan69000/natureaufeminin/dispatches`
3. Method:
   - `POST`
4. Headers:
   - `Accept: application/vnd.github+json`
   - `Authorization: Bearer <GITHUB_DISPATCH_TOKEN>`
   - `X-GitHub-Api-Version: 2022-11-28`
5. Payload JSON:

```json
{
  "event_type": "sanity_content_updated",
  "client_payload": {
    "source": "sanity"
  }
}
```

6. Trigger:
   - sur publish/update du type document `page`

### Secret GitHub conseillé

Créer un token GitHub (fine-grained) avec accès `Actions` et `Contents` sur ce repo, puis l'utiliser dans Sanity comme valeur du header `Authorization`.

## Contenu éditorial

- Le contenu de pages est géré dans Sanity.
- Les modèles de documents sont définis dans `sanity/schemaTypes/`.
- Certains scripts `scripts/` permettent de vérifier/synchroniser des contenus.

## Domaine de production

- `https://naturaufeminin.fr`

## Licence

Projet privé.
