import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import { parse } from 'csv-parse/sync';
import { bucketGroups, groupBucketFormats } from '../src/lib/groupBucketFormats.ts';

const rows = parse(readFileSync(new URL('../data/catalogo.csv', import.meta.url)), { columns: true, skip_empty_lines: true });
const base = rows.map((row, index) => ({
  id: `${row.sku || 'prodotto'}-${index}`, sku: row.sku, slug: '',
  name: row.variant ? `${row.name} – ${row.variant}` : row.name,
  subtitle: row.subtitle || null, description: row.description || null,
  department_id: row.department, price: row.price ? Number(row.price) : null,
  images: [row.image], is_featured: false,
}));
const grouped = groupBucketFormats(base);
const affected = new Set();
let hiddenCount = 0;
const parseLitres = variant => {
  let value = variant.replace(/\s/g, '');
  // The two 0.750 L labels in the source contain doubled OCR characters.
  if (value.startsWith('00')) value = value.replace(/(.)\1/g, '$1');
  const match = value.match(/^\d+(?:[,.]\d+)?/);
  assert(match, `Formato non riconoscibile: ${variant}`);
  return Number(match[0].replace(',', '.'));
};
for (const group of bucketGroups) {
  const family = rows.filter(row => row.name === group.name);
  assert.equal(family.length, group.smaller.length + 1, `Aggiornare il raggruppamento per i nuovi formati: ${group.name}`);
  assert.deepEqual(new Set(family.map(row => row.sku)), new Set([group.main.sku, ...group.smaller.map(format => format.sku)]));
  const source = base.find(p => p.sku === group.main.sku);
  const card = grouped.find(p => p.sku === group.main.sku);
  assert(source && card, `Formato grande assente: ${group.name}`);
  affected.add(source.sku);
  assert.equal(card.price, source.price, `Prezzo del formato grande alterato: ${group.name}`);
  assert.equal(card.name, source.name);
  assert.deepEqual(card.images, source.images);
  assert.equal(card.department_id, source.department_id);
  assert.equal(card.smaller_formats.length, group.smaller.length);
  const rawMain = rows.find(r => r.sku === group.main.sku);
  assert.equal(parseLitres(rawMain.variant), group.main.litres);
  for (const format of group.smaller) {
    const raw = rows.find(r => r.sku === format.sku);
    assert(raw, `Variante assente dal catalogo: ${format.sku}`);
    assert.equal(raw.name, group.name);
    assert.equal(raw.department, rawMain.department);
    assert.equal(parseLitres(raw.variant), format.litres, `Misura non corrispondente: ${format.sku}`);
    assert(format.litres < group.main.litres, 'La scheda mantenuta deve essere la confezione maggiore');
    assert(!grouped.some(p => p.sku === format.sku), `Scheda piccola ancora separata: ${format.sku}`);
    const label = `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 3 }).format(format.litres)} L`;
    assert(card.smaller_formats.includes(label), `Formato piccolo non indicato: ${label}`);
    assert(card.search_terms.includes(format.sku), `Codice piccolo non ricercabile: ${format.sku}`);
    affected.add(format.sku);
    hiddenCount++;
  }
}
assert.equal(grouped.length, base.length - hiddenCount);
for (const product of base) if (!affected.has(product.sku)) assert.strictEqual(grouped.find(p => p.id === product.id), product, `Prodotto estraneo modificato: ${product.id}`);
const first = bucketGroups[0];
const incomplete = groupBucketFormats(base.filter(p => p.sku !== first.main.sku));
for (const format of first.smaller) assert(incomplete.some(p => p.sku === format.sku), 'Una famiglia incompleta non deve nascondere le confezioni disponibili');
console.log(`Secchi verificati: ${bucketGroups.length} famiglie; ${hiddenCount} schede piccole accorpate; ${rows.length} voci sorgenti conservate; ${grouped.length} schede visibili.`);
