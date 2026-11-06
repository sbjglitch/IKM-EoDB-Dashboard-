// Building permit inspection tables (Excel spec, tables c and d).

/** c. Inspection Performance — figures supplied on 6 Nov 2026 (source and as-of date to be confirmed). */
export const INSPECTION_PERFORMANCE_IS_SAMPLE = false;

/**
 * d. Self-Certification — SAMPLE DATA for design review only: K-SMART does not publish these yet.
 * Never ship with this set to true (CLAUDE.md §13).
 */
export const SELF_CERTIFICATION_IS_SAMPLE = true;

/** One inspection category (a building permit service type). */
export interface InspectionPerformanceRow {
  id: string;
  name: string;
  /** "Total Application for inspection" */
  requiringInspection: number;
  /** "Total Application for schedule" */
  scheduled: number;
  conducted: number;
  conductedWithinTimeline: number;
  conductedBeyondTimeline: number;
  /**
   * "Total Inspection report within / beyond time line". Shown as supplied: the values are far
   * larger than inspections conducted, so they are not report counts. Unit to be confirmed.
   */
  reportsWithinTimeline: number;
  reportsBeyondTimeline: number;
}

/** d. Self-Certification and Third-Party Inspection */
export interface SelfCertification {
  serviceId: string;
  enterprisesUnderRegime: number;
  exemptedSelfCertification: number;
  exemptedThirdParty: number;
}

/** Dashboard services whose row detail links to the Inspection Performance page. */
export const INSPECTION_PERFORMANCE_SERVICE_IDS: readonly string[] = ['bp'];

export const INSPECTION_PERFORMANCE: InspectionPerformanceRow[] = [
  { id: 'general', name: 'General Building Permit', requiringInspection: 316914, scheduled: 97590, conducted: 94491, conductedWithinTimeline: 64722, conductedBeyondTimeline: 20941, reportsWithinTimeline: 5589068, reportsBeyondTimeline: 22690662 },
  { id: 'regularized', name: 'Regularized Completion', requiringInspection: 110349, scheduled: 83533, conducted: 80649, conductedWithinTimeline: 58210, conductedBeyondTimeline: 18448, reportsWithinTimeline: 3859333, reportsBeyondTimeline: 7623047 },
  { id: 'revised', name: 'Revised Permit', requiringInspection: 9366, scheduled: 365, conducted: 359, conductedWithinTimeline: 287, conductedBeyondTimeline: 67, reportsWithinTimeline: 35702, reportsBeyondTimeline: 78490 },
  { id: 'occupancy', name: 'Partially / Completed Permits for Occupancy', requiringInspection: 206958, scheduled: 168250, conducted: 162617, conductedWithinTimeline: 123144, conductedBeyondTimeline: 38369, reportsWithinTimeline: 8342574, reportsBeyondTimeline: 20701021 },
];

export const SELF_CERTIFICATION: SelfCertification[] = [
  {
    serviceId: 'bp',
    enterprisesUnderRegime: 42310,
    exemptedSelfCertification: 9874,
    exemptedThirdParty: 6215,
  },
];
