import type { Product } from './types';

export function mergeAipProducts(products: Product[], additions: Product[]): Product[] {
  // The seven existing Trix rows describe series, not additional door models.
  const seriesNames = new Set(additions.filter(p => p.door_series).map(p => p.door_series!.toLowerCase()));
  const official = additions;
  const merged = products.filter(p => !(p.department_id === 'porte-interne' && seriesNames.has(p.name.toLowerCase()))).map(p => {
    const replacement = p.department_id === 'porte-interne' && p.name === 'Industrial · geometrie' ? official.find(m => m.name === 'Industrial') : undefined;
    return replacement ? { ...p, images: replacement.images, thumbnail: replacement.thumbnail, door_materials: replacement.door_materials, source_url: replacement.source_url } : p;
  });
  const existing = new Set(merged.map(p => `${p.department_id}:${p.name.split(' · ')[0].toLowerCase()}`));
  merged.push(...official.filter(p => !existing.has(`${p.department_id}:${p.name.toLowerCase()}`)));
  return merged;
}
