import retiredNames from '../data/retiredShutterNames.json' with { type: 'json' };
import type { Product } from './types';
const retired = new Set(retiredNames);

export function replaceShutterProducts(products: Product[], additions: Product[]): Product[] {
  const incomingIds = new Set(additions.map(p => p.id));
  return [...products.filter(p => !(p.department_id === 'infissi' && retired.has(p.name)) && !incomingIds.has(p.id)), ...additions];
}
