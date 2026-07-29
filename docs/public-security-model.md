# Modello di Sicurezza Pubblico e Limiti Tecnologici

## 1. Principi di Sicurezza

Il verificatore web statico ABBO APS basa le proprie garanzie di sicurezza esclusivamente su **firme crittografiche asimmetriche (ECDSA ES256)**:

- La chiave privata appartiene unicamente ad ABBO APS ed è custodita offline/in ambiente locale cifrato.
- La chiave pubblica è distribuita liberamente tramite `keyring.json`.
- Qualsiasi utente o browser può verificare matematicamente che l'item NFC e il manifesto dell'edizione sono stati emessi da ABBO APS e non sono stati alterati.

---

## 2. Trasparenza del Codice Sorgente Web

Poiché il verificatore è un sito statico hosted su GitHub Pages, il codice sorgente (JavaScript / Web Crypto API) è completamente accessibile e ispezionabile.

- Non si fa affidamento su offuscamento o "sicurezza tramite oscurità".
- La minificazione ha il solo scopo di ottimizzare i tempi di caricamento del browser.
- Le firme non possono essere forgiate neppure conoscendo integralmente la struttura dell'applicazione client-side.

---

## 3. Limite di Clonazione dei Tag NFC Standard

I tag NFC consumer della famiglia NTAG21x (NTAG213, NTAG215, NTAG216) sono memorie passive di sola lettura (dopo il blocco). Non dispongono di un coprocessore crittografico in grado di rispondere a sfide dinamiche (come gli NTAG 424 DNA).

### Conseguenza Tecnica
Un aggressore dotato di un lettore NFC può copiare l'intero contenuto NDEF di un tag ABBO APS su un tag NFC vergine. La firma crittografica sul tag duplicato risulterà comunque matematicamente valida perché il payload non è stato modificato.

### Contromisure Operative ABBO APS
Per contrastare la contraffazione da duplicazione fisica:
1. **Riscontro del Seriale Fisico**: La UI del verificatore impone il messaggio *"Codice digitale ABBO APS verificato"* e richiede espressamente all'acquirente di verificare che il numero dell'esemplare mostrato (es. `20 di 200`) sia identico a quello stampato, inciso o tessuto sul prodotto.
2. **Supporto Antirimozione / Distruttibile**: I tag vengono applicati tramite etichette VOID/distruttibili, sotto laminato o inseriti nella struttura del prodotto.
3. **Blocco Sola Lettura**: I tag vengono permanentemente bloccati in sola lettura dopo il collaudo prima della distribuzione.
