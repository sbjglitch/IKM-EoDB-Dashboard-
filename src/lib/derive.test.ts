import { describe, expect, it } from 'vitest';
import { SERVICES } from '../data/services';
import { pct } from './format';
import {
  exceedsLimit,
  largestRemainder,
  maxOverLimit,
  outcomesOf,
  remaining,
  totals,
  waffleCounts,
  withinLimitCount,
} from './derive';

const byId = (id: string) => SERVICES.find((s) => s.id === id)!;

describe('totals', () => {
  const t = totals(SERVICES);
  it('matches the published totals', () => {
    expect(t.received).toBe(1651551);
    expect(t.approved).toBe(1119131);
    expect(t.returned).toBe(166563);
    expect(t.rejected).toBe(19053);
    expect(t.remaining).toBe(346804);
  });
  it('matches the published percentages', () => {
    expect(pct(t.approved, t.received)).toBe('67.8%');
    expect(pct(t.returned, t.received)).toBe('10.1%');
    expect(pct(t.rejected, t.received)).toBe('1.2%');
    expect(pct(t.remaining, t.received)).toBe('21.0%');
  });
});

describe('remaining', () => {
  it('is received − approved − returned − rejected', () => {
    expect(remaining(byId('tlr'))).toBe(73476);
    expect(remaining(byId('mt'))).toBe(0);
    expect(remaining(byId('pt'))).toBe(0);
  });
});

describe('waffle', () => {
  it('apportions the 240-square waffle 163 / 24 / 3 / 50', () => {
    expect(waffleCounts(totals(SERVICES), 240)).toEqual([163, 24, 3, 50]);
  });
  it('apportions the 50-square Renewal waffle 41 / 3 / 1 / 5', () => {
    expect(waffleCounts(outcomesOf(byId('tlr')), 50)).toEqual([41, 3, 1, 5]);
  });
  it('always sums to N', () => {
    for (const s of SERVICES) {
      const c = waffleCounts(outcomesOf(s), 240);
      expect(c.reduce((a, b) => a + b, 0)).toBe(s.received > 0 ? 240 : 0);
    }
  });
  it('largestRemainder handles zeros', () => {
    expect(largestRemainder([0, 0], 10)).toEqual([0, 0]);
    expect(largestRemainder([1, 1, 1], 10)).toEqual([4, 3, 3]);
  });
});

describe('flags', () => {
  it('flags only Trade License – Renewal as over the RTS limit', () => {
    expect(SERVICES.filter(exceedsLimit).map((s) => s.id)).toEqual(['tlr']);
    expect(maxOverLimit(byId('tlr'))).toBe(true);
    expect(maxOverLimit(byId('bp'))).toBe(false);
  });
  it('counts 7 of 8 services within the limit', () => {
    expect(withinLimitCount(SERVICES)).toEqual({ within: 7, of: 8 });
  });
});
