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
  'inferriate-persiane': ['Greta', 'Anthos', 'Anthea'],
};
assert.equal(products.length, 45);
assert.equal(doorCollections.length, 10);
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
console.log('Porte verificate: 45 schede originarie preservate, 2 famiglie, 10 collezioni; nessun modello mancante o duplicato.');

const materialCounts = { laminato: 0, legno: 11, vetro: 12, laccato: 1 };
for (const [id, count] of Object.entries(materialCounts)) assert.equal(products.filter(product => getDoorMaterials(product).some(material => material.id === id)).length, count, id);
for (const material of doorMaterials) for (const name of material.models) assert(products.some(product => product.name === name && product.department_id === 'porte-interne'), name);
assert.deepEqual(getDoorMaterials(products.find(product => product.name === 'Grafix')), []);
assert.deepEqual(getDoorMaterials(products.find(product => product.name === 'Stilidea')).map(material => material.id), ['legno', 'laccato']);
assert.equal(getDoorMaterials(products.find(product => product.name === 'Vitra')).length, 0);
console.log('Materiali delle schede originarie verificati: 11 legno, 12 vetro/parti vetrate, 1 laccata.');

const additions = JSON.parse(fs.readFileSync(new URL('../src/data/aipProducts.json', import.meta.url), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(new URL('../docs/aip-model-inventory.json', import.meta.url), 'utf8'));
const { mergeAipProducts } = await import('../src/lib/mergeAipProducts.ts');
const merged = mergeAipProducts(products, additions);
assert.equal(additions.length, 76);
assert.equal(merged.filter(p => p.department_id === 'porte-interne').length, 92);
assert.equal(new Set(merged.map(p => p.name.toLowerCase())).size, merged.length);
assert.equal(merged.filter(p => p.name.startsWith('Industrial')).length, 1);
assert.equal(merged.filter(p => p.door_collection === 'moderne').length, 70);
assert.deepEqual(Object.fromEntries(['grafix','vertis','neos','xtipe','xline','relex','klax'].map(id => [id, merged.filter(p => p.door_series === id).length])), {grafix:20,vertis:12,neos:4,xtipe:7,xline:15,relex:8,klax:4});
for (const model of inventory.filter(p => p.collection !== 'aip-tech')) {
  const matches = merged.filter(p => p.name === model.name || model.name === 'Industrial' && p.name === 'Industrial · geometrie');
  assert.equal(matches.length, 1, model.name);
}
for (const p of additions) {
  assert.equal(p.price, null);
  assert.deepEqual(p.partner_ids, ['aip']);
  assert(getDoorCollection(p), p.name);
  assert(p.source_url.startsWith('https://aipporte.com/'));
  for (const image of [...p.images, p.thumbnail]) assert(fs.existsSync(new URL('../data/immagini/'+image, import.meta.url)), image);
}
assert(!merged.some(p => ['AllTech', 'EiTech'].includes(p.name) || p.door_collection === 'aip-tech'));
assert(!doorCollections.some(c => c.id === 'aip-tech'));
for (const file of ['DoorNavigation', 'ProductCard']) assert(!fs.readFileSync(new URL(`../src/components/${file}.tsx`, import.meta.url), 'utf8').includes('href={p.source_url}'));
assert(!fs.readFileSync(new URL('../src/components/DoorNavigation.tsx', import.meta.url), 'utf8').includes('aipCatalogs'));
assert(!getDoorMaterials(additions.find(p => p.name === 'Wood')).some(m => m.id === 'legno'));
assert.equal(mergeAipProducts(merged, additions).length, merged.length, 'Importazione ripetibile senza duplicati');
console.log('AIP: 76 proposte ufficiali coperte, 92 schede interne finali; AIP Tech e collegamenti rimossi; immagini locali, materiali verificati, nessun duplicato.');
