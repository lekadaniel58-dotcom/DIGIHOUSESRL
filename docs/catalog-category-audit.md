# Verifica completa dei reparti del catalogo

Controllo completato su **357 righe su 357**, corrispondenti a 274 nomi/famiglie
commerciali: incluse tutte le varianti e tutte le 151 voci prive di codice.
Nessun campionamento, nessuna riga saltata. L'identità di una voce senza codice è
preservata tramite la posizione originale e l'identificatore dell'applicazione.

Esito: **348 assegnazioni confermate e 9 corrette**, nei 12 reparti esistenti.
Il registro `catalog-category-audit.csv` ha una riga per ciascuna voce del catalogo,
con codice, nome, variante, pagina, reparto precedente e atteso, esito,
motivazione, riferimenti e note. Nessuna voce è stata eliminata o aggiunta.

## Criteri e fonti

Esaminati nome, variante, sottotitolo, descrizione, pagina e contesto della gamma.
Confronto con le pagine di reparto e partner del sito di riferimento
`lekadaniel58-dotcom/digi-house`, commit
`296b40847fd9f705665d61b13aebc9b4a0f80ea7`.
La verifica riguarda la collocazione commerciale nel catalogo disponibile;
non modifica né riscrive i contenuti tecnici dei prodotti.

- **Materiali edili:** malte, massetti, intonaci, ripristino strutturale,
  impermeabilizzanti cementizi e prodotti tecnici della relativa gamma edile.
- **Pitture e decorazioni:** pitture, rivestimenti decorativi per facciate e
  trattamenti antimuffa della gamma pitture.
- **Adesivi e sigillanti:** collanti, adesivi-rasanti, sigillanti per fughe,
  siliconi e schiume per sigillatura. Le guaine cementizie per strutture sono
  uniformate ai materiali edili, anziché alle colle.
- **Protezione e preparazione:** carta, nastri, teli, feltri e fogli per proteggere
  superfici e arredi, più gli accessori per mascheratura e preparazione.
  La parola «protezione» in una descrizione di serramenti non determina il reparto.
- **Porte interne:** tutti i 24 modelli della relativa gamma AIP.
- **Porte blindate:** i 21 modelli blindati, tecnici e portoncini della gamma Dierre.
- **Infissi:** finestre, portefinestre, persiane, scuri e sistemi complementari
  Sallustio, inclusi SKIN, Invisible light, Sicur Alu Door e Invisible.
- **Avvolgibili e tapparelle:** i 23 modelli e profili avvolgibili Zanzar,
  distinti dalle persiane rigide e dalle reti antinsetto.
- **Zanzariere:** tutti i 48 modelli, avvolgenti, plissettati, ZIP e a pannello.
- **Pennelli e accessori:** applicatori e accessori specifici per pitturazione,
  rulli, aste, mescolatori e utensili della gamma imbianchino.
- **Finiture:** finiture minerali e fondi/fissativi del ciclo di finitura,
  coerentemente con il reparto Finiture del sito di riferimento.
- **Ferramenta:** attrezzi e contenitori da cantiere, fissaggi, utensili da taglio,
  percussione e serraggio, strumenti di misura e manutenzione meccanica.

Le misure e i colori di una stessa famiglia sono stati controllati e mantenuti
insieme. I casi trasversali hanno una motivazione esplicita nel registro: per
esempio fondi/fissativi in Finiture, accessori per imbianchini in Pennelli e
SPM REVOLUTION con gli impermeabilizzanti cementizi in Materiali edili.

## Correzioni applicate

