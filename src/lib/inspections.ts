import type { InspectionPerformanceRow, SelfCertification } from '../data/inspections';

type Totals = Omit<InspectionPerformanceRow, 'id' | 'name'>;

const NUMERIC_KEYS: (keyof Totals)[] = [
  'requiringInspection',
  'scheduled',
  'conducted',
  'conductedWithinTimeline',
  'conductedBeyondTimeline',
  'reportsWithinTimeline',
  'reportsBeyondTimeline',
];

/** Column totals across inspection categories. */
export function inspectionTotals(rows: InspectionPerformanceRow[]): Totals {
  const t = {} as Totals;
  for (const k of NUMERIC_KEYS) t[k] = rows.reduce((acc, r) => acc + r[k], 0);
  return t;
}

/**
 * Consistency rules for an inspection row. Returns a list of problems (empty when consistent),
 * so tests can guard the data now and the API data later.
 * Within + beyond timeline may fall short of conducted: the supplied figures do so in every row.
 * Report figures have no rule because their unit is not confirmed.
 */
export function checkInspectionRow(r: Totals): string[] {
  const problems: string[] = [];
  for (const k of NUMERIC_KEYS) {
    if (!Number.isInteger(r[k]) || r[k] < 0) problems.push(`${k} must be a whole number ≥ 0`);
  }
  if (r.scheduled > r.requiringInspection) problems.push('scheduled exceeds requiring inspection');
  if (r.conducted > r.scheduled) problems.push('conducted exceeds scheduled');
  if (r.conductedWithinTimeline + r.conductedBeyondTimeline > r.conducted) {
    problems.push('within + beyond timeline exceeds conducted');
  }
  return problems;
}

export function checkSelfCertRow(r: SelfCertification): string[] {
  const problems: string[] = [];
  const values = Object.entries(r).filter(([k]) => k !== 'serviceId') as [string, number][];
  for (const [k, v] of values) {
    if (!Number.isInteger(v) || v < 0) problems.push(`${k} must be a whole number ≥ 0`);
  }
  if (r.exemptedSelfCertification + r.exemptedThirdParty > r.enterprisesUnderRegime) {
    problems.push('exemptions exceed enterprises under the inspection regime');
  }
  return problems;
}
