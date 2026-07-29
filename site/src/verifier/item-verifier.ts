import { base64UrlToUint8Array, decodeUtf8, encodeUtf8 } from '../crypto/base64url';
import { importJwkPublicKey, JwkPublicKey, verifyEcdsaEs256 } from '../crypto/web-crypto';
import { ParsedToken } from './token-parser';

export interface KeyringKey {
  kid: string;
  alg: string;
  status: 'active' | 'retired' | 'compromised';
  createdAt: string;
  jwk: JwkPublicKey;
}

export interface Keyring {
  schemaVersion: number;
  keys: KeyringKey[];
}

export interface ProductItemPayload {
  v: number;
  t: 'p';
  iss: string;
  aud: string;
  e: string;
  r: number;
  h: string;
  s: number;
  n: number;
  i: string;
  d: string;
  p?: string;
}

export interface ItemVerificationResult {
  valid: boolean;
  keyStatus: 'active' | 'retired' | 'compromised';
  payload: ProductItemPayload;
  rawPayloadBytes: Uint8Array;
}

/**
 * Recupera il keyring dal server statico (utilizzando cache: "no-store" per evitare keyring obsoleti).
 */
export async function fetchKeyring(baseUrl: string): Promise<Keyring> {
  const url = `${baseUrl}data/keyring.json`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('KEYRING_FETCH_FAILED');
  }
  return await response.json();
}

/**
 * Esegue la verifica crittografica e semantica del token dell'item.
 */
export async function verifyItemToken(
  parsedToken: ParsedToken,
  keyring: Keyring
): Promise<ItemVerificationResult> {
  const keyEntry = keyring.keys.find((k) => k.kid === parsedToken.kid);
  if (!keyEntry) {
    throw new Error('KEY_UNKNOWN');
  }

  const rawSignatureBytes = base64UrlToUint8Array(parsedToken.signatureB64);
  if (rawSignatureBytes.length !== 64) {
    throw new Error('SIGNATURE_INVALID_LENGTH');
  }

  const cryptoKey = await importJwkPublicKey(keyEntry.jwk);
  const signedDataBytes = encodeUtf8(parsedToken.signedContentString);

  const isSignatureValid = await verifyEcdsaEs256(cryptoKey, rawSignatureBytes, signedDataBytes);

  if (!isSignatureValid) {
    throw new Error('SIGNATURE_INVALID');
  }

  const rawPayloadBytes = base64UrlToUint8Array(parsedToken.payloadB64);
  const jsonText = decodeUtf8(rawPayloadBytes);
  const payload: ProductItemPayload = JSON.parse(jsonText);

  // Validazione semantica dei campi
  if (payload.v !== 1) throw new Error('PAYLOAD_INVALID_VERSION');
  if (payload.t !== 'p') throw new Error('PAYLOAD_INVALID_TYPE');
  if (payload.iss !== 'ABBO APS') throw new Error('PAYLOAD_INVALID_ISSUER');
  if (payload.aud !== 'ABBO-PRODUCT-VERIFY-V1') throw new Error('PAYLOAD_INVALID_AUDIENCE');
  if (typeof payload.s !== 'number' || payload.s < 1) throw new Error('PAYLOAD_INVALID_SERIAL');
  if (typeof payload.n !== 'number' || payload.n < 1) throw new Error('PAYLOAD_INVALID_TOTAL');
  if (payload.s > payload.n) throw new Error('PAYLOAD_SERIAL_EXCEEDS_TOTAL');
  if (!payload.e || !payload.h || !payload.i) throw new Error('PAYLOAD_MISSING_REQUIRED_FIELDS');

  return {
    valid: true,
    keyStatus: keyEntry.status,
    payload,
    rawPayloadBytes,
  };
}
