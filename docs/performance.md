# Fluidità del sito

Intervento: eliminati animazioni d'ingresso ritardate, parallasse, effetti 3D
al movimento del mouse, contatori animati e animazioni decorative continue.
I partner sono mostrati in una griglia statica, senza duplicazione dei loghi.
Il catalogo mostra inizialmente 24 schede, incrementabili di 24 con
**Mostra altri prodotti**. Ricerca, filtri e ordinamento operano su tutti i prodotti;
cambiando un filtro, la visualizzazione riparte dalle prime 24 corrispondenze.
Le foto restano nella qualità disponibile e mantengono l'ingrandimento nel catalogo.
Home e partner rimangono non apribili.

L'immagine principale viene caricata subito, con priorità alta; le altre immagini
mantengono caricamento differito e decodifica asincrona. Il carosello delle offerte
non attende più due animazioni consecutive e riserva spazio fisso alla fotografia.

## Verifiche locali

Build TypeScript/Vite superata. JavaScript compilato: 348,10 → 219,23 kB
(gzip: 111,78 → 68,97 kB), senza abbassare la qualità delle fotografie.

Confronto locale Chromium, viewport 375×812, CPU rallentata di 4 volte,
misurazioni dopo il primo contenuto e un secondo di attesa:

| Misura | Prima | Dopo |
| --- | ---: | ---: |
| Schede iniziali catalogo | 357 | 24 |
| Nodi DOM catalogo | 8475 | 840 |
| Tempo script catalogo | 1,526 s | 0,311 s |
| Tempo script home | 0,730 s | 0,273 s |
| Animazioni CSS continue home | 5 | 0 |

Sono misure di una singola prova controllata locale, non tempi garantiti per
ogni dispositivo o connessione. Dati, immagini e relativi abbinamenti sono invariati.

Controlli funzionali: caricamento progressivo fino a tutti i 357 prodotti,
decodifica di tutte le 271 immagini referenziate, ricerca, filtri dei 12 reparti,
ordinamento, ricaricamento, menu mobile, collegamenti ai reparti, modulo contatti,
carosello offerte e ingrandimento delle sole immagini prodotto. Layout verificato
a 320, 375, 768 e 1440 px.
