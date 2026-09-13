import { describe, expect, it } from 'vitest';
import { LIMITED_PHRASES, pickLimitedPhrase } from '../../src/data/limitedPhrases';

describe('Limited ABBO phrases', () => {
  it('contains exactly 50 non-empty phrases', () => {
    expect(LIMITED_PHRASES).toHaveLength(50);
    expect(LIMITED_PHRASES.every((phrase) => phrase.text.trim().length > 0 && phrase.author.trim().length > 0)).toBe(true);
  });

  it('selects a phrase from the centralized collection', () => {
    expect(LIMITED_PHRASES).toContain(pickLimitedPhrase(0));
    expect(LIMITED_PHRASES).toContain(pickLimitedPhrase(0.999));
  });
});
