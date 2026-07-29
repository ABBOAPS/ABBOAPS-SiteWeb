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

export function parseNfcToken(rawHashFragment: string): ParsedToken {
  // Rimuovi eventuale '#' iniziale
  const tokenString = rawHashFragment.startsWith('#')
    ? rawHashFragment.slice(1).trim()
    : rawHashFragment.trim();

  if (!tokenString) {
    throw new Error('TOKEN_EMPTY');
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
