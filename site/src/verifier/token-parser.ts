/**
 * Parsing e validazione sintattica del token NFC `AB1.<kid>.<payload_b64>.<sig_b64>`
 */

export interface ParsedToken {
  tokenPrefix: string;
  kid: string;
  payloadB64: string;
  signatureB64: string;
  signedContentString: string;
}

export interface TokenParserOptions {
  /** Limite difensivo applicato prima di qualsiasi lavoro crittografico. */
  maxTokenLength?: number;
  maxPayloadBytes?: number;
}

export const DEFAULT_MAX_TOKEN_LENGTH = 2048;
export const DEFAULT_MAX_PAYLOAD_BYTES = 2048;

export function parseNfcToken(
  rawHashFragment: string,
  options: TokenParserOptions = {}
): ParsedToken {
  // Rimuovi eventuale '#' iniziale
  const tokenString = rawHashFragment.startsWith('#')
    ? rawHashFragment.slice(1)
    : rawHashFragment;

  if (!tokenString) {
    throw new Error('TOKEN_EMPTY');
  }

  if (tokenString !== tokenString.trim()) {
    throw new Error('TOKEN_INVALID_CHARACTERS');
  }

  const maxTokenLength = options.maxTokenLength ?? DEFAULT_MAX_TOKEN_LENGTH;
  const maxPayloadBytes = options.maxPayloadBytes ?? DEFAULT_MAX_PAYLOAD_BYTES;

  if (tokenString.length > maxTokenLength) {
    throw new Error('TOKEN_TOO_LARGE');
  }

  const parts = tokenString.split('.');
  if (parts.length !== 4) {
    throw new Error('TOKEN_MALFORMED_SEGMENTS');
  }

  const [prefix, kid, payloadB64, signatureB64] = parts;

  if (prefix !== 'AB1') {
    throw new Error('TOKEN_UNSUPPORTED_VERSION');
  }

  if (!kid || !/^[A-Za-z0-9_-]{3,32}$/.test(kid)) {
    throw new Error('TOKEN_INVALID_KID');
  }

  if (!payloadB64 || !/^[A-Za-z0-9_-]+$/.test(payloadB64)) {
    throw new Error('TOKEN_INVALID_PAYLOAD_B64');
  }

  // Base64URL senza padding non può avere una lunghezza residua pari a 1.
  // Il controllo evita che input malformati raggiungano atob/Web Crypto.
  if (payloadB64.length % 4 === 1) {
    throw new Error('TOKEN_INVALID_PAYLOAD_B64');
  }

  // Stima esatta dei byte decodificati per Base64URL senza padding.
  const payloadBytesLength = Math.floor((payloadB64.length * 6) / 8);
  if (payloadBytesLength > maxPayloadBytes) {
    throw new Error('TOKEN_PAYLOAD_TOO_LARGE');
  }

  if (!signatureB64 || !/^[A-Za-z0-9_-]{86}$/.test(signatureB64)) {
    throw new Error('TOKEN_INVALID_SIGNATURE_LENGTH');
  }

  // Stringa da verificare: ASCII("AB1." + kid + "." + payload_base64url)
  const signedContentString = `AB1.${kid}.${payloadB64}`;

  return {
    tokenPrefix: prefix,
    kid,
    payloadB64,
    signatureB64,
    signedContentString,
  };
}
