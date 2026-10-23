import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { getDoorMaterials, doorMaterials } from '../src/lib/doorMaterials.ts';
import { doorCollections, getDoorCollection, getDoorFamily } from '../src/lib/doorCollections.ts';
const rows = parse(fs.readFileSync(new URL('../data/catalogo.csv', import.meta.url), 'utf8'), { columns: true });
const products = rows.filter(r => ['Porte interne', 'Porte blindate'].includes(r.department)).map(r => ({ ...r, department_id: r.department === 'Porte interne' ? 'porte-interne' : 'porte-blindate' }));
const expected = {
  moderne: ['Grafix', 'Vertis', 'Neos', 'Xtipe', 'Xline', 'Relex', 'Klax'],
  legno: ['Essenza', 'Ideale', 'Prestige', 'Concerto', 'Reset', 'Sintesi', 'Living', 'Stilidea', 'Lineaidea', 'Fiabidea', 'Imagine'],
  vetro: ['Athena · battente', 'Cubo Fluid · scorrevole', 'Style · rasomuro', 'Nexus · profili moderni', 'Pivot · bilico', 'Industrial · geometrie'],
  'high-tech': ['hibry5', 'Next Elettra'],
  prestige: ['Sleek Out', 'Sleek', 'Sentry-Evo', 'Synergy Out', 'Synergy In', 'Vitra', 'Silence', 'Wall Security'],
  compact: ['D180', 'Tablet', 'Tablet Class 4', 'Tablet Plus'],
  teknica: ['Synergy-In Firecut', 'Sblock Push', 'Under 1', 'Under 2'],
  portoncini: ['Greta', 'Anthos', 'Anthea'],
};
assert.equal(products.length, 45);
assert.equal(doorCollections.length, 8);
for (const [id, names] of Object.entries(expected)) {
  const assigned = products.filter(product => getDoorCollection(product)?.id === id).map(product => product.name);
  assert.deepEqual(new Set(assigned), new Set(names), id);
}
for (const product of products) assert(getDoorCollection(product), `${product.name}: collezione assente`);
assert.equal(getDoorFamily('', 'aip'), 'porte-interne');
assert.equal(getDoorFamily('', 'dierre'), 'porte-blindate');
assert.equal(getDoorFamily('', 'hex'), '');
assert.equal(getDoorCollection({ department_id: 'infissi', subtitle: 'Porte interne · porte moderne' }), undefined);
assert.equal(getDoorCollection({ department_id: 'porte-interne', subtitle: 'Nuova collezione' }), undefined);
console.log('Porte verificate: 45 modelli, 2 famiglie, 8 collezioni; nessun modello mancante o duplicato.');

const materialCounts = { laminato: 0, legno: 11, vetro: 12, laccato: 1 };
for (const [id, count] of Object.entries(materialCounts)) assert.equal(products.filter(product => getDoorMaterials(product).some(material => material.id === id)).length, count, id);
for (const material of doorMaterials) for (const name of material.models) assert(products.some(product => product.name === name && product.department_id === 'porte-interne'), name);
assert.deepEqual(getDoorMaterials(products.find(product => product.name === 'Grafix')), []);
assert.deepEqual(getDoorMaterials(products.find(product => product.name === 'Stilidea')).map(material => material.id), ['legno', 'laccato']);
assert.equal(getDoorMaterials(products.find(product => product.name === 'Vitra')).length, 0);
console.log('Materiali verificati: 11 legno, 12 vetro/parti vetrate, 1 laccata; nessuna attribuzione non verificata al laminato.');
