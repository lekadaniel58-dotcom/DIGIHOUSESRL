# Secchi: scheda del formato maggiore e formati piccoli indicati sotto

Le quattro linee di pitture in secchio con più confezioni vengono rappresentate
con una sola scheda ciascuna, relativa al formato più grande. Sotto al nome
compare «Disponibile anche nei formati più piccoli», seguito dalle misure.

| Linea | Scheda mantenuta | Formati indicati sotto |
| --- | --- | --- |
| TRX | 14 L, codice 00183 | 5 L (00185), 2,5 L (00184), 0,75 L (00182) |
| X-ONE | 14 L, codice 00186 | 5 L (00188), 2,5 L (00187) |
| THERMORIFLEX IR | 14 L bianco, codice 00192 | 5 L bianco (00193), 0,75 L bianco (00194) |
| THERMOPAINT | 13 L, codice 00190 | 4 L (00191) |

Il colore bianco di THERMORIFLEX IR resta indicato nel titolo della confezione
grande. La nota elenca le misure della stessa variante colore.
I due formati da 0,75 L sono normalizzati in visualizzazione dalle etichette OCR
`00, 775500` e `00 ,775500 L LBTIANCO`, con caratteri duplicati; il CSV non cambia.

Le otto confezioni piccole non hanno più schede separate, ma dati e prezzi restano
conservati nel CSV. Prezzo, codice, foto, nome e categoria della scheda grande
rimangono quelli della relativa confezione, senza mostrare il prezzo minimo
piccolo o la dicitura «da». Cercando un codice piccolo si trova la scheda grande
con l'elenco delle disponibilità.

Sono mantenute tutte le altre schede, incluse le varianti di pennelli, rulli,
utensili e flaconi. L'accorpamento riguarda i secchi, non i flaconi D800, D900 o
Fissativo Acrilico e non le confezioni di prodotti differenti.

Il catalogo sorgente conserva 357 righe verificate per categoria. La vista del
sito contiene 349 schede: 8 in meno perché accorpate alle quattro confezioni grandi.
Il reparto Pitture e decorazioni passa da 18 a 10 schede visibili; gli altri
11 reparti non cambiano.

Configurazione e trasformazione: `src/lib/groupBucketFormats.ts`.
`npm run check:bucket-formats` verifica la presenza di tutte le confezioni,
la misura maggiore, le disponibilità piccole, il mantenimento di prezzi/foto e
delle schede estranee, la ricerca per codice e la conservazione dei piccoli
quando manca la scheda grande. La pubblicazione esegue questo controllo insieme
alla verifica delle categorie.

Verifiche completate: build TypeScript/Vite, controllo categorie 357/357,
controllo raggruppamenti, ricerca dei codici di tutte le otto confezioni piccole,
prezzo del formato grande e messaggio WhatsApp, confronto delle 349 schede visibili
in tutti i 12 reparti e layout a 320, 375, 768 e 1440 px.
