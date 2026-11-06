import { INSPECTION_PERFORMANCE, SELF_CERTIFICATION } from '../data/inspections';
import { pct } from './format';
import { checkInspectionRow, checkSelfCertRow } from './inspections';

const perf = INSPECTION_PERFORMANCE[0];
const cert = SELF_CERTIFICATION[0];

describe('inspection data', () => {
  it('is internally consistent', () => {
    for (const r of INSPECTION_PERFORMANCE) expect(checkInspectionRow(r)).toEqual([]);
    for (const r of SELF_CERTIFICATION) expect(checkSelfCertRow(r)).toEqual([]);
  });

  it('derives the shares shown in the tables', () => {
    expect(pct(perf.scheduled, perf.requiringInspection)).toBe('95.3%');
    expect(pct(perf.conducted, perf.scheduled)).toBe('96.3%');
    expect(pct(perf.conductedWithinTimeline, perf.conducted)).toBe('93.0%');
    expect(pct(perf.conductedBeyondTimeline, perf.conducted)).toBe('7.0%');
    expect(pct(perf.reportsWithin24h, perf.conducted)).toBe('96.5%');
    expect(pct(perf.reportsBeyond24h, perf.conducted)).toBe('3.5%');
    expect(pct(cert.exemptedSelfCertification, cert.enterprisesUnderRegime)).toBe('23.3%');
    expect(pct(cert.exemptedThirdParty, cert.enterprisesUnderRegime)).toBe('14.7%');
  });

  it('reports each broken rule', () => {
    expect(checkInspectionRow({ ...perf, conducted: perf.scheduled + 1 })).toEqual(
      expect.arrayContaining([
        'conducted exceeds scheduled',
        'within + beyond timeline does not equal conducted',
        'reports within + beyond 24 hours does not equal conducted',
      ]),
    );
    expect(checkInspectionRow({ ...perf, scheduled: perf.requiringInspection + 1 })).toContain(
      'scheduled exceeds requiring inspection',
    );
    expect(checkSelfCertRow({ ...cert, exemptedThirdParty: cert.enterprisesUnderRegime })).toEqual([
      'exemptions exceed enterprises under the inspection regime',
    ]);
    expect(checkSelfCertRow({ ...cert, exemptedThirdParty: -1 })).toContain(
      'exemptedThirdParty must be a whole number ≥ 0',
    );
  });
});
