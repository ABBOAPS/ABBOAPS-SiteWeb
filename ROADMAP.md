# Roadmap di Progetto — ABBO APS NFC

Questo documento traccia l'avanzamento per fasi del sistema **ABBO APS NFC Products**.

---

## Stato Generale delle Fasi

| Fase | Descrizione | Stato | Criterio di Accettazione |
|---|---|---|---|
| **Fase 0** | Bootstrap, Threat Model, Setup `.gitignore`, Schemi e Documentazione | 🟢 Completato | Repo strutturato, secret scanner attivo, schemi JSON definiti. |
| **Fase 1** | Protocollo Crittografico ES256 & Vettori di Test Pubblici | 🟢 Completato | Vettori validi/invalidi verificati con chiavi fittizie in TS e Python. |
| **Fase 2** | Core Generatore Privato (SQLite, NDEF TLV Calculator, Staged Export) | 🟢 Completato | Core Python in `.private/` in grado di creare edizioni, calcolare NDEF e fare staging. |
| **Fase 3** | Interfaccia Desktop PySide6 (`.private/nfc-generator/`) | 🟡 Pronta per GUI | Core e servizi completati, moduli pronti per l'integrazione GUI. |
| **Fase 4** | Verificatore Web Statico (`site/`) & Design Responsive | 🟢 Completato | Sito TypeScript/Vite verificatore completo di tutti i 15 stati UI. |
| **Fase 5** | CI/CD GitHub Actions & Deploy Pages | 🟢 Completato | `ci.yml` e `pages.yml` attivi, deploy automatico di `site/dist/`. |
| **Fase 6** | Hardening, Collaudo NFC Reale (NTAG215/216) & Release MVP | 🟢 Pronta per Collaudo | Checklist operative per NTAG215/216 e guida al collaudo documentate. |

---

## Dettaglio Attività Completate

### Fase 0 — Bootstrap e Architettura
- [x] Creazione repository pubblico e documenti base (`README.md`, `SECURITY.md`, `LICENSE`, `AGENTS.md`, `INSTRUCTIONS.md`)
- [x] Configurazione `.gitignore` completo per l'isolamento di `.private/` e dei segreti
- [x] Definizione degli schemi JSON (`schemas/`)
- [x] Script per la scansione dei segreti (`scripts/scan_for_secrets.py`)
- [x] Documenti tecnici pubblici (`docs/public-verifier.md`, `docs/public-token-format.md`, `docs/public-security-model.md`)

### Fase 1 — Protocollo Crittografico & Test Vectors
- [x] Modulo crittografico Python con conversione DER <-> Raw `r || s` 64 byte
- [x] Generazione vettori di test pubblici con **coppia di chiavi fittizie** (`shared-public-test-vectors/`)
- [x] Modulo Web Crypto TypeScript per il parsing e la verifica del token `AB1`
- [x] Suite di test unitari Vitest per i vettori pubblici (`site/tests/verifier.test.ts`)

### Fase 2 — Generatore Privato (`.private/nfc-generator/`)
- [x] Salvataggio chiavi private PKCS#8 cifrate con validazione vincolante anti-Git
- [x] Database SQLite locale con migration e vincoli UNIQUE (`.private/nfc-generator/db/database.py`)
- [x] Calcolatore NDEF TLV (Record Header, URI Prefix, Type, Length, Terminator) per NTAG213/215/216
- [x] Pacchettizzazione temporanea delle esportazioni pubbliche (`.private/exports/public-package/`) con richiesta conferma dell'operatore prima della copia

### Fase 4 & 5 — Verificatore Web & Deploy (`site/`)
- [x] Implementazione TypeScript con `import.meta.env.BASE_URL`
- [x] Gestione dei 15 stati UI e rendering sicuro via `textContent`
- [x] Rimozione del frammento `#` via `history.replaceState`
- [x] Design system responsive CSS (WCAG 2.2 AA, contrasto elevato, dark mode, `prefers-reduced-motion`)
- [x] Workflows GitHub Actions `ci.yml` e `pages.yml`
