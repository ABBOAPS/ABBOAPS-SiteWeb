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

const KID_PATTERN = /^k[0-9]{4}-[0-9]{2}(?:-[A-Za-z0-9_-]{1,16})?$/;
const EDITION_ID_PATTERN = /^ed_[A-Za-z0-9_-]{16,64}$/;
const ITEM_ID_PATTERN = /^it_[A-Za-z0-9_-]{16,64}$/;
const BASE64URL_32_PATTERN = /^[A-Za-z0-9_-]{43}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isValidDateTime(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 64 && !Number.isNaN(Date.parse(value));
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function validateJwk(value: unknown): JwkPublicKey {
  if (!isRecord(value) || !hasOnlyKeys(value, ['kty', 'crv', 'x', 'y', 'ext', 'key_ops'])) {
    throw new Error('KEYRING_INVALID');
  }
  if (
    value.kty !== 'EC' ||
    value.crv !== 'P-256' ||
    value.ext !== true ||
    !BASE64URL_32_PATTERN.test(String(value.x)) ||
    !BASE64URL_32_PATTERN.test(String(value.y)) ||
    !Array.isArray(value.key_ops) ||
    value.key_ops.length !== 1 ||
    value.key_ops[0] !== 'verify'
  ) {
    throw new Error('KEYRING_INVALID');
  }
  return value as unknown as JwkPublicKey;
}

export function validateKeyring(value: unknown): Keyring {
  if (!isRecord(value) || !hasOnlyKeys(value, ['schemaVersion', 'keys']) || value.schemaVersion !== 1 || !Array.isArray(value.keys) || value.keys.length < 1) {
    throw new Error('KEYRING_INVALID');
  }

  const seenKids = new Set<string>();
  const keys = value.keys.map((rawKey): KeyringKey => {
    if (!isRecord(rawKey) || !hasOnlyKeys(rawKey, ['kid', 'alg', 'status', 'createdAt', 'jwk'])) {
      throw new Error('KEYRING_INVALID');
    }
    if (
      typeof rawKey.kid !== 'string' ||
      !KID_PATTERN.test(rawKey.kid) ||
      rawKey.kid.length > 32 ||
      rawKey.alg !== 'ES256' ||
      !['active', 'retired', 'compromised'].includes(String(rawKey.status)) ||
      !isValidDateTime(rawKey.createdAt) ||
      seenKids.has(rawKey.kid)
    ) {
      throw new Error('KEYRING_INVALID');
    }
    seenKids.add(rawKey.kid);
    return {
      kid: rawKey.kid,
      alg: 'ES256',
      status: rawKey.status as KeyringKey['status'],
      createdAt: rawKey.createdAt,
      jwk: validateJwk(rawKey.jwk),
    };
  });

  return { schemaVersion: 1, keys };
}

export function validateProductItemPayload(value: unknown): ProductItemPayload {
  if (!isRecord(value) || !hasOnlyKeys(value, ['v', 't', 'iss', 'aud', 'e', 'r', 'h', 's', 'n', 'i', 'd', 'p'])) {
    throw new Error('PAYLOAD_INVALID_SCHEMA');
  }
  if (
    value.v !== 1 ||
    value.t !== 'p' ||
    value.iss !== 'ABBO APS' ||
    value.aud !== 'ABBO-PRODUCT-VERIFY-V1' ||
    typeof value.e !== 'string' || !EDITION_ID_PATTERN.test(value.e) || value.e.length > 67 ||
    !isIntegerInRange(value.r, 1, 2147483647) ||
    typeof value.h !== 'string' || !BASE64URL_32_PATTERN.test(value.h) ||
    !isIntegerInRange(value.s, 1, 1000000) ||
    !isIntegerInRange(value.n, 1, 1000000) ||
    value.s > value.n ||
    typeof value.i !== 'string' || !ITEM_ID_PATTERN.test(value.i) || value.i.length > 67 ||
    !isValidDate(value.d) ||
    (value.p !== undefined && (typeof value.p !== 'string' || !BASE64URL_32_PATTERN.test(value.p)))
  ) {
    throw new Error('PAYLOAD_INVALID_SCHEMA');
  }
  return value as unknown as ProductItemPayload;
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
  return validateKeyring(await response.json());
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
  let payloadJson: unknown;
  try {
    payloadJson = JSON.parse(jsonText);
  } catch {
    throw new Error('PAYLOAD_INVALID_JSON');
  }
  const payload = validateProductItemPayload(payloadJson);

  return {
    valid: true,
    keyStatus: keyEntry.status,
    payload,
    rawPayloadBytes,
  };
}
