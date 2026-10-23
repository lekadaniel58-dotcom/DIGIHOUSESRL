import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';
import { getWindowCollection, windowCollections, windowFamilies } from '../lib/windowCollections';

export default function WindowNavigation({ products, params, browsing }: { products: Product[]; params: URLSearchParams; browsing: boolean }) {
  const family = params.get('famiglia') ?? '', collection = params.get('sottocategoria') ?? '';
  const familyInfo = windowFamilies.find(f => f.id === family), collectionInfo = windowCollections.find(c => c.id === collection);
  const href = (f = '', c = '') => {
    const next = new URLSearchParams(params); next.set('reparto', 'infissi');
    next.delete('famiglia'); next.delete('sottocategoria');
    if (f) next.set('famiglia', f); if (c) next.set('sottocategoria', c);
    return `/catalogo?${next}`;
  };
  const groups = family ? windowCollections.filter(c => c.family === family) : windowFamilies;
  const cards = groups.map(g => {
    const models = products.filter(p => 'family' in g ? getWindowCollection(p)?.id === g.id : getWindowCollection(p)?.family === g.id);
    return { ...g, models, to: 'family' in g ? href(g.family, g.id) : href(g.id) };
  }).filter(g => g.models.length);
  return <section className="mb-8" aria-label="Esplora finestre e infissi">
    <nav aria-label="Percorso finestre" className="mb-5 flex flex-wrap gap-2 text-sm text-navy/70">
      <Link to="/catalogo?settore=serramenti" className="underline">Serramenti e comfort</Link><span>/</span><Link to={href()} className="underline">Finestre e infissi</Link>
      {familyInfo && <><span>/</span><Link to={href(family)} className="underline">{familyInfo.name}</Link></>}
      {collection && <><span>/</span><span aria-current="page">{collectionInfo?.name ?? (collection === 'tutte' ? 'Tutti i modelli' : 'Altri modelli')}</span></>}
    </nav>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-navy p-6 text-white">
      <div><p className="text-xs uppercase tracking-widest text-gold">Finestre e infissi</p><h2 className="mt-2 font-display text-3xl">{collectionInfo?.name ?? familyInfo?.name ?? 'Scegli la famiglia'}</h2><p className="mt-3 text-sm text-white/75">{browsing ? 'Scegli una categoria, poi confronta i singoli modelli.' : 'Confronta i modelli e chiedici una configurazione su misura.'}</p></div>
      <Link to={browsing ? href(family, 'tutte') : href(family)} className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy">{browsing ? 'Mostra tutti i modelli' : 'Cambia categoria'}</Link>
    </div>
    {browsing && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards.map(g => <Link key={g.id} to={g.to} className="overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 hover:shadow-lg">
      <img src={g.models[0].thumbnail ?? g.models[0].images[0]} alt="" loading="lazy" decoding="async" className="h-56 w-full object-contain p-4" />
      <div className="p-5"><p className="text-xs font-semibold text-gold-600">{g.models.length} modelli</p><h3 className="mt-2 font-display text-2xl">{g.name}</h3><p className="mt-3 text-sm text-navy/70">{g.text}</p><p className="mt-4 text-sm font-semibold">{family ? 'Scopri i modelli' : 'Esplora le categorie'} →</p></div>
    </Link>)}</div>}
    {browsing && products.some(p => !getWindowCollection(p)) && <Link className="mt-4 inline-block underline" to={href('', 'altre')}>Altri modelli</Link>}
  </section>;
}
