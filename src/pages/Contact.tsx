import { useState, type FormEvent } from 'react';
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { supabase, waLink } from '../lib/supabase';
import FxButton from '../components/FxButton';
import { MAPS } from '../components/Layout';

const reparti = ['Porte interne e finestre', 'Avvolgibili e zanzariere', 'Ferramenta', 'Materiali edili', 'Pennelli, rulli e accessori', 'Altro'];
const field = 'w-full rounded-xl bg-white px-4 py-3 ring-1 ring-navy/10 transition focus:ring-2 focus:ring-gold';

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('website')) return; // honeypot anti-spam: i bot compilano il campo nascosto
    const name = String(f.get('name') ?? '').trim(), email = String(f.get('email') ?? '').trim();
    const phone = String(f.get('phone') ?? '').trim(), dept = String(f.get('dept') ?? ''), msg = String(f.get('message') ?? '').trim();
    const err: Record<string, string> = {};
    if (name.length < 2) err.name = 'Inserisci nome e cognome.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) err.email = 'Inserisci un indirizzo email valido.';
    if (msg.length < 10) err.message = 'Scrivi almeno 10 caratteri.';
    if (msg.length > 2500) err.message = 'Messaggio troppo lungo.';
    setErrors(err);
    if (Object.keys(err).length) return;
    setStatus('sending');
    const full = `${dept ? `Reparto: ${dept}\n` : ''}${phone ? `Telefono: ${phone}\n` : ''}\n${msg}`;
    try {
      if (!supabase) {
        setStatus('idle');
        window.location.assign(waLink(`Buongiorno, sono ${name}. Email: ${email}\n${full}`));
        return;
      }
      const { error } = await supabase.from('contact_messages').insert({ name, email, message: full });
      setStatus(error ? 'error' : 'ok');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Contatti</p>
      <h1 className="mt-2 font-display text-3xl md:text-4xl">Il tuo progetto merita una conversazione.</h1>
      <p className="mt-3 max-w-2xl text-navy/70">Passa a trovarci, chiamaci o lascia un messaggio. Iniziamo da quello che vuoi realizzare.</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          {[[Mail, 'Email', 'degihousesrl@gmail.com', 'mailto:degihousesrl@gmail.com'], [Phone, 'Telefono fisso', '+39 0833 186 0089', 'tel:+3908331860089'],
            [MessageCircle, 'WhatsApp', '+39 328 309 9390', waLink('Buongiorno, vorrei informazioni.')], [MapPin, 'Come raggiungerci', 'Zona Industriale Casarano, Lotto 10, Tronco A - Apri su Google Maps', MAPS]].map(([Icon, t, v, h]) => {
            const I = Icon as typeof Mail;
            return (
              <a key={String(t)} href={String(h)} target={String(h).startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-navy/5 transition hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-navy text-gold"><I size={20} /></span>
                <span><span className="block text-xs font-semibold uppercase tracking-wider text-navy/50">{String(t)}</span><span className="font-medium">{String(v)}</span></span>
              </a>); })}
        </div>
        <form onSubmit={submit} noValidate className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/5 md:p-8">
          {status === 'ok' ? (
            <div className="py-10 text-center" role="status">
              <CheckCircle2 className="mx-auto text-gold" size={56} /><h2 className="mt-3 font-display text-2xl">Richiesta inviata!</h2><p className="mt-1 text-navy/70">Ti ricontatteremo per capire meglio il tuo progetto.</p>
            </div>) : (<>
            <h2 className="font-display text-xl">Raccontaci cosa stai costruendo.</h2>
            <div className="mt-5 space-y-4">
              <label className="block"><span className="mb-1 block text-sm font-medium">Nome e cognome</span><input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} />{errors.name && <span role="alert" className="text-sm text-red-700">{errors.name}</span>}</label>
              <label className="block"><span className="mb-1 block text-sm font-medium">Email</span><input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} />{errors.email && <span role="alert" className="text-sm text-red-700">{errors.email}</span>}</label>
              <label className="block"><span className="mb-1 block text-sm font-medium">Telefono (facoltativo)</span><input name="phone" type="tel" autoComplete="tel" className={field} /></label>
              <label className="block"><span className="mb-1 block text-sm font-medium">Sono interessato a</span><select name="dept" className={field} defaultValue=""><option value="">Scegli il reparto</option>{reparti.map(r => <option key={r}>{r}</option>)}</select></label>
              <label className="block"><span className="mb-1 block text-sm font-medium">Messaggio</span><textarea name="message" rows={5} maxLength={2500} className={field} aria-invalid={!!errors.message} />{errors.message && <span role="alert" className="text-sm text-red-700">{errors.message}</span>}</label>
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />
            </div>
            {status === 'error' && <p role="alert" className="mt-4 text-sm text-red-700">{supabase ? 'Invio non riuscito. Riprova tra qualche secondo o scrivici su WhatsApp.' : 'Non è stato possibile aprire WhatsApp. Usa il collegamento WhatsApp presente in questa pagina.'}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3"><FxButton variant="navy" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Invio in corso…' : supabase ? 'Invia la richiesta' : 'Continua su WhatsApp'}</FxButton>
              <span className="text-xs text-navy/50">{!supabase && 'Il messaggio si aprirà in WhatsApp: conferma lì l’invio. '}Nessun impegno: ti ricontattiamo per capire meglio di cosa hai bisogno.</span></div>
          </>)}
        </form>
      </div>
    </div>
  );
}
