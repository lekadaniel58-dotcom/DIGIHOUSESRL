# Collegamenti dei partner

I loghi della homepage aprono `#/catalogo?partner=<id>`. Il filtro partner è combinabile con ricerca, reparto, ordinamento e prezzo. Le due copie del carosello hanno gli stessi collegamenti; la copia visiva non duplica i passaggi della tastiera. Lo scorrimento e la pausa su hover/focus restano attivi.

Le associazioni sono esplicite in `src/data/partners.json`, separate dai dati commerciali. Fonte: codice del sito `lekadaniel58-dotcom/digi-house`, commit `296b40847fd9f705665d61b13aebc9b4a0f80ea7`, e relative pagine di reparto. I prodotti HEX presenti anche nella gamma IVC mantengono entrambe le associazioni. Non si assegna un marchio solo perché compare una parola nella descrizione.

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

Correzione FERRHEX: entrambi i componenti A (00204) e B (00205) del sistema bicomponente sono associati a HEX e IVC. La pagina di riferimento mostrava soltanto A; il filtro comprende ora anche B, già presente nel catalogo corrente. Nessun dato commerciale modificato.

Le immagini originali verificate sono conservate nella cache della compilazione, così gli aggiornamenti del catalogo non richiedono nuovi download. È supportata la conversione automatica WebP dei CDN dei fornitori, anche per URL che terminano in `.jpg` o `.png`; pagine HTML o risposte non riconosciute vengono respinte.

Prezzi Muratti comunicati dall’utente per le schede da 14 L: NAXOS 24,45 €, PANAREA 53,50 €, QUARZO LISCIO 53,60 €. Sostituiscono la precedente indicazione «Su preventivo».
