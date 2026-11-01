# Natur' Au Feminin

Site vitrine statique développé avec Astro. Les contenus éditoriaux sont gérés par
[Admin-Sites-Astro](https://github.com/Stan69000/Admin-Sites-Astro).

## Stack

- Astro
- API publique de l'administration centralisée
- Déploiement statique vers O2Switch

## Installation

Prérequis : Node.js `>= 22.23.4` et npm `10.9.0`. La version Node de référence
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

Le footer possède un contenu statique de secours.

Pour les pages éditoriales, deux situations sont distinguées :

- **l'API répond 404** — la page n'existe pas encore côté administration. C'est un
  état normal, le site publie alors le contenu de repli embarqué dans le dépôt ;
- **toute autre erreur** — l'administration est indisponible. Le build échoue, afin
  d'éviter de publier un site incomplet ou obsolète.

Seule `/menopause/` dispose aujourd'hui d'un contenu de repli (`getOptionalPageContent`).
Les autres pages utilisent `getPageContent` et font échouer le build en l'absence de
leur source.

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

## Conventions d'URL

Le site est servi par Apache, qui ajoute systématiquement le slash final. Astro est
donc réglé sur `trailingSlash: 'always'` : canoniques, sitemap et liens internes
portent tous le slash, et aucun ne déclenche de redirection.

Toute URL écrite sans slash final dans le code produit une redirection 301 inutile,
et faisait auparavant sortir les pages concernées de l'index Google.

## Règles serveur

`public/.htaccess` porte les redirections (HTTPS, apex, anciens permaliens
WordPress), les en-têtes de sécurité, la politique de cache et `Options -Indexes`.

C'est un fichier caché : l'étape `upload-artifact` du workflow doit conserver
`include-hidden-files: true`, sans quoi il est retiré de l'artefact sans erreur et
aucune de ses règles n'atteint la production.

La CSP qu'il définit autorise `'unsafe-inline'` pour les scripts — Astro en génère
deux, non hashés — et `cdn.sanity.io` pour les images du CMS.

## Dépublier une page

L'interrupteur « Dépublier la page » de l'administration ne se contente pas d'un
`noindex` : la page n'est plus produite du tout. Elle disparaît du sitemap, les liens
internes qui la visaient sont retirés, et le déploiement FTP la supprime du serveur.
Son contenu reste intact dans l'administration.

Le mécanisme repose sur `isPageHidden` (`src/data/content.ts`) et sur la table
`CMS_SLUG_BY_PATH` (`src/data/cms-pages.ts`), nécessaire parce que les slugs
héritent de WordPress et ne suivent pas les URL.

## CI/CD GitHub vers O2Switch

Le workflow `.github/workflows/deploy-o2switch.yml` :

- construit le site à chaque push sur `main` ;
- permet un déploiement manuel avec `workflow_dispatch` ;
- accepte le `repository_dispatch` envoyé par l'administration ;
- déploie le dossier `dist/` via FTPS.

**Une seule cible, la racine du site** (`SERVER_DIR: /`), et un environnement GitHub
sans règle d'approbation. Les trois déclencheurs y mènent.

Historiquement, `repository_dispatch` visait un environnement protégé par
`required_reviewers` et un sous-dossier distinct : toute publication déclenchée depuis
l'administration partait en attente d'approbation, et aucune n'est jamais arrivée en
ligne. Ne pas réintroduire de cible alternative sans raison précise.

L'administration envoie encore l'identifiant historique `sanity_content_updated` pour
son `repository_dispatch`. Ce nom est conservé pour compatibilité et ne correspond
plus à une intégration Sanity — qui ne sert aujourd'hui que de CDN aux images
héritées de la migration.

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
