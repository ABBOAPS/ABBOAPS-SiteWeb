import { describe, it, expect } from 'vitest';
import { parseNfcToken } from '../src/verifier/token-parser';
import { base64UrlToUint8Array, uint8ArrayToBase64Url, encodeUtf8, decodeUtf8 } from '../src/crypto/base64url';

describe('Base64URL Utilities', () => {
  it('dovrebbe codificare e decodificare correttamente stringhe UTF-8', () => {
    const originalText = 'ABBO APS Poster 2026 — Verification Test';
    const bytes = encodeUtf8(originalText);
    const b64 = uint8ArrayToBase64Url(bytes);
    const decodedBytes = base64UrlToUint8Array(b64);
    const decodedText = decodeUtf8(decodedBytes);

    expect(decodedText).toBe(originalText);
  });
});

describe('Token Parser AB1', () => {
  it('dovrebbe parsare correttamente un token AB1 valido', () => {
    const rawToken = '#AB1.k2026-01.eyJ2IjoxfQ.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const parsed = parseNfcToken(rawToken);

    expect(parsed.tokenPrefix).toBe('AB1');
    expect(parsed.kid).toBe('k2026-01');
    expect(parsed.payloadB64).toBe('eyJ2IjoxfQ');
    expect(parsed.signatureB64.length).toBe(86);
    expect(parsed.signedContentString).toBe('AB1.k2026-01.eyJ2IjoxfQ');
  });

  it('dovrebbe rifiutare token senza suffisso o con segmenti errati', () => {
    expect(() => parseNfcToken('#AB1.k2026-01.segmentoIncompleto')).toThrow('TOKEN_MALFORMED_SEGMENTS');
    expect(() => parseNfcToken('#AB2.k2026-01.payload.signature')).toThrow('TOKEN_UNSUPPORTED_VERSION');
  });

  it('dovrebbe rifiutare token con firma di lunghezza errata', () => {
    expect(() => parseNfcToken('#AB1.k2026-01.payload.firmaTroppoCorta')).toThrow('TOKEN_INVALID_SIGNATURE_LENGTH');
  });
});
