import { useEffect, useMemo, useRef, useState } from 'react';

type Municipality = { name: string; province: string; prefix: string };
const normalize = (value: string) => value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('it');
let cached: Promise<Municipality[]> | undefined;
function municipalities() {
  return cached ??= fetch(`${import.meta.env.BASE_URL}data/comuni.json`)
    .then(async response => {
      if (!response.ok) throw new Error('Municipalities unavailable');
      const rows: [string, string][] = await response.json();
      return rows.map(([name, province]) => ({ name, province, prefix: normalize(name) }))
        .sort((a, b) => a.name.localeCompare(b.name, 'it') || a.province.localeCompare(b.province));
    }).catch(error => { cached = undefined; throw error; });
}

export default function MunicipalityInput({ id, name, error }: { id: string; name: string; error?: string }) {
  const [value, setValue] = useState('');
  const [activated, setActivated] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Municipality[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [active, setActive] = useState(-1);
  const list = useRef<HTMLUListElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!activated) return;
    let alive = true;
    municipalities().then(data => { if (alive) { setRows(data); setLoadState('ready'); } })
      .catch(() => { if (alive) setLoadState('error'); });
    return () => { alive = false; };
  }, [activated]);
  const query = normalize(value);
  const matches = useMemo(() => query ? rows.filter(row => row.prefix.startsWith(query)) : [], [rows, query]);
  const expanded = open && !!query && loadState === 'ready' && matches.length > 0;
  useEffect(() => { if (expanded && active >= 0) list.current?.children[active]?.scrollIntoView({ block: 'nearest' }); }, [active, expanded]);
  const select = (row: Municipality) => { setValue(`${row.name} (${row.province})`); setOpen(false); setActive(-1); input.current?.focus(); };
  return <div className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <input ref={input} id={id} name={name} value={value} required maxLength={150} autoComplete="off"
      role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={`${id}-options`}
      aria-activedescendant={expanded && active >= 0 ? `${id}-option-${active}` : undefined}
      aria-invalid={!!error} aria-describedby={`${id}-hint${error ? ` error-${name}` : ''}`}
      className="w-full rounded-xl bg-white px-4 py-3 ring-1 ring-navy/20 focus:ring-2 focus:ring-gold"
      onFocus={() => { setActivated(true); setOpen(true); }}
      onChange={event => { setValue(event.target.value); setOpen(true); setActive(-1); }}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); setOpen(false); setActive(-1); }
        else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) {
          event.preventDefault(); setOpen(true);
          setActive(previous => event.key === 'ArrowDown' ? Math.min(previous + 1, matches.length - 1) : previous <= 0 ? matches.length - 1 : previous - 1);
        } else if (event.key === 'Enter' && expanded) { event.preventDefault(); select(matches[active >= 0 ? active : 0]); }
      }} />
    {expanded && <ul ref={list} id={`${id}-options`} role="listbox" aria-label="Comuni suggeriti" className="absolute inset-x-0 top-[3.25rem] z-20 max-h-64 overflow-y-auto overscroll-contain rounded-xl bg-white py-1 shadow-xl ring-1 ring-navy/20">
      {matches.map((row, index) => <li key={`${row.name}-${row.province}`} role="presentation">
        <button type="button" id={`${id}-option-${index}`} role="option" aria-selected={active === index} tabIndex={-1}
          onMouseDown={event => event.preventDefault()} onClick={() => select(row)}
          className={`block w-full px-4 py-3 text-left text-sm hover:bg-navy-50 ${active === index ? 'bg-navy-50' : ''}`}>
          {row.name} <span className="text-navy/60">({row.province})</span>
        </button>
      </li>)}
    </ul>}
    <p id={`${id}-hint`} role="status" className={open && query ? 'mt-2 text-xs text-navy/60' : 'sr-only'}>
      {open && query ? loadState === 'loading' ? 'Caricamento comuni…' : loadState === 'error' ? 'Suggerimenti non disponibili. Scrivi comune e provincia manualmente.' : matches.length ? `${matches.length} comuni: seleziona un suggerimento o continua a scrivere.` : 'Nessun suggerimento. Puoi scrivere comune e provincia manualmente.' : ''}
    </p>
  </div>;
}
