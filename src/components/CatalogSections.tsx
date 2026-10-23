import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { catalogSections } from '../lib/catalogSections';

export default function CatalogSections({ selected = '' }: { selected?: string }) {
  if (selected) return <nav aria-label="Cataloghi" className="mb-6 flex flex-wrap gap-2">
    <Link to="/catalogo" className="rounded-full bg-white px-4 py-3 text-sm ring-1 ring-navy/10">← Scegli catalogo</Link>
    {catalogSections.map(s => <Link key={s.id} to={`/catalogo?settore=${s.id}`} aria-current={selected === s.id ? 'page' : undefined} className={`rounded-full px-4 py-3 text-sm font-semibold ${selected === s.id ? 'bg-navy text-white' : 'bg-white ring-1 ring-navy/10'}`}>{s.name}</Link>)}
  </nav>;
  return <section aria-label="Scegli il catalogo">
    <p className="mb-7 max-w-2xl text-navy/70">Da cosa vuoi iniziare? Scegli il catalogo dedicato al tuo progetto.</p>
    <div className="grid gap-6 md:grid-cols-2">{catalogSections.map(s => <Link key={s.id} to={`/catalogo?settore=${s.id}`} className="group overflow-hidden rounded-3xl bg-white ring-1 ring-navy/10 transition-shadow hover:shadow-xl">
      <img src={`${import.meta.env.BASE_URL}assets/${s.image}`} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async" />
      <div className="p-7"><h2 className="font-display text-3xl">{s.name}</h2><p className="mt-3 text-navy/70">{s.text}</p><span className="mt-6 inline-flex items-center gap-2 font-semibold">Esplora il catalogo<ArrowRight size={18} /></span></div>
    </Link>)}</div>
  </section>;
}
