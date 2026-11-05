import { SERVICES, type Service } from '../data/services';
import { buildHighlights } from './highlights';

const find = (id: string, list = buildHighlights(SERVICES)) => list.find((h) => h.id === id);

describe('buildHighlights', () => {
  it('derives the four highlights from the source data, in journey order', () => {
    const list = buildHighlights(SERVICES);
    expect(list.map((h) => h.stage)).toEqual(['Start', 'Build', 'Connect', 'Renew']);

    expect(find('start')).toMatchObject({
      figure: '7 days',
      headline: 'New trade licences decided within the 7-day limit',
    });
    expect(find('start')?.detail).toContain('Median 3 days, across 2,01,150 applications');

    expect(find('build')).toMatchObject({
      figure: '8 days',
      headline: 'Building permits in about half the legal time',
    });
    expect(find('build')?.detail).toBe('Against a 15-day limit. 1,70,580 permits approved; 0.3% rejected.');

    expect(find('connect')).toMatchObject({ figure: '100%', headline: 'Every mobile tower application approved' });
    expect(find('connect')?.detail).toContain('All 669 applications');
    expect(find('connect')?.detail).toContain('none returned or rejected');

    expect(find('renew')).toMatchObject({ figure: '7,04,281', headline: 'Licence renewal is the most-used service' });
    expect(find('renew')?.detail).toBe('42.6% of all 16,51,551 applications on K-SMART, with 82.4% approved so far.');
  });

  it('softens claims the data no longer supports', () => {
    const changed: Service[] = SERVICES.map((s) => {
      if (s.id === 'tln') return { ...s, maxDays: 9 };
      if (s.id === 'bp') return { ...s, medianDays: 12 };
      if (s.id === 'mt') return { ...s, approved: 600, rejected: 69 };
      return s;
    });
    const list = buildHighlights(changed);
    expect(find('start', list)?.headline).toBe('New trade licences: median 3 days');
    expect(find('build', list)?.headline).toBe('Building permits within the legal time limit');
    expect(find('connect', list)?.headline).toBe('Mobile tower applications approved');
    expect(find('connect', list)?.detail).not.toContain('none returned');
  });

  it('drops a highlight when its service has no applications or misses the limit', () => {
    const changed = SERVICES.map((s) =>
      s.id === 'mt' ? { ...s, received: 0, approved: 0 } : s.id === 'bp' ? { ...s, medianDays: 20 } : s,
    );
    expect(buildHighlights(changed).map((h) => h.id)).toEqual(['start', 'renew']);
  });
});
