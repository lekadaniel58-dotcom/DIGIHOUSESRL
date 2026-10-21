import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { partners } from '../data/promos';
import SafeImg from './SafeImg';

export default function PartnerMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) observer.observe(ref.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility); };
  }, []);
  return <div ref={ref} className="partner-marquee mt-8 overflow-hidden">
    <div className="partner-track flex w-max" style={{ animationPlayState: visible && pageVisible ? undefined : 'paused' }}>
      {[false, true].map(duplicate => <div key={String(duplicate)} aria-hidden={duplicate || undefined} className="partner-group flex shrink-0 gap-6 pr-6">
        {partners.map(p => <Link key={p.id} to={`/catalogo?partner=${p.id}`} aria-label={`Vedi i prodotti ${p.name}`} tabIndex={duplicate ? -1 : undefined} className="flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl bg-navy-50 px-4 text-center text-sm font-semibold text-navy/70 grayscale transition hover:grayscale-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold">
          {p.logo ? <SafeImg src={p.logo} alt={p.name} className="max-h-14 object-contain" fallback={p.name} /> : p.name}
        </Link>)}
      </div>)}
    </div>
  </div>;
}
