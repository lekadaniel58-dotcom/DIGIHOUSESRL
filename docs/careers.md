# Lavora con noi

Pagina `#/lavora-con-noi`, collegata da menu desktop/mobile, homepage e footer.
Due percorsi: dipendente e azienda subappaltatrice. I campi azienda e partita IVA
sono richiesti e inviati soltanto per il secondo percorso. Entrambi raccolgono
referente, email, telefono, comune/provincia, specializzazione ed esperienza.
Curriculum e documenti possono essere richiesti successivamente, senza upload.

Invio AJAX allo stesso destinatario dell’Area imprese, `degihousesrl@gmail.com`,
con oggetti email distinti. Restano necessari attivazione e verifica della casella
FormSubmit descritte in `business-email-requests.md`. La conferma del servizio
appare sul sito, con ritorno alla homepage. Nessun inoltro a pagine esterne.

Verificati build TypeScript/Vite e browser con POST intercettati: entrambi i
percorsi, campi condizionali, errori, conservazione dei dati, oggetti e contenuti
delle email, menu mobile, homepage e layout da 320 a 1440 pixel. Nessuna email
fittizia inviata; ricezione effettiva e servizio remoto non verificati qui.
