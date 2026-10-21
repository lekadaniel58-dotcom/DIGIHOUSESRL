# Foto da Google Drive e anteprime leggere

Archivio ricevuto: `ft.zip`, 3.655.352.168 byte, 244 immagini PNG.
SHA-256: `2039ed43be727c73a3f0267f22902d8a64d6fa352e6d74d068f2df1892d8d58b`.
L'archivio è stato scaricato integralmente ed estratto verificando i CRC di tutti
i file. I PNG e lo ZIP di origine non sono inclusi nel repository o nel deploy.

## Selezione e corrispondenze

Usati i PNG forniti per 102 riferimenti fotografici del catalogo, relativi a 158
voci prodotto. Conservate le 169 sorgenti già recuperate dal sito originale.
Le corrispondenze sono state controllate usando pagina, soggetto, proporzioni e
confronto visivo prima/dopo. Le varianti mantengono le fotografie condivise.
I file forniti sono versioni di grandi dimensioni; la dimensione in pixel, da sola,
non garantisce nuovi dettagli reali rispetto alla fotografia originaria.

`data/catalogo.csv` rimane identico alla versione precedente: nessuna modifica a
codici, nomi, prezzi, descrizioni o categorie. Rimane la correzione del prodotto
00554: SIGILCOLOR · SILVER 1. Restano invariate foto e interazioni della homepage.

## Versioni per la navigazione e l'ingrandimento

Tutti i 271 riferimenti immagine hanno ora una coppia di risorse:

- anteprima WebP con lato massimo di 600 px e qualità 82, caricata nelle schede;
- immagine WebP con lato massimo di 2000 px e qualità 88, richiesta soltanto
  quando l'utente apre la finestra di ingrandimento.

La conversione conserva le proporzioni e non ingrandisce sorgenti più piccole.
Sharp 0.35.5, WebP 1.6.0, effort 4, smartSubsample attivo. Due lavorazioni parallele
con concorrenza interna Sharp limitata a uno. Nessuna modifica creativa ai soggetti.

Il rilevamento dei duplicati tramite SHA-256 produce 243 coppie distinte, per un
totale di 486 file. Le anteprime occupano insieme 3.955.604 byte; le immagini grandi
22.355.252 byte. Totale delle nuove risorse ottimizzate: 26.310.856 byte.
La dimensione mediana delle anteprime è 14.776 byte; la maggiore è 74.536 byte.
La navigazione mantiene 24 schede iniziali, caricamento differito e decodifica
asincrona. I PNG da molti megabyte non vengono richiesti dal browser.

Il registro `drive-photo-update.csv` documenta, per ogni riferimento, sorgente,
provenienza, dimensioni, risorse generate, peso e hash SHA-256. La mappa usata
dall'app è `src/data/responsiveImages.json`. Le mappe e i file precedenti restano
come riserva e per la tracciabilità degli interventi già effettuati.

## Verifiche

Build TypeScript/Vite superata. Controllati gli hash di tutti i 486 file nella
sorgente e nella build. Nel browser: decodifica di tutte le 243 anteprime distinte,
abbinamenti nome/foto di tutti i 357 prodotti confrontati con CSV e manifest,
caricamento progressivo, ricerca silicone/siliconi, filtri dei 12 reparti,
ordinamento prezzi e layout a 320, 375, 768 e 1440 px.

Verificato con registrazione delle richieste che la ricerca del prodotto 00554
carichi soltanto l'anteprima a 600 px; l'immagine a 2000 px viene richiesta dopo
il clic di ingrandimento. Controllato anche l'ingrandimento a 1600 px delle spatole
00360. Restano non apribili le foto della home e i partner; il movimento delle foto
e lo scorrimento dei loghi sono mantenuti, inclusa la preferenza di movimento ridotto.
