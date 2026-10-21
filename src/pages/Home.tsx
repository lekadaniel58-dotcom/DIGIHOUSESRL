import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Bug, Hammer, Layers, MessageCircle, Paintbrush, Ruler, Shield, ShieldCheck, Sparkles, Sun, Wrench, Zap, DoorClosed, Square, AlignJustify, Package, Droplets, type LucideIcon } from 'lucide-react';
import { useCatalog } from '../lib/useCatalog';
import { waLink } from '../lib/supabase';
import { partners } from '../data/promos';
import FxButton from '../components/FxButton';
import Tilt from '../components/Tilt';
import SafeImg from '../components/SafeImg';
import CountUp from '../components/CountUp';
import PromoCarousel from '../components/PromoCarousel';

const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-60px' as const }, transition: { duration: 0.55 } };
interface Card { slug: string; title: string; text: string; Icon: LucideIcon }

const serramenti: Card[] = [
  { slug: 'porte-interne', title: 'Porte interne', text: 'Scorrevoli, battenti, rasomuro e vetrate: soluzioni per arredare gli ambienti con stile e personalità.', Icon: DoorClosed },
  { slug: 'infissi', title: 'Finestre e infissi', text: 'Alluminio, PVC e sistemi compositi per luce naturale, isolamento e comfort abitativo.', Icon: Square },
  { slug: 'porte-blindate', title: 'Porte blindate e portoncini', text: 'Sicurezza, tecnologia, isolamento e finiture personalizzabili per l’ingresso di casa.', Icon: ShieldCheck },
  { slug: 'infissi', title: 'Persiane e scuri', text: 'Protezione solare, privacy e carattere architettonico: scegli la soluzione adatta alla facciata.', Icon: Shield },
];
const comfort: Card[] = [
  { slug: 'avvolgibili-e-tapparelle', title: 'Avvolgibili', text: 'Schermatura, privacy e sicurezza.', Icon: AlignJustify },
  { slug: 'zanzariere', title: 'Zanzariere', text: 'Aria e protezione dagli insetti.', Icon: Bug },
];
const features = [
  { Icon: Sun, t: 'Protezione dal sole', d: 'Gestisci luce e calore per rendere gli ambienti più piacevoli.' },
  { Icon: Bug, t: 'Protezione dagli insetti', d: 'Reti discrete e resistenti per vivere le finestre con più libertà.' },
  { Icon: Zap, t: 'Motorizzazioni', d: 'Apertura e chiusura più semplici, con comandi intuitivi.' },
  { Icon: Ruler, t: 'Soluzioni su misura', d: 'Misure precise e configurazioni pensate per ogni apertura.' },
];
const edilizia: Card[] = [
  { slug: 'materiali-edili', title: 'Materiali edili', text: 'Per costruire e ristrutturare.', Icon: Hammer },
  { slug: 'pitture-e-decorazioni', title: 'Pitture', text: 'Colori e prodotti per pareti e superfici.', Icon: Paintbrush },
  { slug: 'adesivi-e-sigillanti', title: 'Adesivi e sigillanti', text: 'Per unire, proteggere e completare.', Icon: Droplets },
  { slug: 'finiture', title: 'Finiture', text: 'Effetti, protezioni e dettagli di carattere.', Icon: Sparkles },
  { slug: 'pennelli-e-accessori', title: 'Pennelli e accessori', text: 'Strumenti per pittura, finitura e preparazione.', Icon: Layers },
  { slug: 'protezione-e-preparazione', title: 'Protezione e preparazione', text: 'Carta, teli, nastri e utensili per lavorare pulito.', Icon: Package },
  { slug: 'ferramenta', title: 'Ferramenta e utensili', text: 'Attrezzi, fissaggi e strumenti per il cantiere.', Icon: Wrench },
];
const perche = [
  ['01', 'Partiamo dall’uso, non dal catalogo.', 'Ascoltiamo le esigenze del tuo spazio o del tuo cantiere per proporti soluzioni che hanno davvero senso.'],
  ['02', 'Mettiamo chiarezza tra le alternative.', 'Materiali, prestazioni, finiture: confronta con il supporto di chi conosce ogni dettaglio del reparto.'],
  ['03', 'Restiamo il tuo punto fermo.', 'Dalla prima scelta all’ultimo accessorio, trovi una squadra pronta ad aiutarti a chiudere il progetto.'],
];

