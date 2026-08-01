import { base64UrlToUint8Array, decodeUtf8, encodeUtf8, uint8ArrayToBase64Url } from '../crypto/base64url';
import { importJwkPublicKey, sha256Bytes, verifyEcdsaEs256 } from '../crypto/web-crypto';
import { Keyring, ProductItemPayload } from './item-verifier';

export interface EditionEnvelope {
  format: 'ABBO-EDITION-1';
  kid: string;
  payload: string;
  signature: string;
}

export interface EditionPayload {
  v: number;
  t: 'edition';
  iss: string;
  aud: string;
  e: string;
  r: number;
  code: string;
  title: string;
  description: string;
  n: number;
  releaseDate: string;
  image: {
    path: string;
    sha256: string;
    alt: string;
  };
  physicalSerialRequired: boolean;
  createdAt: string;
}

export interface VerifiedEditionResult {
  valid: boolean;
  editionPayload: EditionPayload;
  manifestEnvelope: EditionEnvelope;
  verifiedImageBlobUrl?: string;
}

const KID_PATTERN = /^k[0-9]{4}-[0-9]{2}(?:-[A-Za-z0-9_-]{1,16})?$/;
const EDITION_ID_PATTERN = /^ed_[A-Za-z0-9_-]{16,64}$/;
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const SIGNATURE_PATTERN = /^[A-Za-z0-9_-]{86}$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(value).every((key) => keys.includes(key));
}

function isIntegerInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isDateTime(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 64 && !Number.isNaN(Date.parse(value));
}

export function validateEditionEnvelope(value: unknown): EditionEnvelope {
  if (!isRecord(value) || !hasOnlyKeys(value, ['format', 'kid', 'payload', 'signature'])) {
    throw new Error('MANIFEST_INVALID_SCHEMA');
  }
  if (
    value.format !== 'ABBO-EDITION-1' ||
    typeof value.kid !== 'string' || !KID_PATTERN.test(value.kid) || value.kid.length > 32 ||
    typeof value.payload !== 'string' || !BASE64URL_PATTERN.test(value.payload) || value.payload.length < 16 || value.payload.length > 8192 || value.payload.length % 4 === 1 ||
    typeof value.signature !== 'string' || !SIGNATURE_PATTERN.test(value.signature)
  ) {
    throw new Error('MANIFEST_INVALID_SCHEMA');
  }
  return value as unknown as EditionEnvelope;
}

export function validateEditionPayload(value: unknown): EditionPayload {
  if (!isRecord(value) || !hasOnlyKeys(value, ['v', 't', 'iss', 'aud', 'e', 'r', 'code', 'title', 'description', 'n', 'releaseDate', 'image', 'physicalSerialRequired', 'createdAt'])) {
    throw new Error('MANIFEST_INVALID_SCHEMA');
  }
  const image = value.image;
  if (!isRecord(image) || !hasOnlyKeys(image, ['path', 'sha256', 'alt'])) {
    throw new Error('MANIFEST_INVALID_SCHEMA');
  }
  if (
    value.v !== 1 || value.t !== 'edition' || value.iss !== 'ABBO APS' || value.aud !== 'ABBO-PRODUCT-VERIFY-V1' ||
    typeof value.e !== 'string' || !EDITION_ID_PATTERN.test(value.e) || value.e.length > 67 ||
    !isIntegerInRange(value.r, 1, 2147483647) ||
    typeof value.code !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._-]{1,63}$/.test(value.code) ||
    typeof value.title !== 'string' || value.title.length < 1 || value.title.length > 160 ||
    typeof value.description !== 'string' || value.description.length < 1 || value.description.length > 2000 ||
    !isIntegerInRange(value.n, 1, 1000000) ||
    !isDate(value.releaseDate) ||
    typeof value.physicalSerialRequired !== 'boolean' ||
    !isDateTime(value.createdAt) ||
    typeof image.path !== 'string' || !/^\/assets\/products\/ed_[A-Za-z0-9_-]{16,64}\/[A-Za-z0-9._-]+$/.test(image.path) || image.path.length > 300 ||
    typeof image.sha256 !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(image.sha256) ||
    typeof image.alt !== 'string' || image.alt.length < 1 || image.alt.length > 300
  ) {
    throw new Error('MANIFEST_INVALID_SCHEMA');
  }
  return value as unknown as EditionPayload;
}

/**
 * Fetch e verifica del manifesto dell'edizione e dell'immagine autenticata.
 */
