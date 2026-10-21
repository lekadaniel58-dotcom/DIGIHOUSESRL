import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { strict as assert } from 'node:assert';
import { pathToFileURL } from 'node:url';
import { parse } from 'csv-parse/sync';

export function checkCatalogCategories(products, audit) {
  assert.equal(audit.length, products.length, 'Ogni riga del catalogo deve avere una verifica');
  assert(products.length > 0, 'Catalogo vuoto');
  const byId = new Map(audit.map(entry => [entry.product_id, entry]));
  assert.equal(byId.size, audit.length, 'Identificatori duplicati nel registro');
  let corrected = 0;
  products.forEach((product, index) => {
    const id = `${product.sku || 'prodotto'}-${index}`;
    const entry = byId.get(id);
    assert(entry, `Prodotto non verificato: ${id}`);
    assert.equal(Number(entry.row), index + 1, `Ordine non corrispondente: ${id}`);
    assert.equal(product.name, entry.name, `Nome non corrispondente: ${id}`);
    assert.equal(product.variant, entry.variant, `Variante non corrispondente: ${id}`);
    assert.equal(product.department, entry.expected_department, `Categoria errata: ${id} ${product.name}`);
    assert(['confermata', 'corretta'].includes(entry.status), `Verifica incompleta: ${id}`);
    assert(entry.reason && entry.evidence, `Motivazione o riferimento mancante: ${id}`);
    const protectedFields = Object.fromEntries(Object.entries(product).filter(([key]) => key !== 'department'));
    const hash = createHash('sha256').update(JSON.stringify(protectedFields)).digest('hex');
    assert.equal(hash, entry.protected_fields_sha256, `Dati prodotto modificati senza aggiornare la verifica: ${id}`);
    if (entry.status === 'corretta') corrected++;
  });
  return { reviewed: products.length, corrected, departments: new Set(products.map(p => p.department)).size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = { columns: true, skip_empty_lines: true };
  const products = parse(readFileSync(new URL('../data/catalogo.csv', import.meta.url)), options);
  const audit = parse(readFileSync(new URL('../docs/catalog-category-audit.csv', import.meta.url)), options);
  const result = checkCatalogCategories(products, audit);
  console.log(`Categorie verificate: ${result.reviewed}/${products.length}; ${result.corrected} correzioni; ${result.departments} reparti; nessuna riga saltata.`);
}
