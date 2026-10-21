import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'gold' | 'navy' | 'ghost' | 'wa';
const styles: Record<Variant, string> = {
  gold: 'bg-gold text-navy hover:shadow-[0_12px_30px_-6px_rgba(184,137,43,.7)]',
  navy: 'bg-navy text-white hover:shadow-[0_12px_30px_-6px_rgba(29,28,59,.6)]',
  ghost: 'border border-white/30 text-white hover:border-gold hover:text-gold',
  wa: 'bg-[#25D366] text-white hover:shadow-[0_12px_30px_-6px_rgba(37,211,102,.7)]',
};
interface Props { variant?: Variant; size?: 'sm' | 'md'; to?: string; href?: string; onClick?: () => void; children: ReactNode; className?: string; type?: 'button' | 'submit'; disabled?: boolean }

/** Pulsante con bagliore al passaggio, onda al click e leggero rimbalzo alla pressione */
export default function FxButton({ variant = 'gold', size = 'md', to, href, children, className = '', type = 'button', onClick, disabled }: Props) {
  const burst = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget; const r = el.getBoundingClientRect(); const d = Math.max(r.width, r.height) * 2;
    const s = document.createElement('span');
    s.className = 'fx-ripple';
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    el.appendChild(s); setTimeout(() => s.remove(), 650);
    onClick?.();
  };
  const cls = `fx-btn relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold transition duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-60 ${size === 'sm' ? 'px-4 py-2 text-sm' : 'px-6 py-3'} ${styles[variant]} ${className}`;
  const inner = <><span className="fx-shine" aria-hidden /><span className="relative z-10 inline-flex items-center gap-2">{children}</span></>;
  if (to) return <Link to={to} onClick={burst} className={cls}>{inner}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" onClick={burst} className={cls}>{inner}</a>;
  return <button type={type} disabled={disabled} onClick={burst} className={cls}>{inner}</button>;
}
