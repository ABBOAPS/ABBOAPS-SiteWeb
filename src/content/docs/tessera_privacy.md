# Informativa privacy relativa alla Card NFC ABBO APS

*Informativa specifica ex artt. 13-14 Reg. UE 2016/679 (GDPR)*  
*Versione 1.0 — Ultimo aggiornamento: 1 agosto 2026*

## 1. Titolare del Trattamento

Il Titolare del trattamento dei dati personali raccolti tramite il servizio Card NFC è:

- **Denominazione:** ABBO APS — Associazione di Promozione Sociale
- **Codice Fiscale:** `[CODICE FISCALE ABBO APS]`
- **Sede Legale:** `[SEDE LEGALE]`
- **Email Ufficiale:** `[EMAIL]`
- **PEC:** `[PEC]`
- **Contatto Privacy:** `[CONTATTO PRIVACY]`
- **RUNTS:** `[NUMERO RUNTS, SE APPLICABILE]`

## 2. Ambito dell'informativa

La presente informativa riguarda **esclusivamente** le operazioni di trattamento dei dati connesse alla Card fisica NFC:

- Emissione e codifica iniziale del chip NFC;
- Associazione tra token digitale revocabile e scheda socio;
- Verifica pubblica dello stato della tessera e della quota annuale;
- Gestione di smarrimento, revoca e sostituzione del token.

## 3. Dati trattati

### A. Dati identificativi
Nome, cognome, numero progressivo socio ed identificativo pubblico della Card (es. `ABBO-2026-0042`).

### B. Dati associativi
Stato della posizione associativa (es. in regola / non in regola / sospeso) ed eventuale termine di validità della quota annuale versata.

### C. Dati della Card fisica
Anno di emissione della card, stato del chip (attivo / smarrito / revocato / sostituito) e storico delle revoche.

### D. Dati tecnici di verifica
Token casuale ed opaco scritto nel tag NFC, impronta hash/HMAC memorizzata nel gestionale e log di sistema strettamente tecnici minimizzati.

*Minimizzazione fondamentale:* Il chip NFC non contiene direttamente il nome, il cognome o il codice fiscale del socio, ma unicamente un URL con un token opaco e revocabile.

## 4. Finalità del trattamento

I dati personali vengono trattati per le seguenti finalità esclusive:

1. Emissione e gestione operativa della Card NFC facoltativa;
2. Verifica istantanea della titolarità dichiarata e dello stato della quota associativa;
3. Fruizione delle agevolazioni riservate ai soci presso gli enti e partner convenzionati;
4. Prevenzione di utilizzi abusivi, duplicazioni indebite e gestione della revoca immediata;
5. Tutela della sicurezza informatica dell’infrastruttura API e difesa da attacchi DoS.

## 5. Base giuridica del trattamento

`[BASE GIURIDICA DA VALIDARE CON IL CONSULENTE]`

- **Gestione rapporto associativo (Art. 6(1)(b) GDPR):** Esecuzione delle prestazioni contrattuali/statutarie derivanti dall’iscrizione ad ABBO APS;
- **Legittimo interesse del Titolare e del socio (Art. 6(1)(f) GDPR):** Semplificazione della verifica associativa e prevenzione dell’abuso di tessere o sconti riservati;
- **Adempimento obblighi di legge (Art. 6(1)(c) GDPR):** Per la corretta tenuta del libro soci e la gestione amministrativo-contabile.

## 6. Natura del conferimento

Il conferimento dei dati per l’adesione ad ABBO APS è disciplinato dallo Statuto. La richiesta ed il rilascio della Card NFC sono **completamente facoltativi**. Il socio che sceglie di non richiedere o di non utilizzare la Card NFC conserva integralmente i propri diritti associativi e può dimostrare la qualifica di socio tramite le modalità tradizionali indicate dall’Associazione.

## 7. Funzionamento tecnico della scansione

La procedura di verifica si svolge secondo i seguenti passaggi trasparenti:

