import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
import { getPartnerIds } from '../src/lib/partnerCatalog.ts';
import { groupBucketFormats } from '../src/lib/groupBucketFormats.ts';
const read = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const partners = read('../src/data/partners.json');
const extras = read('../src/data/partnerProducts.json');
const rows = parse(fs.readFileSync(new URL('../data/catalogo.csv', import.meta.url), 'utf8'), { columns: true });
const slug = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const legacyProducts = groupBucketFormats([...rows, ...extras].map(r => ({ ...r,
  department_id: slug(r.department), partner_ids: getPartnerIds(r.name, slug(r.department)) })));
const { mergeAipProducts } = await import('../src/lib/mergeAipProducts.ts');
const { replaceWindowProducts } = await import('../src/lib/replaceWindowProducts.ts');
const { replaceShutterProducts } = await import('../src/lib/replaceShutterProducts.ts');
const products = replaceShutterProducts(replaceWindowProducts([...mergeAipProducts(legacyProducts, read('../src/data/aipProducts.json')), ...read('../src/data/pailProducts.json')], read('../src/data/fossatiProducts.json')), read('../src/data/fossatiShutterProducts.json'));
assert.equal(new Set(partners.map(p => p.id)).size, 11);
for (const partner of partners) {
  for (const name of partner.productNames) assert([...rows, ...extras].some(r => r.name === name), `${partner.id}: ${name}`);
  for (const department of partner.departments) assert(rows.some(r => slug(r.department) === department));
  assert(products.some(p => p.partner_ids.includes(partner.id)), `${partner.id}: selezione non vuota`);
  if (partner.logo && !['muratti', 'hex'].includes(partner.id)) assert(fs.existsSync(new URL(`../public${partner.logo}`, import.meta.url)));
  // The two original logos are downloaded and signature-checked before publication.
}
const expectedCounts = { ivc: 14, muratti: 3, hex: 7, aip: 92, dierre: 21, sallustio: 4, zanzar: 71, opera: 24, premier: 10, pail: 80, fossati: 59 };
for (const [id, count] of Object.entries(expectedCounts)) assert.equal(products.filter(p => p.partner_ids.includes(id)).length, count, id);
assert(!getPartnerIds('KT PLUS BIANCA', 'adesivi-e-sigillanti').includes('opera'));
assert(!getPartnerIds('SILICONE ACETICO FISCHER', 'adesivi-e-sigillanti').includes('opera'));
assert(getPartnerIds('SIGILCOLOR · LEGNO', 'adesivi-e-sigillanti').includes('opera'));
assert(getPartnerIds('SKIN', 'infissi').includes('sallustio'));
assert(!getPartnerIds('SKIN', 'infissi').includes('dierre'));
for (const extra of extras) {
  assert(!rows.some(r => r.sku === extra.sku || r.name === extra.name));
  assert.equal(extra.variant, '14 LT');
  assert(Number.isFinite(Number(extra.price)) && Number(extra.price) > 0, 'Prezzo Muratti valido');
  assert(extra.smaller_formats.length >= 2);
  assert(fs.existsSync(new URL(`../public/assets/${extra.image}`, import.meta.url)));
  assert(extra.thumbnail && extra.thumbnail !== extra.image);
  assert(fs.existsSync(new URL(`../public/assets/${extra.thumbnail}`, import.meta.url)));
}
console.log(`Partner verificati: ${JSON.stringify(expectedCounts)}; ${products.length} schede totali.`);

for (const name of ['FERRHEX COMPONENTE A', 'FERRHEX COMPONENTE B']) {
  const product = products.find(p => p.name === name);
  assert(product, name);
  assert(product.partner_ids.includes('hex'), `${name}: presente sotto HEX`);
  assert(!product.partner_ids.includes('ivc'), `${name}: non duplicato sotto IVC`);
}
for (const product of products) {
  assert(product.partner_ids.length <= 1, `${product.name}: più partner assegnati`);
  if (/\b[a-z0-9]*hex\b/i.test(product.name)) assert.deepEqual(product.partner_ids, ['hex']);
  if (product.partner_ids.includes('ivc')) assert(!/\b[a-z0-9]*hex\b/i.test(product.name));
}
for (const name of ['MALTHEX', 'FLEXOCOTE', 'ACRIL-SILOSSANICO']) {
  assert.deepEqual(getPartnerIds(name, 'materiali-edili'), ['hex'], name);
}
assert.deepEqual(getPartnerIds('NUOVOHEX 25 KG', 'materiali-edili'), ['hex']);
assert.deepEqual(getPartnerIds('THERMORIFLEX IR', 'pitture-e-decorazioni'), ['ivc']);
assert.deepEqual(getPartnerIds('SILICONE ACETICO FISCHER', 'adesivi-e-sigillanti'), []);
