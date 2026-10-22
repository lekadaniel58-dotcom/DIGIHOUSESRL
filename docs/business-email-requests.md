# Richieste imprese via email

La pagina `#/imprese` invia un modulo POST a FormSubmit, destinatario
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
Il servizio può richiedere una verifica antispam al cliente. La conferma dell'invio
è gestita dal servizio, senza mostrare un successo anticipato sul sito.

La validazione locale controlla i campi obbligatori. Il modulo mantiene il campo
honeypot `_honey` e la protezione antispam predefinita del servizio. Nessuna
iscrizione o condizione commerciale viene attivata automaticamente.

## Verifica effettuata

Build TypeScript/Vite e test browser del POST intercettato localmente: dati,
destinatario, validazione e visualizzazione mobile/desktop. Nessuna richiesta
fittizia è stata inviata. La rete dell'ambiente restituisce HTTP 403 per
`formsubmit.co`, quindi non è stato possibile verificare qui il servizio remoto
o la consegna effettiva. Le eventuali condizioni e i limiti del servizio vanno
verificati nell'account/dalla documentazione del fornitore.