export async function verifyEditionManifest(
  itemPayload: ProductItemPayload,
  keyring: Keyring,
  baseUrl: string
): Promise<VerifiedEditionResult> {
  const editionId = itemPayload.e;
  const revision = itemPayload.r;

  // Protezione path traversal: pattern esatto per l'edition ID
  if (!/^ed_[A-Za-z0-9_-]{16,64}$/.test(editionId)) {
    throw new Error('EDITION_ID_MALFORMED');
  }

  if (typeof revision !== 'number' || revision < 1) {
    throw new Error('REVISION_INVALID');
  }

  const manifestUrl = `${baseUrl}data/e/${editionId}/${revision}.json`;

  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error('MANIFEST_NOT_FOUND');
  }

  const envelope = validateEditionEnvelope(await response.json());

  const keyEntry = keyring.keys.find((k) => k.kid === envelope.kid);
  if (!keyEntry) {
    throw new Error('MANIFEST_KEY_UNKNOWN');
  }
  if (keyEntry.status === 'compromised') {
    throw new Error('MANIFEST_KEY_COMPROMISED');
  }

  const signedString = `ABBO-EDITION-1.${envelope.kid}.${envelope.payload}`;
  const signedDataBytes = encodeUtf8(signedString);
  const rawSignatureBytes = base64UrlToUint8Array(envelope.signature);
  if (rawSignatureBytes.length !== 64) {
    throw new Error('MANIFEST_SIGNATURE_INVALID');
  }

  const cryptoKey = await importJwkPublicKey(keyEntry.jwk);
  const isSignatureValid = await verifyEcdsaEs256(cryptoKey, rawSignatureBytes, signedDataBytes);

  if (!isSignatureValid) {
    throw new Error('MANIFEST_SIGNATURE_INVALID');
  }

  const manifestPayloadBytes = base64UrlToUint8Array(envelope.payload);
  const computedHashBytes = await sha256Bytes(manifestPayloadBytes);
  const computedHashB64 = uint8ArrayToBase64Url(computedHashBytes);

  if (computedHashB64 !== itemPayload.h) {
    throw new Error('MANIFEST_HASH_MISMATCH');
  }

  let editionJson: unknown;
  try {
    editionJson = JSON.parse(decodeUtf8(manifestPayloadBytes));
  } catch {
    throw new Error('MANIFEST_INVALID_JSON');
  }
  const editionPayload = validateEditionPayload(editionJson);

  if (editionPayload.e !== itemPayload.e) throw new Error('MANIFEST_FIELD_MISMATCH_EDITION');
  if (editionPayload.r !== itemPayload.r) throw new Error('MANIFEST_FIELD_MISMATCH_REVISION');
  if (editionPayload.n !== itemPayload.n) throw new Error('MANIFEST_FIELD_MISMATCH_TOTAL');
  if (editionPayload.iss !== itemPayload.iss) throw new Error('MANIFEST_FIELD_MISMATCH_ISSUER');
  if (editionPayload.aud !== itemPayload.aud) throw new Error('MANIFEST_FIELD_MISMATCH_AUDIENCE');

  // Verification dell'immagine autenticata (SHA-256 dei byte)
  let verifiedImageBlobUrl: string | undefined = undefined;

  if (editionPayload.image && editionPayload.image.path) {
    try {
      // Normalizza percorso immagine eliminando eventuale slash iniziale
      const imgRelPath = editionPayload.image.path.startsWith('/')
        ? editionPayload.image.path.slice(1)
        : editionPayload.image.path;
      
      const fullImgUrl = `${baseUrl}${imgRelPath}`;
      const imgRes = await fetch(fullImgUrl);

      if (!imgRes.ok) {
        throw new Error('IMAGE_NOT_FOUND');
      }

      const imgBuffer = await imgRes.arrayBuffer();
      const imgBytes = new Uint8Array(imgBuffer);
      const imgHashBytes = await sha256Bytes(imgBytes);
      const imgHashB64 = uint8ArrayToBase64Url(imgHashBytes);

      if (imgHashB64 === editionPayload.image.sha256) {
        const blob = new Blob([imgBuffer], { type: 'image/webp' });
        verifiedImageBlobUrl = URL.createObjectURL(blob);
      } else {
        console.warn('⚠️ Immagine alterata o hash non coincidente:', imgHashB64, 'vs', editionPayload.image.sha256);
        throw new Error('IMAGE_INVALID_HASH');
      }
    } catch (imgErr) {
      console.warn('⚠️ Errore durante la verifica dell\'immagine autenticata:', imgErr);
      throw new Error('IMAGE_INVALID');
    }
  }

  return {
    valid: true,
    editionPayload,
    manifestEnvelope: envelope,
    verifiedImageBlobUrl,
  };
}