function DeptCard({ c, i, big = false }: { c: Card; i: number; big?: boolean }) {
  return (
    <motion.div {...reveal} transition={{ delay: (i % 4) * 0.07, duration: 0.5 }}>
      <Tilt className="h-full rounded-2xl">
        <Link to={`/catalogo?reparto=${c.slug}`} className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-navy/5 transition-colors duration-300 hover:bg-navy hover:text-white ${big ? 'min-h-[220px]' : 'min-h-[170px]'}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Reparto / {String(i + 1).padStart(2, '0')}</span>
          <c.Icon className="mt-4 text-gold transition duration-300 group-hover:-rotate-6 group-hover:scale-125" size={30} />
          <h3 className="mt-3 text-xl font-semibold">{c.title}</h3>
          <p className="mt-1 flex-1 text-sm opacity-70">{c.text}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold">Scopri <ArrowUpRight size={16} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
          <span className="absolute bottom-0 left-0 h-1 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
        </Link>
      </Tilt>
    </motion.div>
  );
}

const Head = ({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) => (
  <motion.div {...reveal} className="max-w-2xl">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">{eyebrow}</p>
    <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
    {text && <p className="mt-3 text-navy/70">{text}</p>}
  </motion.div>
);

export default function Home() {
  const { departments, products, loading } = useCatalog();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 70]);
  const loop = [...partners, ...partners];
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-gold/15 blur-3xl" aria-hidden />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:48px_48px]" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gold">Casa · Edilizia · Serramenti</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-4xl leading-[1.1] md:text-6xl">
              Tutto quello che serve per costruire <span className="text-shine italic">meglio.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-5 max-w-xl text-lg text-white/75">
              Porte interne, finestre, avvolgibili, zanzariere, ferramenta, materiali edili e pitture: DIGI HOUSE ti aiuta a scegliere le soluzioni giuste per la casa, il cantiere e ogni progetto fai-da-te.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-3">
              <FxButton to="/catalogo">Scopri i nostri reparti</FxButton>
              <FxButton variant="ghost" to="/contatti">Parla con noi</FxButton>
            </motion.div>
            <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 grid max-w-lg grid-cols-3 gap-4 text-sm">
              {[['Ampio', 'assortimento'], ['Su misura', 'soluzioni che si adattano'], ['Supporto', 'diretto in sede']].map(([a, b]) => (
                <div key={a} className="border-l-2 border-gold pl-3"><dt className="font-semibold">{a}</dt><dd className="text-white/60">{b}</dd></div>))}
            </motion.dl>
          </div>
          <motion.div style={{ y }} className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-gold/25 blur-2xl" aria-hidden />
            <Tilt className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              <SafeImg src="/assets/hero-house.jpg" alt="Casa contemporanea con ampie finestre e serramenti scuri" className="aspect-[4/3] w-full object-cover" fallback="DIGI HOUSE" />
            </Tilt>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }} className="absolute -bottom-5 -left-3 rounded-2xl bg-gold px-5 py-3 text-navy shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-wider">Soluzioni complete</p><p className="font-display text-lg leading-tight">Dalla casa al cantiere.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {!loading && products.length > 0 && (
        <section className="bg-gold text-navy"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-5 text-center">
          <div><p className="font-display text-3xl"><CountUp to={products.length} /></p><p className="text-sm font-medium">prodotti a catalogo</p></div>
          <div><p className="font-display text-3xl"><CountUp to={departments.length} /></p><p className="text-sm font-medium">reparti</p></div>
        </div></section>)}

      <section id="offerte" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-16">
        <Head eyebrow="Occasioni DIGI HOUSE" title="Super promo del momento." text="Prodotti professionali in offerta, fino ad esaurimento scorte." />
        <motion.div {...reveal} className="mt-8"><PromoCarousel /></motion.div>
      </section>

      <section id="serramenti" className="scroll-mt-20 bg-white py-16"><div className="mx-auto max-w-7xl px-4">
        <Head eyebrow="Porte interne & finestre" title="Dettagli che definiscono lo spazio." text="Una porta non separa soltanto due ambienti. Una finestra non porta dentro solo la luce. Insieme definiscono proporzioni, atmosfera e comfort della casa." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{serramenti.map((c, i) => <DeptCard key={c.title} c={c} i={i} big />)}</div>
      </div></section>

      <section id="comfort" className="scroll-mt-20 mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <Head eyebrow="Avvolgibili & zanzariere" title="Il comfort non si nota. Si sente." text="Più controllo sulla luce. Più protezione dagli insetti. Più comfort in ogni stagione." />
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {features.map((f, i) => (
                <motion.div key={f.t} {...reveal} transition={{ delay: i * 0.08, duration: 0.5 }} whileHover={{ y: -4 }} className="rounded-2xl bg-white p-4 ring-1 ring-navy/5">
                  <f.Icon className="text-gold" /><h3 className="mt-2 font-semibold">{f.t}</h3><p className="text-sm text-navy/70">{f.d}</p>
                </motion.div>))}
            </div>
          </div>
          <div>
            <Tilt className="overflow-hidden rounded-3xl shadow-xl"><SafeImg src="/assets/roller-screen.jpg" alt="Sistema avvolgibile e schermatura per finestra" className="aspect-[4/3] w-full object-cover" fallback="Avvolgibili e zanzariere" /></Tilt>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">{comfort.map((c, i) => <DeptCard key={c.title} c={c} i={i} />)}</div>
          </div>
        </div>
      </section>

      <section id="edilizia" className="scroll-mt-20 bg-navy py-16 text-white"><div className="mx-auto max-w-7xl px-4">
        <motion.div {...reveal}><p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Ferramenta · edilizia · pittura</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl md:text-4xl">Per fare bene, serve trovare quello che serve.</h2>
          <p className="mt-3 max-w-2xl text-white/70">Un assortimento pratico e organizzato di ferramenta e materiali edili: soluzioni per professionisti, artigiani e amanti del fai-da-te.</p></motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {edilizia.map((c, i) => (
            <motion.div key={c.slug} {...reveal} transition={{ delay: (i % 4) * 0.06, duration: 0.5 }}>
              <Link to={`/catalogo?reparto=${c.slug}`} className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-navy">
                <c.Icon className="text-gold transition group-hover:scale-125 group-hover:text-navy" /><h3 className="mt-3 font-semibold">{c.title}</h3><p className="mt-1 text-sm opacity-70">{c.text}</p>
              </Link>
            </motion.div>))}
          <motion.div {...reveal} className="flex flex-col justify-between rounded-2xl bg-gold p-5 text-navy">
            <p className="font-display text-xl leading-tight">Un catalogo che parla pratico.</p>
            <p className="mt-2 text-sm">Chiedi disponibilità: formati e quantità da cantiere.</p>
            <div className="mt-4"><FxButton variant="navy" size="sm" href={waLink('Ciao DIGI HOUSE, vorrei sapere la disponibilità di alcuni prodotti.')}><MessageCircle size={16} />Chiedi disponibilità</FxButton></div>
          </motion.div>
        </div>
      </div></section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <Head eyebrow="Perché DIGI HOUSE" title="Non solo prodotti. Risposte." text="Quando un progetto richiede tempo, la differenza la fanno le persone che sanno indicarti la strada più semplice." />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {perche.map(([n, t, d], i) => (
            <motion.div key={n} {...reveal} transition={{ delay: i * 0.1, duration: 0.5 }} whileHover={{ y: -6 }} className="rounded-2xl bg-white p-6 ring-1 ring-navy/5">
              <span className="font-display text-5xl text-gold/40">{n}</span><h3 className="mt-2 text-xl font-semibold">{t}</h3><p className="mt-1 text-navy/70">{d}</p>
            </motion.div>))}
        </div>
      </section>

      <section className="overflow-hidden bg-white py-14">
        <div className="mx-auto max-w-7xl px-4"><Head eyebrow="Collaborazioni selezionate" title="I nostri partner." text="Soluzioni e materiali scelti da aziende specializzate nei rispettivi settori." /></div>
        <div className="mt-8 flex w-max animate-marquee gap-6 motion-reduce:animate-none">
          {loop.map((p, i) => (
            <div key={i} className="flex h-24 w-52 items-center justify-center rounded-2xl bg-navy-50 px-4 text-center text-sm font-semibold text-navy/70 grayscale transition hover:grayscale-0">
              {p.logo ? <SafeImg src={p.logo} alt={p.name} className="max-h-14 object-contain" fallback={p.name} /> : p.name}
            </div>))}
        </div>
      </section>

      <section className="px-4 pb-16"><motion.div {...reveal} className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-navy-700 to-navy p-10 text-white md:p-14">
        <h2 className="font-display text-3xl md:text-4xl">Il tuo progetto merita <span className="text-shine">una conversazione.</span></h2>
        <p className="mt-3 max-w-xl text-white/75">Passa a trovarci, chiamaci o scrivici su WhatsApp. Raccontaci cosa stai costruendo, ristrutturando o cercando.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <FxButton variant="wa" href={waLink('Ciao DIGI HOUSE, vorrei parlare di un progetto.')}><MessageCircle size={18} />WhatsApp</FxButton>
          <FxButton to="/contatti">Richiedi consulenza</FxButton>
        </div>
      </motion.div></section>
    </>
  );
}
