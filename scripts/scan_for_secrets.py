#!/usr/bin/env python3
"""
Scanner di Sicurezza Anti-Leak Segreti per ABBO APS NFC.
Scansiona il repository per verificare che nessuna chiave privata, database SQLite,
file .env o lista di token individuali di produzione sia stata inserita.
"""

import os
import re
import sys
from pathlib import Path

# Pattern critici ASSOLUTI (vietati ovunque nei file del repository pubblico, senza eccezione)
ABSOLUTE_FORBIDDEN_PATTERNS = [
    (re.compile(r"-----BEGIN (?:ENCRYPTED )?PRIVATE KEY-----"), "Stringa chiave privata PEM detected"),
    (re.compile(r"-----BEGIN EC PRIVATE KEY-----"), "Chiave EC privata PEM detected"),
    (re.compile(r"-----BEGIN RSA PRIVATE KEY-----"), "Chiave RSA privata PEM detected"),
    (re.compile(r'"d"\s*:\s*"[A-Za-z0-9_-]{43}"'), "Coordinata 'd' (chiave privata JWK) detected"),
]

# Pattern token NFC (vietato nei file di produzione, consentito solo nelle fixture/test espliciti di test)
TOKEN_PATTERN = re.compile(r"AB1\.k[0-9]{4}-[0-9]{2}(?:-[A-Za-z0-9_-]+)?\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{86}")

# Estensioni vietate nel repository pubblico
FORBIDDEN_EXTENSIONS = {".pem", ".p8", ".key", ".pkcs8", ".p12", ".pfx", ".sqlite", ".sqlite3", ".db"}

# Nomi di file vietati (tranne deroghe esplicite)
FORBIDDEN_FILENAMES = {".env", ".env.local", ".env.production", "secrets.json", "private-key.json"}

# Cartelle da ignorare durante la scansione
IGNORED_DIRS = {".git", "node_modules", ".private", "private", ".venv", "venv", "dist", "site/dist", "__pycache__"}

# File/percorsi di test o documentazione autorizzati a contenere token NFC di test (con chiavi fittizie)
ALLOWLISTED_TOKEN_PATHS = [
    "shared-public-test-vectors",
    "site/tests",
    "docs/public-token-format.md",
    "docs/public-verifier.md",
    "README.md",
    "AGENTS.md",
    "INSTRUCTIONS.md",
]

def is_allowlisted_for_tokens(rel_path_str: str) -> bool:
    for allow_path in ALLOWLISTED_TOKEN_PATHS:
        if allow_path in rel_path_str or rel_path_str.endswith(".test.ts") or rel_path_str.endswith(".spec.ts"):
            return True
    return False

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
            rel_file_str = str(rel_file_path)

            # Check estensione
            if file_path.suffix.lower() in FORBIDDEN_EXTENSIONS:
                print(f"❌ ERRORE ESTENSIONE VIETATA: '{rel_file_str}' ha un'estensione non consentita ({file_path.suffix})")
                has_error = True

            # Check nome file
            if file_name in FORBIDDEN_FILENAMES:
                print(f"❌ ERRORE FILE RISERVATO: '{rel_file_str}' non deve essere presente nel repo pubblico")
                has_error = True

            # Scansione contenuti file di testo
            try:
                if file_path.suffix.lower() in {".webp", ".png", ".jpg", ".jpeg", ".ico", ".woff", ".woff2", ".ttf", ".eot"}:
                    continue

                content = file_path.read_text(encoding="utf-8", errors="ignore")

                # 1. Controlli assoluti per segreti reali (MAI consentiti)
                for pattern, description in ABSOLUTE_FORBIDDEN_PATTERNS:
                    if pattern.search(content):
                        if "scan_for_secrets.py" in file_name:
                            continue
                        print(f"❌ ERRORE SEGRETO CRITICO in {rel_file_str}: {description}")
                        has_error = True

                # 2. Controllo token NFC individuali (consentiti solo nelle fixture di test esplicite)
                if TOKEN_PATTERN.search(content):
                    if not is_allowlisted_for_tokens(rel_file_str) and "scan_for_secrets.py" not in file_name:
                        print(f"❌ ERRORE TOKEN NEI FILE DI PRODUZIONE in {rel_file_str}: Token NFC individuale in chiaro nei file di codice")
                        has_error = True

            except Exception as e:
                print(f"⚠️ Avviso: Impossibile leggere {rel_file_str}: {e}")

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
