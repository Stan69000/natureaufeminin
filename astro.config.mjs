// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://naturaufeminin.fr',

  // Apache (O2Switch) ajoute systematiquement le slash final via DirectorySlash.
  // 'never' faisait declarer aux canonicals et au sitemap des URL sans slash,
  // qui redirigent en 301 vers la version avec slash : Google recevait deux
  // signaux contradictoires et laissait les pages concernees hors index.
  // 'always' aligne canonicals, sitemap et serveur sur une seule forme.
  trailingSlash: 'always',
  build: { format: 'directory' },

  compressHTML: true,

  // Les redirections d'anciens permaliens WordPress sont desormais servies
  // en vrai 301 par public/.htaccess. Les conserver ici produirait en plus
  // des pages HTML 200 avec meta-refresh, que Google traite comme des
  // redirections molles et indexe comme des doublons.
});
