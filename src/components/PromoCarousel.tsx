import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { promos } from '../data/promos';
import { waLink } from '../lib/supabase';
import FxButton from './FxButton';
import SafeImg from './SafeImg';

export default function PromoCarousel() {
  const list = promos.filter(p => p.active);
  const [i, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (d: number) => setIndex(n => (n + d + list.length) % list.length);
  useEffect(() => { if (paused || list.length < 2) return; const t = setInterval(() => go(1), 6000); return () => clearInterval(t); }, [paused, list.length]);
  if (!list.length) return null;
  const p = list[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-2xl">

        <div key={p.id}
          className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Occasioni DIGI HOUSE</p>
            <h3 className="font-display text-3xl md:text-4xl">{p.title}</h3>
            <p className="text-shine mt-3 font-display text-3xl md:text-4xl">{p.highlight}</p>
            <p className="mt-3 text-white/70">{p.note}</p>
            <div className="mt-6"><FxButton variant="wa" href={waLink(`Ciao DIGI HOUSE, vorrei informazioni sulla promozione: ${p.title}`)}><MessageCircle size={18} />Chiedi disponibilità</FxButton></div>
          </div>
          <SafeImg src={p.image} alt={`Promozione ${p.title}`} className="mx-auto h-80 w-full rounded-2xl object-contain" fallback={p.title} />
        </div>

      {list.length > 1 && <>
        <button onClick={() => go(-1)} aria-label="Promozione precedente" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-gold hover:text-navy"><ChevronLeft /></button>
        <button onClick={() => go(1)} aria-label="Promozione successiva" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 transition hover:bg-gold hover:text-navy"><ChevronRight /></button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {list.map((x, n) => <button key={x.id} onClick={() => setIndex(n)} aria-label={`Vai alla promozione ${n + 1}`} className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-gold' : 'w-2 bg-white/40'}`} />)}
        </div>
      </>}
    </div>
  );
}
