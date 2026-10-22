import { Link } from 'react-router-dom';
import PromoCarousel from '../components/PromoCarousel';
import FxButton from '../components/FxButton';

export function Promotions() {
  return <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="font-display text-3xl md:text-4xl">Promozioni</h1>
    <p className="mt-3 mb-8 max-w-2xl text-navy/70">Scopri le offerte DIGI HOUSE. Contattaci per confermare disponibilità, formati e condizioni della promozione.</p>
    <PromoCarousel />
    <div className="mt-8"><FxButton variant="navy" to="/catalogo">Esplora il catalogo</FxButton></div>
  </div>;
}

export function About() {
  return <div className="mx-auto max-w-4xl px-4 py-14">
    <h1 className="font-display text-3xl md:text-4xl">Chi siamo</h1>
    <p className="mt-5 text-lg text-navy/80">DIGI HOUSE SRL è a Casarano, in provincia di Lecce: un punto di riferimento per casa, edilizia e serramenti.</p>
    <p className="mt-4 text-navy/70">Porte interne e blindate, finestre, avvolgibili, zanzariere, materiali edili, pitture e ferramenta: ti aiutiamo a confrontare le alternative e a scegliere ciò che serve al tuo progetto.</p>
    <p className="mt-4 text-navy/70">Rivolgiti a noi per informazioni sui prodotti, disponibilità, formati e soluzioni su misura. Ci trovi nella Zona Industriale di Casarano, Lotto 10, Tronco A.</p>
    <div className="mt-8 flex flex-wrap gap-3"><FxButton variant="navy" to="/contatti">Contattaci</FxButton><FxButton to="/catalogo">Scopri i prodotti</FxButton></div>
  </div>;
}

export function NotFound() {
  return <div className="mx-auto max-w-3xl px-4 py-20">
    <h1 className="font-display text-3xl">Pagina non trovata</h1>
    <p className="mt-4 text-navy/70">Il collegamento non corrisponde a una pagina del sito.</p>
    <Link to="/" className="mt-6 inline-block font-semibold underline">Torna alla homepage</Link>
    <Link to="/catalogo" className="ml-6 inline-block font-semibold underline">Apri il catalogo</Link>
  </div>;
}
