import DoorSeriesNavigation from './DoorSeriesNavigation';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, DoorClosed } from 'lucide-react';
import type { Product } from '../lib/types';
import DoorMaterialNavigation from './DoorMaterialNavigation';
import { doorCollections, doorFamilies, getDoorCollection, getDoorCollections } from '../lib/doorCollections';

type Props = { products: Product[]; family: string; collection: string; params: URLSearchParams; browsing: boolean };

export default function DoorNavigation({ products, family, collection, params, browsing }: Props) {
  if (['moderne', 'pail-rapido', 'pail-super-rapido', 'gp-legno'].includes(collection) && browsing) return <DoorSeriesNavigation products={products} params={params} collection={collection} />;
  const materialView = family === 'porte-interne' && (params.get('vista') === 'materiali' || !!params.get('materiale'));
  if (materialView) return <DoorMaterialNavigation products={products} params={params} browsing={browsing} />;
  const materialParams = new URLSearchParams(params);
  materialParams.set('reparto', 'porte-interne'); materialParams.set('vista', 'materiali');
  materialParams.delete('serie'); materialParams.delete('collezione'); materialParams.delete('materiale');
  const familyInfo = doorFamilies.find(item => item.id === family);
  const collectionInfo = doorCollections.find(item => item.id === collection && item.family === family);
  const href = (department: string, group = '') => {
    const next = new URLSearchParams(params);
    next.set('reparto', department);
    next.delete('serie'); next.delete('materiale'); next.delete('vista');
    if (group) next.set('collezione', group); else next.delete('collezione');
    return `/catalogo?${next}`;
  };
  const groups = family ? doorCollections.filter(item => item.family === family) : doorFamilies;
  const cards = groups.map(item => {
    const models = products.filter(product => 'family' in item ? getDoorCollections(product).some(c => c.id === item.id) : product.department_id === item.id);
    const cover = models.find(product => product.name.startsWith(item.cover)) ?? models[0];
    return { ...item, models, cover, to: 'family' in item ? href(item.family, item.id) : href(item.id) };
  }).filter(item => item.models.length);
  // Keep uncategorised future models reachable instead of silently hiding them.
  const otherModels = family ? products.filter(product => !getDoorCollection(product)) : [];
  return <section className="mb-8" aria-label="Esplora le porte">
    <nav aria-label="Percorso porte" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-navy/65">
      <Link to="/catalogo" className="hover:underline">Catalogo</Link><ChevronRight size={14} aria-hidden="true" />
      <Link to={href('porte')} className="hover:underline" aria-current={!family ? 'page' : undefined}>Porte</Link>
      {familyInfo && <><ChevronRight size={14} aria-hidden="true" /><Link to={href(family)} className="hover:underline" aria-current={!collection ? 'page' : undefined}>{familyInfo.name}</Link></>}
      {collection && <><ChevronRight size={14} aria-hidden="true" /><span aria-current="page" className="font-semibold text-navy">{collection === 'tutte' ? 'Tutti i modelli' : collection === 'altre' ? 'Altri modelli' : collectionInfo?.name ?? 'Collezione non disponibile'}</span></>}
    </nav>
    {family === 'porte-interne' && <nav aria-label="Esplora porte interne" className="mb-5 flex flex-wrap gap-2 text-sm font-semibold">
      <Link to={href(family)} aria-current="page" className="rounded-full bg-navy px-5 py-3 text-white">Per collezione</Link>
      <Link to={`/catalogo?${materialParams}`} className="rounded-full bg-white px-5 py-3 ring-1 ring-navy/10">Per materiale e finitura</Link>
    </nav>}
    {browsing ? <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 rounded-3xl bg-navy p-6 text-white md:p-8">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-gold">Collezioni DIGI HOUSE</p>
          <h2 className="mt-2 font-display text-3xl">{familyInfo?.name ?? 'Una porta per ogni progetto.'}</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/75">{family ? 'Scegli una collezione per esplorare i modelli e trovare la soluzione per te.' : 'Inizia dalla famiglia, scegli una collezione e scopri i singoli modelli.'}</p>
        </div>
        <Link to={href(family || 'porte', 'tutte')} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy">Mostra tutti i modelli<ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className={`grid gap-5 ${family ? 'sm:grid-cols-2 lg:grid-cols-3' : 'md:grid-cols-2'}`}>
        {cards.map(item => <Link key={item.id} to={item.to} className="group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
          <div className="aspect-[4/3] overflow-hidden bg-white">
            {item.cover && <img src={item.cover.thumbnail ?? item.cover.images[0]} alt={item.cover.name} loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-200 motion-safe:group-hover:scale-105" />}
          </div>
          <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{item.models.length} {item.id.startsWith('pail-') ? 'configurazioni' : 'modelli'}</p><h3 className="mt-2 font-display text-2xl">{item.name}</h3><p className="mt-3 flex-1 text-sm text-navy/70">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{family ? 'Scopri i modelli' : 'Esplora le collezioni'}<ArrowRight size={16} aria-hidden="true" /></span></div>
        </Link>)}
      </div>
      {otherModels.length > 0 && <Link to={href(family, 'altre')} className="mt-5 inline-flex items-center gap-2 font-semibold underline"><DoorClosed size={18} />Altri modelli ({otherModels.length})</Link>}
      {!cards.length && <p className="mt-5 text-navy/70">Nessuna collezione disponibile con i filtri selezionati. Modifica i filtri per esplorare le porte.</p>}
    </> : <div className="rounded-2xl bg-white p-5 ring-1 ring-navy/10">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl">{params.get('serie') ? `${collectionInfo?.name} · ${params.get('serie')!.replace(/^./, c => c.toUpperCase())}` : collectionInfo?.name ?? (collection === 'altre' ? 'Altri modelli' : familyInfo?.name ?? 'Tutte le porte')}</h2><Link to={href(family || 'porte', params.get('serie') ? collection : '')} className="text-sm font-semibold underline">{params.get('serie') ? 'Cambia serie' : family ? 'Cambia collezione' : 'Scegli una famiglia'}</Link></div>
      <p className="mt-2 text-sm text-navy/65">Esplora i modelli, ingrandisci le foto e chiedici un preventivo per la soluzione che preferisci.</p>
    </div>}
  </section>;
}
