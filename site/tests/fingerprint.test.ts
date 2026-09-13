import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import vector from '../../shared-public-test-vectors/valid/01_valid_normal_item.json';
import { fingerprintToken } from '../src/crypto/fingerprint';

describe('Fingerprint pubblico AB1', () => {
  it('coincide con il vettore condiviso Python/TypeScript', async () => {
    await expect(fingerprintToken(vector.token)).resolves.toBe(vector.metadata.fingerprint);
  });

  it('resta stabile, corto e non confonde token diversi', async () => {
    const fingerprint = await fingerprintToken(vector.token);
    const other = await fingerprintToken(`${vector.token}x`);

    expect(fingerprint).toMatch(/^[0-9A-F]{4}-[0-9A-F]{4}$/);
    expect(other).not.toBe(fingerprint);
  });

  it('espone fingerprint accessibile senza inserire token completo nella UI', () => {
    const renderSource = readFileSync(new URL('../src/ui/render.ts', import.meta.url), 'utf-8');
    expect(renderSource).toContain('digital-fingerprint-value');
    expect(renderSource).toContain('aria-label');
    expect(renderSource).not.toContain('itemPayload.token');
  });
});
