import type { Product } from './types';

export const doorMaterials = [
  { id: 'laminato', name: 'Laminato', text: 'Pannelli in laminato HPL e telai in alluminio.', cover: '', models: [] },
  { id: 'melaminico', name: 'Melaminico', text: 'Le superfici decorative della gamma Trix.', cover: 'Grafix GF01', models: [] },
  { id: 'legno', name: 'Legno', text: 'Essenze, venature e lavorazioni della gamma di porte in legno.', cover: 'Essenza', models: ['Essenza', 'Ideale', 'Prestige', 'Concerto', 'Reset', 'Sintesi', 'Living', 'Stilidea', 'Lineaidea', 'Fiabidea', 'Imagine'] },
  { id: 'vetro', name: 'Vetro', text: 'Porte in vetro e modelli con parti vetrate indicate nel catalogo.', cover: 'Athena · battente', models: ['Neos', 'Xline', 'Concerto', 'Reset', 'Sintesi', 'Fiabidea', 'Athena · battente', 'Cubo Fluid · scorrevole', 'Style · rasomuro', 'Nexus · profili moderni', 'Pivot · bilico', 'Industrial · geometrie'] },
  { id: 'laccato', name: 'Laccate', text: 'La finitura laccata per dare carattere agli ambienti.', cover: 'Stilidea', models: ['Stilidea'] },
];

export function getDoorMaterials(product: Product) {
  if (product.department_id !== 'porte-interne') return [];
  return doorMaterials.filter(material => material.models.includes(product.name) || product.door_materials?.includes(material.id));
}
