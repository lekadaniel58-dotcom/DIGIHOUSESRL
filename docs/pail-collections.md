# Rapido Pail e Super Rapido Pail

Fonti ufficiali consultate il 23 ottobre 2026:
- https://www.pailporte.com/rapidopail/
- https://www.pailporte.com/super-rapido-pail/

Sono importate esclusivamente le configurazioni illustrate in queste due pagine,
comprese le versioni aggiuntive mostrate nelle gallerie di esempi. Nessuna altra
collezione, maniglia, telaio separato o accessorio Pail diventa un prodotto.
I modelli Mimetica 43, Riga e Luna sono inclusi soltanto nelle configurazioni che
Pail espone nel programma Rapido, senza importare le rispettive gamme complete.

## Struttura

Serramenti e comfort → Porte → Porte interne → collezione → serie → configurazione.

| Collezione | Serie | Configurazioni |
| --- | --- | ---: |
| Rapido Pail | Riga | 34 |
| Rapido Pail | Luna | 5 |
| Rapido Pail | Linea | 30 |
| Rapido Pail | Marsia | 10 |
| Rapido Pail | Mimetica | 1 |
| Super Rapido Pail | Linea | 27 |
| Super Rapido Pail | Marsia | 6 |

Totale: 80 schede uniche. Le 33 configurazioni Super Rapido fanno parte anche di
Rapido Pail e sono collegate ai due percorsi con un unico ID: non si duplicano nel
catalogo generale, nella ricerca o nella selezione del partner Pail. Versioni
cieche e vetrate, disegni del vetro e finiture differenti restano identificabili.
Gli esempi che differiscono soltanto per il telaio non creano schede duplicate.

Le descrizioni sono riassunti originali basati sui dati ufficiali, con modello,
finitura e configurazione. Il termine “decorati” resta distinto dal legno massello;
Nuvola Lac e Cappuccino Lac restano nelle finiture decorate, come sul sito Pail.
Non sono pubblicate promesse Digi House di consegna in 15 giorni o 72 ore:
disponibilità, tempi, prezzo e configurazione vengono confermati al preventivo.
Nessun prezzo Pail è stato inventato. Nomi, codici e prezzi preesistenti restano
invariati; il CSV originale non è modificato.

Alcune didascalie ufficiali Riga riportano codici ripetuti o contrastanti tra la
griglia e gli esempi (Torino, Agrigento, Ferrara). Per evitare codici non verificati,
le nuove schede sono identificate da serie, nome e finitura, senza creare SKU.
L’inventario conserva le didascalie ufficiali per la verifica.

## Immagini e verifiche

Le immagini derivano dagli elementi associati ai prodotti nelle due pagine.
Per gli esempi, immagini e schede sono abbinate usando l’indice del medesimo
widget ufficiale. Non si utilizza il generico collegamento “guarda modelli” per
importare altre gamme.

Miniature WebP locali fino a 600 px; immagini dello zoom fino a 1800 px, senza
interpolare gli originali più piccoli. Lo zoom scarica la versione grande solo
all’apertura. Il logo Pail proviene dal sito ufficiale e apre la selezione Pail.

`pail-import-inventory.json` documenta le 80 configurazioni e le fotografie con
URL, hash e dimensioni. `pail-import-coverage.json` collega tutti i 137 riferimenti
nelle due pagine alle schede finali. HTML completo e manifesti di acquisizione
restano nel ramo `source/pail-catalog`.

`npm run check:pail` verifica copertura, esclusione delle altre collezioni,
appartenenze multiple senza duplicati, materiali, immagini e prezzi su preventivo.
Gli altri controlli verificano l’isolamento dei partner e dei settori. Prove browser
a 320, 768 e 1440 px coprono navigazione, ricerca, tutte le 80 immagini, zoom,
descrizioni e assenza di scorrimento orizzontale.
