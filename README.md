# ABBO APS — Sistema Prodotti NFC in Edizione Limitata & Sito Web

Repository ufficiale di **ABBO APS** per la pubblicazione del sito statico e del verificatore digitale per prodotti fisici in edizione limitata con tag NFC.

---

## 🏛️ Architettura del Verificatore NFC

Il verificatore per i prodotti NFC ABBO APS è un'applicazione **100% statica**, pubblicata tramite **GitHub Pages**.

- **Hosting**: Statico su GitHub Pages (compatibile con domini custom e percorsi di sottocartella).
- **Crittografia**: ECDSA P-256 con SHA-256 (ES256). Firme Raw `r || s` (64 byte) codificate in Base64URL.
- **Privacy & Sicurezza**: Nessun database pubblico, nessun tracciamento, nessun dato personale e nessuna chiave privata nel repository.
- **Verifica**: Ogni tag NFC contiene un URL con token nel frammento `#` (`#AB1.<kid>.<payload_base64url>.<signature_base64url>`). Il browser verifica la firma crittografica prima di decodificare e mostrare i dati autenticati.

---

## 📁 Struttura del Repository

```text
ABBOAPS-SiteWeb/
├── README.md                          # Panoramica del repository
├── SECURITY.md                        # Politica di sicurezza e gestione incidenti
├── LICENSE                            # Licenza open-source MIT
├── .gitignore                         # Regole di esclusione (componenti e segreti privati)
├── .editorconfig                      # Standard di formattazione codice
├── .pre-commit-config.yaml            # Configurazione hook pre-commit
├── docs/                              # Documentazione pubblica
│   ├── public-verifier.md             # Architettura del verificatore web statico
│   ├── public-token-format.md         # Specifiche del protocollo AB1 e delle firme ES256
│   └── public-security-model.md       # Modello di minaccia e garanzie di sicurezza
├── schemas/                           # JSON Schema per validazione pubblica
│   ├── keyring.schema.json            # Schema del registro chiavi pubbliche
│   ├── edition-envelope.schema.json   # Schema della busta firmata del manifesto
│   ├── edition-payload.schema.json    # Schema del payload del manifesto dell'edizione
│   └── product-payload.schema.json    # Schema del payload del singolo esemplare
├── shared-public-test-vectors/        # Vettori di test pubblici (con chiavi fittizie)
│   ├── valid/                         # Vettori di test validi
│   └── invalid/                       # Vettori di test non validi / alterati
├── site/                              # Verificatore Web Statico (TypeScript / Vite)
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   ├── src/                           # Logica di verifica crittografica e UI
│   ├── public/                        # Keyring e manifesti edizioni pubblici
│   └── tests/                         # Suite di test unitari (Vitest)
├── scripts/                           # Utility di verifica e sicurezza
│   ├── scan_for_secrets.py            # Scanner anti-leak segreti e chiavi private
│   └── verify_public_files.py         # Validatore di firme e manifesti pubblici
├── .github/                           # Workflow CI/CD GitHub Actions
│   └── workflows/
│       ├── ci.yml                     # Continuous Integration per il sito statico
│       └── pages.yml                  # Build & Deploy automatico su GitHub Pages
└── .private/                          # [COMPONENTE PRIVATA LOCALE - IGNORATA DA GIT]
    ├── nfc-generator/                 # Applicazione desktop Python (ABBO NFC Studio)
    ├── database/                      # Registro SQLite locale di produzione
    ├── keys/                          # Chiavi private PKCS#8 cifrate e backup
    └── exports/                       # Pacchetti di export locali prima del deploy
```

---

## 🔒 Componenti Privati & Sicurezza

L'applicazione desktop di gestione ed emissione (**ABBO NFC Studio**), il database SQLite locale, le chiavi private e le liste di prodotti **non sono contenuti in questo repository**.

Tali componenti risiedono esclusivamente in locale nella directory dell'utente (`platformdirs`) oppure nella directory locale `.private/` (espressamente ignorata da Git via `.gitignore`).

> [!WARNING]
> La chiave privata ABBO APS non deve mai essere inserita nel repository, nei file di configurazione del sito, in GitHub Actions o in file `.env`. Lo script `scripts/scan_for_secrets.py` blocca automaticamente qualsiasi commit contenente materiale riservato.

---

## 🚀 Sviluppo del Sito Statico (`site/`)

Il verificatore web è sviluppato in TypeScript con Vite.

### Requisiti
- Node.js 18+ e npm

### Avvio in Sviluppo
```bash
cd site
npm install
npm run dev
```

### Esecuzione Test
```bash
cd site
npm run test
```

### Build per Produzione
```bash
cd site
npm run build
```
L'output della build viene generato in `site/dist/` senza source map ed è pronto per il deploy su GitHub Pages.

---

## 📜 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Consulta il file [LICENSE](LICENSE) per i dettagli.
