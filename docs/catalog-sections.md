# Cataloghi e navigazione finestre

Aggiornamento del 24 ottobre 2026: le 19 finestre precedenti sono sostituite con
42 configurazioni Fossati. Gli infissi attivi sono 55, in 3 famiglie e 11
sottocategorie. Vedere `fossati-windows.md` per struttura e fonti attuali.
La tabella seguente documenta la configurazione precedente.

Il catalogo iniziale presenta due ingressi:
- `#/catalogo?settore=serramenti`: Serramenti e comfort.
- `#/catalogo?settore=edilizia`: Edilizia e ferramenta.

Serramenti comprende porte interne, porte blindate, infissi, avvolgibili e
zanzariere. Tutti gli altri reparti appartengono a Edilizia e ferramenta.
Ricerca, filtri di reparto e partner lavorano soltanto nel settore selezionato.
I vecchi collegamenti di reparto e i loghi partner aprono il settore pertinente.
La pagina iniziale non mescola i prodotti dei due cataloghi.

La navigazione infissi è costruita sui sottotitoli del catalogo esistente:

| Famiglia | Sottocategoria | Modelli |
| --- | --- | ---: |
| Finestre e portefinestre | Alluminio a battente | 5 |
| Finestre e portefinestre | Alluminio scorrevole | 3 |
| Finestre e portefinestre | Alluminio / legno | 3 |
| Finestre e portefinestre | Legno / alluminio | 2 |
| Finestre e portefinestre | PVC | 6 |
| Persiane e scuri | Persiane in alluminio | 7 |
| Persiane e scuri | Scuri in alluminio | 2 |
| Soluzioni complementari | Sistemi complementari | 4 |

Totale: 32 modelli, ciascuno in una sottocategoria. Non vengono attribuite aperture
aggiuntive ai compositi e al PVC, perché il catalogo non le documenta per modello.
Le categorie sono raggiungibili dalla homepage, dal percorso serramenti e dal
partner Sallustio. Breadcrumb, collegamenti indietro e “Mostra tutti i modelli”
consentono di cambiare livello.

Rimossi AIP Tech (EiTech e AllTech), la relativa collezione e i collegamenti esterni
AIP dalle schede e dalla navigazione. Le porte interne rimanenti sono 92.
I file CSV originali, i prezzi e le descrizioni degli altri prodotti restano invariati.

Verifica automatica: `npm run check:sections`, inclusa nel deploy GitHub Pages,
oltre ai controlli esistenti su porte, partner, testi, ricerca e catalogo.


Aggiornamento persiane Fossati: vedere [fossati-shutters.md](fossati-shutters.md). I conteggi precedenti rappresentano lo stato prima della sostituzione: ora 63 infissi e 59 schede del partner Fossati (incluse le 17 tipologie di oscuranti); le 42 finestre restano invariate.
