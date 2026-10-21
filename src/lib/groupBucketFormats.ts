import type { Product } from './types';

type Format = { sku: string; litres: number };
type BucketGroup = { name: string; main: Format; smaller: Format[] };

// Explicit paint-bucket families; bottles, tools and unrelated variants stay separate.
export const bucketGroups: BucketGroup[] = [
  { name: 'TRX', main: { sku: '00183', litres: 14 }, smaller: [
    { sku: '00185', litres: 5 }, { sku: '00184', litres: 2.5 }, { sku: '00182', litres: 0.75 },
  ] },
  { name: 'X-ONE', main: { sku: '00186', litres: 14 }, smaller: [
    { sku: '00188', litres: 5 }, { sku: '00187', litres: 2.5 },
  ] },
  { name: 'THERMORIFLEX IR', main: { sku: '00192', litres: 14 }, smaller: [
    { sku: '00193', litres: 5 }, { sku: '00194', litres: 0.75 },
  ] },
  { name: 'THERMOPAINT', main: { sku: '00190', litres: 13 }, smaller: [
    { sku: '00191', litres: 4 },
  ] },
];

const formatLitres = (litres: number) => `${new Intl.NumberFormat('it-IT', { maximumFractionDigits: 3 }).format(litres)} L`;

export function groupBucketFormats(products: Product[]): Product[] {
  const bySku = new Map(products.filter(p => p.sku).map(p => [p.sku, p]));
  const hidden = new Set<string>();
  const replacements = new Map<string, Product>();
  for (const group of bucketGroups) {
    const main = bySku.get(group.main.sku);
    const smaller = group.smaller.map(format => ({ format, product: bySku.get(format.sku) }));
    // Incomplete future data must not accidentally hide available products.
    if (!main || smaller.some(({ product }) => !product)) continue;
    if ([main, ...smaller.map(({ product }) => product!)].some(product =>
      !(product.name === group.name || product.name.startsWith(`${group.name} – `)) || product.department_id !== main.department_id)) continue;
    const formats = [...group.smaller].sort((a, b) => b.litres - a.litres).map(format => formatLitres(format.litres));
    replacements.set(main.sku, {
      ...main,
      smaller_formats: formats,
      search_terms: [main.search_terms ?? '', ...formats,
        ...smaller.map(({ product }) => `${product!.name} ${product!.sku}`)].join(' '),
    });
    group.smaller.forEach(format => hidden.add(format.sku));
  }
  return products.filter(product => !hidden.has(product.sku)).map(product => replacements.get(product.sku) ?? product);
}
