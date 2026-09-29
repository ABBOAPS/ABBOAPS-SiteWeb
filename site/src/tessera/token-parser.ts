/**
 * Utility per l'estrazione e la validazione del bearer token per la tessera associativa NFC.
 * Garantisce che il token sia rimosso immediatamente dall'URL per ragioni di privacy.
 */

export interface TokenExtractionResult {
  token: string | null;
  error: 'TOKEN_MISSING' | 'TOKEN_MALFORMED' | null;
}

/**
 * Legge il token dalla route canonica (`#/tessera/<TOKEN>`) o dall'alias legacy (`#card=<TOKEN>`), invalida/rimuove immediatamente l'hash dall'URL
 * con replaceState, e ne verifica la forma sintattica opaca.
 */
export function readAndRemoveCardToken(rawHash?: string): TokenExtractionResult {
  const hash = rawHash !== undefined ? rawHash : (typeof window !== 'undefined' ? window.location.hash : '');

  // Inizia la pulizia dell'URL nel browser se stiamo leggendo l'hash globale
  if (rawHash === undefined && typeof window !== 'undefined' && window.location && window.history) {
    if (window.location.hash) {
      try {
        const cleanUrl = window.location.pathname + window.location.search;
        window.history.replaceState(null, '', cleanUrl);
      } catch {
        // Fallback per ambienti restrittivi
        try {
          window.location.hash = '';
        } catch {
          // Ignora errori di storage/navigation
        }
      }
    }
  }

  if (!hash || hash === '#' || hash === '') {
    return { token: null, error: 'TOKEN_MISSING' };
  }

  // La route canonica usa #/tessera/<TOKEN>; mantieni #card= per i link già distribuiti.
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const pathToken = cleanHash.match(/^\/tessera\/([^/?#]+)/)?.[1];
  const queryString = cleanHash.includes('?') ? cleanHash.slice(cleanHash.indexOf('?') + 1) : cleanHash;
  const queryToken = new URLSearchParams(queryString).get('card');
  const rawToken = pathToken || queryToken;

  if (!rawToken) {
    return { token: null, error: 'TOKEN_MALFORMED' };
  }

  let decodedToken: string;
  try {
    decodedToken = decodeURIComponent(rawToken).trim();
  } catch {
    return { token: null, error: 'TOKEN_MALFORMED' };
  }

  if (!isValidTokenShape(decodedToken)) {
    return { token: null, error: 'TOKEN_MALFORMED' };
  }

  return { token: decodedToken, error: null };
}

/**
 * Verifica la forma opaca del token opaco (lunghezza tra 16 e 128 caratteri URL-safe).
 */
export function isValidTokenShape(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  if (token.length < 16 || token.length > 128) return false;
  // Caratteri permessi: A-Z, a-z, 0-9, dash, underscore, tilde
  return /^[A-Za-z0-9_\-~]+$/.test(token);
}
