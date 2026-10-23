import type { Product } from './types';

export const doorFamilies = [
  { id: 'porte-interne', name: 'Porte interne', text: 'Scegli lo stile degli ambienti: linee moderne, legno e vetro.', cover: 'Essenza' },
  { id: 'porte-blindate', name: 'Porte blindate e portoncini', text: 'Scopri le collezioni dedicate alla sicurezza e all’ingresso.', cover: 'Synergy Out' },
] as const;

export const doorCollections = [
  { id: 'moderne', family: 'porte-interne', name: 'Trix · porte moderne', match: 'porte moderne', text: 'Geometrie contemporanee, superfici e dettagli di carattere.', cover: 'Grafix' },
  { id: 'legno', family: 'porte-interne', name: 'Sololegno · porte in legno', match: 'porte in legno', text: 'Venature, finiture e lavorazioni per dare personalità agli interni.', cover: 'Essenza' },
  { id: 'vetro', family: 'porte-interne', name: 'Visioni · porte in vetro', match: 'porte in vetro', text: 'Trasparenze e soluzioni che lasciano spazio alla luce.', cover: 'Athena' },
  { id: 'aip-tech', family: 'porte-interne', name: 'AIP Tech', match: 'aip tech', text: 'Porte tecniche e soluzioni per ambienti professionali.', cover: 'AllTech' },
  { id: 'high-tech', family: 'porte-blindate', name: 'High-tech', match: 'high-tech', text: 'Le soluzioni della gamma dedicata alla sicurezza connessa.', cover: 'hibry5' },
  { id: 'prestige', family: 'porte-blindate', name: 'Prestige', match: 'prestige', text: 'La collezione di porte blindate di alta gamma.', cover: 'Sleek' },
  { id: 'compact', family: 'porte-blindate', name: 'Compact', match: 'compact', text: 'La gamma di porte blindate compatte e accessibili.', cover: 'Tablet' },
  { id: 'teknica', family: 'porte-blindate', name: 'Teknica', match: 'teknica', text: 'Porte tecniche per esigenze e ambienti specifici.', cover: 'Sblock Push' },
  { id: 'portoncini', family: 'porte-blindate', name: 'Portoncini e serramenti esterni', match: 'portoncini e serramenti esterni', text: 'Le proposte dedicate agli ingressi esterni.', cover: 'Greta' },
] as const;

export function getDoorCollection(product: Product) {
  if (product.door_collection && product.department_id === 'porte-interne') return doorCollections.find(c => c.id === product.door_collection && c.family === 'porte-interne');
  return doorCollections.find(collection => collection.family === product.department_id &&
    product.subtitle?.toLocaleLowerCase('it').split('·').some(part => part.trim() === collection.match));
}

export function getDoorFamily(department: string, partner: string) {
  if (doorFamilies.some(family => family.id === department)) return department;
  if (!department && partner === 'aip') return 'porte-interne';
  if (!department && partner === 'dierre') return 'porte-blindate';
  return '';
}
