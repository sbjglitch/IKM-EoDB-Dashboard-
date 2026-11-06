import { SERVICES } from './services';
import { SAMPLE_ROWS, sampleApplications } from './applications';

const svc = (id: string) => SERVICES.find((s) => s.id === id)!;
const DAY = 86_400_000;

describe('sampleApplications', () => {
  it('is the same on every call', () => {
    expect(sampleApplications(svc('bp'), 'approved')).toEqual(sampleApplications(svc('bp'), 'approved'));
  });

  it('never shows more rows than the service has applications', () => {
    expect(sampleApplications(svc('bp'), 'approved')).toHaveLength(SAMPLE_ROWS);
    expect(sampleApplications(svc('mt'), 'rejected')).toHaveLength(0); // 0 rejected
    expect(sampleApplications(svc('pt'), 'approved')).toHaveLength(0); // no applications
  });

  it('keeps every record internally consistent with its service', () => {
    for (const s of SERVICES) {
      for (const d of ['approved', 'returned', 'rejected'] as const) {
        for (const a of sampleApplications(s, d)) {
          expect(a.decision).toBe(d);
          expect(Math.round((a.decidedOn.getTime() - a.appliedOn.getTime()) / DAY)).toBe(a.daysTaken);
          expect(a.daysTaken).toBeGreaterThanOrEqual(s.minDays);
          expect(a.daysTaken).toBeLessThanOrEqual(s.maxDays);
          expect(a.applicant).toMatch(/\*\*\*/); // masked
          expect(a.receiptNo === null).toBe(a.fees === null);
          if (s.feeNote === 'No fee') expect(a.fees).toBeNull();
        }
      }
    }
  });

  it('uses the statutory fee as the Building Permit application fee', () => {
    const [a] = sampleApplications(svc('bp'), 'approved');
    expect(a.fees![0]).toEqual({ label: 'Permit application fee', amount: 150 });
    expect(a.applicationNo).toMatch(/^BP-2026-[A-Z]{3}-\d{6}$/);
  });
});
