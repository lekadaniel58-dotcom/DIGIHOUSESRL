import { catalogDisplayText } from '../lib/catalogDisplayText';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';
import type { Product } from '../lib/types';
import { doorMaterials, getDoorMaterials } from '../lib/doorMaterials';
import { waLink } from '../lib/supabase';

export default function DoorMaterialNavigation({ products, params, browsing }: { products: Product[]; params: URLSearchParams; browsing: boolean }) {
  const chosen = params.get('materiale') ?? '';
  const material = doorMaterials.find(item => item.id === chosen);
  const href = (view: string, selected = '') => {
    const next = new URLSearchParams(params);
    next.set('reparto', 'porte-interne');
    next.delete('serie'); next.delete('collezione'); next.delete('materiale'); next.delete('vista');
    if (view === 'materiali') next.set('vista', view);
    if (selected) next.set('materiale', selected);
    return `/catalogo?${next}`;
  };
  return <section className="mb-8" aria-label="Materiali delle porte">
    <nav aria-label="Percorso porte" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-navy/65">
      <Link to="/catalogo" className="hover:underline">Catalogo</Link><ChevronRight size={14} aria-hidden="true" />
      <Link to="/catalogo?reparto=porte" className="hover:underline">Porte</Link><ChevronRight size={14} aria-hidden="true" />
      <Link to={href('collezioni')} className="hover:underline">Porte interne</Link><ChevronRight size={14} aria-hidden="true" />
      <Link to={href('materiali')} className="hover:underline">Materiali e finiture</Link>
      {chosen && <><ChevronRight size={14} aria-hidden="true" /><span aria-current="page" className="font-semibold text-navy">{material?.name ?? 'Materiale non disponibile'}</span></>}
    </nav>
    <nav aria-label="Esplora porte interne" className="mb-5 flex flex-wrap gap-2 text-sm font-semibold">
      <Link to={href('collezioni')} className="rounded-full bg-white px-5 py-3 ring-1 ring-navy/10">Per collezione</Link>
      <Link to={href('materiali')} aria-current="page" className="rounded-full bg-navy px-5 py-3 text-white">Per materiale e finitura</Link>
    </nav>
    {browsing ? <>
      <div className="mb-6 rounded-3xl bg-navy p-6 text-white md:p-8"><p className="text-xs font-semibold uppercase tracking-widest text-gold">Porte interne</p><h2 className="mt-2 font-display text-3xl">Scegli materiali e finiture.</h2><p className="mt-3 max-w-2xl text-sm text-white/75">Esplora il legno, le parti in vetro e le finiture laccate. Un modello può comparire in più selezioni quando combina materiali differenti.</p></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {doorMaterials.filter(item => products.some(p => getDoorMaterials(p).some(m => m.id === item.id))).map(item => {
          const models = products.filter(product => getDoorMaterials(product).some(m => m.id === item.id));
          const cover = models.find(product => product.name === item.cover) ?? models[0];
          const unverified = models.length === 0;
          const content = <>
            <div className="grid aspect-[4/3] place-items-center overflow-hidden bg-white">{cover ? <img src={cover.thumbnail ?? cover.images[0]} alt={catalogDisplayText(cover.name)} loading="lazy" decoding="async" className="h-full w-full object-contain p-3 transition-transform duration-200 motion-safe:group-hover:scale-105" /> : <Layers size={52} className="text-gold" aria-hidden="true" />}</div>
            <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-wider text-gold-600">{unverified ? 'Modelli da confermare' : `${models.length} ${models.length === 1 ? 'modello' : 'modelli'}`}</p><h3 className="mt-2 font-display text-2xl">{item.name}</h3><p className="mt-3 flex-1 text-sm text-navy/70">{item.text}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">{unverified ? 'Chiedi informazioni' : 'Scopri i modelli'}<ArrowRight size={16} aria-hidden="true" /></span></div>
          </>;
          const className = 'group flex min-w-0 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-navy/10 transition-shadow hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold';
          return unverified ? <a key={item.id} className={className} href={waLink('Buongiorno, vorrei informazioni sui modelli e sulle finiture delle porte in laminato.')} target="_blank" rel="noopener noreferrer">{content}</a> : <Link key={item.id} className={className} to={href('materiali', item.id)}>{content}</Link>;
        })}
      </div>
    </> : <div className="rounded-2xl bg-white p-5 ring-1 ring-navy/10"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-display text-2xl">{material?.name ?? 'Porte interne'}</h2><Link to={href('materiali')} className="text-sm font-semibold underline">Cambia materiale o finitura</Link></div><p className="mt-2 text-sm text-navy/65">Confronta i modelli e chiedici le finiture disponibili per il tuo progetto.</p></div>}
  </section>;
}
