#!/usr/bin/env bash
set -e

echo "=================================================="
echo "  ABBO APS NFC — Suite Locale di Build e Verifiche"
echo "=================================================="

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "1. Controllo Scansione Segreti..."
python3 scripts/scan_for_secrets.py

echo "2. Verifica Integrità File Pubblici..."
python3 scripts/verify_public_files.py

echo "3. Build Sito Principale ABBO APS..."
npm run build

echo "4. Build Verificatore Web Statico (/nfc/)..."
cd "$REPO_ROOT/site"
if [ -d "node_modules" ]; then
  npm run test
  VITE_BASE_URL=/nfc/ npm run build
else
  echo "⚠️ node_modules non presenti in site/. Esegui 'npm install' dentro site/ prima della build."
fi

echo "5. Integrazione Verificatore in dist/nfc/..."
cd "$REPO_ROOT"
mkdir -p dist/nfc
if [ -d "site/dist" ]; then
  cp -r site/dist/* dist/nfc/
fi

echo "6. Verifica Assenza Source Maps in Produzione..."
if find dist -name "*.map" | grep -q .; then
  echo "❌ ERRORE: Trovati file .map di source map in dist!"
  exit 1
fi

echo "=================================================="
echo "  ✅ Tutte le verifiche e la build unificata sono state completate con successo!"
echo "=================================================="
