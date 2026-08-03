# ABBO APS — Sito Ufficiale & Sistema Verificatore Prodotti NFC

Repository ufficiale di **ABBO APS** per la pubblicazione del sito web dell'associazione ([www.abboaps.org](https://www.abboaps.org)) e del sistema verificatore digitale per prodotti fisici in edizione limitata con tag NFC (`/nfc/`).

---

## 🌐 Il Sito Web di ABBO APS

Questo repository contiene il sito web principale dell'associazione ABBO APS, sviluppato come applicazione staticamente compilata e pubblicata tramite **GitHub Pages**.

- **Dominio Ufficiale**: `https://www.abboaps.org`
- **Percorso canonico di verifica**: `https://abboaps.org/#/limited`
- **Compatibilità NFC legacy**: la pipeline integra anche il verificatore statico nella sottocartella `/nfc/` per gli URL già prodotti.

---

## 🏛️ Come Funziona il Verificatore NFC

Il verificatore di autenticità per i prodotti fisici ABBO APS (poster, capi o gadget numerati) è un'applicazione **100% statica** che gira interamente nel browser del visitatore.

### Principio di Funzionamento
1. **Ogni esemplare ha un tag NFC**: Il tag NFC contiene un URL univoco firmato digitalmente (es. `https://abboaps.org/#/limited/AB1.<kid>.<payload_base64url>.<signature_base64url>`).
2. **Scansione con Smartphone**: Avvicinando lo smartphone al prodotto fisicamente numerato (es. *Esemplare 20 di 200*), si apre il browser sulla pagina del verificatore.
3. **Verifica Crittografica Locale**: Il codice JavaScript legge la firma ECDSA P-256 del token nella route, la verifica con la chiave pubblica dell'associazione presente in `data/keyring.json` e confronta l'hash SHA-256 del manifesto dell'edizione.
4. **Nessun Database Pubblico**: L'integrità è garantita dalla firma crittografica. Non esiste un database pubblico e nessuna informazione privata o tracciamento viene inviato al server.

---

## 🔒 Componenti Privati & Sicurezza

L'applicazione desktop locale per la generazione delle firme e la gestione della chiave privata (**ABBO NFC Studio**), il database SQLite locale e le liste di esportazione **non sono contenuti in questo repository pubblico**.

Questi componenti risiedono esclusivamente nel computer dell'operatore autorizzato (`platformdirs` o cartella `.private/` ignorata da Git).

- **Chiavi private cifrate**: `~/.local/share/ABBO NFC Studio/keys/`
- **Database SQLite locale**: `~/.local/share/ABBO NFC Studio/database/`
- **Export temporanei**: `~/.local/share/ABBO NFC Studio/exports/`

> [!WARNING]
> La chiave privata di firma ABBO APS non deve mai essere pubblicata o inclusa nel repository. Lo script `scripts/scan_for_secrets.py` blocca automaticamente commit contenenti materiale riservato.

---

## 📖 Guida Operativa: Come Generare le Edizioni e i Token NFC

### PASSO 1 — Generazione della Chiave Privata (Eseguito 1 volta)
Dalla cartella `.private/nfc-generator/`:
```bash
cd .private/nfc-generator
pip install -e .
python3 -m abbo_nfc_studio.cli init-key --kid k2026-01
```
*Inserisci e conferma una password master forte per cifrare la chiave privata sul disco.*

---

### PASSO 2 — Creazione dell'Edizione e dei 200 Token Firmati
Quando l'immagine del poster finale è pronta (es. `poster_2026.png`), esegui:

```bash
python3 -m abbo_nfc_studio.cli create-edition \
  --kid k2026-01 \
  --code FESTIVAL-ABBO-1-POSTER \
  --title "Poster Festival Abbiamo 1 — Edizione 2026" \
  --description "Poster ufficiale in edizione limitata numerata per il Festival Abbiamo 1." \
  --quantity 200 \
  --date 2026-09-01 \
  --image /percorso/al/tuo/poster_2026.png \
  --base-url https://abboaps.org \
  --chip NTAG215
```
*(Se desideri generare anche i file di immagine PNG/SVG dei QR Code, aggiungi il flag facoltativo `--generate-qr`).*

