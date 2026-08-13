import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readAndRemoveCardToken, isValidTokenShape } from '../src/tessera/token-parser';
import { validateApiResponse, verifyMembershipToken } from '../src/tessera/api-client';
import { isValidLinkUrl } from '../src/tessera/link-tree';
import { formatItalianDate } from '../src/tessera/render';

describe('Tessera Token Parser', () => {
  it('dovrebbe estrarre un bearer token opaco valido dal frammento URL', () => {
    const rawHash = '#card=QJ8pL8pc4n2xM4m3-6LQv-wkL6MVzW2X7U35O7utnN4';
    const result = readAndRemoveCardToken(rawHash);

    expect(result.error).toBeNull();
    expect(result.token).toBe('QJ8pL8pc4n2xM4m3-6LQv-wkL6MVzW2X7U35O7utnN4');
  });

  it('dovrebbe segnalare TOKEN_MISSING se il frammento è vuoto', () => {
    expect(readAndRemoveCardToken('').error).toBe('TOKEN_MISSING');
    expect(readAndRemoveCardToken('#').error).toBe('TOKEN_MISSING');
  });

  it('dovrebbe segnalare TOKEN_MALFORMED se il parametro card= non è presente', () => {
    expect(readAndRemoveCardToken('#token=12345678901234567890').error).toBe('TOKEN_MALFORMED');
  });

  it('dovrebbe rifiutare token con caratteri non consentiti o lunghezza errata', () => {
    expect(isValidTokenShape('short')).toBe(false);
    expect(isValidTokenShape('token_con_spazi_e_caratteri_speciali!@#$%^&*()')).toBe(false);
    expect(isValidTokenShape('QJ8pL8pc4n2xM4m3-6LQv-wkL6MVzW2X7U35O7utnN4')).toBe(true);
  });
});

describe('API Client e Validatore Risposte API', () => {
  it('dovrebbe validare correttamente uno stato active con dati del socio', () => {
    const rawData = {
      result: 'active',
      member: { displayName: 'Mario Rossi' },
      card: { displayCode: 'ABBO-2026-0042', issueYear: 2026 },
      membership: { validFrom: '2026-07-15', validUntil: '2027-07-14' },
    };

    const validated = validateApiResponse(rawData);

    expect(validated.result).toBe('active');
    expect(validated.member?.displayName).toBe('Mario Rossi');
    expect(validated.card?.displayCode).toBe('ABBO-2026-0042');
    expect(validated.membership?.validUntil).toBe('2027-07-14');
  });

  it('dovrebbe supportare il nuovo contratto API (card.code, card.issuedYear, member.memberNumber)', () => {
    const rawData = {
      result: 'active',
      member: { displayName: 'Mario Rossi', memberNumber: 42 },
      membership: { status: 'active', validUntil: '2029-12-31' },
      card: { status: 'active', code: 'ABBO-2026-0042', issuedYear: 2026 },
    };

    const validated = validateApiResponse(rawData);
    expect(validated.result).toBe('active');
    expect(validated.member?.displayName).toBe('Mario Rossi');
    expect(validated.member?.memberNumber).toBe(42);
    expect(validated.card?.code).toBe('ABBO-2026-0042');
    expect(validated.card?.issuedYear).toBe(2026);
    expect(validated.membership?.validUntil).toBe('2029-12-31');
  });

  it('dovrebbe gestire un socio senza card dove card è null o assente', () => {
    const rawData = {
      result: 'active',
      member: { displayName: 'Luca Bianchi', memberNumber: 15 },
      membership: { status: 'active', validUntil: '2028-12-31' },
      card: null,
    };

    const validated = validateApiResponse(rawData);
    expect(validated.result).toBe('active');
    expect(validated.member?.displayName).toBe('Luca Bianchi');
    expect(validated.card).toBeUndefined();
  });

  it('dovrebbe validare lo stato membership_inactive ed escludere dati personali se forniti errati', () => {
    const rawData = {
      result: 'membership_inactive',
      member: { displayName: 'Nome Non Mostrato' },
      card: { displayCode: 'ABBO-2026-0042', issueYear: 2026 },
    };

    const validated = validateApiResponse(rawData);

    expect(validated.result).toBe('membership_inactive');
    expect(validated.member).toBeUndefined();
    expect(validated.card?.displayCode).toBe('ABBO-2026-0042');
  });

  it('dovrebbe mappare risposte suspended e not_valid senza dati accessori', () => {
    expect(validateApiResponse({ result: 'suspended' }).result).toBe('suspended');
    expect(validateApiResponse({ result: 'not_valid' }).result).toBe('not_valid');
  });

  it('dovrebbe convertire risposte sconosciute o malformate in unavailable', () => {
    expect(validateApiResponse(null).result).toBe('unavailable');
    expect(validateApiResponse({ result: 'unknown_state' }).result).toBe('unavailable');
    expect(validateApiResponse('non json').result).toBe('unavailable');
  });

  it('dovrebbe gestire la chiamata fetch con successo', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: 'active',
        member: { displayName: 'Giuseppe Verdi' },
      }),
    });

    const res = await verifyMembershipToken('test_token_1234567890', {
      apiBaseUrl: 'https://api.test.abboaps.org',
      fetchFn: mockFetch as any,
    });

    expect(res.result).toBe('active');
    expect(res.member?.displayName).toBe('Giuseppe Verdi');
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.test.abboaps.org/api/v1/membership-cards/verify',
      expect.objectContaining({
        method: 'POST',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
      })
    );
  });

  it('dovrebbe gestire errori HTTP 503 ed errori di rete con result: unavailable', async () => {
    const mockFetch503 = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    const res503 = await verifyMembershipToken('test_token_1234567890', {
      fetchFn: mockFetch503 as any,
    });
    expect(res503.result).toBe('unavailable');

    const mockFetchNetworkError = vi.fn().mockRejectedValue(new Error('Network error'));
    const resNetErr = await verifyMembershipToken('test_token_1234567890', {
      fetchFn: mockFetchNetworkError as any,
    });
    expect(resNetErr.result).toBe('unavailable');
  });
});

