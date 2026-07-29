#!/usr/bin/env bash
set -e

echo "=================================================="
echo " 📦 ABBO APS — Generazione Archivio Pubblico Sicuro"
echo "=================================================="

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

OUTPUT_ZIP="$REPO_ROOT/dist/ABBOAPS-SiteWeb-public.zip"
mkdir -p "$REPO_ROOT/dist"

echo "1. Creazione archivio zip dai soli file tracciati da Git..."
git archive --format=zip -o "$OUTPUT_ZIP" HEAD

echo "2. Audit del contenuto dell'archivio generato..."
# Elenca i file contenuti nello zip usando unzip -l
UNZIP_LIST=$(unzip -l "$OUTPUT_ZIP")

# Pattern da verificare per prevenire leak nell'archivio
FORBIDDEN_TERMS=(".private" ".git" ".pem" ".p8" ".key" ".pkcs8" ".sqlite" ".db" "ABBO_APS_NFC_PRODOTTI" "private-docs" "items.csv" "tokens.csv")

HAS_ERROR=0
for term in "${FORBIDDEN_TERMS[@]}"; do
  if echo "$UNZIP_LIST" | grep -i -E "(^|/)${term}(/|$)" > /dev/null; then
    echo "❌ ERRORE DI SICUREZZA: Trovato elemento vietato '$term' nell'archivio pubblico!"
    HAS_ERROR=1
  fi
done

if [ $HAS_ERROR -eq 1 ]; then
  rm -f "$OUTPUT_ZIP"
  echo "❌ Creazione archivio fallita! L'archivio è stato rimosso per sicurezza."
  exit 1
else
  echo "✅ Archivio pubblico creato e verificato con successo: $OUTPUT_ZIP"
fi
