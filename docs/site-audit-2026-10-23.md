# Verifica sito del 23 ottobre 2026

## Problemi riprodotti e corretti

- Da porte interne AIP, scegliendo Dierre rimaneva il filtro “Porte interne”,
  mostrando un catalogo vuoto. Il nuovo filtro scelto mantiene la precedenza;
  viene cancellato soltanto il precedente filtro incompatibile. La stessa regola
  vale quando si cambia reparto. Le selezioni compatibili restano attive.
- La ricerca non aggiornava il parametro `q`: ricarica, condivisione e navigazione
  potevano ripristinare un testo precedente. Il collegamento ora segue il testo
  digitato, senza aggiungere una voce alla cronologia per ogni lettera.
- Il filtro “Solo con prezzo” rimaneva attivo passando da Edilizia a Serramenti,
  nascondendo i prodotti su preventivo. Cambio catalogo ripristina prezzo e
  ordinamento; i percorsi con risultati vuoti mostrano una spiegazione.
- Il carosello promozionale sostituiva il link attivo dopo sei secondi, facendo
  perdere il focus da tastiera. La rotazione si ferma durante la navigazione
  interna da tastiera e quando la scheda del browser è nascosta. Frecce, indicatori
  e rotazione automatica restano funzionanti.

## Controlli eseguiti

- Homepage, catalogo, chi siamo, promozioni, area imprese, lavora con noi, contatti
  e pagina non trovata: 32 combinazioni con larghezze 320, 390, 768 e 1440 px.
  Nessun errore JavaScript o scorrimento orizzontale rilevato.
- Tutte le 497 schede, in tutti i 12 reparti: immagini del catalogo caricate e
  decodificate correttamente. Verificati separazione dei due cataloghi, partner,
  ricerca, paginazione, gerarchie delle porte e finestre.
- Verifiche Pail e Dierre a 320, 768 e 1440 px: tutte le foto abbinate ai prodotti,
  miniature, zoom su richiesta e chiusura da tastiera; nessun duplicato.
- Menu mobile e collegamenti alle sezioni della homepage.
- Area imprese: validazione, errore del servizio, dati conservati, nuovo tentativo
  e conferma, usando esclusivamente risposte simulate.
- Tre percorsi candidature: validazione, autocomplete Milano (MI), allegato PDF,
  foto facoltative per subappaltatori, invio multipart e callback sul sito, tutti
  intercettati e simulati. Nessuna richiesta di prova inviata ai destinatari.
- Contatti: validazione del modulo e percorso WhatsApp esplicitato nell’interfaccia.
- Controlli automatici su filtri, ricerca, categorie, formati, porte, partner,
  testi, Dierre e Pail; compilazione TypeScript e Vite.

## Verifica della versione pubblica

Il deploy esegue ora anche `scripts/check-published-site.py`, in sola lettura:
controlla homepage, JavaScript, CSS, favicon, catalogo CSV, dati dei comuni, tutti
i loghi partner e pagina callback delle candidature. Non invia moduli.

I loghi Muratti e HEX vengono acquisiti durante il build cloud: la loro
indisponibilità nell’anteprima locale non dimostra un errore della versione
pubblicata. La verifica dopo il deploy controlla direttamente i file pubblici.

La ricezione effettiva nella casella email e l’eventuale attivazione FormSubmit
non sono confermate dai test simulati. Serve verificarle nella casella del
beneficiario; non viene dichiarato un invio reale riuscito.
