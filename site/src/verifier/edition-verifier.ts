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

  const envelope: EditionEnvelope = await response.json();

  if (envelope.format !== 'ABBO-EDITION-1') {
    throw new Error('MANIFEST_FORMAT_UNSUPPORTED');
  }

  const keyEntry = keyring.keys.find((k) => k.kid === envelope.kid);
  if (!keyEntry) {
    throw new Error('MANIFEST_KEY_UNKNOWN');
  }

  const signedString = `ABBO-EDITION-1.${envelope.kid}.${envelope.payload}`;
  const signedDataBytes = encodeUtf8(signedString);
  const rawSignatureBytes = base64UrlToUint8Array(envelope.signature);

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

  const editionPayload: EditionPayload = JSON.parse(decodeUtf8(manifestPayloadBytes));

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

      if (imgRes.ok) {
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
