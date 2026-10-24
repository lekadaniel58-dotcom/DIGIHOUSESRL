import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { replaceShutterProducts } from '../src/lib/replaceShutterProducts.ts';
import { getWindowCollection } from '../src/lib/windowCollections.ts';
const read = p => JSON.parse(fs.readFileSync(new URL(p, import.meta.url), 'utf8'));
const products = read('../src/data/fossatiShutterProducts.json');
const retired = read('../src/data/retiredShutterNames.json');
const inventory = read('../docs/fossati-shutters-inventory.json');
const rows = parse(fs.readFileSync(new URL('../data/catalogo.csv', import.meta.url), 'utf8'), {columns:true});
assert.equal(products.length, 17);
assert.deepEqual(products.map(p => ({id:p.id,name:p.name})), inventory.models.flatMap(m => m.variants.map(v => ({id:v.id,name:v.name}))));
for (const m of inventory.models) {
  assert.equal(m.variants.length, m.options.length);
  assert.deepEqual(m.variants.map(v => v.type), m.options);
}
assert.equal(new Set(products.map(p => p.id)).size, 17);
assert.equal(inventory.catalogue.pages, 26);
assert.equal(inventory.models.length, 4);
assert.equal(retired.length, 9);
assert.deepEqual(new Set(retired), new Set(rows.filter(p => p.department === 'Infissi' && /^(Persiana |Scuri )/.test(p.name)).map(p => p.name)));
for (const p of products) {
  const source = inventory.models.find(m => m.variants.some(v => v.id === p.id));
  assert(source);
  assert.equal(p.department_id, 'infissi');
  assert.deepEqual(p.partner_ids, ['fossati']);
  assert.equal(p.price, null);
  assert.equal(p.sku, '');
  assert.equal(getWindowCollection(p)?.family, 'persiane');
  assert.equal(getWindowCollection(p)?.id, source.collection);
  assert.equal(p.images[0], source.image.full);
  assert.equal(p.thumbnail, source.image.thumbnail);
  assert.equal(new URL(p.source_url).hostname, 'www.fossatiserramenti.it');
  assert.match(p.description, /alluminio/);
  const variant = source.variants.find(v => v.id === p.id);
  assert(p.description.toLowerCase().includes(variant.type.replace(' su richiesta','').toLowerCase()));
  assert.match(p.image_note, /rappresentativa/);
  for (const file of [...p.images,p.thumbnail]) {
    const bytes = fs.readFileSync(new URL('../data/immagini/'+file, import.meta.url));
    assert.equal(bytes.subarray(8,12).toString(), 'WEBP');
    assert(bytes.length < 800_000);
  }
}
assert.match(products.find(p => p.name.startsWith('Picasso')).description, /esclusivamente su telaio/);
const legacy = rows.map((p,i) => ({...p,id:String(i),department_id:p.department === 'Infissi'?'infissi':'other'}));
const result = replaceShutterProducts(legacy, products);
assert.equal(result.length, legacy.length-9+17);
assert(!result.some(p => p.department_id === 'infissi' && retired.includes(p.name)));
for (const p of legacy.filter(p => !retired.includes(p.name))) assert(result.includes(p), p.name);
for (const name of ['Anthos','Anthea']) {
  const original = legacy.find(p => p.name.toLowerCase().includes(name.toLowerCase()));
  assert(original, name);
  assert(result.includes(original), name+': Dierre must remain unchanged');
}
assert.deepEqual(replaceShutterProducts(result, products), result);
console.log('Persiane: 17 tipologie Fossati verificate su 4 linee, 9 precedenti ritirati; Dierre e tutti gli altri prodotti preservati.');
