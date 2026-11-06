import { INSPECTION_PERFORMANCE, SELF_CERTIFICATION } from '../data/inspections';
import { pct } from './format';
import { checkInspectionRow, checkSelfCertRow, inspectionTotals } from './inspections';

const general = INSPECTION_PERFORMANCE.find((r) => r.id === 'general')!;
const cert = SELF_CERTIFICATION[0];

describe('inspection data', () => {
  it('is internally consistent', () => {
    for (const r of INSPECTION_PERFORMANCE) expect(checkInspectionRow(r)).toEqual([]);
    for (const r of SELF_CERTIFICATION) expect(checkSelfCertRow(r)).toEqual([]);
  });

  it('derives the published totals', () => {
    expect(inspectionTotals(INSPECTION_PERFORMANCE)).toEqual({
      requiringInspection: 643587,
      scheduled: 349738,
      conducted: 338116,
      conductedWithinTimeline: 246363,
      conductedBeyondTimeline: 77825,
      reportsWithinTimeline: 17826677,
      reportsBeyondTimeline: 51093220,
    });
  });

  it('derives the shares shown in the table', () => {
    expect(pct(general.scheduled, general.requiringInspection)).toBe('30.8%');
    expect(pct(general.conducted, general.scheduled)).toBe('96.8%');
    expect(pct(general.conductedWithinTimeline, general.conducted)).toBe('68.5%');
    expect(pct(general.conductedBeyondTimeline, general.conducted)).toBe('22.2%');
    const t = inspectionTotals(INSPECTION_PERFORMANCE);
    expect(pct(t.scheduled, t.requiringInspection)).toBe('54.3%');
    expect(pct(t.conductedWithinTimeline, t.conducted)).toBe('72.9%');
    expect(pct(cert.exemptedSelfCertification, cert.enterprisesUnderRegime)).toBe('23.3%');
  });

  it('reports each broken rule', () => {
    expect(checkInspectionRow({ ...general, conducted: general.scheduled + 1 })).toContain('conducted exceeds scheduled');
    expect(checkInspectionRow({ ...general, scheduled: general.requiringInspection + 1 })).toContain(
      'scheduled exceeds requiring inspection',
    );
    expect(checkInspectionRow({ ...general, conductedBeyondTimeline: general.conducted })).toContain(
      'within + beyond timeline exceeds conducted',
    );
    expect(checkSelfCertRow({ ...cert, exemptedThirdParty: cert.enterprisesUnderRegime })).toEqual([
      'exemptions exceed enterprises under the inspection regime',
    ]);
    expect(checkSelfCertRow({ ...cert, exemptedThirdParty: -1 })).toContain(
      'exemptedThirdParty must be a whole number ≥ 0',
    );
  });
});
