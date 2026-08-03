# Architettura del Verificatore Web Statico

## Panoramica

Il **Verificatore Web Statico ABBO APS** è una Single Page Application (SPA) realizzata in TypeScript e Vite, progettata per funzionare interamente client-side ed essere ospitata su **GitHub Pages**.

---

## Flusso Operativo Client-Side

1. **Lettura del Frammento**: Quando lo smartphone legge l'NFC, apre l'URL principale contenente il token nella route HashRouter:
   ```text
   https://abboaps.org/#/limited/AB1.<kid>.<payload_base64url>.<signature_base64url>
   ```
2. **Parsing del Token**: L'applicazione estrae `kid`, `payload_base64url` e `signature_base64url`.
3. **Caricamento Keyring**: Fetch del file `public/data/keyring.json` e ricerca del JWK corrispondente al `kid`.
4. **Verifica della Firma dell'Item**: Importazione della chiave pubblica JWK con `crypto.subtle.importKey` e verifica ECDSA P-256 / SHA-256 (ES256) con `crypto.subtle.verify` sui byte ASCII di `AB1.<kid>.<payload_base64url>`.
5. **Decodifica Payload**: Solo se la firma è valida, il payload JSON viene decodificato e validato.
6. **Fetch del Manifesto**: Recupero del file busta firmata dell'edizione `/data/e/<edition-id>/<revision>.json`.
7. **Verifica della Firma del Manifesto**: Controllo della firma della busta rispetto alla chiave pubblica.
8. **Riscontro Hash**: Calcolo di `SHA-256` dei byte del payload del manifesto e confronto con il campo `h` del token dell'item.
9. **Rimozione del Token dall'URL**: Dopo l'acquisizione in memoria, il token viene rimosso dalla barra degli indirizzi tramite `history.replaceState`, lasciando attiva la route `https://abboaps.org/#/limited`.
10. **Rendering Sicuro**: Rendering dei dati verificati tramite manipolazione DOM sicura (`textContent`).

---

## Compatibilità e Deployment

Il verificatore utilizza `import.meta.env.BASE_URL` per garantire la risoluzione corretta di asset e manifesti sia in caso di installazione con dominio personalizzato (es. `nfc.dominio-abbo.it/`), sia in caso di hosting su project site GitHub Pages (es. `username.github.io/ABBOAPS-SiteWeb/`).
