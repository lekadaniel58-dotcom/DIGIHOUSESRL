import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCatalog } from '../lib/useCatalog';
import ProductCard from '../components/ProductCard';
import partners from '../data/partners.json';
import { createSearchIndex, searchCatalog } from '../lib/catalogSearch';

type Sort = 'relevance' | 'name' | 'price-asc' | 'price-desc';

export default function Catalog() {
  const { departments, products, loading, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const queryFromUrl = params.get('q') ?? '';
  const [q, setQ] = useState(queryFromUrl);
  useEffect(() => { setQ(queryFromUrl); }, [queryFromUrl]);
  const [sort, setSort] = useState<Sort>('relevance');
  const [onlyPriced, setOnlyPriced] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const dep = params.get('reparto') ?? '';
  const partnerId = params.get('partner') ?? '';
  const partner = partners.find(p => p.id === partnerId);
  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next);
  };
  useEffect(() => { setVisibleCount(24); }, [q, dep, partnerId, sort, onlyPriced]);
  const depId = departments.find(d => d.slug === dep)?.id;

  const searchIndex = useMemo(() => products.map(p => createSearchIndex(p,
    departments.find(d => d.id === p.department_id)?.name ?? '')), [products, departments]);
  const list = useMemo(() => {
    const r = searchCatalog(searchIndex, q).map(result => result.product).filter(p =>
      (!partnerId || (partner && p.partner_ids?.includes(partnerId))) &&
      (!depId || p.department_id === depId) && (!onlyPriced || p.price !== null));
    if (sort === 'relevance' && q.trim()) return r;
    const cmp: Record<Sort, (a: typeof r[0], b: typeof r[0]) => number> = {
      relevance: (a, b) => a.name.localeCompare(b.name, 'it'),
      name: (a, b) => a.name.localeCompare(b.name, 'it'),
      'price-asc': (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      'price-desc': (a, b) => (b.price ?? -1) - (a.price ?? -1),
    };
    return [...r].sort(cmp[sort]);
  }, [searchIndex, q, depId, partnerId, partner, sort, onlyPriced]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-3xl mb-6">{partner ? `Catalogo · ${partner.name}` : 'Catalogo'}</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10">
        <p className="text-sm text-navy/80">I prezzi visualizzati sono riservati ai privati. Sei un’impresa? Richiedi le condizioni dedicate.</p>
        <Link to="/imprese" className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy/90">Iscrivi la tua impresa</Link>
      </div>
      {partner && <p className="mb-4 text-sm text-navy/70">Stai visualizzando solo i prodotti {partner.name}. <button type="button" onClick={() => updateFilter('partner', '')} className="underline">Mostra tutti i partner</button></p>}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative w-full flex-none sm:w-auto sm:flex-1 min-w-0 sm:min-w-[220px]">
          <span className="sr-only">Cerca prodotto</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Come possiamo aiutarti?"
            className="w-full rounded-full bg-white py-3 pl-10 pr-4 ring-1 ring-navy/10 focus:ring-gold" />
        </label>
        <select aria-label="Reparto" value={dep} onChange={e => updateFilter('reparto', e.target.value)} className="rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="">Tutti i reparti</option>{departments.map(d => <option key={d.id} value={d.slug}>{d.name}</option>)}
        </select>
        <select aria-label="Partner" value={partnerId} onChange={e => updateFilter('partner', e.target.value)} className="max-w-full rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="">Tutti i partner</option>{partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Ordina" value={sort} onChange={e => setSort(e.target.value as Sort)} className="rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="relevance">Più pertinenti</option><option value="name">Nome A-Z</option><option value="price-asc">Prezzo crescente</option><option value="price-desc">Prezzo decrescente</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyPriced} onChange={e => setOnlyPriced(e.target.checked)} />Solo con prezzo</label>
      </div>
      {loading ? <p>Caricamento…</p> : error ? <p role="alert" className="text-red-700">Errore: {error}</p> :
        list.length === 0 ? <p>Nessun prodotto trovato. Prova a descrivere l’uso o il materiale, oppure modifica i filtri di reparto e partner.</p> :
        <>
          <p role="status" className="mb-4 text-sm text-navy/60">{list.length} {list.length === 1 ? 'prodotto' : 'prodotti'} · {Math.min(visibleCount, list.length)} visualizzati</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.slice(0, visibleCount).map(p => <ProductCard key={p.id} p={p} />)}</div>
          {visibleCount < list.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisibleCount(n => n + 24)} className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">Mostra altri prodotti</button></div>}
        </>}
    </div>
  );
}
