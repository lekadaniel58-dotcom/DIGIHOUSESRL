# Lavora con noi

Pagina `#/lavora-con-noi`, collegata da menu desktop/mobile, homepage e footer.
Tre percorsi: dipendente, azienda subappaltatrice, fornitore o agente commerciale.
Azienda e partita IVA sono richieste per i due percorsi professionali. Tutti raccolgono
referente, email, telefono, comune/provincia, specializzazione ed esperienza.
Allegato obbligatorio: curriculum per i dipendenti, profilo aziendale o curriculum
dell’impresa per i subappaltatori, presentazione aziendale o catalogo per fornitori
e agenti. Questi ultimi indicano materiali, marchi rappresentati e proposta di
collaborazione, con oggetto email dedicato. Un file PDF, DOC o DOCX, massimo 5.000.000 byte.

Invio multipart con file allo stesso destinatario dell’Area imprese, `degihousesrl@gmail.com`,
con oggetti email distinti. Restano necessari attivazione e verifica della casella
FormSubmit descritte in `business-email-requests.md`. La conferma del servizio
appare sul sito, con ritorno alla homepage. Il POST nativo usa un iframe nascosto
con `_next` alla pagina statica `candidatura-inviata.html`. La ricevuta invia un
messaggio alla pagina principale; vengono controllati origine, finestra del frame
e identificativo casuale della singola richiesta prima di mostrare la conferma.
Il candidato non lascia la pagina. `_captcha=false` evita verifiche esterne nel
frame; resta il campo honeypot. Avviso a 8 secondi, timeout a 45 secondi, nessun
ritentativo automatico. In caso di errore i dati e il file restano selezionati.

Verificati build TypeScript/Vite e browser con POST intercettati: entrambi i
percorsi, campi condizionali, errori, conservazione dei dati, oggetti e contenuti
delle email, menu mobile, homepage e layout da 320 a 1440 pixel. Nessuna email
fittizia inviata; ricezione effettiva e servizio remoto non verificati qui.
Verificati inoltre allegato mancante, estensione non accettata, file oltre limite,
trasmissione dei byte di un PDF e di un Word in multipart, ricevuta nel frame,
rifiuto di messaggi senza identificativo corretto e timeout conservando il file.

## Foto dei subappaltatori

Solo il percorso subappaltatore richiede da una a tre foto di lavori svolti:
prima foto obbligatoria, altre due facoltative, JPG/PNG/WebP. Campi multipart
distinti `work_photo_1`, `work_photo_2`, `work_photo_3`, insieme ad `attachment`
per il profilo aziendale. Il limite complessivo di tutti i file è 5.000.000 byte.
Gli altri percorsi non mostrano né inviano questi campi.

## Interfaccia a percorsi

La pagina iniziale presenta tre schede selezionabili affiancate su desktop e
scorrevoli con snap su mobile. Nessun modulo è mostrato prima della scelta.
La scheda selezionata viene evidenziata e apre il modulo pertinente, con riepilogo
degli allegati, focus sul titolo e scorrimento che rispetta il movimento ridotto.
Il pulsante “Cambia percorso” riporta alle schede. I recapiti già compilati vengono
conservati quando si cambia percorso. La selezione è bloccata durante l'invio.

Verificati tastiera e tocco, tre invii multipart intercettati (nessuna email reale),
comuni, allegati e foto, conferma sul sito e layout da 320 a 1440 pixel. Ispezionate
le schermate iniziali desktop/mobile. Build TypeScript/Vite riuscita.
