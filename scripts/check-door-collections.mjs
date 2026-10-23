import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
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
