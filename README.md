# Natur' Au Feminin

Site vitrine statique développé avec Astro. Les contenus éditoriaux sont gérés par
[Admin-Sites-Astro](https://github.com/Stan69000/Admin-Sites-Astro).

## Stack

- Astro
- API publique de l'administration centralisée
- Déploiement statique vers O2Switch

## Installation

Prérequis : Node.js `>= 22.12.0` et npm `10.9.0`. La version Node de référence
est déclarée dans `.node-version`.

```bash
npm install
cp .env.example .env
npm run dev
```

## Configuration

`NAF_ADMIN_API_URL` est obligatoire pour charger les pages pendant le build.

```dotenv
NAF_ADMIN_API_URL=https://admin.stan-bouchet.fr
PUBLIC_CONTACT_FORM_ENDPOINT=/contact.php
PUBLIC_TURNSTILE_SITE_KEY=
```

Le footer possède un contenu statique de secours. Les pages éditoriales n'ont pas
de source secondaire : si l'API d'administration est indisponible, le build échoue
afin d'éviter de publier un site incomplet ou obsolète.

## Commandes

```bash
npm run dev
npm run build
npm run check
npm run audit
npm run preview
```

## Contrôles CI

Les pull requests exécutent systématiquement :

- `astro check` ;
- un build statique avec des contenus de test déterministes ;
- Dependency Review pour refuser toute nouvelle vulnérabilité de niveau élevé ;
- CodeQL et Gitleaks.

Le mode de contenu de test exige simultanément `CI=true` et
`NAF_USE_CONTENT_FIXTURES=true`. Il ne peut donc pas remplacer par accident
l'API d'administration pendant un build local ou un déploiement de production.

L'audit npm complet continue de s'exécuter sur `main`, chaque nuit et à la
demande. Les actions GitHub sont figées sur des SHA immuables.

Les mises à jour Dependabot de type patch concernant une dépendance directe de
développement activent automatiquement le squash auto-merge. La fusion reste
bloquée jusqu'à la réussite de tous les contrôles obligatoires de `main`.

## CI/CD GitHub vers O2Switch

Le workflow `.github/workflows/deploy-o2switch.yml` :

- construit le site à chaque push sur `main` ;
- permet un déploiement manuel avec `workflow_dispatch` ;
- accepte le `repository_dispatch` envoyé par la nouvelle administration ;
- déploie le dossier `dist/` via FTPS.

La nouvelle administration envoie encore l'identifiant historique
`sanity_content_updated` pour son `repository_dispatch`. Ce nom est conservé
temporairement pour compatibilité et ne correspond plus à une intégration Sanity.

### Secrets GitHub

- `FTP_SERVER`
- `FTP_PORT`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `NAF_ADMIN_API_URL`
- `PUBLIC_CONTACT_FORM_ENDPOINT`
- `PUBLIC_TURNSTILE_SITE_KEY`
- `TRUSTED_PROXY_IPS`

## Domaine

- Site : <https://naturaufeminin.fr>
- Administration : <https://admin.stan-bouchet.fr>

## Licence

Projet privé.
