import { sha256Bytes } from './web-crypto';
import { encodeUtf8 } from './base64url';

/** SHA-256 del token AB1 completo, primi 8 caratteri esadecimali uppercase. */
export async function fingerprintToken(token: string): Promise<string> {
  const digest = await sha256Bytes(encodeUtf8(token));
  const hex = Array.from(digest.slice(0, 4), (byte) => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}
