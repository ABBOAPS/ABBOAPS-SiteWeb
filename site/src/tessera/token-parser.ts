/**
 * Utility per l'estrazione e la validazione del bearer token per la tessera associativa NFC.
 * Garantisce che il token sia rimosso immediatamente dall'URL per ragioni di privacy.
 */

export interface TokenExtractionResult {
  token: string | null;
  error: 'TOKEN_MISSING' | 'TOKEN_MALFORMED' | null;
}

/**
 * Legge il token dal frammento URL (`#card=<TOKEN>`), invalida/rimuove immediatamente l'hash dall'URL
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

  // Cerca il prefisso #card= o card=
  const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
  const match = cleanHash.match(/(?:^|&)card=([^&]+)/);

  if (!match || !match[1]) {
    return { token: null, error: 'TOKEN_MALFORMED' };
  }

  const rawToken = match[1].trim();

  if (!isValidTokenShape(rawToken)) {
    return { token: null, error: 'TOKEN_MALFORMED' };
  }

  return { token: rawToken, error: null };
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
