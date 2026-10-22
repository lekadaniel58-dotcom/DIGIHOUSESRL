import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parse } from 'csv-parse/sync';
const readCSV = path => parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'), { columns: true, skip_empty_lines: true });
const rows = readCSV('../data/catalogo.csv');
const extras = JSON.parse(fs.readFileSync(new URL('../src/data/partnerProducts.json', import.meta.url), 'utf8'));
const review = readCSV('../docs/catalog-text-audit.csv');
assert.equal(review.length, rows.length + extras.length);
for (const [i, row] of [...rows, ...extras].entries()) {
  assert(row.description.trim().length > 0, `Descrizione assente: ${row.sku || row.name}`);
  assert(!row.subtitle.trim().endsWith('·'), `Sottotitolo troncato: ${row.sku || row.name}`);
  assert(!/SSiiggi|775500|LTT|R0IGIDE|S0TANLEY|CCMH/.test(`${row.variant} ${row.description}`), `Artefatto OCR: ${row.sku}`);
  const record = review[i];
  assert.equal(record.sku, row.sku);
  assert.equal(record.name, row.name);
  assert.equal(record.department, row.department);
  assert(['corretta', 'confermata'].includes(record.status));
  assert(record.evidence.trim());
  for (const [field, value] of Object.entries(JSON.parse(record.corrected_text))) assert.equal(row[field], value, `${row.sku}: ${field}`);
}
const bySku = new Map(rows.map(row => [row.sku, row]));
for (const sku of ['00552', '00554']) assert.equal(bySku.get(sku).description, bySku.get('00543').description);
assert.equal(bySku.get('00360').variant, '20');
assert.equal(bySku.get('00495').variant, 'Archetto corto');
assert.equal(bySku.get('00182').variant, '0,75 L');
assert.equal(bySku.get('00410').variant, '', 'Non inventare la misura non leggibile');
for (const sku of ['00450', '00451', '00452', '00453']) assert(bySku.get(sku).name.includes('PENNELLESSA'));
for (const row of rows.filter(r => ['SKIN', 'Invisible light', 'Sicur Alu Door', 'Invisible'].includes(r.name))) assert.equal(row.subtitle, 'Finestre e infissi · Soluzioni complementari');
console.log(`Testi verificati: ${review.length}/${review.length} record; ${review.filter(r => r.status === 'corretta').length} righe corrette; nessuna descrizione assente.`);
