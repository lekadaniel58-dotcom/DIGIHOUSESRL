import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { Expand, X } from 'lucide-react';

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string; containerClassName?: string };

export default function ZoomImage({ src, alt, containerClassName = 'block w-full', ...props }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; trigger.current?.focus(); };
  }, [open]);
  return <>
    <button ref={trigger} type="button" aria-label={`Ingrandisci: ${alt}`} aria-haspopup="dialog"
      onClick={() => setOpen(true)} className={`relative cursor-zoom-in ${containerClassName}`}>
      <img decoding="async" {...props} src={src} alt={alt} />
      <span className="absolute bottom-3 right-3 rounded-full bg-white/90 p-2 text-navy shadow" aria-hidden><Expand size={16} /></span>
    </button>
    {open && createPortal(
      <dialog ref={node => { if (node && !node.open) node.showModal(); }} aria-label={alt}
        onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        className="m-auto max-h-[95dvh] w-[min(96vw,1600px)] max-w-none overflow-auto rounded-2xl bg-white p-3 text-navy backdrop:bg-black/80">
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm font-medium">{alt}</p>
          <button type="button" autoFocus aria-label="Chiudi immagine" onClick={() => setOpen(false)} className="shrink-0 rounded-full p-2 hover:bg-navy/10"><X /></button>
        </div>
        <img decoding="async" src={src} alt={alt} className="mx-auto max-h-[78dvh] max-w-full object-contain" />
      </dialog>, document.body)}
  </>;
}
