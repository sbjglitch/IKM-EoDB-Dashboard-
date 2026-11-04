import type { Service } from '../data/services';

export interface Outcomes {
  received: number;
  approved: number;
  returned: number;
  rejected: number;
  remaining: number;
}

/** received − approved − returned − rejected */
export function remaining(s: Pick<Service, 'received' | 'approved' | 'returned' | 'rejected'>): number {
  return s.received - s.approved - s.returned - s.rejected;
}

export function outcomesOf(s: Service): Outcomes {
  return {
    received: s.received,
    approved: s.approved,
    returned: s.returned,
    rejected: s.rejected,
    remaining: remaining(s),
  };
}

/** Totals across services. Times are deliberately not totalled. */
export function totals(services: Service[]): Outcomes {
  const sum = (key: 'received' | 'approved' | 'returned' | 'rejected') =>
    services.reduce((acc, s) => acc + s[key], 0);
  const t = {
    received: sum('received'),
    approved: sum('approved'),
    returned: sum('returned'),
    rejected: sum('rejected'),
  };
  return { ...t, remaining: remaining(t) };
}

/**
 * Largest-remainder apportionment: returns integer counts that sum to `n`.
 * Ties go to the earlier value. All-zero input yields all zeros.
 */
export function largestRemainder(values: number[], n: number): number[] {
  const total = values.reduce((a, b) => a + b, 0);
  if (total <= 0) return values.map(() => 0);
  const exact = values.map((v) => (v / total) * n);
  const counts = exact.map(Math.floor);
  let left = n - counts.reduce((a, b) => a + b, 0);
  const order = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; left > 0; k = (k + 1) % order.length, left--) {
    counts[order[k].i]++;
  }
  return counts;
}

export type WaffleCounts = [approved: number, returned: number, rejected: number, remaining: number];

/** Square counts in fill order: approved → returned → rejected → remaining. */
export function waffleCounts(o: Outcomes, squares: number): WaffleCounts {
  if (o.received <= 0) return [0, 0, 0, 0];
  return largestRemainder([o.approved, o.returned, o.rejected, o.remaining], squares) as WaffleCounts;
}

export function exceedsLimit(s: Service): boolean {
  return s.avgDays > s.rtsLimitDays || s.maxDays > s.rtsLimitDays;
}

export function maxOverLimit(s: Service): boolean {
  return s.maxDays > s.rtsLimitDays;
}

export function hasNoApplications(s: Service): boolean {
  return s.received === 0;
}

/** Services with applications whose average time is within the RTS limit. */
export function withinLimitCount(services: Service[]): { within: number; of: number } {
  const active = services.filter((s) => s.received > 0);
  return { within: active.filter((s) => s.avgDays <= s.rtsLimitDays).length, of: active.length };
}
