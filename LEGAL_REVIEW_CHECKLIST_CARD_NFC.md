# Checklist di Revisione Legale e Privacy — Card NFC ABBO APS

> **DOCUMENTO AD USO INTERNO — NON DESTINATO ALLA PUBBLICAZIONE**  
> *Ultimo aggiornamento: 1 agosto 2026*  
> *Riferimento sistema: ABBO APS NFC Membership Card System v1.0*

Questo documento raccoglie tutti i **placeholder**, le **basi giuridiche da deliberare**, i **ruoli privacy dei soggetti coinvolti** e le **decisioni organizzative/tecniche** che il consiglio direttivo di ABBO APS ed il consulente legale/privacy dovranno formalizzare ed approvare prima della pubblicazione definitiva delle pagine legali della Card NFC.

---

## 1. Elenco dei Placeholder Utilizzati nelle Pagine Legali

Nelle bozze delle tre pagine legali (`/tessera/condizioni`, `/tessera/privacy`, `/tessera/partner`) e nel disclaimer di verifica sono stati utilizzati i seguenti placeholder standardizzati. Ciascun dato deve essere verificato e compilato con i riferimenti ufficiali:

| Placeholder | Descrizione / Campo Richiesto | Valore Definitivo da Inserire | Stato |
| :--- | :--- | :--- | :--- |
| `[CODICE FISCALE ABBO APS]` | Codice fiscale ufficiale dell'Associazione (es. `94070530152`) | `94070530152` *(da confermare)* | ⚠️ In attesa di validazione legale |
| `[SEDE LEGALE]` | Indirizzo completo della sede legale dell'Associazione | *Es. Via ..., Cap, Città (Provincia)* | ❌ Da compilare |
| `[EMAIL]` | Email ufficiale di contatto dell'Associazione | *Es. info@abboaps.org* | ❌ Da compilare |
| `[PEC]` | Indirizzo di Posta Elettronica Certificata (PEC) | *Es. abboaps@pec.it* | ❌ Da compilare |
| `[NUMERO RUNTS, SE APPLICABILE]` | Numero di iscrizione al Registro Unico Nazionale del Terzo Settore | *Es. Rep. N. ...* | ❌ Da compilare |
| `[CONTATTO PRIVACY]` | Canale/Email dedicato alle richieste di esercizio diritti privacy (artt. 15-22 GDPR) | *Es. privacy@abboaps.org* | ❌ Da compilare |
| `[BASE GIURIDICA DA VALIDARE CON IL CONSULENTE]` | Base giuridica specifica per ciascuna finalità del trattamento NFC | *Vedi Sezione 2* | ⚠️ In attesa di parere legale |
| `[TEMPO DI CONSERVAZIONE LOG TECNICI]` | Periodo di ritenzione dei log tecnici minimizzati dell'API di verifica | *Es. 30 giorni / 90 giorni* | ⚠️ In attesa di parere tecnico/legale |
| `[FORNITORI E RESPONSABILI DA VERIFICARE]` | Elenco fornitori infrastruttura (Hosting statico, Provider API/Database, DNS) | *Es. GitHub Pages, Hetzner/AWS, ecc.* | ⚠️ In attesa di mappatura contrattuale |
| `[CANALE SEGNALAZIONE ABUSI PARTNER]` | Email o canale telefonico dedicato ai partner per segnalare anomalie o abusi | *Es. partner@abboaps.org* | ❌ Da compilare |
| `[PROCEDURA ALTERNATIVA ERRORE TECNICO]` | Procedura per i partner in caso di temporanea indisponibilità dell'API | *Es. verifica ricevuta quota / contatto telefonico* | ⚠️ In attesa di delibera interna |

---

## 2. Decisioni Giuridiche da Sottoporre al Consulente Legale/Privacy

