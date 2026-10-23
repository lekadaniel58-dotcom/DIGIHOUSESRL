import { Link } from 'react-router-dom';
import type { Product } from '../lib/types';

export default function DoorSeriesNavigation({ products, params }: { products: Product[]; params: URLSearchParams }) {
  const series = [...new Set(products.filter(p => p.door_collection === 'moderne').map(p => p.door_series).filter(Boolean))];
  const href = (value: string) => {
    const next = new URLSearchParams(params);
    next.set('collezione', 'moderne'); next.set('serie', value);
    return `/catalogo?${next}`;
  };
  return <section className="mb-8" aria-label="Serie Trix">
    <Link to="/catalogo?reparto=porte-interne" className="text-sm underline">← Tutte le collezioni di porte interne</Link>
    <h2 className="my-5 font-display text-3xl">Trix: scegli la serie</h2>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{series.map(name => {
      const models = products.filter(p => p.door_series === name);
      return <Link key={name} to={href(name!)} className="overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-navy/10 hover:shadow-lg">
        <img src={models[0].thumbnail} alt={`Porte ${name}`} loading="lazy" decoding="async" className="h-56 w-full object-contain" />
        <h3 className="mt-4 font-display text-2xl capitalize">{name}</h3><p className="mt-2 text-sm">{models.length} modelli · Scopri la serie →</p>
      </Link>;
    })}</div>
  </section>;
}
