#!/usr/bin/env python3
"""
Validatore di File Pubblici per ABBO APS NFC.
Verifica che keyring.json, i manifesti delle edizioni e i file configurazione
siano sintatticamente e semanticamente validi prima del deploy.
"""

import json
import sys
from pathlib import Path
import jsonschema

def load_json(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def verify_public_files(root_dir: Path) -> bool:
    print(f"🔍 Verifica integrità file pubblici in: {root_dir.resolve()}")
    has_error = False

    schemas_dir = root_dir / "schemas"
    site_public_dir = root_dir / "site" / "public"

    if not schemas_dir.exists():
        print(f"❌ Errore: Cartella schemi non trovata: {schemas_dir}")
        return False

    # Carica schemi
    keyring_schema = load_json(schemas_dir / "keyring.schema.json")
    envelope_schema = load_json(schemas_dir / "edition-envelope.schema.json")

    # 1. Verifica keyring.json se presente
    keyring_path = site_public_dir / "data" / "keyring.json"
    if keyring_path.exists():
        try:
            keyring_data = load_json(keyring_path)
            jsonschema.validate(instance=keyring_data, schema=keyring_schema)
            print(f"  ✓ Keyring valido: {keyring_path.relative_to(root_dir)}")
        except Exception as e:
            print(f"  ❌ Errore di validazione keyring in {keyring_path}: {e}")
            has_error = True

    # 2. Verifica edizioni in site/public/data/e/
    editions_dir = site_public_dir / "data" / "e"
    if editions_dir.exists():
        for envelope_file in editions_dir.rglob("*.json"):
            try:
                envelope_data = load_json(envelope_file)
                jsonschema.validate(instance=envelope_data, schema=envelope_schema)
                print(f"  ✓ Busta edizione valida: {envelope_file.relative_to(root_dir)}")
            except Exception as e:
                print(f"  ❌ Errore di validazione busta edizione in {envelope_file}: {e}")
                has_error = True

    if has_error:
        print("❌ Verifica file pubblici fallita!")
        return False
    else:
        print("✅ Tutti i file pubblici sono validi.")
        return True

if __name__ == "__main__":
    repo_root = Path(__file__).resolve().parent.parent
    success = verify_public_files(repo_root)
    sys.exit(0 if success else 1)
