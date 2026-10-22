# Revisione dei testi del catalogo — 22 ottobre 2026

Esaminati **357 record**: 354 righe del CSV e 3 prodotti Muratti aggiuntivi. La vista conserva tutte le **349 schede** dopo il raggruppamento degli otto formati piccoli. Sono state corrette **169 righe**, con interventi su nomi incompleti, varianti, sottotitoli e descrizioni. Il registro `catalog-text-audit.csv` include ogni record, anche quelli confermati, e i testi prima/dopo ogni correzione.

## Problemi corretti

- Misure mescolate a lettere del nome, cifre duplicate, parole tronche e unità danneggiate. Esempi: `2R0IGIDE 20` → `20`; `5LTT` → `5 L`; `A5RCCMH AERTCTHOE CTOTOR TCOOR` → `Archetto corto`.
- Titoli SP.15 e PLASTICA separati dall'intestazione durante l'estrazione: ricostruita la denominazione completa delle rispettive pennellesse e dei plafoncini, presente in `pennelli-accessori.html` del riferimento.
- Ripetizioni come «FERRHEX COMPONENTE A – COMPONENTE A» e ripetizioni di marca/misura già comprese nel nome.
- Sottotitoli troncati di SKIN, Invisible, Invisible light e Sicur Alu Door ripristinati dalla pagina Sallustio del riferimento.
- Separatori finali vuoti e intestazioni generiche Premier sostituite dal tipo di prodotto già descritto nella riga (massetto, malta, intonaco, adesivo o finitura minerale).
- Descrizione SIGILCOLOR 00554 con caratteri sovrapposti e descrizione assente di 00552: recuperato il testo comune della famiglia SIGILCOLOR.
- Note editoriali («la corrispondenza ufficiale», «la pagina indica») e indicazioni del formato 5 L ripetute impropriamente sulla variante da 1 L.
- Formulazioni fuorvianti: filo cotto per legature, anziché tracciature; mazzetta «modello Microfibra Extra», senza attribuire quel materiale all'intero utensile; sigillante acrilico Soudal, senza definirne il materiale come silicone. Rimosso il riferimento a un «comando» a bottone non documentato nelle descrizioni di zanzariere.

## Presentazione e aggiornamenti

Ogni scheda permette di aprire **Descrizione** e leggere il testo completo. Prima si vedeva soltanto il sottotitolo; il campo descrizione era usato dalla ricerca ma non mostrato.

Il CSV viene rivalidato tramite cache HTTP condizionale per non continuare a mostrare testi precedenti dopo una pubblicazione. Non cambiano i percorsi delle fotografie né i prezzi. Sono invariati tutti i codici, reparti, immagini, pagine sorgenti e numero dei prodotti. I campi di testo autorizzati alla correzione sono registrati nel rapporto; le impronte del registro categorie sono state aggiornate coerentemente, senza riclassificare prodotti.

## Fonti e limiti

Riferimenti: contenuto leggibile delle righe estratte (confronto tra porzioni ripetute e varianti della stessa famiglia); pagine HTML del sito `lekadaniel58-dotcom/digi-house`, commit `296b40847fd9f705665d61b13aebc9b4a0f80ea7`; descrizioni della famiglia già presenti nel catalogo. Il controllo riguarda pulizia, leggibilità e coerenza delle informazioni disponibili: non sostituisce la verifica tecnica di ogni prestazione presso il produttore.

Non sono state aggiunte unità di misura assenti o incerte nella sorgente: una misura numerica senza unità resta numerica. Il diametro del disco marmo **00410** non è ricostruibile con certezza dal testo OCR; il frammento illeggibile è stato rimosso dalla variante, conservando nome, codice, prezzo e fotografia. Per completare quella misura occorre il dato originale leggibile.

Controlli: `npm run check:text`, gli altri quattro controlli del catalogo e la compilazione TypeScript/Vite. Nel browser si verificano tutte le 349 descrizioni contro i record correnti, apertura/chiusura dei dettagli, prezzi, codici, collegamenti preventivo, reparti, partner, ricerca e visualizzazione mobile.
