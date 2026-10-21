import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  { src: '/banner/materiali-edili.jpg', alt: 'Materiali edili: scopri il reparto', to: '/catalogo?reparto=materiali-edili' },
  { src: '/banner/infissi.jpg', alt: 'Infissi: scopri il reparto', to: '/catalogo?reparto=infissi' },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI(n => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const s = slides[i];
  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative mx-auto w-full max-w-[340px]">
      <div className="absolute -inset-3 rounded-[2rem] bg-gold/30 blur-2xl" aria-hidden />
      <div className="relative aspect-[720/1020] overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
        <AnimatePresence mode="wait">
          <motion.div key={s.src} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0">
            <Link to={s.to}><img src={`${import.meta.env.BASE_URL}${s.src.slice(1)}`} alt={s.alt} className="h-full w-full object-cover" /></Link>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((x, n) => (
          <button key={x.src} onClick={() => setI(n)} aria-label={`Mostra banner ${n + 1}`}
            className={`h-2 rounded-full transition-all ${n === i ? 'w-8 bg-gold' : 'w-2 bg-white/40 hover:bg-white/70'}`} />))}
      </div>
    </div>
  );
}
