import { describe, expect, it } from 'vitest';
import {
  buildLegacyVerificationRedirectUrl,
  buildLimitedVerificationCleanUrl,
  buildLimitedVerificationUrl,
  readVerificationTokenFromHash,
} from '../src/verifier/verification-url';

const validToken = 'AB1.k2099-01-test.eyJ2IjoxfQ.' + 'A'.repeat(86);

describe('URL pubblici di verifica edizioni limitate', () => {
  it('genera la route canonica con il token firmato completo', () => {
    const url = buildLimitedVerificationUrl(validToken);

    expect(url).toBe(`https://abboaps.org/#/limited/${validToken}`);
    expect(url).not.toContain('sha256');
  });

  it('rifiuta token oltre il limite o non URL-safe', () => {
    expect(() => buildLimitedVerificationUrl(`${validToken}!`)).toThrow('TOKEN_INVALID');
    expect(() => buildLimitedVerificationUrl(`AB1.k2099-01-test.${'A'.repeat(2049)}.${'A'.repeat(86)}`)).toThrow('TOKEN_');
  });

  it('legge la nuova route, il token assente e l\'alias legacy', () => {
    expect(readVerificationTokenFromHash(`#/limited/${encodeURIComponent(validToken)}`)).toBe(validToken);
    expect(readVerificationTokenFromHash('#/limited')).toBeUndefined();
    expect(readVerificationTokenFromHash('#/limited/')).toBeUndefined();
    expect(readVerificationTokenFromHash(`#${validToken}`)).toBe(validToken);
  });

  it('inoltra l\'alias NFC valido alla route canonica senza cambiare token', () => {
    expect(buildLegacyVerificationRedirectUrl(`#${validToken}`)).toBe(`https://abboaps.org/#/limited/${validToken}`);
    expect(buildLegacyVerificationRedirectUrl(`#/limited/${validToken}`)).toBeUndefined();
    expect(buildLegacyVerificationRedirectUrl('#AB1.invalid')).toBeUndefined();
  });

  it('prepara la sostituzione della cronologia senza il token', () => {
    expect(buildLimitedVerificationCleanUrl('/', '')).toBe('/#/limited');
    expect(buildLimitedVerificationCleanUrl('/ABBOAPS-SiteWeb/', '?lang=it')).toBe('/ABBOAPS-SiteWeb/?lang=it#/limited');
  });
});
