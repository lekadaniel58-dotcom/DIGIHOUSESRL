import type { Product } from './types';

export const doorFamilies = [
  { id: 'porte-interne', name: 'Porte interne', text: 'Scegli lo stile degli ambienti: linee moderne, legno e vetro.', cover: 'Essenza' },
  { id: 'porte-blindate', name: 'Porte blindate e sicurezza', text: 'Porte blindate, inferriate e persiane per la sicurezza della casa.', cover: 'Synergy Out' },
] as const;

export const doorCollections = [
  { id: 'moderne', family: 'porte-interne', name: 'Trix · porte moderne', match: 'porte moderne', text: 'Geometrie contemporanee, superfici e dettagli di carattere.', cover: 'Grafix' },
  { id: 'legno', family: 'porte-interne', name: 'Sololegno · porte in legno', match: 'porte in legno', text: 'Venature, finiture e lavorazioni per dare personalità agli interni.', cover: 'Essenza' },
  { id: 'gp-legno', family: 'porte-interne', name: 'Porte in legno', match: 'gp legno', text: 'Tutte le linee di porte in legno, suddivise per serie e singolo modello.', cover: 'Classic 01' },
  { id: 'vetro', family: 'porte-interne', name: 'Visioni · porte in vetro', match: 'porte in vetro', text: 'Trasparenze e soluzioni che lasciano spazio alla luce.', cover: 'Athena' },
  { id: 'pail-rapido', family: 'porte-interne', name: 'Rapido', match: 'rapido pail', text: 'Porte delle serie Riga, Luna, Linea, Marsia e Mimetica. Finiture e configurazioni da concordare.', cover: 'Riga Milano' },
  { id: 'pail-super-rapido', family: 'porte-interne', name: 'Super Rapido', match: 'super rapido pail', text: 'La selezione Super Rapido delle serie Linea e Marsia. Disponibilità e tempi da confermare al preventivo.', cover: 'Linea Cieca' },
  { id: 'high-tech', family: 'porte-blindate', name: 'High-tech', match: 'high-tech', text: 'Le soluzioni della gamma dedicata alla sicurezza connessa.', cover: 'hibry5' },
  { id: 'prestige', family: 'porte-blindate', name: 'Prestige', match: 'prestige', text: 'La collezione di porte blindate di alta gamma.', cover: 'Sleek' },
  { id: 'compact', family: 'porte-blindate', name: 'Compact', match: 'compact', text: 'La gamma di porte blindate compatte e accessibili.', cover: 'Tablet' },
  { id: 'teknica', family: 'porte-blindate', name: 'Teknica', match: 'teknica', text: 'Porte tecniche per esigenze e ambienti specifici.', cover: 'Sblock Push' },
  { id: 'inferriate-persiane', family: 'porte-blindate', name: 'Inferriate e persiane blindate', match: 'inferriate e persiane blindate', text: 'Greta, Anthos e Anthea: inferriate e persiane di sicurezza per finestre e portefinestre.', cover: 'Greta' },
] as const;

export function getDoorCollections(product: Product) {
  if (product.department_id === 'porte-blindate' && ['Greta', 'Anthos', 'Anthea'].includes(product.name)) return doorCollections.filter(c => c.id === 'inferriate-persiane');
  if (product.door_collections?.length || product.door_collection) return doorCollections.filter(c => c.family === product.department_id && (product.door_collections?.includes(c.id) || c.id === product.door_collection));
  return doorCollections.filter(collection => collection.family === product.department_id &&
    product.subtitle?.toLocaleLowerCase('it').split('·').some(part => part.trim() === collection.match));
}

export function getDoorCollection(product: Product) {
  return getDoorCollections(product)[0];
}

export function getDoorFamily(department: string, partner: string) {
  if (doorFamilies.some(family => family.id === department)) return department;
  if (!department && ['aip', 'pail', 'gp'].includes(partner)) return 'porte-interne';
  if (!department && partner === 'dierre') return 'porte-blindate';
  return '';
}
