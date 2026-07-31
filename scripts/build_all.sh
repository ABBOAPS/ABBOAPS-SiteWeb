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

echo "4. Build Verificatori Web Statici (/nfc/ e /tessera/)..."
cd "$REPO_ROOT/site"
if [ -d "node_modules" ]; then
  npm run test
  VITE_BASE_URL=/ npm run build
else
  echo "⚠️ node_modules non presenti in site/. Esegui 'npm install' dentro site/ prima della build."
fi

echo "5. Integrazione Verificatori in dist/nfc/ e dist/tessera/..."
cd "$REPO_ROOT"
mkdir -p dist/nfc dist/tessera
if [ -d "site/dist" ]; then
  cp -r site/dist/index.html dist/nfc/index.html
  cp -r site/dist/assets dist/nfc/ 2>/dev/null || true
  if [ -d "site/dist/tessera" ]; then
    cp -r site/dist/tessera/* dist/tessera/
    cp -r site/dist/assets dist/tessera/ 2>/dev/null || true
  fi
fi

echo "6. Verifica Assenza Source Maps in Produzione..."
if find dist -name "*.map" | grep -q .; then
  echo "❌ ERRORE: Trovati file .map di source map in dist!"
  exit 1
fi

echo "=================================================="
echo "  ✅ Tutte le verifiche e la build unificata sono state completate con successo!"
echo "=================================================="