| Voce | Codice | Prima | Dopo |
| --- | --- | --- | --- |
| TERMOCOATHEX RIVESTIMENTO | assente | Adesivi e sigillanti | Pitture e decorazioni |
| ACRIL-SILOSSANICO | 00124 | Adesivi e sigillanti | Pitture e decorazioni |
| SPM REVOLUTION | 00537 | Adesivi e sigillanti | Materiali edili |
| Invisible | assente | Protezione e preparazione | Infissi |
| CARTONE ONDULATO DOPPIO STRATO | 00399 | Ferramenta | Protezione e preparazione |
| FELTRI PROTEZIONE PAVIMENTO | 00400 | Ferramenta | Protezione e preparazione |
| TELI COPRITUTTO | 00401 | Ferramenta | Protezione e preparazione |
| FOGLI TAKE AWAY, prima misura | 00402 | Ferramenta | Protezione e preparazione |
| FOGLI TAKE AWAY, seconda misura | 00403 | Ferramenta | Protezione e preparazione |

SKIN era già stato corretto in Infissi nell'intervento precedente ed è stato
nuovamente verificato insieme agli altri 356 record.

## Copertura verificata nel browser

Per ogni reparto sono state caricate anche le schede successive alle prime 24.
Le schede effettivamente visualizzate sono state confrontate, una per una, con
nome, variante, codice e immagine previsti. Verificata anche l'unione dei reparti:
**357 voci, nessuna omessa o aggiunta**.

| Reparto | Voci attese | Voci visualizzate e verificate |
| --- | ---: | ---: |
| Materiali edili | 14 | 14 |
| Pitture e decorazioni | 18 | 18 |
| Adesivi e sigillanti | 28 | 28 |
| Protezione e preparazione | 18 | 18 |
| Porte interne | 24 | 24 |
| Porte blindate | 21 | 21 |
| Infissi | 32 | 32 |
| Avvolgibili e tapparelle | 23 | 23 |
| Zanzariere | 48 | 48 |
| Pennelli e accessori | 59 | 59 |
| Finiture | 7 | 7 |
| Ferramenta | 65 | 65 |
| **Totale** | **357** | **357** |

Verificati i 12 collegamenti ai reparti dalla home e il layout a 320, 375, 768 e
1440 px. Build TypeScript/Vite superata.

## Salvaguardia e limiti dei dati preesistenti

Modificato soltanto il campo `department` delle nove righe indicate. Codici,
nomi, varianti, prezzi, descrizioni, foto e pagine restano identici. Il registro
conserva l'hash dei campi protetti di ogni singola voce.

Sono state rilevate tre righe senza codice, prezzo, descrizione e immagine:
TERMOCOATHEX RIVESTIMENTO, PENNELLESSA MANICO LEGNO · FIBRA SINTETICA e
PLAFONCINO ECONOMICO · TAVOLETTA E MANICO. Potrebbero essere intestazioni estratte
dal PDF: sono state comunque classificate per titolo e conservate, senza
inventare dati o cancellarle. Alcuni testi/varianti contengono artefatti OCR,
compresa la descrizione di 00554: segnalati o preservati, fuori dalla correzione
delle categorie. Questi rilievi non sono stati confusi con voci saltate.

## Controllo automatico per le prossime pubblicazioni

`npm run check:catalog` confronta ogni riga con il registro completo: verifica
copertura, identità, categoria attesa, motivazione, riferimento e hash dei dati
protetti. GitHub Actions lo esegue prima della build. Una nuova voce o una
variazione richiede una verifica e l'aggiornamento intenzionale del registro.

Verificato anche che il controllo fallisca per una riga omessa, Invisible rimesso
in Protezione e preparazione e una modifica accidentale del prezzo. Questi
controlli automatici preservano la revisione umana documentata; non sostituiscono
la valutazione funzionale di un nuovo prodotto.

### Vista successiva con confezioni in secchio accorpate

Dopo questa verifica completa è stata applicata la visualizzazione richiesta
per i secchi: la sorgente mantiene 357 righe e il registro resta valido; il sito
mostra 349 schede, perché 8 confezioni piccole sono elencate sotto i quattro
formati grandi. I nuovi controlli della vista hanno confrontato tutte le 349
schede nei 12 reparti. Dettagli in `bucket-formats.md`.
