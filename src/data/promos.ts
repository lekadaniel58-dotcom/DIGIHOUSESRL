/** Promozioni copiate dal sito precedente: verificare validità e prezzi prima della pubblicazione. */
export interface Promo { id: string; title: string; highlight: string; note: string; image: string; active: boolean }
export const promos: Promo[] = [
  { id: 'rashexk8', title: 'RasHexK8 Bianco', highlight: '10,20 € + IVA', note: 'Fino ad esaurimento scorte.', image: '/assets/promo-rashexk8.jpg', active: true },
  { id: 'ktplus', title: 'KT Plus Bianca', highlight: '11,80 € IVA inclusa', note: 'Adesivo. Fino ad esaurimento scorte.', image: '/assets/promo-ktplus.jpg', active: true },
  { id: 'planirapid', title: 'Planirapid 400', highlight: 'Per massetti e calcestruzzi', note: 'Autolivellante per interni ed esterni.', image: '/assets/promo-planirapid.jpg', active: true },
  { id: 'termocoathex', title: 'TermocoatHEX', highlight: 'Offerta shock: 300 secchi', note: 'Solo 300 secchi disponibili, fino ad esaurimento scorte.', image: '/assets/promo-termocoathex.jpg', active: true },
  { id: 'gasbeton', title: 'Gasbeton', highlight: 'Leggerezza e isolamento', note: 'Resistenza e isolamento per i tuoi progetti.', image: '/assets/promo-gasbeton.png', active: true },
];
export { default as partners } from './partners.json';
