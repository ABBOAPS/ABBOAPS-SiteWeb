# Regole per la verifica della Card NFC presso i partner ABBO APS

*Guida Operativa Esercenti e Partner Convenzionati*  
*Versione 1.0 — Ultimo aggiornamento: 1 agosto 2026*

> **Integrazione della Convenzione Ufficiale:** Le presenti regole integrano le indicazioni operative della convenzione stipulata tra ABBO APS ed il partner. Gli obblighi legali ed i trattamenti privacy autorizzati devono essere disciplinati anche nell’accordo sottoscritto con ABBO APS.

## 1. Finalità della verifica

Il partner convenzionato utilizza la pagina di verifica unicamente per accertare in tempo reale, **in presenza del socio**, l’esistenza della Card, lo stato attivo della quota associativa annuale e la corrispondenza del nome visualizzato ai fini dell’applicazione delle agevolazioni pattuite.

## 2. Procedura corretta per l'esercente

1. Chiedere al socio di presentare la propria Card NFC ABBO APS;
2. Avvicinare lo smartphone o lettore NFC alla Card **esclusivamente alla presenza del socio**;
3. Attendere l’apertura della pagina web e la risposta aggiornata dell’API;
4. Verificare che la pagina mostri la dicitura **Socio ABBO APS** e la quota **in regola**;
5. Applicare lo sconto o il vantaggio previsto dalla convenzione;
6. Chiudere la scheda del browser al termine dell’operazione.

## 3. Cosa verifica la pagina

La pagina di verifica interroga l’API di ABBO APS e conferma: (a) l’associazione valida del token alla tesseramento; (b) lo stato aggiornato nel gestionale; (c) la validità della quota al momento della richiesta.

## 4. Cosa NON verifica la pagina

La pagina digitale non certifica:

- L’impossibilità assoluta di clonazione del supporto fisico NFC;
- L’identità certa della persona fisica che presenta la Card;
- La validità di schermate precedentemente fotografate o salvate (screenshots);
- Il diritto ad agevolazioni non contemplate dalla specifica convenzione.

## 5. Verifica del Documento di Identità

**Regola rigorosa:** Il partner può richiedere al socio l’esibizione di un documento di riconoscimento **esclusivamente in caso di dubbio ragionevole** sulla corrispondenza tra l’utilizzatore ed il nome visualizzato sulla schermata.

**Divieto assoluto:** È severamente vietato fotografare, fotocopiare, annotare gli estremi o conservare copia del documento di identità del socio.

## 6. Divieti tassativi per il partner

Nell’ambito delle operazioni di verifica è fatto assoluto divieto al partner di:

- Fotografare o registrare lo schermo del telefono con i dati del socio;
- Salvare o registrare il token URL contenuto nel chip;
- Annotare o trascrivere il nome, cognome o codice della Card del socio;
- Creare elenchi, database o registri cartacei/digitali dei soci verificate;
- Utilizzare i dati del socio per finalità di marketing proprio o di terzi;
- Effettuare verifiche a distanza o in assenza della presentazione fisica del socio.

## 7. Gestione degli esiti della verifica

- **Socio in regola (Spunta verde):** Applicare regolarmente il vantaggio o lo sconto stabilito dalla convenzione.
- **Quota non in regola / Posizione sospesa:** Non applicare i vantaggi riservati ai soci in regola.
- **Card non valida / Revocata:** La pagina non mostra alcun dato. Non applicare alcun vantaggio.
- **Verifica momentaneamente non disponibile:** In caso di errore di connessione internet, applicare la procedura alternativa concordata: `[PROCEDURA ALTERNATIVA ERRORE TECNICO]`.

## 8. Sospetto abuso o clonazione

Qualora si riscontrino nomi non corrispondenti o comportamenti palesemente sospetti:

- Non trattenere o sequestrare la Card fisica né lo smartphone della persona;
- Non effettuare contestazioni aggressive o foto al cliente;
- Non applicare la convenzione e segnalare l’evento ad ABBO APS tramite il canale riservato: `[CANALE SEGNALAZIONE ABUSI PARTNER]`.

## 9. Riservatezza

L’esercente ed il suo personale incaricato si impegnano a mantenere la massima riservatezza sui dati personali eventualmente visualizzati durante la procedura di verifica, limitandone la visione al tempo strettamente necessario per l’erogazione del servizio.

## 10. Offerte e vantaggi

Le condizioni economiche, le percentuali di sconto ed i prodotti esclusi sono definiti unicamente dal testo della convenzione stipulata tra ABBO APS ed il partner. La pagina web di verifica NFC non specifica percentuali commerciali.

## 11. Contatti dedicati ai partner

- **Assistenza Partner:** `[EMAIL]`
- **Segnalazione Abusi / Anomalie:** `[CANALE SEGNALAZIONE ABUSI PARTNER]`
- **Contatto Privacy:** `[CONTATTO PRIVACY]`
