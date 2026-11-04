import { describe, expect, it } from 'vitest';
import { formatDays, formatINR, formatRupees, pct } from './format';

describe('formatINR', () => {
  it.each([
    [0, '0'],
    [669, '669'],
    [7922, '7,922'],
    [276849, '2,76,849'],
    [1651551, '16,51,551'],
    [10000000, '1,00,00,000'],
    [-1119131, '-11,19,131'],
  ])('formats %d as %s', (n, expected) => {
    expect(formatINR(n)).toBe(expected);
  });
});

describe('formatRupees / pct / formatDays', () => {
  it('formats currency', () => {
    expect(formatRupees(150)).toBe('₹150');
    expect(formatRupees(4000)).toBe('₹4,000');
    expect(formatRupees(10000)).toBe('₹10,000');
  });
  it('formats percentages with one decimal and an em dash for no applications', () => {
    expect(pct(1119131, 1651551)).toBe('67.8%');
    expect(pct(0, 0)).toBe('—');
  });
  it('pluralises days', () => {
    expect(formatDays(1)).toBe('1 day');
    expect(formatDays(2)).toBe('2 days');
  });
});
