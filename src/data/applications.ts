// Application list behind "View Application List".
// SAMPLE DATA for design review only: the EoDB source has totals, not individual applications.
// Replace with the K-SMART application API (same `Application` shape), then set APPLICATIONS_ARE_SAMPLE to false.
import type { Service } from './services';

/** Never ship with this set to true (CLAUDE.md §13). */
export const APPLICATIONS_ARE_SAMPLE = true;

export type Decision = 'approved' | 'returned' | 'rejected';

export interface FeeLine {
  label: string;
  amount: number; // ₹
}

export interface Application {
  applicationNo: string;
  /** Masked before it reaches the page, e.g. "R*** K*** Nair". */
  applicant: string;
  localBody: string;
  appliedOn: Date;
  decidedOn: Date;
  daysTaken: number;
  decision: Decision;
  receiptNo: string | null;
  /** null when the service charges no fee. */
  fees: FeeLine[] | null;
}

/** How many sample rows each list shows at most. */
export const SAMPLE_ROWS = 24;

const PREFIX: Record<string, string> = {
  bp: 'BP', cli: 'CLI', occ: 'OC', mt: 'MT', tln: 'TLN', tlr: 'TLR', tla: 'TLA', pt: 'PT', oc: 'OWN',
};

const LOCAL_BODIES: [string, string][] = [
  ['TVM', 'Thiruvananthapuram Corporation'],
  ['EKM', 'Kochi Corporation'],
  ['KKD', 'Kozhikode Corporation'],
  ['TSR', 'Thrissur Corporation'],
  ['KLM', 'Kollam Corporation'],
  ['KNR', 'Kannur Corporation'],
  ['PKD', 'Palakkad Municipality'],
  ['KTM', 'Kottayam Municipality'],
  ['ALP', 'Alappuzha Municipality'],
  ['MLP', 'Malappuram Municipality'],
];

const INITIALS = 'ABDFGJKLMNPRSTV';
const SURNAMES = ['Nair', 'Varghese', 'Menon', 'Thomas', 'Pillai', 'Kurian', 'Joseph', 'Das', ''];

/** Sample records are fixed relative to the date the source figures were read. */
const REFERENCE_DATE = new Date(2026, 10, 2); // 2 Nov 2026

/** Small deterministic PRNG so the sample list is the same on every load. */
function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

function feesFor(s: Service, r: () => number): FeeLine[] | null {
  const pick = <T,>(xs: T[]) => xs[Math.floor(r() * xs.length)];
  if (s.id === 'bp' || s.id === 'cli') {
    return [
      { label: 'Permit application fee', amount: s.statutoryFee ?? 0 },
      { label: 'Fee for construction of buildings', amount: 1500 + Math.floor(r() * 130) * 50 },
      { label: 'Permit fee for additional FSI', amount: r() < 0.75 ? 0 : 500 + Math.floor(r() * 40) * 50 },
    ];
  }
  if (s.feeNote === 'Slab-based') {
    return [{ label: 'Licence fee (slab-based)', amount: pick([500, 1000, 2000, 3000, 5000]) }];
  }
  if (s.statutoryFee !== null) return [{ label: 'Application fee', amount: s.statutoryFee }];
  return null; // 'No fee'
}

/** Up to SAMPLE_ROWS sample applications with this decision, newest decision first. */
export function sampleApplications(s: Service, decision: Decision): Application[] {
  const count = Math.min(SAMPLE_ROWS, s[decision]);
  const r = rng(`${s.id}:${decision}`);
  const prefix = PREFIX[s.id] ?? s.id.toUpperCase();
  const rows: Application[] = [];
  let decidedOn = addDays(REFERENCE_DATE, -1);
  for (let i = 0; i < count; i++) {
    const [code, localBody] = LOCAL_BODIES[Math.floor(r() * LOCAL_BODIES.length)];
    const daysTaken = s.minDays + Math.floor(r() * (s.maxDays - s.minDays + 1));
    const initial = () => INITIALS[Math.floor(r() * INITIALS.length)];
    const surname = SURNAMES[Math.floor(r() * SURNAMES.length)];
    const serial = String(1000 + Math.floor(r() * 9000)).padStart(6, '0');
    const fees = feesFor(s, r);
    rows.push({
      applicationNo: `${prefix}-2026-${code}-${serial}`,
      applicant: [`${initial()}***`, `${initial()}***`, surname].filter(Boolean).join(' '),
      localBody,
      appliedOn: addDays(decidedOn, -daysTaken),
      decidedOn,
      daysTaken,
      decision,
      receiptNo: fees ? `RCPT-2026-${code}-${String(100000 + Math.floor(r() * 900000))}` : null,
      fees,
    });
    if (r() < 0.5) decidedOn = addDays(decidedOn, -1);
  }
  return rows;
}
