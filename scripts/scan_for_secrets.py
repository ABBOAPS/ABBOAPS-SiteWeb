#!/usr/bin/env python3
"""
Scanner di Sicurezza Anti-Leak Segreti per ABBO APS NFC.
Scansiona il repository per verificare che nessuna chiave privata, database SQLite,
file .env o lista di token individuali sia stata accidentalmente inclusa.
"""

import os
import re
import sys
from pathlib import Path

# Keyword / pattern vietati nei file pubblici
FORBIDDEN_PATTERNS = [
    (re.compile(r"-----BEGIN (?:ENCRYPTED )?PRIVATE KEY-----"), "Stringa chiave privata PEM detected"),
    (re.compile(r"-----BEGIN EC PRIVATE KEY-----"), "Chiave EC privata PEM detected"),
    (re.compile(r"-----BEGIN RSA PRIVATE KEY-----"), "Chiave RSA privata PEM detected"),
    (re.compile(r'"d"\s*:\s*"[A-Za-z0-9_-]{43}"'), "Coordinata 'd' (chiave privata JWK) detected"),
    (re.compile(r"AB1\.k[0-9]{4}-[0-9]{2}\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{86}"), "Token NFC individuale in chiaro nei file di codice"),
]

# Estensioni vietate nel repository pubblico
FORBIDDEN_EXTENSIONS = {".pem", ".p8", ".key", ".pkcs8", ".p12", ".pfx", ".sqlite", ".sqlite3", ".db"}

# Nomi di file vietati (tranne deroghe esplicite)
FORBIDDEN_FILENAMES = {".env", ".env.local", ".env.production", "secrets.json", "private-key.json"}

# Cartelle da ignorare durante la scansione
IGNORED_DIRS = {".git", "node_modules", ".private", "private", ".venv", "venv", "dist", "site/dist", "__pycache__"}

def scan_repository(root_dir: Path) -> bool:
    has_error = False
    print(f"🔍 Avvio scansione di sicurezza nel repository: {root_dir.resolve()}")

    for root, dirs, files in os.walk(root_dir):
        # Filtra cartelle ignorate
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS]

        rel_root = Path(root).relative_to(root_dir)

        # Controllo se accidentalmente è stata tracciata una cartella `.private`
        if ".private" in rel_root.parts or "private" in rel_root.parts:
            print(f"❌ ERRORE DI SICUREZZA: Cartella riservata trovata nel percorso scansionato: {rel_root}")
            has_error = True

        for file_name in files:
            file_path = Path(root) / file_name
            rel_file_path = file_path.relative_to(root_dir)

            # Check estensione
            if file_path.suffix.lower() in FORBIDDEN_EXTENSIONS:
                print(f"❌ ERRORE ESTENSIONE VIETATA: '{rel_file_path}' ha un'estensione non consentita ({file_path.suffix})")
                has_error = True

            # Check nome file
            if file_name in FORBIDDEN_FILENAMES:
                print(f"❌ ERRORE FILE RISERVATO: '{rel_file_path}' non deve essere presente nel repo pubblico")
                has_error = True

            # Scansione contenuti file di testo
            try:
                # Salta file binari di grandi dimensioni (es. immagini WebP, PNG)
                if file_path.suffix.lower() in {".webp", ".png", ".jpg", ".jpeg", ".ico", ".woff", ".woff2", ".ttf", ".eot"}:
                    continue

                content = file_path.read_text(encoding="utf-8", errors="ignore")

                for pattern, description in FORBIDDEN_PATTERNS:
                    if pattern.search(content):
                        # Permetti menzione di pattern nei documenti di spiegazione della sicurezza se opportunamente contestualizzato
                        if file_name.endswith(".md") or file_name.endswith(".schema.json") or "scan_for_secrets.py" in file_name:
                            continue
                        print(f"❌ ERRORE CONTENUTO RISERVATO in {rel_file_path}: {description}")
                        has_error = True

            except Exception as e:
                print(f"⚠️ Avviso: Impossibile leggere {rel_file_path}: {e}")

    if has_error:
        print("❌ Scansione fallita! Rimuovere il materiale privato prima di committare.")
        return False
    else:
        print("✅ Scansione completata con successo! Nessun segreto o file riservato trovato.")
        return True

if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parent.parent
    success = scan_repository(repo_root)
    sys.exit(0 if success else 1)
