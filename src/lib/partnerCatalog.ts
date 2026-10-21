import partners from '../data/partners.json' with { type: 'json' };

export function getPartnerIds(name: string, department: string): string[] {
  return partners.filter(partner => partner.departments.some(value => value === department) ||
    partner.productNames.some(value => value === name)).map(partner => partner.id);
}
