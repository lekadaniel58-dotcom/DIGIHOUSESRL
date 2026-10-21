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
const products = groupBucketFormats([...rows, ...extras].map(r => ({ ...r,
  department_id: slug(r.department), partner_ids: getPartnerIds(r.name, slug(r.department)) })));
assert.equal(new Set(partners.map(p => p.id)).size, 9);
for (const partner of partners) {
  for (const name of partner.productNames) assert([...rows, ...extras].some(r => r.name === name), `${partner.id}: ${name}`);
  for (const department of partner.departments) assert(rows.some(r => slug(r.department) === department));
  assert(products.some(p => p.partner_ids.includes(partner.id)), `${partner.id}: selezione non vuota`);
  if (partner.logo && !['muratti', 'hex'].includes(partner.id)) assert(fs.existsSync(new URL(`../public${partner.logo}`, import.meta.url)));
  // The two original logos are downloaded and signature-checked before publication.
}
const expectedCounts = { ivc: 8, muratti: 3, hex: 5, aip: 24, dierre: 21, sallustio: 32, zanzar: 71, opera: 24, premier: 10 };
for (const [id, count] of Object.entries(expectedCounts)) assert.equal(products.filter(p => p.partner_ids.includes(id)).length, count, id);
assert(!getPartnerIds('KT PLUS BIANCA', 'adesivi-e-sigillanti').includes('opera'));
assert(!getPartnerIds('SILICONE ACETICO FISCHER', 'adesivi-e-sigillanti').includes('opera'));
assert(getPartnerIds('SIGILCOLOR · LEGNO', 'adesivi-e-sigillanti').includes('opera'));
assert(getPartnerIds('SKIN', 'infissi').includes('sallustio'));
assert(!getPartnerIds('SKIN', 'infissi').includes('dierre'));
for (const extra of extras) {
  assert(!rows.some(r => r.sku === extra.sku || r.name === extra.name));
  assert.equal(extra.variant, '14 LT');
  assert.equal(extra.price, '');
  assert(extra.smaller_formats.length >= 2);
  assert(fs.existsSync(new URL(`../public/assets/${extra.image}`, import.meta.url)));
}
console.log(`Partner verificati: ${JSON.stringify(expectedCounts)}; ${products.length} schede totali.`);

for (const name of ['FERRHEX COMPONENTE A', 'FERRHEX COMPONENTE B']) {
  const product = products.find(p => p.name === name);
  assert(product, name);
  assert(product.partner_ids.includes('hex'), `${name}: presente sotto HEX`);
  assert(product.partner_ids.includes('ivc'), `${name}: presente sotto IVC`);
}