**Risultato automatico:**
1. Conversione dell'immagine in **WebP** con calcolo dell'hash SHA-256.
2. Generazione dei **200 token firmati** (da 1 a 200) e salvataggio nel database locale.
3. Generazione della tabella **`items_export.csv`** con i 200 URL da scrivere negli NFC.
4. Richiesta di conferma per aggiornare i file pubblici in `site/public/` (rispondi `s` per confermare).

---

### PASSO 3 — Pubblicazione del Sito su GitHub Pages
Dalla root del repository:

```bash
# Esegui i controlli di build locali
bash scripts/build_all.sh

# Pubblica i file aggiornati
git add site/public/
git commit -m "feat: Pubblicazione manifesto ed edizione 2026 (200 poster)"
git push origin main
```
*La pipeline GitHub Actions pubblicherà automaticamente il verificatore aggiornato. Gli URL già scritti con `https://www.abboaps.org/nfc/#AB1...` restano supportati come alias compatibile.*

---

### PASSO 4 — Scrittura dei Tag NFC sui Poster Fisici
Utilizza l'app **NFC Tools** su smartphone (o un lettore NFC):
1. Apri il file CSV generato (`~/.local/share/ABBO NFC Studio/exports/FESTIVAL-ABBO-1-POSTER/items_export.csv`).
2. Per ciascun poster (es. *Esemplare 1 di 200*):
   - Copia l'URL corrispondente dal CSV.
   - Apri **NFC Tools** ➔ **Scrivi** ➔ **Aggiungi un campo** ➔ **URL / URI** ➔ Scrivi sul tag NFC del Poster 1.
3. **Collauda**: avvicina lo smartphone al poster e verifica che apra il sito mostrando il badge verde *✓ Codice digitale ABBO APS verificato*.
4. **Blocca (Consigliato)**: in **NFC Tools** seleziona **Altro** ➔ **Blocca Tag** per applicare il blocco in sola lettura permanente.

---

## 📁 Struttura del Repository

```text
ABBOAPS-SiteWeb/
├── index.html                         # Pagina principale del sito ABBO APS
├── src/                               # Sorgenti del sito web principale
├── public/                            # Asset pubblici del sito (CNAME, immagini, ecc.)
├── site/                              # Verificatore Web Statico NFC (TypeScript / Vite)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/                           # Logica crittografica ECDSA e UI del verificatore
│   ├── public/                        # Keyring pubblico e manifesti edizioni
│   └── tests/                         # Suite di test unitari (Vitest)
├── docs/                              # Documentazione pubblica e guide operative
│   ├── public-verifier.md             # Architettura del verificatore web
│   ├── public-token-format.md         # Specifiche del protocollo AB1 e firme ES256
│   ├── public-security-model.md       # Modello di minaccia e garanzie di sicurezza
│   ├── nfc-writing-procedure.md       # Guida alla scrittura fisica dei tag NFC
│   └── production-gate-checklist.md   # Checklist per l'emissione dei 200 poster
├── schemas/                           # JSON Schema per la validazione dei dati pubblici
├── shared-public-test-vectors/        # Vettori di test pubblici deterministici
├── scripts/                           # Utility di build, test e scansione di sicurezza
└── .github/workflows/deploy.yml       # Pipeline di deploy unificata GitHub Pages
```

---

## 🚀 Sviluppo Locale e Build

### Requisiti
- Node.js 20+ e npm
- Python 3.12+

### Avvio Sito Principale
```bash
npm install
npm run dev
```

### Avvio Verificatore NFC (`site/`)
```bash
cd site
npm install
npm run dev
```

### Esecuzione Suite di Test e Build Unificata
```bash
bash scripts/build_all.sh
```

---

## 📜 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Consulta il file [LICENSE](LICENSE) per i dettagli.
