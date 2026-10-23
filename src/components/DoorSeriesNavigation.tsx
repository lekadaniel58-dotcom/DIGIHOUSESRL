import { doorCollections, getDoorCollections } from '../lib/doorCollections';
import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';

export default function DoorSeriesNavigation({ products, params, collection = 'moderne' }: { products: Product[]; params: URLSearchParams; collection?: string }) {
  const collectionInfo = doorCollections.find(c => c.id === collection);
  const label = collection === 'moderne' ? 'Trix' : collectionInfo?.name ?? 'Porte interne';
  const scoped = products.filter(p => getDoorCollections(p).some(c => c.id === collection));
  const series = [...new Set(scoped.map(p => p.door_series).filter(Boolean))];
  const back = new URLSearchParams(params);
  back.set('reparto', 'porte-interne');
  for (const key of ['collezione', 'serie', 'materiale', 'vista']) back.delete(key);
  const href = (value: string) => {
    const next = new URLSearchParams(params);
    next.set('collezione', collection); next.set('serie', value);
    return `/catalogo?${next}`;
  };
  return <section className="mb-8" aria-label={`Serie ${label}`}>
    <Link to={`/catalogo?${back}`} className="text-sm underline">← Tutte le collezioni di porte interne</Link>
    <h2 className="my-5 font-display text-3xl">{label}: scegli la serie</h2>
    <p className="mb-5 max-w-2xl text-navy/70">{collectionInfo?.text}</p>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{series.map(name => {
      const models = scoped.filter(p => p.door_series === name);
      return <Link key={name} to={href(name!)} className="overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-navy/10 hover:shadow-lg">
        <img src={models[0].thumbnail} alt={`Porte ${name}`} loading="lazy" decoding="async" className="h-56 w-full object-contain" />
        <h3 className="mt-4 font-display text-2xl capitalize">{name}</h3><p className="mt-2 text-sm">{models.length} {collection.startsWith('pail-') ? 'configurazioni' : 'modelli'} · Scopri la serie →</p>
      </Link>;
    })}</div>
  </section>;
}
