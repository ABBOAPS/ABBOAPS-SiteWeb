import { parseNfcToken } from './token-parser';

export const PUBLIC_SITE_URL = 'https://abboaps.org';
export const LIMITED_VERIFICATION_PATH = '/#/limited';

export function buildLimitedVerificationCleanUrl(pathname: string, search: string): string {
  return `${pathname}${search}#/limited`;
}

/**
 * Costruisce l'unico formato pubblico canonico per la verifica delle edizioni limitate.
 * Il token firmato completo viene validato prima di essere inserito nell'URL.
 */
export function buildLimitedVerificationUrl(token: string): string {
  const parsed = parseNfcToken(token);
  const canonicalToken = `AB1.${parsed.kid}.${parsed.payloadB64}.${parsed.signatureB64}`;
  if (token !== canonicalToken) {
    throw new Error('TOKEN_NOT_CANONICAL');
  }
  return `${PUBLIC_SITE_URL}${LIMITED_VERIFICATION_PATH}/${encodeURIComponent(token)}`;
}

/**
 * Estrae il token dalla nuova route HashRouter o dalla vecchia route NFC.
 * Il valore restituito vive solo nella memoria del chiamante.
 */
export function readVerificationTokenFromHash(hash: string): string | undefined {
  if (!hash || hash === '#') return undefined;

  if (hash === '#/limited' || hash === '#/limited/') return undefined;

  if (hash.startsWith('#/limited/')) {
    const encodedToken = hash.slice('#/limited/'.length);
    if (!encodedToken || encodedToken.includes('/')) return encodedToken;

    try {
      return decodeURIComponent(encodedToken);
    } catch {
      return encodedToken;
    }
  }

  // Alias compatibile per gli URL già scritti sui tag NFC: /nfc/#AB1....
  return hash.startsWith('#') ? hash.slice(1) : hash;
}
