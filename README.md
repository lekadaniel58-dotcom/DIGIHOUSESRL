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

Le versioni migliori disponibili nel sito originale sono collegate tramite
`src/data/imageOverrides.json`, senza cambiare codici, nomi, prezzi, descrizioni
né categorie nel CSV. Il registro di provenienza e dimensioni è in
`docs/high-resolution-images.csv`. Sono state migliorate 177 fotografie, usate
da 212 voci prodotto. Per le spatole rigide è stata trovata la foto corretta
`zangrillo-ordine/img-009.jpg` (200×200), diversa dal frattone errato del vecchio ZIP.

Solo le foto dei prodotti nel catalogo si aprono con un clic; le immagini della home
e dei partner non sono apribili. La finestra del catalogo si chiude
con il pulsante o Escape. Il logo usa l'originale disponibile a 1131×426.
Le foto principali della home erano già identiche alle migliori versioni del sito
originale: non sono state ingrandite artificialmente.

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

Il repository è disponibile su GitHub. La pubblicazione è automatica dopo ogni push
su `main`: verificare l'esito del workflow nella scheda Actions.

## Fluidità

Il catalogo carica 24 schede alla volta: usare **Mostra altri prodotti** per vedere
le successive. Ricerca e filtri includono sempre l'intero catalogo. Le foto della home reagiscono al movimento del puntatore e i loghi dei partner
scorrono quando la sezione è visibile. Lo scorrimento si ferma al passaggio del mouse
e gli effetti rispettano la preferenza di movimento ridotto. Il catalogo mantiene
le ottimizzazioni e le immagini della home restano non apribili.
Il confronto tecnico è documentato in [docs/performance.md](docs/performance.md).

L'ultimo archivio di foto fornito contiene ingrandimenti 2×: applicati ai riferimenti
ancora piccoli, conservando gli originali migliori. Dettagli e limiti in
[docs/catalog-zip-photo-update.md](docs/catalog-zip-photo-update.md).
