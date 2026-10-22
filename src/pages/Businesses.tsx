import { useState, type FormEvent } from 'react';
import { Building2, MessageCircle } from 'lucide-react';
import { waLink } from '../lib/supabase';

const fields = [
  { name: 'company', label: 'Ragione sociale', autoComplete: 'organization', maxLength: 150 },
  { name: 'vat', label: 'Partita IVA', autoComplete: 'off', maxLength: 20 },
  { name: 'contact', label: 'Nome e cognome del referente', autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Email aziendale', autoComplete: 'email', type: 'email', maxLength: 150 },
  { name: 'phone', label: 'Telefono', autoComplete: 'tel', type: 'tel', maxLength: 30 },
];
const fieldClass = 'w-full rounded-xl bg-white px-4 py-3 ring-1 ring-navy/20 focus:ring-2 focus:ring-gold';

export default function Businesses() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [request, setRequest] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('website')) return;
    const value = (name: string) => String(data.get(name) ?? '').trim();
    const next: Record<string, string> = {};
    if (value('company').length < 2) next.company = 'Inserisci la ragione sociale.';
    // Accept Italian VAT numbers and foreign VAT identifiers; verification is handled by DIGI HOUSE.
    if (!/^(?:IT\s*)?\d{11}$/i.test(value('vat')) && !/^[A-Z]{2}[A-Z0-9]{5,14}$/i.test(value('vat'))) next.vat = 'Inserisci una partita IVA di 11 cifre o un identificativo IVA estero con prefisso paese.';
    if (value('contact').length < 2) next.contact = 'Inserisci il nome del referente.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value('email'))) next.email = 'Inserisci un indirizzo email valido.';
    if (!/^[+\d\s()./-]+$/.test(value('phone')) || value('phone').replace(/\D/g, '').length < 6) next.phone = 'Inserisci un numero di telefono valido.';
    if (!data.get('acknowledgement')) next.acknowledgement = 'Conferma di voler essere ricontattato per la richiesta.';
    setErrors(next);
    if (Object.keys(next).length) {
      setRequest('');
      const first = form.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setRequest(waLink(`Buongiorno DIGI HOUSE, vorrei richiedere l’iscrizione della mia impresa e conoscere le condizioni commerciali dedicate.\n\nRagione sociale: ${value('company')}\nPartita IVA: ${value('vat')}\nReferente: ${value('contact')}\nEmail: ${value('email')}\nTelefono: ${value('phone')}${value('message') ? `\nEsigenze: ${value('message')}` : ''}\n\nChiedo di essere ricontattato per questa richiesta.`));
  };

  return <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Area imprese</p>
    <h1 className="mt-2 font-display text-3xl md:text-4xl">Iscrivi la tua impresa</h1>
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <div>
        <Building2 className="text-gold" size={40} aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl">Condizioni dedicate ai professionisti</h2>
        <p className="mt-4 leading-relaxed text-navy/80">I prezzi visualizzati sul sito sono riservati ai privati. Se acquisti per un’impresa, compila la richiesta per conoscere le condizioni dedicate alle tue forniture.</p>
        <ol className="mt-6 space-y-4 text-navy/80">
          <li>1. Inserisci i dati dell’impresa e del referente.</li>
          <li>2. Apri WhatsApp e conferma l’invio della richiesta a DIGI HOUSE.</li>
          <li>3. Ti ricontatteremo per verificare i dati e concordare le condizioni commerciali.</li>
        </ol>
        <p className="mt-6 text-sm text-navy/60">La richiesta non attiva automaticamente un account o un listino. Le condizioni per le imprese vengono confermate direttamente da DIGI HOUSE.</p>
      </div>
      <form onSubmit={submit} onChange={() => { if (request) setRequest(''); }} noValidate className="min-w-0 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10 md:p-8">
        <h2 className="font-display text-xl">Richiesta di iscrizione</h2>
        <p className="mt-2 text-sm text-navy/60">Tutti i campi sono obbligatori, salvo dove indicato.</p>
        <div className="mt-6 space-y-4">
          {fields.map(field => <div key={field.name}>
            <label htmlFor={`business-${field.name}`} className="mb-1 block text-sm font-medium">{field.label}</label>
            <input {...field} id={`business-${field.name}`} type={field.type ?? 'text'} required className={fieldClass} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />
            {errors[field.name] && <p id={`error-${field.name}`} role="alert" className="mt-1 text-sm text-red-700">{errors[field.name]}</p>}
          </div>)}
          <label className="block"><span className="mb-1 block text-sm font-medium">Di cosa hai bisogno? (facoltativo)</span><textarea name="message" rows={4} maxLength={1500} className={fieldClass} placeholder="Materiali, quantità o forniture che ti interessano" /></label>
          <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <label className="flex items-start gap-3 text-sm text-navy/80"><input name="acknowledgement" type="checkbox" required className="mt-1" aria-invalid={!!errors.acknowledgement} aria-describedby={errors.acknowledgement ? 'error-acknowledgement' : undefined} /><span>Chiedo di essere ricontattato da DIGI HOUSE per l’iscrizione e le condizioni riservate alla mia impresa.</span></label>
          {errors.acknowledgement && <p id="error-acknowledgement" role="alert" className="text-sm text-red-700">{errors.acknowledgement}</p>}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-navy/60">I dati del modulo saranno condivisi con DIGI HOUSE tramite WhatsApp solo quando confermerai l’invio del messaggio. Saranno usati per gestire questa richiesta.</p>
        <button type="submit" className="mt-6 rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90">Prepara la richiesta</button>
        {request && <div role="status" className="mt-5 rounded-2xl bg-navy-50 p-4">
          <p className="text-sm">Richiesta pronta. Apri WhatsApp e invia il messaggio per completare la richiesta di iscrizione.</p>
          <a href={request} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-navy"><MessageCircle size={18} />Invia su WhatsApp</a>
        </div>}
      </form>
    </div>
  </div>;
}
