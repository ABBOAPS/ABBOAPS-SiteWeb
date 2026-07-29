# Politica di Sicurezza e Modello di Minaccia — ABBO APS NFC

## 1. Principi Fondamentali di Sicurezza

Il sistema di verifica NFC per prodotti in edizione limitata ABBO APS si basa sul principio della **firma digitale asimmetrica**:

- **Chiave Privata**: Mantenuta esclusivamente dall'operatore autorizzato ABBO APS in un ambiente locale protetto da password. Non viene mai caricata su cloud, GitHub, server web o repository.
- **Chiavi Pubbliche**: Distribuite liberamente tramite il file pubblico `site/public/data/keyring.json`.
- **Firma Digitale**: Ogni token NFC e ogni manifesto d'edizione viene firmato con l'algoritmo ECDSA P-256 / SHA-256 (ES256).

> [!IMPORTANT]
> La sicurezza del verificatore web **non dipende dall'offuscamento del codice JavaScript**. Il codice sorgente del verificatore statico è pubblico. Chiunque può ispezionare l'applicazione web; tuttavia, nessun aggressore può generare token o manifesti validi senza la chiave privata ABBO APS.

---

## 2. Garanzie e Limiti Tecnici del Sistema Statico

### 2.1 Cosa viene garantito
- **Integrità dei Dati**: Qualsiasi modifica al numero dell'esemplare, alla tiratura, all'ID edizione o all'hash del manifesto rende la firma digitale **non valida**.
- **Autenticità dell'Emittente**: Impossibilità di creare edizioni o copie a nome di ABBO APS senza la chiave privata.
- **Trasparenza Crittografica**: La verifica viene eseguita localmente nel browser dell'utente via Web Crypto API.

### 2.2 Limiti dichiarati (Clonazione dei Tag Standard)
Un tag NFC standard (come NTAG215 o NTAG216) non possiede un chip crittografico con sfida-risposta dinamica. Pertanto, un aggressore con un lettore NFC può copiare l'intero record NDEF URI su un secondo tag NFC vergine.

Per questa ragione:
1. La UI del verificatore dichiara esclusivamente: **"Codice digitale ABBO APS verificato"**.
2. La UI non promette mai *"autenticità fisica assoluta"* o *"impossibilità di clonazione"*.
3. La UI invita l'utente a verificare che il **numero dell'esemplare** mostrato sullo schermo coincida con il **numero inciso, stampato o ricamato** sul prodotto fisico.
4. L'operatore ABBO APS applica tag antirimozione/distruttibili o incorporati nella struttura fisica del prodotto e li blocca in sola lettura.

---

## 3. Gestione e Stati delle Chiavi (`keyring.json`)

Le chiavi pubbliche nel keyring possiedono uno dei tre stati prescritti:

- `active`: Chiave pubblica corrente impiegata per firmare nuove edizioni.
- `retired`: Chiave pubblica di edizioni passate. **Rimane valida a tempo indeterminato** nel keyring per verificare i prodotti storici. Non viene usata per nuove firme.
- `compromised`: Indica che la chiave privata corrispondente è stata sottratta o compromessa. In questo caso, il verificatore web mostra un **avviso di sicurezza speciale ed esplicito** indicando all'utente che il prodotto firmato con tale chiave richiede una verifica diretta con l'associazione.

---

## 4. Procedura di Risposta agli Incidenti (Key Compromise)

Nel caso in cui la chiave privata venga smarrita o rubata:

1. **Segnalazione Immediata**: Avvisare tempestivamente il direttivo di ABBO APS.
2. **Aggiornamento Keyring**: Modificare lo stato della chiave interessata in `"status": "compromised"` all'interno di `site/public/data/keyring.json`.
3. **Generazione Nuova Chiave**: Generare una nuova chiave privata e aggiungere la rispettiva chiave pubblica con un nuovo `kid` (es. `k2026-02`) e stato `active`.
4. **Pubblicazione ed Export**: Eseguire il deploy immediato del keyring aggiornato su GitHub Pages.

---

## 5. Divieto di Segreti nel Repository

È tassativamente vietato committare nel repository pubblico:
- Chiavi private (`.pem`, `.key`, `.p8`, `.pkcs8`, ecc.);
- Database SQLite locali (`*.sqlite`, `*.db`);
- Credenziali o file `.env`;
- Token individuali o URL completi generati per i prodotti;
- Registri di produzione o backup cifrati/in chiaro.

Tutti i commit vengono scansionati automaticamente dallo script `scripts/scan_for_secrets.py`.

---

## 6. Segnalazione Vulnerabilità

Se scopri una vulnerabilità nel verificatore o nel protocollo, ti preghiamo di contattare ABBO APS all'indirizzo email ufficiale di sicurezza prima di qualsiasi divulgazione pubblica.
