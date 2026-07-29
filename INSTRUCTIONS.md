# Istruzioni Operative e Convenzioni — ABBO APS

## Standard di Sviluppo

### Sito Web Statico (`site/`)
- **Linguaggio**: TypeScript 5+
- **Bundler**: Vite
- **Stili**: Vanilla CSS con custom properties semantiche (`--brand-primary`, `--status-valid`, ecc.)
- **Sicurezza DOM**: Manipolazione diretta con `textContent`. Uso vietato di `innerHTML` o `document.write`.
- **Test**: Vitest per unit/integration test, Playwright per E2E test.

### Generatore Privato Locale (`.private/nfc-generator/`)
- **Linguaggio**: Python 3.12+ (con type hints completi)
- **GUI**: PySide6
- **Crittografia**: `cryptography` (PKCS#8 cifrato, ECDSA P-256)
- **Database**: `sqlite3` con registri versionati e vincoli UNIQUE.
- **Protezione Git**: Rifiuto di salvare chiavi private o configurazioni dentro cartelle `.git`.

---

## Comandi Utili

### Sviluppo Web
```bash
cd site
npm install
npm run dev      # Avvia server di sviluppo locale
npm run test     # Esegue i test Vitest
npm run build    # Compila l'output statico per produzione in site/dist/
```

### Controlli di Sicurezza
```bash
python3 scripts/scan_for_secrets.py       # Scansione locale per segreti
python3 scripts/verify_public_files.py     # Verifica firme e manifesti pubblici
```

---

## Criteri di Completamento per Pull Request
1. NESSUN segreto o chiave privata nel repository.
2. `scripts/scan_for_secrets.py` completato con esito positivo.
3. Test unitari TypeScript verdi.
4. Build `npm run build` eseguito senza warning e senza file di source map (`.map`).
