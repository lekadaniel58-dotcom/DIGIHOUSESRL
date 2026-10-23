import type { Product } from './types';

type FilterProduct = Pick<Product, 'department_id' | 'partner_ids'>;
const inDepartment = (product: FilterProduct, department: string) => !department ||
  product.department_id === department || department === 'porte' && ['porte-interne', 'porte-blindate'].includes(product.department_id ?? '');

export function changeCatalogFilter(params: URLSearchParams, key: string, value: string, products: FilterProduct[]) {
  const next = new URLSearchParams(params);
  if (value) next.set(key, value); else next.delete(key);
  if (key === 'reparto' || key === 'partner') {
    for (const child of ['serie', 'collezione', 'materiale', 'vista', 'famiglia', 'sottocategoria']) next.delete(child);
    const department = next.get('reparto') ?? '', partner = next.get('partner') ?? '';
    if (department && partner && !products.some(p => inDepartment(p, department) && p.partner_ids?.includes(partner))) {
      // Keep the newly chosen filter and clear the incompatible previous choice.
      next.delete(key === 'partner' ? 'reparto' : 'partner');
    }
  }
  return next;
}

export function changeCatalogQuery(params: URLSearchParams, query: string, sector: string) {
  const next = new URLSearchParams(params);
  if (query) next.set('q', query); else next.delete('q');
  if (sector) next.set('settore', sector);
  return next;
}
