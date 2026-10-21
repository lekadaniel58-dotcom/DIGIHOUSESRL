# DIGIHOUSESRL — Digi House SRL

Sito React, TypeScript e Vite ricreato da `digi-house-github.zip`.

## Avvio

Node.js 24. Eseguire dalla radice del repository:

```sh
npm ci
npm run dev -- --host 0.0.0.0
```

Percorso base: `/DIGIHOUSESRL/`. Il catalogo è nella rotta `#/catalogo`.
`npm run build` controlla TypeScript e crea `dist/`, includendo il catalogo e le foto.
`npm run preview -- --host 0.0.0.0` permette di verificare la build.

## Catalogo e immagini

Il sito legge `data/catalogo.csv` direttamente: non servono credenziali Supabase.
I 357 prodotti e i 12 reparti sono quelli dello ZIP; il CSV è mantenuto identico.
Le foto mancanti nello ZIP sono state copiate dal checkout `digi-house-fase2`,
comprendendo i 120 aggiornamenti fotografici verificati in precedenza.
Gli asset della home e dei fornitori provengono dal repository esistente
`lekadaniel58-dotcom/digi-house`, commit `296b40847fd9f705665d61b13aebc9b4a0f80ea7`.
I dati e il sito di quei repository non sono stati modificati.

La foto ad alta risoluzione `00360.jpg` ricevuta in precedenza raffigurava un altro
utensile: per le spatole rigide 00360–00368 resta la foto originale. Non tutte le
foto del catalogo dispongono di una versione ad alta risoluzione.

## Contatti

Senza Supabase, il modulo valida i dati e apre WhatsApp con il testo predisposto;
l'utente deve confermare l'invio in WhatsApp. Non viene simulato un invio riuscito.
Se viene configurato un backend Supabase, il modulo usa `contact_messages`.
Le migrazioni e lo script di importazione Supabase restano strumenti opzionali.
Non inserire mai credenziali amministrative nei file del sito o nel repository.

## GitHub Pages

Repository previsto: `lekadaniel58-dotcom/DIGIHOUSESRL`.
In **Settings → Pages → Source**, scegliere **GitHub Actions**.
Il workflow `.github/workflows/deploy.yml` compila e pubblica `dist/` a ogni push
su `main`, oppure con avvio manuale. Le rotte hash supportano il ricaricamento
su GitHub Pages. URL previsto dopo la pubblicazione:
`https://lekadaniel58-dotcom.github.io/DIGIHOUSESRL/`.

La creazione del repository tramite l'API GitHub è stata bloccata con `Forbidden`.
La preparazione locale e la compilazione non equivalgono alla pubblicazione.
