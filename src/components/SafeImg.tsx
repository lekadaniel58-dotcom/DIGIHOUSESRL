import { useState, type ReactNode } from 'react';

/** Immagine con riquadro sostitutivo se il file manca (nessun errore a schermo) */
export default function SafeImg({ src, alt, className = '', fallback, priority = false }: { src: string; alt: string; className?: string; fallback?: ReactNode; priority?: boolean }) {
  const [bad, setBad] = useState(false);
  if (bad) return <div role="img" aria-label={alt} className={`grid place-items-center bg-gradient-to-br from-navy-700 to-navy p-4 text-center text-xs text-white/50 ${className}`}>{fallback ?? 'Immagine in arrivo'}</div>;
  return <img src={src.startsWith('/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src} alt={alt} decoding="async" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} onError={() => setBad(true)} className={className} />;
}
