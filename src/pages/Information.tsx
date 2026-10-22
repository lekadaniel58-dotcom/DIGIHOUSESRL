import { Link } from 'react-router-dom';
import PromoCarousel from '../components/PromoCarousel';
import FxButton from '../components/FxButton';
import { MAPS } from '../components/Layout';
import { waLink } from '../lib/supabase';

export function Promotions() {
  return <div className="mx-auto max-w-7xl px-4 py-14">
    <h1 className="font-display text-3xl md:text-4xl">Promozioni</h1>
    <p className="mt-3 mb-8 max-w-2xl text-navy/70">Scopri le offerte DIGI HOUSE. Contattaci per confermare disponibilità, formati e condizioni della promozione.</p>
    <PromoCarousel />
    <div className="mt-8"><FxButton variant="navy" to="/catalogo">Esplora il catalogo</FxButton></div>
  </div>;
}

const sectors = [
  ['Edilizia e costruzioni', 'Materiali per nuove costruzioni, ristrutturazioni, murature e interventi di manutenzione.'],
  ['Pitture e decorazioni', 'Pitture per interni ed esterni, rivestimenti decorativi, prodotti antimuffa, impermeabilizzanti e soluzioni per la protezione delle superfici.'],
  ['Adesivi e sigillanti', 'Collanti professionali, stucchi, sigillanti cementizi, siliconi e prodotti per la posa e la finitura.'],
  ['Infissi e serramenti', 'Soluzioni per migliorare il comfort abitativo, l’isolamento termico e acustico e l’estetica degli edifici.'],
  ['Porte interne e blindate', 'Proposte che uniscono design, funzionalità, resistenza e sicurezza.'],
  ['Tapparelle e avvolgibili', 'Sistemi pratici e funzionali per la protezione e la gestione della luce negli ambienti.'],
  ['Zanzariere', 'Soluzioni per proteggere gli spazi abitativi dagli insetti senza rinunciare alla ventilazione.'],
  ['Pavimenti e rivestimenti', 'Ceramiche e materiali per valorizzare gli ambienti interni ed esterni.'],
  ['Accessori e attrezzature professionali', 'Prodotti e strumenti per la posa, la pittura, la manutenzione e i lavori di finitura.'],
];