describe('Sicurezza Link Tree Galleria', () => {
  it('dovrebbe consentire esclusivamente i protocolli https: e mailto:', () => {
    expect(isValidLinkUrl('https://www.instagram.com/abboaps/')).toBe(true);
    expect(isValidLinkUrl('https://www.linkedin.com/company/abboaps/')).toBe(true);
    expect(isValidLinkUrl('https://www.tiktok.com/@abbo.aps')).toBe(true);
    expect(isValidLinkUrl('https://discord.gg/HDuD3tCvus')).toBe(true);
    expect(isValidLinkUrl('https://www.abboaps.org/privacy-policy')).toBe(true);
    expect(isValidLinkUrl('mailto:info@abboaps.org')).toBe(true);
    expect(isValidLinkUrl('https://evil.example/phishing')).toBe(false);
    expect(isValidLinkUrl('mailto:attacker@example.com')).toBe(false);

    expect(isValidLinkUrl('http://insecure-site.com')).toBe(false);
    expect(isValidLinkUrl('javascript:alert(1)')).toBe(false);
    expect(isValidLinkUrl('data:text/html,hack')).toBe(false);
    expect(isValidLinkUrl('file:///etc/passwd')).toBe(false);
  });
});

describe('Formatting Date Italiane', () => {
  it('dovrebbe formattare correttamente la data ISO in italiano', () => {
    expect(formatItalianDate('2027-07-14')).toBe('14 luglio 2027');
    expect(formatItalianDate('2026-01-01')).toBe('1 gennaio 2026');
    expect(formatItalianDate('data-non-valida')).toBe('data-non-valida');
    expect(formatItalianDate(undefined)).toBeNull();
  });
});

describe('Controlli Privacy & Storage', () => {
  it('non dovrebbe salvare alcun dato o token in localStorage o sessionStorage', () => {
    // Simula token check
    readAndRemoveCardToken('#card=QJ8pL8pc4n2xM4m3-6LQv-wkL6MVzW2X7U35O7utnN4');

    const getLocal = (key: string) => (typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null);
    const getSession = (key: string) => (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(key) : null);

    expect(getLocal('token')).toBeNull();
    expect(getLocal('card')).toBeNull();
    expect(getSession('token')).toBeNull();
    expect(getSession('card')).toBeNull();
  });
});
