# Foto e collezioni Dierre

Verifica delle fonti ufficiali Dierre del 23 ottobre 2026.

Aggiornate le immagini di tutte le 21 schede esistenti; nessun nuovo prodotto,
codice, prezzo o descrizione. Miniature WebP fino a 600 px e immagini per lo zoom
fino a 1800 px, senza ingrandire artificialmente gli originali. Le foto rimangono
locali: nessuna richiesta al sito Dierre durante la navigazione.

## Collezioni

- High-tech: 2 modelli.
- Prestige: 8 modelli.
- Compact: 4 modelli.
- Teknica: 4 modelli.
- Inferriate e persiane blindate: 3 modelli.

La fonte ufficiale classifica Greta come inferriata, Anthos come persiana in
acciaio e Anthea come persiana blindata rivestita in legno. Corretto il precedente
raggruppamento “Portoncini e serramenti esterni” nella navigazione e nei sottotitoli.
Il vecchio collegamento `collezione=portoncini` resta compatibile.

Per Tablet, Tablet Class 4, Tablet Plus, Under 1 e Under 2 la scheda indica che
si tratta di una fotografia rappresentativa della gamma. Per le due versioni
Under e per Tablet/Tablet Class 4 il produttore presenta una foto comune: non
sono state inventate immagini di varianti né alterati i dettagli dei prodotti.

## Corrispondenze

| Scheda | Pagina ufficiale | Originale | Foto di gamma |
| --- | --- | --- | --- |
| hibry5 | [Dierre](https://www.dierre.com/prodotto/blindate/high-tech/hibry-5/) | 1920 × 1080 | No |
| Next Elettra | [Dierre](https://www.dierre.com/prodotto/blindate/high-tech/next-elettra/) | 1920 × 960 | No |
| Sleek Out | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/sleek-out/) | 1920 × 800 | No |
| Sleek | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/sleek/) | 1920 × 800 | No |
| Sentry-Evo | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/sentry-evo/) | 1920 × 800 | No |
| Synergy Out | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/sinergy-out/) | 1920 × 800 | No |
| Synergy In | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/synergy-in/) | 1920 × 800 | No |
| Vitra | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/vitra/) | 1920 × 800 | No |
| Silence | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/silence/) | 1920 × 1080 | No |
| Wall Security | [Dierre](https://www.dierre.com/prodotto/blindate/prestige/wall-security/) | 1920 × 800 | No |
| D180 | [Dierre](https://www.dierre.com/prodotto/blindate/compact/d180/) | 1920 × 1080 | No |
| Tablet | [Dierre](https://www.dierre.com/prodotto/blindate/compact/tablet/) | 1920 × 800 | Sì |
| Tablet Class 4 | [Dierre](https://www.dierre.com/prodotto/blindate/compact/tablet/) | 1920 × 800 | Sì |
| Tablet Plus | [Dierre](https://www.dierre.com/prodotto/blindate/compact/tablet/) | 700 × 400 | Sì |
| Synergy-In Firecut | [Dierre](https://www.dierre.com/prodotto/blindate/teknica/sinergy-in-firecut/) | 1920 × 800 | No |
| Sblock Push | [Dierre](https://www.dierre.com/prodotto/blindate/teknica/sblock-push/) | 1920 × 800 | No |
| Under 1 | [Dierre](https://www.dierre.com/prodotto/blindate/teknica/under/) | 1920 × 800 | Sì |
| Under 2 | [Dierre](https://www.dierre.com/prodotto/blindate/teknica/under/) | 1920 × 800 | Sì |
| Greta | [Dierre](https://www.dierre.com/porte/blindate/inferriate-persiane/#greta) | 1920 × 800 | No |
| Anthos | [Dierre](https://www.dierre.com/porte/blindate/inferriate-persiane/#anthos-e-anthea) | 1920 × 800 | No |
| Anthea | [Dierre](https://www.dierre.com/porte/blindate/inferriate-persiane/#anthos-e-anthea) | 1920 × 800 | No |

URL delle immagini, impronte SHA-256, dimensioni e file derivati sono documentati
in `src/data/dierrePhotos.json`. Le pagine sorgenti complete sono conservate nel
ramo di revisione `source/dierre-photos`, separato dalla pubblicazione del sito.

`npm run check:dierre` controlla copertura 21/21, associazioni, collezioni,
presenza e peso delle immagini, e indicazioni per le fotografie comuni alla gamma.
Verifica browser a 320, 768 e 1440 px: tutte le miniature, zoom su richiesta,
chiusura con Escape e recupero del focus, categorie e compatibilità dei link.
