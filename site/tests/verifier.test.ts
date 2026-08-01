import { describe, it, expect, vi } from 'vitest';
import { parseNfcToken } from '../src/verifier/token-parser';
import { base64UrlToUint8Array, uint8ArrayToBase64Url, encodeUtf8, decodeUtf8 } from '../src/crypto/base64url';
import { validateProductItemPayload } from '../src/verifier/item-verifier';
import { validateEditionEnvelope, validateEditionPayload, verifyEditionManifest } from '../src/verifier/edition-verifier';

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
    const rawToken = '#AB1.k2099-01-test.eyJ2IjoxfQ.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
    const parsed = parseNfcToken(rawToken);

    expect(parsed.tokenPrefix).toBe('AB1');
    expect(parsed.kid).toBe('k2099-01-test');
    expect(parsed.payloadB64).toBe('eyJ2IjoxfQ');
    expect(parsed.signatureB64.length).toBe(86);
    expect(parsed.signedContentString).toBe('AB1.k2099-01-test.eyJ2IjoxfQ');
  });

  it('dovrebbe rifiutare token senza suffisso o con segmenti errati', () => {
    expect(() => parseNfcToken('#AB1.k2099-01-test.segmentoIncompleto')).toThrow('TOKEN_MALFORMED_SEGMENTS');
    expect(() => parseNfcToken('#AB2.k2099-01-test.payload.signature')).toThrow('TOKEN_UNSUPPORTED_VERSION');
  });

  it('dovrebbe rifiutare token con firma di lunghezza errata', () => {
    expect(() => parseNfcToken('#AB1.k2099-01-test.payload.firmaTroppoCorta')).toThrow('TOKEN_INVALID_SIGNATURE_LENGTH');
  });

  it('dovrebbe rifiutare payload NFC sovradimensionati prima della verifica crittografica', () => {
    const oversizedPayload = uint8ArrayToBase64Url(new Uint8Array(2049));
    const rawToken = `AB1.k2099-01-test.${oversizedPayload}.${'A'.repeat(86)}`;

    expect(() => parseNfcToken(rawToken, { maxTokenLength: 10000 })).toThrow('TOKEN_PAYLOAD_TOO_LARGE');
  });

  it('dovrebbe rifiutare Base64URL con lunghezza impossibile', () => {
    expect(() => parseNfcToken(`AB1.k2099-01-test.A.${'A'.repeat(86)}`)).toThrow('TOKEN_INVALID_PAYLOAD_B64');
  });
});

describe('Runtime schema validation', () => {
  const validItemPayload = {
    v: 1,
    t: 'p',
    iss: 'ABBO APS',
    aud: 'ABBO-PRODUCT-VERIFY-V1',
    e: 'ed_1234567890abcdef',
    r: 1,
    h: 'A'.repeat(43),
    s: 1,
    n: 10,
    i: 'it_1234567890abcdef',
    d: '2026-07-28',
  };

  it('dovrebbe applicare i vincoli numerici e rifiutare proprietà extra', () => {
    expect(validateProductItemPayload(validItemPayload).s).toBe(1);
    expect(() => validateProductItemPayload({ ...validItemPayload, s: 1.5 })).toThrow('PAYLOAD_INVALID_SCHEMA');
    expect(() => validateProductItemPayload({ ...validItemPayload, injected: '<script>' })).toThrow('PAYLOAD_INVALID_SCHEMA');
  });

  it('dovrebbe validare envelope e manifesto con schema runtime stretto', () => {
    const envelope = {
      format: 'ABBO-EDITION-1',
      kid: 'k2026-01',
      payload: 'A'.repeat(16),
      signature: 'A'.repeat(86),
    };
    expect(validateEditionEnvelope(envelope).format).toBe('ABBO-EDITION-1');
    expect(() => validateEditionEnvelope({ ...envelope, signature: 'short' })).toThrow('MANIFEST_INVALID_SCHEMA');

    const payload = {
      v: 1,
      t: 'edition',
      iss: 'ABBO APS',
      aud: 'ABBO-PRODUCT-VERIFY-V1',
      e: 'ed_1234567890abcdef',
      r: 1,
      code: 'ED-2026-01',
      title: 'Edizione di test',
      description: 'Descrizione di test',
      n: 10,
      releaseDate: '2026-07-28',
      image: {
        path: '/assets/products/ed_1234567890abcdef/cover.webp',
        sha256: 'A'.repeat(43),
        alt: 'Copertina test',
      },
      physicalSerialRequired: true,
      createdAt: '2026-07-28T13:00:00Z',
    };
    expect(validateEditionPayload(payload).image.path).toContain('/assets/products/');
    expect(() => validateEditionPayload({ ...payload, image: { ...payload.image, path: '../secret' } })).toThrow('MANIFEST_INVALID_SCHEMA');
  });

  it('dovrebbe bloccare manifesti firmati da chiavi compromesse', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        format: 'ABBO-EDITION-1',
        kid: 'k2026-01',
        payload: 'A'.repeat(16),
        signature: 'A'.repeat(86),
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(verifyEditionManifest(
      { e: 'ed_1234567890abcdef', r: 1, h: 'A'.repeat(43), v: 1, t: 'p', iss: 'ABBO APS', aud: 'ABBO-PRODUCT-VERIFY-V1', s: 1, n: 1, i: 'it_1234567890abcdef', d: '2026-07-28' },
      { schemaVersion: 1, keys: [{ kid: 'k2026-01', alg: 'ES256', status: 'compromised', createdAt: '2026-07-28T13:00:00Z', jwk: {} as never }] },
      '/'
    )).rejects.toThrow('MANIFEST_KEY_COMPROMISED');

    vi.unstubAllGlobals();
  });
});
