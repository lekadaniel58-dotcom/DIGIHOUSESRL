// Presentation only: keep source names, matching, supplier filters and product codes intact.
const supplierNames = /\b(?:Gruppo AIP Porte|AIP Porte|GP Porte|Pail Porte|Fossati Serramenti|Sallustio Infissi e Persiane|IVC The Color Company|OPERA Adhesives|Premier Unicalce|Muratti|Fossati|Sallustio|Dierre|Zanzar|Premier|Pail|AIP|IVC|HEX)\b/gi;

export function catalogDisplayText(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/\b(?:di|del|della)\s+(?=(?:GP Porte|Fossati(?: Serramenti)?|Dierre|Pail(?: Porte)?|AIP(?: Porte)?)\b)/gi, '')
    .replace(supplierNames, '')
    .replace(/\b(?:OPERA|Opera)\b/g, '')
    .split('·').map(part => part.trim()).filter(Boolean).join(' · ')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
