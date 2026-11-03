import { describe, expect, it } from 'vitest';
import { getPlatformLabel, isOnline } from './platform';

describe('SIMAPP platform foundation', () => {
  it('returns a supported platform label', () => {
    expect(['desktop', 'mobile', 'web']).toContain(getPlatformLabel());
  });

  it('reports the current runtime connectivity state without throwing', () => {
    expect(typeof isOnline()).toBe('boolean');
  });
});
