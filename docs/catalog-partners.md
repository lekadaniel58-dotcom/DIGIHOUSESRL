# Collegamenti dei partner

I loghi della homepage aprono `#/catalogo?partner=<id>`. Il filtro partner è combinabile con ricerca, reparto, ordinamento e prezzo. Le due copie del carosello hanno gli stessi collegamenti; la copia visiva non duplica i passaggi della tastiera. Lo scorrimento e la pausa su hover/focus restano attivi.

Le associazioni sono esplicite in `src/data/partners.json`, separate dai dati commerciali. Fonte: codice del sito `lekadaniel58-dotcom/digi-house`, commit `296b40847fd9f705665d61b13aebc9b4a0f80ea7`, e relative pagine di reparto. Su richiesta del cliente, le linee HEX sono assegnate esclusivamente a HEX e non ripetute sotto IVC. Non si assegna un marchio solo perché compare una parola nella descrizione.

| Partner | Fonte delle associazioni |
| --- | --- |
| IVC | Schede con immagini `assets/ivc` nelle pagine originali |
| Muratti | `muratti.html` |
| HEX | `hex.html` |
| AIP | Reparto Porte interne |
| Dierre | Reparto Porte blindate |
| Sallustio | Reparto Infissi |
| Zanzar | Reparti Zanzariere e Avvolgibili e tapparelle |
| Opera | `catalogo-opera.html` e varianti Opera in `adesivi-sigillanti.html` |
| Premier | `catalogo-premier.html` |

NAXOS, PANAREA e QUARZO LISCIO, assenti nel CSV corrente, sono ripristinati da `muratti.html` in `src/data/partnerProducts.json`, con fotografie locali WebP, descrizioni e codici listino della fonte. Si mostra il formato da 14 L con i formati piccoli indicati sotto; nessun prezzo viene inventato. Sono disponibili nel catalogo generale e nella selezione Muratti. Il CSV e i dati dei 356 record esistenti restano invariati; le schede visibili diventano 351, incluse le tre Muratti e gli otto formati già raggruppati.

Verifiche automatiche: `npm run check:partners`, `npm run check:search`, `npm run check:catalog`, `npm run check:bucket-formats`, `npm run build`.

I loghi originali Muratti e HEX vengono scaricati da `npm run fetch:partner-logos` prima della compilazione su GitHub Actions, controllando firma PNG/JPEG/WebP e dimensione. Le immagini diventano file locali nel sito pubblicato: nessuna richiesta ai fornitori durante la navigazione. Fonti indicate dall’utente: pagina Muratti di Colorificio Nembrini e pagina Marchi di Di Donato; indirizzi delle immagini già presenti nel codice del sito di riferimento. L’ambiente cloud locale blocca questi due domini; download e controllo delle immagini sono pertanto verificati nella pubblicazione. Per una compilazione completa su un altro ambiente eseguire `npm run fetch:partner-logos` prima di `npm run build`.

Correzione FERRHEX: entrambi i componenti A (00204) e B (00205) del sistema bicomponente sono associati esclusivamente a HEX. La pagina di riferimento mostrava soltanto A; il filtro comprende ora anche B, già presente nel catalogo corrente. Nessun dato commerciale modificato.

Le immagini originali verificate sono conservate nella cache della compilazione, così gli aggiornamenti del catalogo non richiedono nuovi download. È supportata la conversione automatica WebP dei CDN dei fornitori, anche per URL che terminano in `.jpg` o `.png`; pagine HTML o risposte non riconosciute vengono respinte.

Prezzi Muratti comunicati dall’utente per le schede da 14 L: NAXOS 24,45 €, PANAREA 53,50 €, QUARZO LISCIO 53,60 €. Sostituiscono la precedente indicazione «Su preventivo».

## Separazione marchi del 23 ottobre 2026

Verificate tutte le 357 righe sorgenti (354 CSV + 3 Muratti), corrispondenti a
349 schede dopo il raggruppamento dei formati. Le famiglie che terminano in HEX
sono riconosciute anche con suffissi come “COMPONENTE B” o “K8 GRIGIO”.
MALTHEX viene aggiunto a HEX. Restano sotto HEX anche FLEXOCOTE (confezione
ELASTOFLEXHEX, codice 00534) e ACRIL-SILOSSANICO (confezione TermocoatHEX, 00124).
FERRHEX A/B, RASHEX bianco/grigio e FLEXOCOTE vengono rimossi da IVC.

Le confezioni del catalogo confermano IVC per D800, D900, FISSATIVO ACRILICO,
TRX, X-ONE, THERMORIFLEX IR, THERMOPAINT, SILOPITTURA, PRISMA, SILOGRUND e
UNIFORMA. Tutte queste famiglie sono ora comprese nel filtro IVC.

Risultati: IVC 14 schede, HEX 7. Gli altri partner mantengono le associazioni
verificate; tutte le 349 schede hanno al massimo un partner. Prodotti privi di
un'associazione verificata ai nove partner restano nel catalogo generale.
L'audit completo delle 357 righe è `catalog-partner-audit.csv`.
Codici, nomi, varianti, prezzi, descrizioni, categorie e immagini non modificati.
