/**
 * Client API per la verifica delle tessere associative ABBO APS.
 */

export type MembershipResultState =
  | 'active'
  | 'membership_inactive'
  | 'suspended'
  | 'not_valid'
  | 'unavailable';

export interface MembershipMember {
  displayName: string;
}

export interface MembershipCardInfo {
  displayCode: string;
  issueYear?: number;
}

export interface MembershipValidity {
  validFrom?: string;
  validUntil?: string;
}

export interface TesseraApiResponse {
  result: MembershipResultState;
  member?: MembershipMember;
  card?: MembershipCardInfo;
  membership?: MembershipValidity;
}

export interface VerifyOptions {
  apiBaseUrl?: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

const DEFAULT_API_BASE = 'https://api.abboaps.org';
const DEFAULT_TIMEOUT_MS = 5000;

/**
 * Invia il bearer token all'API del gestionale ABBO APS via HTTPS POST.
 */
export async function verifyMembershipToken(
  token: string,
  options: VerifyOptions = {}
): Promise<TesseraApiResponse> {
  const envApiBase = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_MEMBERSHIP_API_BASE_URL : undefined;
  const baseUrl = (options.apiBaseUrl || envApiBase || DEFAULT_API_BASE).replace(/\/+$/, '');
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const fetchImpl = options.fetchFn || (typeof fetch !== 'undefined' ? fetch : undefined);

  if (!fetchImpl) {
    return { result: 'unavailable' };
  }

  const endpoint = `${baseUrl}/api/v1/membership-cards/verify`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ token }),
      signal: controller.signal,
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 503) {
        return { result: 'unavailable' };
      }
      if (response.status === 400 || response.status === 404) {
        return { result: 'not_valid' };
      }
      return { result: 'unavailable' };
    }

    const data = await response.json();
    return validateApiResponse(data);
  } catch (error: any) {
    clearTimeout(timeoutId);
    return { result: 'unavailable' };
  }
}

/**
 * Valida la struttura sintattica del payload JSON ricevuto dall'API.
 */
export function validateApiResponse(data: any): TesseraApiResponse {
  if (!data || typeof data !== 'object') {
    return { result: 'unavailable' };
  }

  const validResults: MembershipResultState[] = [
    'active',
    'membership_inactive',
    'suspended',
    'not_valid',
    'unavailable',
  ];

  if (!validResults.includes(data.result)) {
    return { result: 'unavailable' };
  }

  const result: TesseraApiResponse = {
    result: data.result,
  };

  if (data.result === 'active') {
    if (data.member && typeof data.member.displayName === 'string') {
      result.member = { displayName: data.member.displayName.trim() };
    }
  }

  if (data.result === 'active' || data.result === 'membership_inactive') {
    if (data.card && typeof data.card.displayCode === 'string') {
      result.card = {
        displayCode: data.card.displayCode.trim(),
        issueYear: typeof data.card.issueYear === 'number' ? data.card.issueYear : undefined,
      };
    }
    if (data.membership && typeof data.membership === 'object') {
      result.membership = {
        validFrom: typeof data.membership.validFrom === 'string' ? data.membership.validFrom : undefined,
        validUntil: typeof data.membership.validUntil === 'string' ? data.membership.validUntil : undefined,
      };
    }
  }

  return result;
}
