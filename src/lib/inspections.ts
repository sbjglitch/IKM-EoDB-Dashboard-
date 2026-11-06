import type { InspectionPerformance, SelfCertification } from '../data/inspections';

/**
 * Consistency rules for an inspection row. Returns a list of problems (empty when consistent),
 * so tests can guard both the sample data and, later, the API data.
 */
export function checkInspectionRow(r: InspectionPerformance): string[] {
  const problems: string[] = [];
  const values = Object.entries(r).filter(([k]) => k !== 'serviceId') as [string, number][];
  for (const [k, v] of values) {
    if (!Number.isInteger(v) || v < 0) problems.push(`${k} must be a whole number ≥ 0`);
  }
  if (r.scheduled > r.requiringInspection) problems.push('scheduled exceeds requiring inspection');
  if (r.conducted > r.scheduled) problems.push('conducted exceeds scheduled');
  if (r.conductedWithinTimeline + r.conductedBeyondTimeline !== r.conducted) {
    problems.push('within + beyond timeline does not equal conducted');
  }
  if (r.reportsWithin24h + r.reportsBeyond24h !== r.conducted) {
    problems.push('reports within + beyond 24 hours does not equal conducted');
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
