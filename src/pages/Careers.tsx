import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Building2, CheckCircle2, Mail } from 'lucide-react';

import { Link } from 'react-router-dom';

type Field = { name: string; label: string; autoComplete: string; maxLength: number; type?: string };
const commonFields: Field[] = [
  { name: 'contact', label: 'Nome e cognome', autoComplete: 'name', maxLength: 100 },
  { name: 'email', label: 'Email', autoComplete: 'email', type: 'email', maxLength: 150 },
  { name: 'phone', label: 'Telefono', autoComplete: 'tel', type: 'tel', maxLength: 30 },
  { name: 'city', label: 'Comune e provincia', autoComplete: 'address-level2', maxLength: 150 },
  { name: 'specialty', label: 'Ruolo o specializzazione', autoComplete: 'organization-title', maxLength: 150 },
];
const companyFields: Field[] = [
  { name: 'company', label: 'Ragione sociale', autoComplete: 'organization', maxLength: 150 },
  { name: 'vat', label: 'Partita IVA', autoComplete: 'off', maxLength: 20 },
];
const fieldClass = 'w-full rounded-xl bg-white px-4 py-3 ring-1 ring-navy/20 focus:ring-2 focus:ring-gold';

export default function Careers() {
  const [kind, setKind] = useState<'employee' | 'subcontractor'>('employee');
  const fields = kind === 'subcontractor' ? [...companyFields, ...commonFields] : commonFields;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [slow, setSlow] = useState(false);
  const inFlight = useRef<AbortController | null>(null);
  const uploadFrame = useRef<HTMLIFrameElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => () => { inFlight.current?.abort(); }, []);
  useEffect(() => { if (status === 'success' || status === 'error') feedback.current?.focus(); }, [status]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('_honey')) { event.preventDefault(); return; }
    const value = (name: string) => String(data.get(name) ?? '').trim();
    const next: Record<string, string> = {};
    if (kind === 'subcontractor' && value('company').length < 2) next.company = 'Inserisci la ragione sociale.';
    // Accept Italian VAT numbers and foreign VAT identifiers; verification is handled by DIGI HOUSE.
    if (kind === 'subcontractor' && !/^(?:IT\s*)?\d{11}$/i.test(value('vat')) && !/^[A-Z]{2}[A-Z0-9]{5,14}$/i.test(value('vat'))) next.vat = 'Inserisci una partita IVA di 11 cifre o un identificativo IVA estero con prefisso paese.';
    if (value('contact').length < 2) next.contact = 'Inserisci il nome del referente.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value('email'))) next.email = 'Inserisci un indirizzo email valido.';
    if (!/^[+\d\s()./-]+$/.test(value('phone')) || value('phone').replace(/\D/g, '').length < 6) next.phone = 'Inserisci un numero di telefono valido.';
    if (value('city').length < 2) next.city = 'Indica il comune e la provincia.';
    if (value('specialty').length < 2) next.specialty = 'Indica il ruolo o la specializzazione.';
    if (value('message').length < 10) next.message = 'Descrivi brevemente la tua esperienza (almeno 10 caratteri).';
    const attachment = data.get('attachment');
    if (!(attachment instanceof File) || !attachment.size) next.attachment = 'Allega il curriculum o il profilo aziendale.';
    else if (!/\.(pdf|doc|docx)$/i.test(attachment.name)) next.attachment = 'Scegli un file PDF o Word (.doc, .docx).';
    else if (attachment.size > 5_000_000) next.attachment = 'Il file supera il limite di 5 MB.';
    if (!data.get('acknowledgement')) next.acknowledgement = 'Conferma di voler essere ricontattato per la candidatura.';
    setErrors(next);
    if (Object.keys(next).length) {
      event.preventDefault();
      const first = form.elements.namedItem(Object.keys(next)[0]);
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    const controller = new AbortController();
    inFlight.current = controller;
    setStatus('sending');
    setSlow(false);
    const slowTimer = window.setTimeout(() => setSlow(true), 8000);
    const timeout = window.setTimeout(() => controller.abort(), 45000);
    try {
      // File attachments use the provider's multipart endpoint. Its success redirect
      // returns a receipt to a hidden frame so the candidate stays on this page.
      const requestId = crypto.randomUUID();
      const receipt = new URL(`${import.meta.env.BASE_URL}candidatura-inviata.html`, window.location.origin);
      receipt.searchParams.set('request', requestId);
      (form.elements.namedItem('_next') as HTMLInputElement).value = receipt.href;
      await new Promise<void>((resolve, reject) => {
        const clean = () => {
          window.removeEventListener('message', confirmed);
          controller.signal.removeEventListener('abort', aborted);
        };
        const confirmed = (event: MessageEvent) => {
          if (event.origin !== window.location.origin || event.source !== uploadFrame.current?.contentWindow ||
              event.data?.type !== 'digi-careers-receipt' || event.data?.request !== requestId) return;
          clean();
          resolve();
        };
        const aborted = () => { clean(); reject(new Error('No confirmation received')); };
        window.addEventListener('message', confirmed);
        controller.signal.addEventListener('abort', aborted, { once: true });
        try { HTMLFormElement.prototype.submit.call(form); }
        catch (error) { clean(); reject(error); }
      });
      if (inFlight.current === controller) setStatus('success');
    } catch {
      if (inFlight.current === controller) setStatus('error');
    } finally {
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeout);
      if (inFlight.current === controller) inFlight.current = null;
      setSlow(false);
    }
  };

  return <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">Persone e collaborazioni</p>
    <h1 className="mt-2 font-display text-3xl md:text-4xl">Lavora con noi</h1>
    <p className="mt-4 max-w-2xl text-navy/75">Proponi la tua candidatura per lavorare come dipendente oppure presenta la tua azienda per collaborare come subappaltatore.</p>
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
          <h2 className="font-display text-2xl">Vuoi lavorare come dipendente?</h2>
          <p className="mt-3 text-navy/75">Raccontaci le tue competenze, le esperienze e il ruolo che ti interessa. Puoi inviare una candidatura spontanea anche se non trovi una posizione pubblicata.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 ring-1 ring-navy/10">
          <Building2 className="text-gold" size={32} aria-hidden="true" />
          <h2 className="mt-3 font-display text-2xl">Sei un’azienda subappaltatrice?</h2>
          <p className="mt-3 text-navy/75">Presenta la tua impresa, le lavorazioni di cui ti occupi, le zone in cui operi e la disponibilità della tua squadra.</p>
        </div>
        <p className="text-sm text-navy/60">Valuteremo le candidature in base alle nostre esigenze. L’invio non garantisce un’assunzione o un incarico. Se necessario, ti contatteremo per approfondire e richiedere ulteriori informazioni o documentazione aziendale.</p>
      </div>
      <iframe ref={uploadFrame} name="careers-upload" title="Conferma invio candidatura" hidden aria-hidden="true" />
      <form action="https://formsubmit.co/degihousesrl@gmail.com" method="POST" encType="multipart/form-data" target="careers-upload" onSubmit={submit} noValidate aria-busy={status === 'sending'} className="min-w-0 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-navy/10 md:p-8">
        {status === 'success' ? <div ref={feedback} tabIndex={-1} role="status" className="py-8 text-center">
          <CheckCircle2 size={48} className="mx-auto text-gold" aria-hidden="true" />
          <h2 className="mt-4 font-display text-2xl">Candidatura inviata</h2>
          <p className="mt-3 text-navy/70">Grazie per esserti proposto a DIGI HOUSE. Ti contatteremo se il tuo profilo o la tua azienda risponderanno alle nostre esigenze.</p>
          <Link to="/" className="mt-6 inline-block rounded-full bg-navy px-6 py-3 font-semibold text-white">Torna al sito</Link>
        </div> : <>
        <fieldset disabled={status === 'sending'} className="min-w-0">
        <input type="hidden" name="_subject" value={`DIGI HOUSE — Candidatura ${kind === 'subcontractor' ? 'azienda subappaltatrice' : 'dipendente'}`} />
        <input type="hidden" name="_template" value="table" />
        <input type="hidden" name="_next" defaultValue="" />
        <input type="hidden" name="_captcha" value="false" />
        <h2 className="font-display text-xl">Invia la tua candidatura</h2>
        <fieldset className="mt-5 space-y-3">
          <legend className="mb-2 text-sm font-semibold">Come vuoi lavorare con noi?</legend>
          {[['employee', 'Come dipendente'], ['subcontractor', 'Come azienda subappaltatrice']].map(([value, label]) => <label key={value} className="flex cursor-pointer items-center gap-3 rounded-xl bg-navy-50 p-3 text-sm">
            <input type="radio" name="tipo_candidatura" value={label} checked={kind === value} onChange={() => { setKind(value as typeof kind); setErrors({}); setStatus('idle'); }} />{label}
          </label>)}
        </fieldset>
        <p className="mt-4 text-sm text-navy/60">Tutti i campi sono obbligatori, salvo dove indicato.</p>
        <div className="mt-6 space-y-4">
          {fields.map(field => <div key={field.name}>
            <label htmlFor={`careers-${field.name}`} className="mb-1 block text-sm font-medium">{field.label}</label>
            <input {...field} id={`careers-${field.name}`} type={field.type ?? 'text'} required className={fieldClass} aria-invalid={!!errors[field.name]} aria-describedby={errors[field.name] ? `error-${field.name}` : undefined} />
            {errors[field.name] && <p id={`error-${field.name}`} role="alert" className="mt-1 text-sm text-red-700">{errors[field.name]}</p>}
          </div>)}
          <label className="block"><span className="mb-1 block text-sm font-medium">Esperienza e competenze</span><textarea name="message" rows={5} required maxLength={2500} className={fieldClass} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'error-message' : undefined} placeholder={kind === 'subcontractor' ? 'Lavorazioni, esperienza della squadra, zone operative e disponibilità' : 'Esperienze precedenti, competenze e disponibilità'} /></label>
          {errors.message && <p id="error-message" role="alert" className="text-sm text-red-700">{errors.message}</p>}
          <div>
            <label htmlFor="careers-attachment" className="mb-1 block text-sm font-medium">{kind === 'employee' ? 'Allega il curriculum' : 'Allega il profilo aziendale o curriculum dell’impresa'}</label>
            <input id="careers-attachment" name="attachment" type="file" required accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className={`${fieldClass} min-w-0 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-navy-50 file:px-3 file:py-2 file:text-navy`} aria-invalid={!!errors.attachment} aria-describedby={`attachment-help${errors.attachment ? ' error-attachment' : ''}`} />
            <p id="attachment-help" className="mt-2 text-xs text-navy/60">PDF o Word (.doc, .docx), massimo 5 MB. Il documento sarà allegato alla candidatura.</p>
            {errors.attachment && <p id="error-attachment" role="alert" className="mt-1 text-sm text-red-700">{errors.attachment}</p>}
          </div>
          <input name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
          <label className="flex items-start gap-3 text-sm text-navy/80"><input name="acknowledgement" type="checkbox" required className="mt-1" aria-invalid={!!errors.acknowledgement} aria-describedby={errors.acknowledgement ? 'error-acknowledgement' : undefined} /><span>Chiedo di essere ricontattato da DIGI HOUSE per la valutazione della mia candidatura.</span></label>
          {errors.acknowledgement && <p id="error-acknowledgement" role="alert" className="text-sm text-red-700">{errors.acknowledgement}</p>}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-navy/60">Premendo “Invia candidatura”, i dati e il documento allegato saranno trasmessi tramite FormSubmit alla casella email di DIGI HOUSE per valutare la candidatura. Non inserire dati sanitari o altri dati sensibili. La conferma dell’invio apparirà su questa pagina.</p>
        <button type="submit" disabled={status === 'sending'} className="mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90 disabled:opacity-60"><Mail size={18} />{status === 'sending' ? 'Invio in corso…' : 'Invia candidatura'}</button>
        </fieldset>
        {status === 'sending' && <p role="status" className="mt-4 text-sm text-navy/70">{slow ? 'Il servizio sta impiegando più tempo del previsto. Attendi la conferma senza inviare di nuovo.' : 'Stiamo inviando la candidatura. Rimani su questa pagina.'}</p>}
        {status === 'error' && <div ref={feedback} tabIndex={-1} role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">
          Non abbiamo ricevuto conferma dell’invio. I dati sono rimasti nel modulo. Prima di riprovare, puoi contattarci al <a className="underline" href="tel:+3908331860089">0833 186 0089</a> o scrivere a <a className="break-all underline" href="mailto:degihousesrl@gmail.com">degihousesrl@gmail.com</a>.
        </div>}
        </>}
      </form>
    </div>
  </div>;
}
