import partners from '../data/partners.json' with { type: 'json' };

export function getPartnerIds(name: string, department: string): string[] {
  // Match the product family too: FERRHEX COMPONENTE B and RASHEX K8 GRIGIO.
  // HEX takes precedence over the IVC manufacturer shown on some packaging.
  if (/\b[a-z0-9]*hex\b/i.test(name)) return ['hex'];
  return partners.filter(partner => partner.departments.some(value => value === department) ||
    partner.productNames.some(value => value === name)).map(partner => partner.id);
}
