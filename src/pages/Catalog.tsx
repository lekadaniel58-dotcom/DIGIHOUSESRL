import { changeCatalogFilter, changeCatalogQuery } from '../lib/catalogFilters';
import CatalogSections from '../components/CatalogSections';
import FittingsNavigation from '../components/FittingsNavigation';
import WindowNavigation from '../components/WindowNavigation';
import { catalogSections, getCatalogSection, getProductSection } from '../lib/catalogSections';
import { getWindowCollection, getWindowFamily } from '../lib/windowCollections';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useCatalog } from '../lib/useCatalog';
import ProductCard from '../components/ProductCard';
import partners from '../data/partners.json';
import { createSearchIndex, searchCatalog } from '../lib/catalogSearch';
import { doorFamilies, getDoorCollection, getDoorCollections, getDoorFamily } from '../lib/doorCollections';
import DoorNavigation from '../components/DoorNavigation';
import { getDoorMaterials } from '../lib/doorMaterials';

type Sort = 'relevance' | 'name' | 'price-asc' | 'price-desc';

export default function Catalog() {
  const { departments, products, loading, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const queryFromUrl = params.get('q') ?? '';
  const [q, setQ] = useState(queryFromUrl);
  useEffect(() => { setQ(queryFromUrl); }, [queryFromUrl, params]);
  const [sort, setSort] = useState<Sort>('relevance');
  const [onlyPriced, setOnlyPriced] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const dep = params.get('reparto') ?? '';
  const partnerId = params.get('partner') ?? '';
  const collection = params.get('collezione') === 'portoncini' ? 'inferriate-persiane' : params.get('collezione') ?? '';
  const series = params.get('serie') ?? '';
  const material = params.get('materiale') ?? '';
  const doorView = params.get('vista') ?? '';
  const windowFamily = getWindowFamily(params);
  const windowCollection = params.get('sottocategoria') ?? '';
  const sector = getCatalogSection(dep, partnerId, params.get('settore') ?? '') || (q.trim() ? 'edilizia' : '');
  const windowScope = dep === 'infissi' || !dep && ['sallustio', 'fossati'].includes(partnerId);
  const sectorInfo = catalogSections.find(s => s.id === sector);
  const sectorProducts = useMemo(() => products.filter(p => getProductSection(p) === sector), [products, sector]);
  const sectionDepartments = departments.filter(d => getProductSection({ department_id: d.id }) === sector);
  const sectionPartners = partners.filter(p => sectorProducts.some(product => product.partner_ids?.includes(p.id)));
  const browsingFittings = sector === 'serramenti' && !dep && !partnerId && !q.trim();
  const browsingWindows = windowScope && !windowCollection && !q.trim();
  const doorFamily = getDoorFamily(dep, partnerId);
  const doorScope = dep === 'porte' || !!doorFamily;
  const browsingDoors = doorScope && (!collection || ['moderne', 'pail-rapido', 'pail-super-rapido', 'gp-legno'].includes(collection) && !series) && !material && !q.trim();
  useEffect(() => {
    if (doorScope || windowScope || sector) window.scrollTo({ top: 0, behavior: 'instant' });
  }, [doorScope, doorFamily, collection, series, material, doorView, windowScope, windowFamily, windowCollection, sector]);
  useEffect(() => { setOnlyPriced(false); setSort('relevance'); }, [sector]);
  const partner = partners.find(p => p.id === partnerId);
  const updateFilter = (key: string, value: string) => {
    const next = changeCatalogFilter(params, key, value, products);
    if (sector) next.set('settore', sector);
    setParams(next);
  };
  useEffect(() => { setVisibleCount(24); }, [q, dep, partnerId, collection, series, material, sort, onlyPriced, sector, windowFamily, windowCollection]);
  const depId = departments.find(d => d.slug === dep)?.id;

  const searchIndex = useMemo(() => sectorProducts.map(p => createSearchIndex(p,
    departments.find(d => d.id === p.department_id)?.name ?? '')), [sectorProducts, departments]);
  const matching = useMemo(() => {
    const r = searchCatalog(searchIndex, q).map(result => result.product).filter(p =>
      (!partnerId || (partner && p.partner_ids?.includes(partnerId))) &&
      (!doorScope || (doorFamily ? p.department_id === doorFamily : doorFamilies.some(f => f.id === p.department_id))) &&
      (!depId || p.department_id === depId) && (!onlyPriced || p.price !== null));
    if (sort === 'relevance' && q.trim()) return r;
    const cmp: Record<Sort, (a: typeof r[0], b: typeof r[0]) => number> = {
      relevance: (a, b) => a.name.localeCompare(b.name, 'it'),
      name: (a, b) => a.name.localeCompare(b.name, 'it'),
      'price-asc': (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity),
      'price-desc': (a, b) => (b.price ?? -1) - (a.price ?? -1),
    };
    return [...r].sort(cmp[sort]);
  }, [searchIndex, q, depId, partnerId, partner, sort, onlyPriced, doorScope, doorFamily]);
  const list = useMemo(() => {
    if (windowScope) return matching.filter(p =>
      (!windowFamily || getWindowCollection(p)?.family === windowFamily) &&
      (!windowCollection || windowCollection === 'tutte' || (windowCollection === 'altre' ? !getWindowCollection(p) : getWindowCollection(p)?.id === windowCollection)));
    if (!doorScope) return matching;
    return matching.filter(product =>
      (!collection || collection === 'tutte' || (collection === 'altre' ? !getDoorCollection(product) : getDoorCollections(product).some(c => c.id === collection))) &&
      (!series || product.door_series === series) &&
      (!material || getDoorMaterials(product).some(item => item.id === material)));
  }, [matching, doorScope, collection, series, material, windowScope, windowFamily, windowCollection]);

  if (!sector) return <div className="mx-auto max-w-7xl px-4 py-10"><h1 className="mb-6 font-display text-3xl">Catalogo</h1><CatalogSections /></div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <CatalogSections selected={sector} />
      <h1 className="font-display text-3xl mb-6">{doorScope ? `Porte${partner ? ` · ${partner.name}` : ''}` : partner ? `Catalogo · ${partner.name}` : windowScope ? 'Finestre e infissi' : sectorInfo?.name ?? 'Catalogo'}</h1>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy/10">
        <p className="text-sm text-navy/80">I prezzi visualizzati sono riservati ai privati. Sei un’impresa? Richiedi le condizioni dedicate.</p>
        <Link to="/imprese" className="rounded-full bg-navy px-5 py-2 text-sm font-semibold text-white hover:bg-navy/90">Iscrivi la tua impresa</Link>
      </div>
      {partner && <p className="mb-4 text-sm text-navy/70">Stai visualizzando solo i prodotti {partner.name}. <button type="button" onClick={() => updateFilter('partner', '')} className="underline">Mostra tutti i partner</button></p>}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="relative w-full flex-none sm:w-auto sm:flex-1 min-w-0 sm:min-w-[220px]">
          <span className="sr-only">Cerca prodotto</span>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40" size={18} />
          <input value={q} onChange={e => { setQ(e.target.value); setParams(changeCatalogQuery(params, e.target.value, sector), { replace: true }); }} placeholder="Come possiamo aiutarti?"
            className="w-full rounded-full bg-white py-3 pl-10 pr-4 ring-1 ring-navy/10 focus:ring-gold" />
        </label>
        <select aria-label="Reparto" value={dep} onChange={e => updateFilter('reparto', e.target.value)} className="rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="">Tutti i reparti di questo catalogo</option>{sector === 'serramenti' && <option value="porte">Porte · tutte le famiglie</option>}{sectionDepartments.map(d => <option key={d.id} value={d.slug}>{d.name}</option>)}
        </select>
        <select aria-label="Partner" value={partnerId} onChange={e => updateFilter('partner', e.target.value)} className="max-w-full rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="">Tutti i partner</option>{sectionPartners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select aria-label="Ordina" value={sort} onChange={e => setSort(e.target.value as Sort)} className="rounded-full bg-white px-4 py-3 ring-1 ring-navy/10">
          <option value="relevance">Più pertinenti</option><option value="name">Nome A-Z</option><option value="price-asc">Prezzo crescente</option><option value="price-desc">Prezzo decrescente</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={onlyPriced} onChange={e => setOnlyPriced(e.target.checked)} />Solo con prezzo</label>
      </div>
      {!loading && !error && browsingFittings && <FittingsNavigation products={matching} />}
      {!loading && !error && windowScope && <WindowNavigation products={matching} params={params} browsing={browsingWindows} />}
      {doorScope && !loading && !error && <DoorNavigation products={matching} family={doorFamily} collection={collection} params={params} browsing={browsingDoors} />}
      {loading ? <p>Caricamento…</p> : error ? <p role="alert" className="text-red-700">Errore: {error}</p> :
        browsingDoors || browsingWindows || browsingFittings ? null : list.length === 0 ? <p>Nessun prodotto trovato. Prova a descrivere l’uso o il materiale, oppure modifica i filtri di reparto e partner.</p> :
        <>
          <p role="status" className="mb-4 text-sm text-navy/60">{list.length} {list.length === 1 ? 'prodotto' : 'prodotti'} · {Math.min(visibleCount, list.length)} visualizzati</p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.slice(0, visibleCount).map(p => <ProductCard key={p.id} p={p} />)}</div>
          {visibleCount < list.length && <div className="mt-8 text-center"><button type="button" onClick={() => setVisibleCount(n => n + 24)} className="rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">Mostra altri prodotti</button></div>}
        </>}
    </div>
  );
}
