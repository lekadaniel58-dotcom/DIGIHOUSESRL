import assert from 'node:assert/strict';
import fs from 'node:fs';
import { getDoorCollections, getDoorFamily } from '../src/lib/doorCollections.ts';
import { getDoorMaterials } from '../src/lib/doorMaterials.ts';
import { getProductSection, getCatalogSection } from '../src/lib/catalogSections.ts';
const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const products = read('../src/data/pailProducts.json');
const inventory = read('../docs/pail-import-inventory.json');
const coverage = read('../docs/pail-import-coverage.json');
assert.equal(products.length, 80);
assert.equal(inventory.length, 80);
assert.equal(new Set(products.map(p => p.id)).size, 80);
assert.equal(new Set(products.map(p => p.name)).size, 80);
assert.equal(getDoorFamily('', 'pail'), 'porte-interne');
assert.equal(getCatalogSection('', 'pail', ''), 'serramenti');
assert.equal(products.filter(p => getDoorCollections(p).some(c => c.id === 'pail-rapido')).length, 80);
assert.equal(products.filter(p => getDoorCollections(p).some(c => c.id === 'pail-super-rapido')).length, 33);
const expected = { riga:34, luna:5, linea:30, marsia:10, mimetica:1 };
for (const [id, count] of Object.entries(expected)) assert.equal(products.filter(p => p.door_series === id).length, count, id);
const allowed = new Set(['pail-rapido','pail-super-rapido']);
for (const product of products) {
  const source = inventory.find(s => product.id === 'pail-'+s.key);
  assert(source, product.name);
  assert.equal(product.name, source.name);
  assert.equal(product.price, null);
  assert.equal(product.sku, ''); // The official page repeats/conflicts on some Riga codes; none are invented.
  assert(product.description.length > 100, product.name);
  assert(!/72 ore|15 giorni|spedizione|consegna garantita/i.test(product.description));
  assert.deepEqual(product.partner_ids, ['pail']);
  assert.equal(getProductSection(product), 'serramenti');
  assert.deepEqual(new Set(getDoorCollections(product).map(c => c.id)), new Set(source.collections));
  assert(product.door_collections.every(id => allowed.has(id)));
  assert(source.sources.every(s => ['https://www.pailporte.com/rapidopail/','https://www.pailporte.com/super-rapido-pail/'].includes(s.source_url)));
  assert(source.sources.some(s => s.source_image_url === source.image.image_url), product.name);
  assert.equal(source.image.full, product.images[0]);
  assert.equal(source.image.thumbnail, product.thumbnail);
  assert(source.image.width >= 700 && source.image.height >= 700);
  for (const file of [...product.images, product.thumbnail]) {
    const bytes = fs.readFileSync(new URL('../data/immagini/'+file, import.meta.url));
    assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
  }
  assert(!getDoorMaterials(product).some(m => m.id === 'legno'), 'Effetto legno non implica legno massello');
}
for (const entry of coverage) {
  const source = inventory.find(s => s.key === entry.key);
  assert(source, entry.label);
  assert(source.collections.includes(entry.program), entry.label);
  assert(source.sources.some(s => s.source_label === entry.label && s.source_image_url === entry.image_url && s.program === entry.program), entry.label);
}
assert.equal(products.filter(p => getDoorMaterials(p).some(m => m.id === 'laccato')).length, 40);
assert.equal(products.filter(p => getDoorMaterials(p).some(m => m.id === 'decorato')).length, 39);
assert.equal(products.filter(p => getDoorMaterials(p).some(m => m.id === 'vetro')).length, 24);
assert(!products.some(p => p.partner_ids.includes('aip')));
console.log(`Pail: solo Rapido Pail (80 configurazioni) e Super Rapido (33 condivise), 5 serie, ${coverage.length} riferimenti ufficiali coperti; nessun duplicato o prezzo inventato.`);
