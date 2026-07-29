# Setup Locale della Cartella Privata ABBO APS

Questa cartella è una guida d'esempio per gli operatori ABBO APS autorizzati alla gestione ed emissione dei prodotti NFC.

---

## Istruzioni per l'Operatore Locale

1. **Creazione Cartella Privata**:
   Nella radice del repository locale (oppure nel percorso sicuro utente gestito da `platformdirs`), crea la cartella `.private/`:
   ```bash
   mkdir -p .private/nfc-generator .private/database .private/keys .private/exports .private/backups
   ```

2. **Verifica Esclusione Git**:
   La cartella `.private/` e tutti i suoi contenuti sono elencati in `.gitignore` e **NON devono mai essere tracciati o inviati a GitHub**.
   Per verificare:
   ```bash
   git status
   ```
   Assicurati che `.private/` non sia visibile tra i file Untracked.

3. **Struttura della Cartella Privata Locale**:
   ```text
   .private/
   ├── nfc-generator/      # Applicazione desktop Python ABBO NFC Studio
   ├── database/           # Database locale SQLite dei prodotti prodotti
   ├── keys/               # Chiave privata ECDSA PKCS#8 cifrata con password master
   ├── exports/            # Pacchetti temporanei di esportazione prima della copia nel sito
   └── backups/            # Backup locali cifrati
   ```

> [!WARNING]
> Non rimuovere `.private/` dal file `.gitignore` e non aggiungere file contenuti in `.private/` all'indice di Git.
