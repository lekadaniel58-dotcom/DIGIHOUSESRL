# Navigazione porte

Il cliente ha richiesto una struttura per insiemi e sottoinsiemi, indicando
https://gp-porte.it/ come riferimento. Il dominio restituisce 403 dalla rete di
questo ambiente: il riferimento non è stato ispezionato e non sono stati copiati
contenuti o immagini. Le collezioni derivano dai sottotitoli del catalogo esistente.

## Struttura

`#/catalogo?reparto=porte` apre le due famiglie. I collegamenti esistenti della
homepage a Porte interne / Porte blindate aprono ora le collezioni corrispondenti.
Un collegamento nella sezione Serramenti e uno nel catalogo generale consentono
di aprire l'insieme delle porte. I filtri partner AIP e Dierre aprono le famiglie
rispettive senza assegnare modelli ad altri marchi.

| Famiglia | Collezione | Modelli |
| --- | --- | ---: |
| Interne | Moderne | 7 |
| Interne | Legno | 11 |
| Interne | Vetro | 6 |
| Blindate | High-tech | 2 |
| Blindate | Prestige | 8 |
| Blindate | Compact | 4 |
| Blindate | Teknica | 4 |
| Blindate | Portoncini e serramenti esterni | 3 |

La collezione è memorizzata nel parametro `collezione`; i collegamenti sono
condivisibili e la cronologia avanti/indietro funziona. Il percorso visibile
permette di risalire ai livelli precedenti. La ricerca mostra direttamente i
modelli nel contesto selezionato. Filtri di partner, reparto, prezzo e ordinamento
restano combinabili. Cambiare reparto/partner elimina la collezione precedente.
“Mostra tutti i modelli” consente anche di saltare la scelta della collezione.
Eventuali modelli futuri non classificati restano accessibili in “Altri modelli”.
Le foto delle schede collezione appartengono a modelli della selezione effettiva.
Nessun dato commerciale o assegnazione di partner modificato. Tutte le 45 porte
restano nel catalogo generale, che conserva 349 schede complessive.

## Verifiche

`npm run check:doors` verifica i nomi di tutti i 45 modelli, le otto collezioni,
le famiglie e i casi non classificati; il controllo è aggiunto alla pubblicazione.
Verificati inoltre partner, ricerca e compilazione TypeScript/Vite.
Nel browser: tutti i 45 modelli senza duplicati, avanti/indietro, AIP/Dierre,
ricerca, cambio reparto, link non valido, zoom, catalogo generale e tocco mobile.
Layout controllato da 320 a 1440 pixel; schermate desktop/mobile ispezionate.
