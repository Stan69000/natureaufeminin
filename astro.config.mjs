// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://naturaufeminin.fr',
  trailingSlash: 'never',
  compressHTML: true,
  redirects: {
    '/contact-prise-de-rendez-vous': '/contact',
    '/que-se-passe-t-il-en-ce-moment': '/actualites',
    '/gestion-naturelle-de-la-fertilite-symptothermie': '/prestations/symptothermie',
    '/doula-un-bebe-pour-bientot': '/prestations/doula',
    '/lecoute-corporelle-par-la-voie-des-sens': '/prestations/ecoute-corporelle',
    '/naturopathie': '/prestations/naturopathie',
  },
});
