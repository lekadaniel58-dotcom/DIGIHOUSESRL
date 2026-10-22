# Richieste imprese via email

La pagina `#/imprese` invia un POST JSON all’endpoint AJAX di FormSubmit, destinatario
`degihousesrl@gmail.com`. Non richiede credenziali email nel codice pubblico.
Il campo `email` è l'indirizzo del referente per le risposte; l'oggetto è
“DIGI HOUSE — Richiesta iscrizione impresa”, con riepilogo dei dati in tabella.

## Attivazione necessaria

1. Inviare dal sito una richiesta riconoscibile come prova.
2. Aprire l'email di attivazione di FormSubmit nella casella destinataria
   (controllare anche lo spam) e confermare il collegamento.
3. Ripetere la prova dopo l'attivazione e verificarne l'arrivo nella casella.

Fino all'attivazione e alla verifica di ricezione, la consegna email non va
considerata operativa. Il destinatario deve completare personalmente la verifica.
Il cliente resta su Digi House. La conferma appare solo dopo una risposta HTTP
positiva con `success: true` o `success: "true"` dal servizio; non certifica la
consegna nella casella destinataria. Da lì può tornare al catalogo.

La validazione locale controlla i campi obbligatori. Il modulo mantiene il campo
honeypot `_honey` e i controlli del servizio compatibili con l’endpoint AJAX. Nessuna
iscrizione o condizione commerciale viene attivata automaticamente.

## Verifica effettuata

Build TypeScript/Vite e test browser con endpoint intercettato: dati, validazione,
conferma senza navigazione esterna, collegamento al catalogo, attesa lenta e blocco
dei doppi invii. Errori HTTP, rete o `success: false` mantengono i dati senza
mostrare una conferma. Dopo 8 secondi appare un avviso; a 25 secondi l’attesa
viene interrotta senza tentativi automatici (la consegna può essere incerta). Nessuna richiesta
fittizia è stata inviata. La rete dell'ambiente restituisce HTTP 403 per
`formsubmit.co`, quindi non è stato possibile verificare qui il servizio remoto
o la consegna effettiva. Le eventuali condizioni e i limiti del servizio vanno
verificati nell'account/dalla documentazione del fornitore.
