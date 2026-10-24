# Sostituzione finestre con la gamma Fossati

Fonti Fossati Serramenti consultate il 24 ottobre 2026: pagine finestre e scorrevoli,
indice dei cataloghi e 12 PDF/edizioni disponibili tramite collegamenti ufficiali.

Sono ritirati dal catalogo visibile i 19 modelli di finestre Sallustio elencati in
`src/data/retiredWindowNames.json`. Il CSV originale resta una fonte storica;
la sostituzione viene applicata esplicitamente da `replaceWindowProducts` prima
della ricerca, della navigazione e del calcolo dei conteggi. Persiane, scuri e
soluzioni complementari non sono finestre e conservano le loro 13 schede.

## Gamma importata

42 sistemi/configurazioni in otto categorie:

| Materiale e apertura | Schede |
| --- | ---: |
| PVC a battente | 10 |
| PVC scorrevoli | 8 |
| Alluminio a battente | 6 |
| Alluminio scorrevoli | 9 |
| Legno a battente | 2 |
| Legno scorrevoli | 1 |
| Legno/alluminio a battente | 2 |
| Legno/alluminio scorrevoli | 4 |

Comprende Icon Centenario e ALU; Linea76, Plus, ALU e ALU Plus; Vision76 e Plus;
Solaris e Plus; Metropolis a battente e Plus; Forma; iShape, iLine e iFrame;
Nova e Nova Plus; ThermicX e ThermicX Plus; sei HST Meridiana; quattro alzanti
Metropolis; inLuce e Velis; quattro alzanti ThermicX; la proposta Nova alzante
in legno citata dalla pagina ufficiale; complanari in PVC; Ecoslide;
Metropolis complanare e Plus; Mediterraneo.

Le aperture a battente, alzanti, complanari e leggere sono distinte. Le finiture,
le sagome Classic/Design, le misure e i semplici schemi di apertura non generano
prodotti duplicati. Portoncini, oscuranti e accessori Fossati non sono importati,
perché la richiesta riguarda le finestre.

Le nuove schede sono attribuite esclusivamente al partner Fossati. La selezione
Sallustio mantiene 13 schede; Fossati ne mostra 42. I prodotti visibili complessivi
sono 520. Gli altri nomi, codici, prezzi e descrizioni restano invariati.
Nessun prezzo o codice commerciale è inventato: le nuove finestre sono su preventivo.
Le descrizioni sono riassunti originali dei dati del produttore; misure, allestimenti
e prestazioni specifiche vengono confermati al preventivo.

## Immagini e documenti

Le immagini sono locali, ottimizzate in WebP, con miniature fino a 600 px e immagini
zoom fino a 1800 px senza ingrandire artificialmente gli originali. I profili in
legno Nova e ThermicX sono estratti dai PDF originali, preservando le maschere
trasparenti. Il disegno Ecoslide è estratto dalla tavola specifica del catalogo
Scorrevoli; non è una foto generata.

Le immagini condivise dal produttore tra le varianti riportano l’indicazione
“Immagine rappresentativa della gamma”. Nova alzante usa una foto della pagina
ufficiale comune agli alzanti in legno e legno-alluminio e lo dichiara nella scheda.
Questo evita di presentare fotografie come conferma di un preciso vetro,
rivestimento o allestimento non verificato. La figura tecnica Ecoslide è indicata
come disegno da catalogo.

Il collegamento di aprile al catalogo Nova/ThermicX nell’indice ufficiale restituisce
404; è stato recuperato il PDF aggiornato di giugno collegato dalla pagina legno.
L’indice di revisione documenta entrambe le URL e la risoluzione del collegamento.

`fossati-import-inventory.json` collega ogni scheda alla pagina ufficiale, al PDF,
alle pagine del catalogo, alla fotografia e al suo hash. `fossati-catalogue-review.json`
riporta le 12 edizioni consultate. I documenti di revisione completi restano nel ramo
`source/fossati-windows`; il sito non aggiunge collegamenti a cataloghi esterni.

## Verifica

`npm run check:fossati` verifica le 42 schede, le 19 rimozioni, categorie, immagini,
fonti, assenza di duplicati e ripetibilità della sostituzione. Controlli partner e
sezioni verificano tutti i 55 infissi rimasti: 42 finestre, 9 persiane/scuri e 4
complementi. Gli altri controlli proteggono porte, ricerca, descrizioni e prezzi.
Prove browser a 320, 768 e 1440 px: tutte le foto, ricerca, filtri, zoom, conteggi,
logo Fossati e assenza di scorrimento orizzontale.


Aggiornamento persiane Fossati: vedere [fossati-shutters.md](fossati-shutters.md). I conteggi precedenti rappresentano lo stato prima della sostituzione: ora 63 infissi e 59 schede del partner Fossati (incluse le 17 tipologie di oscuranti); le 42 finestre restano invariate.
