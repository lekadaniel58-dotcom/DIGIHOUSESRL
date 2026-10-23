import type { Product } from './types';

export const catalogSections = [
  { id: 'serramenti', name: 'Serramenti e comfort', text: 'Porte, finestre, persiane, avvolgibili e zanzariere: scegli la soluzione per la tua casa.', image: 'comfort-interni-finestre.webp' },
  { id: 'edilizia', name: 'Edilizia e ferramenta', text: 'Materiali edili, pitture, adesivi, utensili e accessori per il cantiere e il fai-da-te.', image: 'hero-haus-buerger.avif' },
] as const;
export const fittingsDepartments = ['porte-interne', 'porte-blindate', 'infissi', 'avvolgibili-e-tapparelle', 'zanzariere'];
export function getProductSection(product: Pick<Product, 'department_id'>) {
  return fittingsDepartments.includes(product.department_id ?? '') ? 'serramenti' : 'edilizia';
}
export function getCatalogSection(department: string, partner: string, selected: string) {
  if (department) return department === 'porte' || fittingsDepartments.includes(department) ? 'serramenti' : 'edilizia';
  if (['aip', 'pail', 'dierre', 'sallustio', 'zanzar'].includes(partner)) return 'serramenti';
  if (partner) return 'edilizia';
  return catalogSections.some(s => s.id === selected) ? selected : '';
}
