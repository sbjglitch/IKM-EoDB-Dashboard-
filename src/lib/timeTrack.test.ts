import { SERVICES } from '../data/services';
import { timeTrack } from './timeTrack';

const svc = (id: string) => SERVICES.find((s) => s.id === id)!;

describe('timeTrack', () => {
  it('scales Building Permit to its 15-day limit', () => {
    const t = timeTrack(svc('bp'));
    expect(t.min).toBeCloseTo(40);
    expect(t.median).toBeCloseTo(53.33, 1);
    expect(t.average).toBeCloseTo(86.67, 1);
    expect(t.max).toBe(100);
    expect(t.limit).toBe(100);
    expect(t.status).toBe('within');
    expect(t.statusText).toBe('All within the 15-day limit');
    expect(t.label).toContain('median 8 days');
  });

  it('extends the scale past a missed limit and says so', () => {
    // Renewal: limit Same day (1), average 2, max 5.
    const t = timeTrack(svc('tlr'));
    expect(t.max).toBe(100);
    expect(t.limit).toBeCloseTo(20);
    expect(t.status).toBe('average-over');
    expect(t.statusText).toBe('Average exceeds the same-day limit');
  });

  it('distinguishes a slow outlier from a slow average', () => {
    const t = timeTrack({ ...svc('bp'), maxDays: 20 });
    expect(t.status).toBe('slowest-over');
    expect(t.limit).toBeCloseTo(75);
  });
});
