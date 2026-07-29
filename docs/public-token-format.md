# Specifiche del Protocollo Token AB1 e Firme ES256

## Formato del Token NFC

Il token scritto sul tag NFC segue il formato compatto in 4 segmenti separati da punti:

```text
AB1.<kid>.<payload_base64url>.<signature_base64url>
```

### 1. Prefisso di Versione (`AB1`)
Identifica la versione 1 del protocollo NFC prodotti ABBO APS.

### 2. Key Identifier (`kid`)
Identifica la chiave pubblica utilizzata per la firma (es. `k2026-01`), presente nel `keyring.json`.

### 3. Payload Base64URL (`payload_base64url`)
JSON compatto canonicalizzato in UTF-8 (chiavi ordinate lessicograficamente, nessun spazio superfluo, separatori `,` e `:`), codificato in Base64URL senza padding (`=`).

#### Struttura JSON Item:
```json
{
  "v": 1,
  "t": "p",
  "iss": "ABBO APS",
  "aud": "ABBO-PRODUCT-VERIFY-V1",
  "e": "ed_A7f4Kp9Qx2Lm8Vt3",
  "r": 1,
  "h": "SHA256_MANIFEST_BASE64URL",
  "s": 20,
  "n": 200,
  "i": "it_Bv8N2wQ5mR7xK4pC",
  "d": "2026-07-28"
}
```

Campi opzionali:
- `"p"`: Hash del codice fisico di abbinamento `Base64URL(SHA-256(edition_id + ":" + item_id + ":" + pairing_code))`

### 4. Firma Base64URL (`signature_base64url`)
Firma ECDSA P-256 SHA-256 (ES256) in formato **Raw `r || s`** da 64 byte (32 byte per `r` big-endian concatenati a 32 byte per `s` big-endian), codificata in Base64URL senza padding.

---

## Messaggio Firmato dall'Item

La firma copre esattamente i byte ASCII della stringa:

```text
AB1.<kid>.<payload_base64url>
```

---

## Formato della Busta del Manifesto Edizione

Percorso: `site/public/data/e/<edition-id>/<revision>.json`

```json
{
  "version": 1,
  "kid": "k2026-01",
  "payload": "BASE64URL_DEI_BYTE_JSON_DEL_MANIFESTO",
  "signature": "BASE64URL_DELLA_FIRMA_RAW_ES256"
}
```

La firma della busta copre esattamente la stringa ASCII:

```text
ABBO-EDITION-1.<kid>.<payload_base64url>
```

Il campo `"h"` dell'item NFC corrisponde a:

```text
h = Base64URL(SHA-256(manifest_payload_bytes))
```
