/**
 * Indian digit grouping (16,51,551). Implemented by hand rather than relying on
 * toLocaleString('en-IN'), which is not available in every runtime.
 */
export function formatINR(n: number): string {
  const negative = n < 0;
  const digits = String(Math.trunc(Math.abs(n)));
  let out: string;
  if (digits.length <= 3) {
    out = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    out = `${rest},${last3}`;
  }
  return negative ? `-${out}` : out;
}

/** "₹4,000" */
export function formatRupees(n: number): string {
  return `₹${formatINR(n)}`;
}

/** Share of `part` in `whole` as a number, or null when there is no whole. */
export function share(part: number, whole: number): number | null {
  return whole > 0 ? (part / whole) * 100 : null;
}

/** "67.8%" with one decimal, or "—" when there are no applications. */
export function pct(part: number, whole: number): string {
  const s = share(part, whole);
  return s === null ? '—' : `${s.toFixed(1)}%`;
}

/** "1 day", "2 days" */
export function formatDays(n: number): string {
  return n === 1 ? '1 day' : `${n} days`;
}
