import { describe, expect, it, vi } from 'vitest';
import { encodeUtf8, uint8ArrayToBase64Url } from '../src/crypto/base64url';
import { sha256Bytes } from '../src/crypto/web-crypto';
import { verifyEditionManifest } from '../src/verifier/edition-verifier';
import { fetchKeyring, verifyItemToken, type Keyring } from '../src/verifier/item-verifier';
import { parseNfcToken } from '../src/verifier/token-parser';

const kid = 'k2026-01-test';
const editionId = 'ed_1234567890abcdef';
const itemId = 'it_1234567890abcdef';
const baseUrl = 'https://www.abboaps.org/';
const imageBytes = new TextEncoder().encode('fixture-webp-bytes');

function tamperBase64Url(value: string): string {
  const replacement = value[0] === 'A' ? 'B' : 'A';
  return `${replacement}${value.slice(1)}`;
}

async function makeFlowFixture() {
  const keyPair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  );
  const imageHash = uint8ArrayToBase64Url(await sha256Bytes(imageBytes));
  const manifestPayload = {
    v: 1, t: 'edition', iss: 'ABBO APS', aud: 'ABBO-PRODUCT-VERIFY-V1',
    e: editionId, r: 1, code: 'ED-2026-01', title: 'Edizione di test',
    description: 'Descrizione di test', n: 1, releaseDate: '2026-07-28',
    image: { path: `/assets/products/${editionId}/cover.webp`, sha256: imageHash, alt: 'Copertina test' },
    physicalSerialRequired: true, createdAt: '2026-07-28T13:00:00Z',
  };
  const manifestPayloadB64 = uint8ArrayToBase64Url(encodeUtf8(JSON.stringify(manifestPayload)));
  const manifestBytes = encodeUtf8(`ABBO-EDITION-1.${kid}.${manifestPayloadB64}`);
  const manifestSignature = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, keyPair.privateKey, manifestBytes,
  ));
  const itemPayload = {
    v: 1, t: 'p', iss: 'ABBO APS', aud: 'ABBO-PRODUCT-VERIFY-V1', e: editionId,
    r: 1, h: uint8ArrayToBase64Url(await sha256Bytes(encodeUtf8(JSON.stringify(manifestPayload)))),
    s: 1, n: 1, i: itemId, d: '2026-07-28',
  };
  const itemPayloadB64 = uint8ArrayToBase64Url(encodeUtf8(JSON.stringify(itemPayload)));
  const itemSigned = `AB1.${kid}.${itemPayloadB64}`;
  const itemSignature = new Uint8Array(await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, keyPair.privateKey, encodeUtf8(itemSigned),
  ));
  const token = `${itemSigned}.${uint8ArrayToBase64Url(itemSignature)}`;
  const jwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const keyring: Keyring = {
    schemaVersion: 1,
    keys: [{ kid, alg: 'ES256', status: 'active', createdAt: '2026-07-28T13:00:00Z', jwk: jwk as Keyring['keys'][number]['jwk'] }],
  };
  const manifest = {
    format: 'ABBO-EDITION-1', kid, payload: manifestPayloadB64,
    signature: uint8ArrayToBase64Url(manifestSignature),
  };
  return { token, keyring, manifest, manifestUrl: `${baseUrl}data/e/${editionId}/1.json`, imageUrl: `${baseUrl}assets/products/${editionId}/cover.webp` };
}

function response(body: unknown, contentType = 'application/json', bytes = imageBytes) {
  return { ok: true, headers: new Headers({ 'content-type': contentType }), json: async () => body, arrayBuffer: async () => bytes.buffer };
}

describe('Limited verification integration flow', () => {
  it('reaches VERIFIED through the same token → manifest → image chain', async () => {
    const fixture = await makeFlowFixture();
    const fetchMock = vi.fn(async (url: string) => {
      if (url === `${baseUrl}data/keyring.json`) return response(fixture.keyring);
      if (url === fixture.manifestUrl) return response(fixture.manifest);
      if (url === fixture.imageUrl) return response(imageBytes, 'image/webp');
      return { ok: false, json: async () => ({}) };
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:verified-image'), revokeObjectURL: vi.fn() });

    const parsed = parseNfcToken(fixture.token);
    const keyring = await fetchKeyring(baseUrl);
    const item = await verifyItemToken(parsed, keyring);
    const edition = await verifyEditionManifest(item.payload, keyring, baseUrl);

    expect(item.valid).toBe(true);
    expect(edition.valid).toBe(true);
    expect(edition.verifiedImageBlobUrl).toBe('blob:verified-image');
    expect(fetchMock).toHaveBeenCalledWith(fixture.manifestUrl);
    expect(fetchMock).toHaveBeenCalledWith(fixture.imageUrl);
    vi.unstubAllGlobals();
  });

  it('rejects an altered item signature', async () => {
    const fixture = await makeFlowFixture();
    const parts = fixture.token.split('.');
    parts[3] = tamperBase64Url(parts[3]);
    const key = fixture.keyring;
    await expect(verifyItemToken(parseNfcToken(parts.join('.')), key)).rejects.toThrow('SIGNATURE_INVALID');
  });

  it('rejects an unknown key before cryptographic verification', async () => {
    const fixture = await makeFlowFixture();
    const parts = fixture.token.split('.');
    parts[1] = 'k2099-01-test';
    await expect(verifyItemToken(parseNfcToken(parts.join('.')), fixture.keyring)).rejects.toThrow('KEY_UNKNOWN');
  });

  it('rejects an altered manifest signature', async () => {
    const fixture = await makeFlowFixture();
    const badManifest = { ...fixture.manifest, signature: tamperBase64Url(fixture.manifest.signature) };
    vi.stubGlobal('fetch', vi.fn(async (url: string) => url === fixture.manifestUrl ? response(badManifest) : response(fixture.keyring)));
    await expect(verifyEditionManifest(
      (await verifyItemToken(parseNfcToken(fixture.token), fixture.keyring)).payload,
      fixture.keyring,
      baseUrl,
    )).rejects.toThrow('MANIFEST_SIGNATURE_INVALID');
    vi.unstubAllGlobals();
  });

  it('rejects a manifest hash mismatch', async () => {
    const fixture = await makeFlowFixture();
    vi.stubGlobal('fetch', vi.fn(async () => response(fixture.manifest)));
    const item = await verifyItemToken(parseNfcToken(fixture.token), fixture.keyring);
    item.payload.h = 'A'.repeat(43);
    await expect(verifyEditionManifest(item.payload, fixture.keyring, baseUrl)).rejects.toThrow('MANIFEST_HASH_MISMATCH');
    vi.unstubAllGlobals();
  });

  it('rejects an image hash mismatch', async () => {
    const fixture = await makeFlowFixture();
    vi.stubGlobal('fetch', vi.fn(async (url: string) => {
      if (url === fixture.manifestUrl) return response(fixture.manifest);
      if (url === fixture.imageUrl) return response({}, 'image/webp', new TextEncoder().encode('different-image'));
      return response(fixture.keyring);
    }));
    const item = await verifyItemToken(parseNfcToken(fixture.token), fixture.keyring);
    await expect(verifyEditionManifest(item.payload, fixture.keyring, baseUrl)).rejects.toThrow('IMAGE_INVALID');
    vi.unstubAllGlobals();
  });
});