export function About() {
  return <article className="mx-auto max-w-6xl px-4 py-10 md:py-14">
    <header className="rounded-3xl bg-navy p-7 text-white md:p-12">
      <h1 className="font-display text-3xl md:text-4xl">Chi siamo – DIGI HOUSE</h1>
      <h2 className="mt-5 max-w-3xl font-display text-2xl leading-snug text-gold md:text-3xl">La qualità per costruire, ristrutturare e valorizzare ogni ambiente.</h2>
      <p className="mt-6 max-w-3xl leading-relaxed text-white/80"><strong className="text-white">DIGI HOUSE</strong> è un’azienda con sede a <strong className="text-white">Casarano, in provincia di Lecce</strong>, specializzata nella fornitura di materiali e soluzioni per l’edilizia, le ristrutturazioni, le finiture e il miglioramento degli ambienti residenziali e commerciali.</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-white/80">Il nostro obiettivo è offrire a privati, professionisti, artigiani e imprese edili un punto di riferimento completo, dove trovare prodotti di qualità, soluzioni innovative e assistenza nella scelta dei materiali più adatti a ogni progetto.</p>
    </header>

    <section className="mt-12" aria-labelledby="about-products">
      <h2 id="about-products" className="font-display text-2xl md:text-3xl">Tutto ciò che serve per i tuoi progetti</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-navy/75">DIGI HOUSE propone un’ampia gamma di prodotti e soluzioni per soddisfare le diverse esigenze del settore edilizio e delle finiture.</p>
      <p className="mt-5 font-semibold">I nostri principali settori comprendono:</p>
      <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sectors.map(([title, text]) => <li key={title} className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
          <h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-navy/75">{text}</p>
        </li>)}
      </ul>
    </section>

    <section className="mt-12 max-w-3xl space-y-4 leading-relaxed text-navy/75" aria-labelledby="about-quality">
      <h2 id="about-quality" className="font-display text-2xl leading-snug text-navy md:text-3xl">Qualità, innovazione e attenzione al cliente</h2>
      <p>Crediamo che ogni progetto, dal piccolo intervento domestico alla ristrutturazione completa, meriti materiali affidabili e soluzioni adeguate.</p>
      <p>Per questo ci impegniamo a proporre prodotti che rispondano alle esigenze di funzionalità, durata, estetica e praticità, prestando particolare attenzione all’evoluzione dei materiali e delle tecnologie per l’edilizia.</p>
      <p>Il nostro approccio si basa su tre principi fondamentali: <strong className="text-navy">qualità dei prodotti, attenzione alle esigenze del cliente e ricerca della soluzione più adatta.</strong></p>
      <p>Vogliamo semplificare ogni fase della scelta, offrendo un assortimento completo e un servizio orientato sia ai professionisti del settore sia a chi desidera migliorare la propria abitazione.</p>
    </section>

    <section className="mt-12 rounded-3xl bg-white p-7 ring-1 ring-navy/10 md:p-10" aria-labelledby="about-reference">
      <h2 id="about-reference" className="font-display text-2xl md:text-3xl">Un unico punto di riferimento per ogni esigenza</h2>
      <p className="mt-4 max-w-3xl leading-relaxed text-navy/75">DIGI HOUSE nasce con una visione precisa: riunire in un’unica realtà commerciale tutto ciò che serve per costruire, rinnovare, proteggere e valorizzare gli spazi.</p>
      <p className="mt-4 max-w-3xl leading-relaxed text-navy/75">Dalla scelta dei materiali edili alle finiture decorative, dagli infissi alle porte, fino ai prodotti tecnici per la posa e la manutenzione, il nostro obiettivo è accompagnare ogni cliente nella realizzazione dei propri progetti.</p>
      <p className="mt-6 font-semibold">DIGI HOUSE – Le soluzioni giuste per dare forma alle tue idee.</p>
    </section>

    <section className="mt-12 border-t border-navy/10 pt-10" aria-labelledby="about-location">
      <h2 id="about-location" className="font-display text-2xl md:text-3xl">Dove siamo</h2>
      <p className="mt-4 text-navy/75">Ti aspettiamo presso la nostra sede:</p>
      <address className="mt-4 space-y-3 not-italic">
        <p><a href={MAPS} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-gold underline-offset-4">Zona Industriale Casarano, Lotto 10, Tronco A – Casarano (LE)</a></p>
        <p><strong>Telefono:</strong> <a href="tel:+3908331860089" className="hover:underline">+39 0833 186 0089</a></p>
        <p><strong>WhatsApp:</strong> <a href={waLink('Buongiorno, vorrei informazioni su DIGI HOUSE.')} target="_blank" rel="noopener noreferrer" className="hover:underline">+39 328 309 9390</a></p>
        <p><strong>Email:</strong> <a href="mailto:degihousesrl@gmail.com" className="break-all hover:underline">degihousesrl@gmail.com</a></p>
      </address>
      <p className="mt-7 font-semibold">DIGI HOUSE: costruire, ristrutturare, innovare.</p>
      <div className="mt-8 flex flex-wrap gap-3"><FxButton variant="navy" to="/contatti">Contattaci</FxButton><FxButton to="/catalogo">Scopri i prodotti</FxButton></div>
    </section>
  </article>;
}

export function NotFound() {
  return <div className="mx-auto max-w-3xl px-4 py-20">
    <h1 className="font-display text-3xl">Pagina non trovata</h1>
    <p className="mt-4 text-navy/70">Il collegamento non corrisponde a una pagina del sito.</p>
    <Link to="/" className="mt-6 inline-block font-semibold underline">Torna alla homepage</Link>
    <Link to="/catalogo" className="ml-6 inline-block font-semibold underline">Apri il catalogo</Link>
  </div>;
}
