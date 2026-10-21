import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';

export default function Tilt({ children, className = '', interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const bounds = useRef<DOMRect | null>(null);
  const point = useRef({ x: 0, y: 0 });
  const reset = () => {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    bounds.current = null;
    if (ref.current) ref.current.style.transform = '';
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  const enter = (e: PointerEvent<HTMLDivElement>) => {
    if (!interactive || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    bounds.current = e.currentTarget.getBoundingClientRect();
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!bounds.current) return;
    point.current = { x: e.clientX, y: e.clientY };
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const r = bounds.current, el = ref.current;
      if (!r || !el) return;
      const x = Math.max(-0.5, Math.min(0.5, (point.current.x - r.left) / r.width - 0.5));
      const y = Math.max(-0.5, Math.min(0.5, (point.current.y - r.top) / r.height - 0.5));
      el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
  };
  return <div ref={ref} onPointerEnter={enter} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}
    className={`${interactive ? 'photo-tilt' : ''} ${className}`}>{children}</div>;
}
