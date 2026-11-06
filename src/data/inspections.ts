// Building Permit inspection tables (Excel spec, tables c and d).
// SAMPLE DATA for design review only: K-SMART does not publish these figures yet.
// Replace with the K-SMART API using the same shape, then set INSPECTIONS_ARE_SAMPLE to false.

/** Never ship with this set to true (CLAUDE.md §13). */
export const INSPECTIONS_ARE_SAMPLE = true;

/** c. Inspection Performance */
export interface InspectionPerformance {
  serviceId: string;
  requiringInspection: number;
  scheduled: number;
  conducted: number;
  conductedWithinTimeline: number;
  conductedBeyondTimeline: number;
  reportsWithin24h: number;
  reportsBeyond24h: number;
}

/** d. Self-Certification and Third-Party Inspection */
export interface SelfCertification {
  serviceId: string;
  enterprisesUnderRegime: number;
  exemptedSelfCertification: number;
  exemptedThirdParty: number;
}

export const INSPECTION_PERFORMANCE: InspectionPerformance[] = [
  {
    serviceId: 'bp',
    requiringInspection: 118420,
    scheduled: 112906,
    conducted: 108735,
    conductedWithinTimeline: 101128,
    conductedBeyondTimeline: 7607,
    reportsWithin24h: 104912,
    reportsBeyond24h: 3823,
  },
];

export const SELF_CERTIFICATION: SelfCertification[] = [
  {
    serviceId: 'bp',
    enterprisesUnderRegime: 42310,
    exemptedSelfCertification: 9874,
    exemptedThirdParty: 6215,
  },
];
