import type { Product } from './types';

const normalize = (text: string) => text.toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const groups = [
  'silicone siliconi',
  'sigillante sigillanti sigillatura sigillare',
  'litro litri lt l',
  'pittura pitture vernice vernici pitturare verniciare dipingere imbiancare idropittura idropitture',
  'muro muri parete pareti murale murali',
  'muffa muffe antimuffa antimuffe', 'colla colle collante collanti adesivo adesivi incollare',
  'piastrella piastrelle ceramica ceramiche', 'pavimento pavimenti pavimentazione pavimentazioni',
  'esterno esterni esterna esterne facciata facciate', 'interno interni interna interne',
  'finestra finestre infisso infissi serramento serramenti',
  'tapparella tapparelle avvolgibile avvolgibili', 'zanzariera zanzariere zanzara zanzare insetto insetti',
  'porta porte', 'blindata blindate blindato blindati antieffrazione',
  'scorrevole scorrevoli scorrimento', 'pennello pennelli pennellessa pennellesse',
  'rullo rulli rullino rullini', 'telo teli copritutto coprire proteggere protezione protettivo protettivi',
  'stucco stucchi stuccatura stuccare', 'fuga fughe', 'rasante rasanti rasatura rasare',
  'impermeabile impermeabili impermeabilizzante impermeabilizzanti impermeabilizzare infiltrazione infiltrazioni',
  'fissativo fissativi primer aggrappante aggrappanti', 'schiuma schiume poliuretanica poliuretaniche',
  'vite viti', 'tassello tasselli', 'chiodo chiodi', 'martello martelli',
  'spatola spatole', 'secchio secchi mastello mastelli', 'bianco bianca bianchi bianche',
  'grigio grigia grigi grigie', 'nero nera neri nere', 'legno lignea ligneo',
  'termico termica termici termiche termoisolante termoisolanti isolamento isolante isolanti',
];
const aliases = new Map<string, string>();
for (const group of groups) { const words = group.split(' '); for (const word of words) aliases.set(word, words[0]); }
const ignored = new Set('a ad al allo alla alle agli ai all anche che chi ci con contro da dal dalla dalle dei degli del della delle di e ed gli i il in la le lo l mi per un uno una un ho vorrei voglio cerco cercando serve servono bisogno prodotto prodotti qualcosa quale quali comprare acquistare devo fare mettere su sul sulla sulle sui da'.split(' '));
function tokens(text: string): string[] {
  return [...new Set(normalize(text).split(' ').filter(t => t && !ignored.has(t)).map(t => aliases.get(t) ?? t))];
}

// One missing, extra or mistyped letter, including swapped adjacent letters.
function similar(a: string, b: string): boolean {
  if (a.length < 5 || b.length < 5 || /\d/.test(a + b) || Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const differences = [...a].map((c, i) => c === b[i] ? -1 : i).filter(i => i >= 0);
    return differences.length === 1 || (differences.length === 2 && differences[1] === differences[0] + 1 && a[differences[0]] === b[differences[1]] && a[differences[1]] === b[differences[0]]);
  }
  const [short, long] = a.length < b.length ? [a, b] : [b, a];
  let i = 0; while (i < short.length && short[i] === long[i]) i++;
  return short.slice(i) === long.slice(i + 1);
}
export function createSearchIndex(product: Product, department = '') {
  const title = tokens(product.name);
  const subtitle = tokens(product.subtitle ?? '');
  const body = tokens(`${product.subtitle ?? ''} ${product.description ?? ''} ${product.search_terms ?? ''} ${department}`);
  const departmentTerms = tokens(department || product.department_id || '');
  const isPaint = departmentTerms.includes('pittura') && departmentTerms.includes('decorazioni')
    && !subtitle.includes('trattamento');
  return { product, title, subtitle, body, isPaint, codes: normalize(`${product.sku} ${product.search_terms ?? ''}`).split(' '), phrase: normalize(product.name) };
}
export function searchCatalog(index: ReturnType<typeof createSearchIndex>[], query: string): { product: Product; score: number }[] {
  const terms = tokens(query);
  if (!terms.length) return index.map(entry => ({ product: entry.product, score: 0 }));
  const phrase = normalize(query);
  // A request for paint means the product itself, unless another product type is explicit.
  const otherProductTypes = new Set(['rullo', 'pennello', 'telo', 'nastro', 'carta', 'proteggere',
    'fissativo', 'rasante', 'stucco', 'colla', 'finitura', 'finiture', 'sacco', 'sacchi',
    'mescolatore', 'pistola', 'manico', 'ricarica', 'retina', 'secchio', 'trattamento']);
  const wantsPaint = terms.includes('pittura') && !terms.some(term => otherProductTypes.has(term));
  return index.flatMap(entry => {
    if (wantsPaint && !entry.isPaint) return [];
    let score = entry.phrase.includes(phrase) ? 50 : 0;
    for (const term of terms) {
      if (entry.codes.includes(term)) score += 200;
      else if (entry.title.includes(term)) score += 30;
      else if (entry.subtitle.includes(term)) score += 20;
      else if (entry.body.includes(term)) score += 10;
      else if (!/\d/.test(term) && term.length >= 3 && entry.title.some(word => word.startsWith(term))) score += 8;
      else if ([...entry.title, ...entry.body].some(word => similar(term, word))) score += 3;
      else return [];
    }
    // Accessories remain available, below the material when the request is generic.
    if (!terms.some(term => entry.title.includes(term) && /^(pistola|manico|ricarica|retina|mescolatore)$/.test(term)) && /\b(pistola|manico|ricarica|retina|mescolatore)\b/.test(entry.phrase)) score -= 20;
    return [{ product: entry.product, score }];
  }).sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, 'it'));
}
