# Suggerimenti comuni

Fonte: ANPR, repository pubblico Italia, archivio dei comuni:
https://github.com/italia/anpr/blob/master/src/archivi/ANPR_archivio_comuni.csv
Licenza CC BY 4.0: https://creativecommons.org/licenses/by/4.0/
Testo conservato in `comuni-source-license.txt`.

Snapshot scaricato il 22 ottobre 2026; ultimo aggiornamento indicato nel CSV:
16 maggio 2023. Non è un registro amministrativo aggiornato in tempo reale.
Il campo consente inserimento libero per comuni nuovi, cambi di provincia o esteri.

Derivazione: filtro STATO=A e intervallo di validità alla data 2026-10-22;
7.901 coppie nome/sigla provincia, senza duplicati. Estratti solo denominazione
italiana e sigla, nomi convertiti in maiuscole iniziali e ordine alfabetico.
`public/data/comuni.json` caricato al primo focus, memorizzato in memoria.
Suggerimenti per prefisso, senza distinzione maiuscole/accenti, nessuna
limitazione sul numero dei risultati: elenco scorrevole. Non vengono trasmesse
ricerche a servizi esterni.
