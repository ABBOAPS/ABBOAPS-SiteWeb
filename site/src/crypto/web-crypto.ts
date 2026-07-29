/**
 * Wrapper per Web Crypto API (ECDSA P-256 SHA-256 / ES256).
 */

export interface JwkPublicKey {
  kty: string;
  crv: string;
  x: string;
  y: string;
  ext: boolean;
  key_ops: string[];
}

/**
 * Importa una chiave pubblica JWK P-256 per la verifica.
 */
export async function importJwkPublicKey(jwk: JwkPublicKey): Promise<CryptoKey> {
  if (jwk.kty !== 'EC' || jwk.crv !== 'P-256') {
    throw new Error('Formato chiave JWK non valido o algoritmo non supportato');
  }

  return await crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['verify']
  );
}

/**
 * Verifica una firma ECDSA ES256 in formato raw r || s (64 byte).
 */
export async function verifyEcdsaEs256(
  cryptoKey: CryptoKey,
  rawSignatureBytes: Uint8Array,
  signedDataBytes: Uint8Array
): Promise<boolean> {
  // Rifiuta categoricamente qualsiasi firma la cui lunghezza non sia esattamente 64 byte
  if (rawSignatureBytes.length !== 64) {
    return false;
  }

  const sigBuffer = rawSignatureBytes.buffer.slice(
    rawSignatureBytes.byteOffset,
    rawSignatureBytes.byteOffset + rawSignatureBytes.byteLength
  ) as ArrayBuffer;

  const dataBuffer = signedDataBytes.buffer.slice(
    signedDataBytes.byteOffset,
    signedDataBytes.byteOffset + signedDataBytes.byteLength
  ) as ArrayBuffer;

  return await crypto.subtle.verify(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    cryptoKey,
    sigBuffer,
    dataBuffer
  );
}

/**
 * Calcola l'hash SHA-256 di un array di byte.
 */
export async function sha256Bytes(dataBytes: Uint8Array): Promise<Uint8Array> {
  const dataBuffer = dataBytes.buffer.slice(
    dataBytes.byteOffset,
    dataBytes.byteOffset + dataBytes.byteLength
  ) as ArrayBuffer;

  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return new Uint8Array(hashBuffer);
}
