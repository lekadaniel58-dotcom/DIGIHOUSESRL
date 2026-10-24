import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { getWindowCollection } from '../lib/windowCollections';

export default function FittingsNavigation({ products }: { products: Product[] }) {
  if (!products.length) return <p role="status" className="text-navy/70">Nessun prodotto con i filtri selezionati. Modifica i filtri o disattiva “Solo con prezzo”.</p>;
  const groups = [
    { name: 'Porte', text: 'Interne, blindate e portoncini: esplora famiglie e collezioni.', to: 'reparto=porte', matches: (p: Product) => ['porte-interne', 'porte-blindate'].includes(p.department_id ?? '') },
    { name: 'Finestre e portefinestre', text: 'PVC, alluminio, legno e sistemi compositi, divisi per materiale e apertura.', to: 'reparto=infissi&famiglia=finestre', matches: (p: Product) => getWindowCollection(p)?.family === 'finestre' },
    { name: 'Persiane e scuri', text: 'Soluzioni oscuranti in alluminio.', to: 'reparto=infissi&famiglia=persiane', matches: (p: Product) => getWindowCollection(p)?.family === 'persiane' },
    { name: 'Avvolgibili e tapparelle', text: 'Schermatura, privacy e protezione.', to: 'reparto=avvolgibili-e-tapparelle', matches: (p: Product) => p.department_id === 'avvolgibili-e-tapparelle' },
    { name: 'Zanzariere', text: 'Soluzioni contro gli insetti per finestre e porte.', to: 'reparto=zanzariere', matches: (p: Product) => p.department_id === 'zanzariere' },
    { name: 'Soluzioni complementari', text: 'I sistemi che completano i serramenti.', to: 'reparto=infissi&famiglia=complementi', matches: (p: Product) => getWindowCollection(p)?.family === 'complementi' },
  ];
  return <section aria-label="Reparti serramenti e comfort" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{groups.map(group => {
    const models = products.filter(group.matches), cover = models[0];
    return <Link key={group.name} to={`/catalogo?settore=serramenti&${group.to}`} className="overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition-shadow hover:shadow-lg">
      {cover && <img src={cover.thumbnail ?? cover.images[0]} alt="" className="h-52 w-full object-contain p-4" loading="lazy" decoding="async" />}
      <div className="p-5"><h2 className="font-display text-2xl">{group.name}</h2><p className="mt-2 text-sm text-navy/70">{group.text}</p><p className="mt-4 text-sm font-semibold">{models.length} modelli · Esplora →</p></div>
    </Link>;
  })}</section>;
}
