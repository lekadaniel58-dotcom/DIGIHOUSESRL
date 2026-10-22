import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { createSearchIndex, searchCatalog } from '../src/lib/catalogSearch.ts';
import { groupBucketFormats } from '../src/lib/groupBucketFormats.ts';
const rows = parse(fs.readFileSync(new URL('../data/catalogo.csv', import.meta.url), 'utf8'), { columns: true });
const products = groupBucketFormats(rows.map((r, i) => ({ ...r, id: String(i), name: r.variant ? `${r.name} – ${r.variant}` : r.name, department_id: r.department })));
const index = products.map(p => createSearchIndex(p, p.department));
const find = q => searchCatalog(index, q).map(r => r.product);
const names = q => find(q).map(p => p.name);
for (const [query, expected] of [
  ['vorrei una vernice contro la muffa', 'THERMOPAINT'],
  ['colla per piastrelle', 'KT PLUS BIANCA'],
  ['proteggere il pavimento', 'FELTRI PROTEZIONE PAVIMENTO'],
  ['rullo esterni', 'RULLO POLIAMMIDE PER ESTERNI'],
  ['sillicone', 'SILICONE ACETICO FISCHER'],
  ['silicne', 'SILICONE ACETICO FISCHER'],
  ['pittura muro', 'TRX'],
]) assert(names(query).some(name => name.includes(expected)), query);
assert.deepEqual(new Set(names('silicone')), new Set(names('siliconi')));
assert(!names('siliconi')[0].includes('PISTOLA'));
assert(find('cerco una finestra').slice(0, 5).every(p => p.department === 'Infissi'));
assert(find('zanzare').slice(0, 5).every(p => p.department === 'Zanzariere'));
assert.equal(find('00124')[0].sku, '00124');
assert.equal(find('00185')[0].sku, '00183');
assert.equal(find('999999999').length, 0);
assert.equal(find('prodottoinesistente').length, 0);
assert.equal(find('').length, products.length);
console.log('Ricerca verificata: richieste naturali, sinonimi, refusi, codici esatti e formati raggruppati.');

// A primary use in the subtitle outranks a secondary property in a description.
for (const query of ['muffa', 'muffe', 'antimuffa']) {
  const results = find(query);
  const firstSilicone = results.findIndex(p => p.name.startsWith('ACETIGUM'));
  assert(firstSilicone >= 0, 'Siliconi antimuffa ancora reperibili');
  for (const name of ['D800', 'SILOPITTURA', 'THERMOPAINT']) {
    const position = results.findIndex(p => p.name.startsWith(name));
    assert(position >= 0 && position < firstSilicone, `${query}: ${name} prima dei siliconi`);
  }
}
assert(find('silicone antimuffa')[0].name.startsWith('ACETIGUM'));

for (const query of ['pittura', 'pitture', 'vernice', 'vorrei pittura per interni']) {
  const results = find(query);
  assert(results.length > 0, query);
  assert(results.every(p => p.department === 'Pitture e decorazioni'), `${query}: esclusi sacchi e accessori`);
  assert(!results.some(p => p.name.startsWith('D800')), `${query}: esclusi trattamenti preparatori`);
}
assert(find('pittura').some(p => p.name.startsWith('TRX')));
assert(find('pittura').some(p => p.name.startsWith('THERMOPAINT')));
assert(find('rullo per pittura').some(p => p.name.startsWith('RULLO')));
assert(find('nastro per pittura').some(p => p.name.startsWith('NASTRO')));
assert(find('YW12').some(p => p.name.startsWith('YW12')));

assert(!find('siliconi').some(p => p.name.startsWith('SIGILCOLOR')), 'I sigillanti cementizi non sono siliconi');

for (const query of ['pi', 'pit', 'pitt', 'vern']) {
  const results = find(query);
  assert(results.length > 0, query);
  assert(results.every(p => p.department === 'Pitture e decorazioni'), `${query}: pitture, non sacchi o utensili`);
  assert(results.some(p => p.name.startsWith('TRX')), `${query}: trovata pittura con nome commerciale`);
}
for (const [query, expected] of [['pen', 'PENNELLO'], ['ru', 'RULLO'], ['sil', 'SILICONE'], ['fin', 'Infisso'], ['col', 'KT PLUS'], ['pitt est', 'PRISMA'], ['rullo per pitt', 'RULLO']]) {
  assert(names(query).some(name => name.includes(expected)), query);
}
assert(names('pri').some(name => name.startsWith('PRISMA')), 'I prefissi dei nomi commerciali restano ricercabili');
assert.equal(find('99999').length, 0, 'I codici non vengono corretti o completati come parole');
