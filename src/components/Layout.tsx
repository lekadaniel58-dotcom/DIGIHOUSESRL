import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Facebook, Instagram, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { waLink } from '../lib/supabase';
import FxButton from './FxButton';

const links = [['/#serramenti', 'Serramenti'], ['/#comfort', 'Comfort'], ['/#edilizia', 'Edilizia & Fai-da-te'], ['/catalogo', 'Catalogo'], ['/#offerte', 'Offerte'], ['/contatti', 'Contatti']] as const;
export const MAPS = 'https://maps.app.goo.gl/SMNmwgoUxkVnGmSTA';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => {
    setOpen(false);
    if (loc.hash) { const t = setTimeout(() => document.getElementById(loc.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80); return () => clearTimeout(t); }
    window.scrollTo(0, 0);
  }, [loc.pathname, loc.hash]);
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 bg-navy text-white shadow-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" aria-label="DIGI HOUSE - Home"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="DIGI HOUSE" className="h-11 w-auto transition hover:scale-105" /></Link>
          <nav className="hidden items-center gap-6 lg:flex" aria-label="Principale">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className="group relative py-1 text-sm font-medium transition hover:text-gold">{label}
                <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" /></Link>))}
          </nav>
          <div className="flex items-center gap-3">
            <a href="tel:+3908331860089" className="hidden items-center gap-2 text-sm hover:text-gold xl:flex" aria-label="Chiama"><Phone size={16} />0833 186 0089</a>
            <div className="hidden sm:block"><FxButton size="sm" to="/contatti">Richiedi consulenza</FxButton></div>
            <button className="p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>{open ? <X /> : <Menu />}</button>
          </div>
        </div>

          {open && (
            <nav className="overflow-hidden border-t border-white/10 lg:hidden" aria-label="Mobile">
              <div className="flex flex-col gap-1 px-4 py-3">{links.map(([to, label]) => <Link key={to} to={to} className="rounded-lg px-2 py-2 transition hover:bg-white/10 hover:text-gold">{label}</Link>)}</div>
            </nav>)}

      </header>
      <main className="flex-1"><Outlet /></main>
      <a href={waLink('Buongiorno, vorrei informazioni sui vostri prodotti.')} target="_blank" rel="noopener noreferrer" aria-label="Scrivici su WhatsApp"
        className="group fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-xl transition hover:scale-110">
        <MessageCircle size={20} className="relative" /><span className="relative hidden text-sm font-semibold sm:inline">WhatsApp</span>
      </a>
      <footer className="bg-navy text-sm text-white/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
          <div><img src={`${import.meta.env.BASE_URL}logo.png`} alt="DIGI HOUSE" className="h-12 w-auto" /><p className="mt-3">Il punto di riferimento per casa, edilizia e serramenti.</p>
            <div className="mt-3 flex gap-3"><a href="https://facebook.com/712149025312569" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="transition hover:text-gold"><Facebook /></a>
              <a href="https://www.instagram.com/digihouse_srl" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition hover:text-gold"><Instagram /></a></div></div>
          <div><p className="mb-2 font-semibold text-white">Reparti</p><ul className="space-y-1">{links.slice(0, 5).map(([to, l]) => <li key={to}><Link to={to} className="hover:text-gold">{l}</Link></li>)}</ul></div>
          <div><p className="mb-2 font-semibold text-white">Contatti</p>
            <p>DIGI HOUSE SRL<br />Zona Industriale Casarano, Lotto 10, Tronco A, Casarano (LE)</p>
            <p className="mt-2">Tel. +39 0833 186 0089<br />WhatsApp +39 328 309 9390<br />degihousesrl@gmail.com</p>
            <a href={MAPS} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-gold hover:underline">Apri la sede su Google Maps</a></div>
        </div>
        <p className="border-t border-white/10 py-4 text-center text-xs">© DIGI HOUSE. Tutti i diritti riservati. · Privacy · Cookie</p>
      </footer>
    </div>
  );
}