### 2.1 Basi Giuridiche del Trattamento (Art. 6 GDPR)
La privacy policy specifica (`/tessera/privacy`) deve essere convalidata dal consulente privacy distinguendo le basi giuridiche per ciascuna sotto-finalità:
1. **Emissione e gestione della Card NFC**: *Esecuzione del contratto associativo / Statuto (Art. 6(1)(b) GDPR)*.
2. **Verifica della posizione associativa presso i partner**: *Legittimo interesse dell'Associazione e del socio ad usufruire dei vantaggi associativi (Art. 6(1)(f) GDPR)* oppure *Esecuzione di misure associative (Art. 6(1)(b) GDPR)*.
3. **Sicurezza e prevenzione abusi (revoca token, log minimizzati)**: *Legittimo interesse (Art. 6(1)(f) GDPR)*.
4. **Consenso**: Verificare se vi sono trattamenti opzionali per i quali sia realmente necessario raccogliere un consenso esplicito, evitando di usare il consenso come base giuridica generica indistinta.

### 2.2 Qualificazione Privacy dei Partner Convenzionati
Occorre definire chiaramente la qualificazione giuridica privacy degli esercenti/partner presso cui i soci presentano la Card:
- **Terzi Destinatari dei dati resi pubblici dal socio**: Il socio decide autonomamente di scansionare o mostrare la Card al partner per richiedere una convenzione.
- **Titolari autonomi del trattamento**: Il partner che prende visione del nome e dello stato associativo lo fa nei limiti della transazione/sconto immediato senza conservare dati.
- *Nota legali*: La convenzione firmata tra ABBO APS ed il partner deve contenere la clausola che vieta espressamente al partner di fotocopiare, fotografare, memorizzare o creare elenchi di soci.

### 2.3 Minimizzazione dei Dati e Codice Pubblico `ABBO-ANNO-NUMERO`
Il codice della Card ha il formato `ABBO-2026-0042` (dove `0042` è il numero del socio ed `2026` l'anno di emissione della card fisica).
- **Valutazione di Minimizzazione (Art. 5(1)(c) GDPR)**: Il consulente privacy deve valutare se mostrare il numero socio sia strettamente necessario o se in futuro convenga separare l'identificativo interno del socio da un numero Seriale Card pubblico opaco.
- **Stato Card Invalida**: Quando l'API restituisce `not_valid`, `suspended` o `not_found`, l'applicazione **NON mostra alcun nome o codice** per garantire la massima riservatezza.

### 2.4 Verifica degli Strumenti di Tracciamento (Cookie & Analytics)
Nelle route relative alla Card NFC (`/tessera`, `/tessera/condizioni`, `/tessera/privacy`, `/tessera/partner`):
- Non sono stati inseriti script di terze parti (Google Analytics, Meta Pixel, Hotjar, font remoti o CDN).
- **Checklist per il sistemista**: Verificare che nel build di produzione di tutto il sito web `ABBOAPS-SiteWeb` non siano iniettati script di tracciamento o cookie banner commerciali nelle route `/tessera*`.

### 2.5 Periodo di Conservazione dei Log Tecnici di Verifica
L'API di verifica non conserva lo storico delle scansioni né crea profilazione della posizione del socio.
- I log di rete server-side (IP, User-Agent, timestamp, hash troncato del token) per scopi di protezione da attacchi DoS/rate-limiting devono avere un tempo di ritenzione definito (es. 7 o 30 giorni) stabilito nell'informativa.

---

## 3. Dichiarazione di Limitazione Responsabilità Sviluppo Software

I testi legali inclusi nelle componenti React `/tessera/condizioni`, `/tessera/privacy` e `/tessera/partner` sono stati redatti secondo le migliori pratiche di *Privacy by Design*, trasparenza UX e minimizzazione dei dati. Tuttavia:

> ⚠️ **AVVISO FONDAMENTALE**: La presente bozza di documentazione legale **NON costituisce parere legale definitivo** e **NON garantisce automaticamente la conformità ope legis**. Prima della messa in produzione ufficiale, ABBO APS è tenuta a far revisionare ed approvare i testi definitivi dal proprio legale o consulente privacy di fiducia.
