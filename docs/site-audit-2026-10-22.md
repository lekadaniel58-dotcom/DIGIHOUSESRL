# Verifica del sito — 22 ottobre 2026

Controllata la compilazione di produzione e il comportamento nel browser Chromium, su homepage, catalogo, contatti, promozioni, chi siamo e pagina inesistente. Larghezze verificate: 320, 375, 768, 1024 e 1440 px, senza scorrimento orizzontale indesiderato. Ispezionate anche schermate mobile di homepage, contatti e promozioni.

## Correzioni

- Sostituite le pagine «in preparazione» di Chi siamo e Promozioni con contenuti ricavati dalle informazioni e dalle offerte già presenti nel sito. Aggiunti i relativi collegamenti nel footer.
- Pagina inesistente con collegamenti di recupero verso homepage e catalogo.
- Eliminata l'etichetta vuota «Cod.» e il relativo testo nei preventivi WhatsApp per i prodotti privi di codice.
- Rimosso il blocco temporale di tre secondi nel modulo contatti: poteva respingere una compilazione valida tramite completamento automatico. Conservati validazione dei campi e honeypot; gestiti anche errori di rete e ripristino del pulsante WhatsApp.
- Il menu mobile si chiude anche quando si seleziona il collegamento della pagina/sezione già aperta.
- La ricerca si aggiorna quando cambia il parametro `q` del collegamento o si naviga indietro/avanti nella cronologia.

## Controlli completati

- Tutte le **351 schede** confrontate con i dati sorgenti, inclusi i tre prodotti Muratti e i formati accorpati: nomi, codici, prezzi e testi dei collegamenti per preventivo.
- Tutti i **12 reparti** attraversati fino all'ultima scheda; nessuna riga della vista saltata.
- **486 file** delle immagini responsive del CSV verificati con il decoder Pillow: nessun file mancante o corrotto.
- **349 fotografie** delle schede caricate e decodificate nel browser, incluse le tre Muratti.
- Ingrandimento verificato in ciascuno dei 12 reparti: immagine completa, chiusura con Escape, blocco dello scorrimento e ripristino del focus.
- Tutti i **9 collegamenti partner** cliccati e i risultati confrontati con le associazioni; filtri combinati, azzeramento del partner, link con partner inesistente, carosello e comportamento mobile verificati.
- Selezione HEX comprensiva di FERRHEX A e B; ricerca con sinonimi, refusi, codici e formati piccoli coperta dai controlli automatici esistenti.
- Menu mobile, ancore della homepage, navigazione ripetuta sulla stessa pagina, collegamenti di ricerca e cronologia verificati.
- Comandi avanti/indietro e selezione diretta delle promozioni verificati.
- Modulo contatti verificato con dati invalidi e validi. L'apertura di WhatsApp è stata intercettata e bloccata nel test: **nessun messaggio inviato**. Il sito attuale usa WhatsApp; non è stata simulata una consegna a un servizio email o database non configurato.
- Nessun errore JavaScript osservato nelle prove funzionali.
- Passati `check:partners`, `check:search`, `check:catalog`, `check:bucket-formats` e compilazione TypeScript/Vite.

## Limiti e contenuti da completare

Due righe già presenti nel CSV non hanno fotografia: «PENNELLESSA MANICO LEGNO · FIBRA SINTETICA» e «PLAFONCINO ECONOMICO · TAVOLETTA E MANICO». Sono intestazioni senza codice, prezzo e descrizione già segnalate nel registro del catalogo. Mostrano il messaggio «Foto non disponibile»; non sono richieste HTTP fallite. Non sono state eliminate né associate a immagini non verificate.

I loghi originali Muratti/HEX sono scaricati o recuperati dalla cache e verificati dal processo di pubblicazione su GitHub: i domini dei fornitori restano bloccati nella rete di questo ambiente locale. L'esito della pubblicazione viene controllato separatamente su GitHub Actions. Le prove locali non attestano la raggiungibilità di tutti i servizi esterni (Maps, social, WhatsApp) né le disponibilità commerciali delle promozioni.

CSV, codici, prezzi, nomi, descrizioni e associazioni dei prodotti esistenti non modificati da questa verifica.

## Aggiornamento richiesto dopo la verifica

Rimosse dal CSV le due schede prive di fotografia indicate sopra, su richiesta dell’utente. Il registro categorie è aggiornato a 354 righe. Il sito mostra ora 349 schede, tutte con fotografia (inclusi i tre prodotti Muratti e gli otto formati piccoli già accorpati). I risultati precedenti documentano la situazione prima della rimozione.
