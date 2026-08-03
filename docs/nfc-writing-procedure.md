# Procedura Operativa per la Scrittura e Collaudo dei Tag NFC

## 1. Requisiti e Hardware
- **Tag NFC Compatibili**: NTAG215 (504 B) o NTAG216 (888 B) certificati.
- **Smartphone**: Android (con NFC attivo) o iPhone (iOS 13+ con supporto NFC NDEF).
- **Applicazione consigliata**: **NFC Tools** (disponibile gratuitamente su Google Play Store e Apple App Store).

---

## 2. Procedura Passo-Passo di Scrittura ed Emissione

### FASE 1 — Scrittura del Tag NFC
1. Apri l'app **NFC Tools** sul tuo smartphone.
2. Seleziona **Scrivi** -> **Aggiungi un campo** -> **URL / URI**.
3. Incolla l'URL completo firmato generato dal programma (es. `https://abboaps.org/#/limited/AB1.k2099-01-test...`).
4. Premi **Scrivi / Write** e avvicina il tag NFC alla parte posteriore dello smartphone finché non ricevi il segnale di conferma (suono/vibrazione).

### FASE 2 — Collaudo di Rilettura e Verifica Web
1. Chiudi l'applicazione NFC Tools.
2. Avvicina lo smartphone al tag appena scritto per provocare l'apertura automatica del browser.
3. Verifica che il browser apra la pagina ufficiale `https://abboaps.org/#/limited`.
4. Controlla che compaia il badge:
   > **Codice digitale ABBO APS verificato**  
   > Poster Festival Abbiamo 1 — TEST  
   > **Esemplare N di 3**
5. Confronta il numero dell'esemplare mostrato con quello fisicamente presente sul prodotto.

### FASE 3 — Blocco Sola Lettura (Irreversibile)
> [!CAUTION]
> **ATTENZIONE**: Il blocco in sola lettura rende il tag NFC **PERMANENTEMENTE IMMUTABILE**. Esegui questo passaggio SOLTANTO dopo aver superato con successo la verifica del punto 2.

1. Nell'app **NFC Tools**, seleziona la scheda **Altro / Other**.
2. Seleziona **Blocca Tag / Lock Tag**.
3. Avvicina il tag allo smartphone per applicare il blocco in sola lettura.
4. Tenta una riscrittura di prova per accertarti che il tag risponda con errore di scrittura bloccata.

---

## 3. Registro Operativo
Nel programma desktop **ABBO NFC Studio**, aggiorna lo stato dell'esemplare seguendo le transizioni della macchina a stati:
- `generated` -> `written` (dopo il passaggio 1)
- `written` -> `verified` (dopo il passaggio 2)
- `verified` -> `applied` (dopo l'applicazione fisica sul prodotto)
- `applied` -> `locked` (dopo il passaggio 3 di blocco permanente)
