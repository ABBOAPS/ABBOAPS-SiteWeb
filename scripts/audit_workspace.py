#!/usr/bin/env python3
"""
Script di Audit Iniziale e Diagnostica Workspace per ABBO APS NFC.
Esegue i controlli prescritti nella FASE A.
"""

import os
import subprocess
from pathlib import Path

def run_cmd(cmd: list[str], cwd: Path) -> tuple[int, str]:
    try:
        res = subprocess.run(cmd, cwd=str(cwd), capture_output=True, text=True)
        return res.returncode, res.stdout + res.stderr
    except Exception as e:
        return -1, str(e)

def main():
    root_dir = Path(__file__).resolve().parent.parent
    print(f"🔍 Audit FASE A — Ispezione Workspace: {root_dir}")

    # 1. git status --short
    code, out = run_cmd(["git", "status", "--short"], root_dir)
    print(f"\n--- 1. git status --short (Exit: {code}) ---")
    print(out.strip() or "(Clean)")

    # 2. git ls-files
    code, out = run_cmd(["git", "ls-files"], root_dir)
    print(f"\n--- 2. git ls-files (Exit: {code}) ---")
    lines = out.strip().splitlines()
    print(f"Totale file tracciati: {len(lines)}")
    for line in lines[:15]:
        print(f"  {line}")
    if len(lines) > 15:
        print(f"  ... e altri {len(lines)-15} file.")

    # 3. git check-ignore -v .private .private/nfc-generator/create_edition.py
    code, out = run_cmd(["git", "check-ignore", "-v", ".private", ".private/nfc-generator/create_edition.py"], root_dir)
    print(f"\n--- 3. git check-ignore (Exit: {code}) ---")
    print(out.strip() or "(Nessun ignore abbinato)")

    # 4. Check presenza cartelle riservate tracciate
    private_in_git = [l for l in lines if ".private" in l or "ABBO_APS_NFC_PRODOTTI" in l or ".pem" in l or ".p8" in l or ".sqlite" in l]
    if private_in_git:
        print(f"\n❌ ATTENZIONE: File riservati ancora tracciati in Git ({len(private_in_git)} file):")
        for p in private_in_git:
            print(f"  {p}")
    else:
        print("\n✅ Verificato: Nessun file privato in .private/ o estensione riservata risulta tracciato in Git!")

if __name__ == "__main__":
    main()