1. Lo smartphone legge dal tag NFC l’URL contenente un token casuale (es. `...#/tessera#card=TOKEN`);
2. La pagina web interroga via HTTP POST sicuro (HTTPS) l’API del gestionale trasmettendo il token;
3. L’API convalida crittograficamente il token ed interroga il database;
4. Se la card è valida, l’API restituisce alla pagina unicamente il nome, cognome, stato quota, codice card ed anno;
5. Il browser rimuove immediatamente il token dall’URL tramite `history.replaceState`;
6. **Nessun registro applicativo o cronologia delle scansioni effettuate dal socio viene memorizzata dal sistema.**

## 8. Visibilità dei dati e rischi di copia

**Informativa sui rischi di visibilità pubblica:** Chiunque sia in possesso della Card fisica o ne abbia duplicato il token NFC o l’URL completo può avviare la verifica. Qualora la Card sia attiva, la pagina mostrerà pubblicamente il nome ed il cognome del socio unitamente allo stato della quota.

In caso di smarrimento o sottrazione, il socio deve comunicare tempestivamente l’evento per consentire la revoca del token. A seguito della revoca, l’API risponderà categoricamente con esito non valido e **nessun dato personale verrà mostrato**.

## 9. Destinatari dei dati

I dati personali restituiti dalla verifica possono essere conosciuti da:

- Incaricati del trattamento ed amministratori autorizzati di ABBO APS;
- Esercenti e partner convenzionati davanti ai quali il socio esibisce la Card per ottenere agevolazioni;
- Fornitori di servizi tecnici (hosting web, infrastruttura server API, manutenzione software) nominati Responsabili del Trattamento ex Art. 28 GDPR.

## 10. Trasferimenti e fornitori tecnici

`[FORNITORI E RESPONSABILI DA VERIFICARE]` — L’infrastruttura web statica e l’API server operano su fornitori tecnologici primari. Tutti i trattamenti si svolgono all’interno dello Spazio Economico Europeo (SEE) o presso fornitori garantiti dalle clausole contrattuali standard approvate dalla Commissione Europea ai sensi dell’Art. 46 GDPR.

## 11. Conservazione dei dati

- **Dati del socio e della quota:** Conservati per l’intera durata del rapporto associativo ed in seguito per i tempi di legge previsti in materia amministrativa;
- **Token della Card attiva:** Conservati nel gestionale fino alla disattivazione, sostituzione o revoca;
- **Card revocate o sostituite:** I relativi token disattivati vengono conservati unicamente come storico di revoca a fini di sicurezza;
- **Log tecnici di sicurezza:** `[TEMPO DI CONSERVAZIONE LOG TECNICI]` (conservati per il tempo minimo strettamente necessario a garantire la stabilità della rete).

## 12. Misure di sicurezza

ABBO APS adotta misure tecniche avanzate di *Privacy by Design*: cifratura delle comunicazioni in transito (HTTPS/TLS), token casuali ad elevata entropia, conservazione lato server di digest hash/HMAC, rate-limiting anti-bruteforce sull’API, assenza di token nei log pubblici e separazione rigida del sito statico dal database gestionale.

## 13. Diritti dell'interessato

Gli associati possono in ogni momento esercitare i diritti previsti dagli Artt. 15-22 del GDPR (accesso, rettifica, cancellazione, limitazione, opposizione) inviando una comunicazione a `[CONTATTO PRIVACY]`. È inoltre fatto salvo il diritto di proporre reclamo all’Autorità Garante per la protezione dei dati personali (www.garanteprivacy.it).

## 14. Processi decisionali automatizzati

Il sistema di verifica della Card non effettua alcun processo decisionale automatizzato, profilazione o tracciamento delle abitudini di fruizione del socio.

## 15. Trattamento dati relativi ai minori

**Nota specifica sul servizio NFC:** La funzione Card NFC descritta nella presente informativa è attualmente destinata ai soci maggiorenni.

## 16. Cookie e strumenti di tracciamento

Le pagine web dedicate al servizio Card NFC (`/tessera*`) non utilizzano cookie di profilazione, snippet di terze parti (Google Analytics, Meta Pixel), né strumenti di tracciamento o fingerprinting.

## 17. Aggiornamenti

La presente informativa specifica è soggetta a periodico aggiornamento. Eventuali variazioni sostanziali saranno rese note su questa pagina.
