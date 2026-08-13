import { describe, expect, it } from 'vitest';
import { formatEditionNumber } from '../../src/components/limited/EditionCounter';

describe('Limited Edition experience data', () => {
  it('keeps edition number width stable across serial sizes', () => {
    expect(formatEditionNumber(1, 50)).toBe('01');
    expect(formatEditionNumber(27, 100)).toBe('027');
    expect(formatEditionNumber(193, 200)).toBe('193');
    expect(formatEditionNumber(999, 1000)).toBe('0999');
  });
});
