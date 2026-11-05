import type { Service } from '../data/services';
import { formatDays, formatINR, pct } from './format';
import { remaining, totals } from './derive';

/** "7-day limit"; "same-day limit" for Same day. */
function limitPhrase(s: Service): string {
  return s.rtsLimitLabel === 'Same day' ? 'same-day limit' : `${s.rtsLimitDays}-day limit`;
}

export interface Highlight {
  id: string;
  /** Where this sits in a business's life: start → build → connect → renew. */
  stage: string;
  figure: string;
  figureCaption: string;
  headline: string;
  detail: string;
}

/**
 * Key Highlights, derived from the service table. Each claim is worded from the
 * data at render time, so a highlight changes its wording (or drops out) when
 * the figures no longer support it. None repeats a hero tile.
 */
export function buildHighlights(services: Service[]): Highlight[] {
  const byId = (id: string) => services.find((s) => s.id === id && s.received > 0);
  const out: Highlight[] = [];

  // Start: certainty for a new trade licence (hero already shows its 3-day median).
  const tln = byId('tln');
  if (tln) {
    const withinLimit = tln.maxDays <= tln.rtsLimitDays;
    out.push({
      id: 'start',
      stage: 'Start',
      figure: formatDays(tln.maxDays),
      figureCaption: 'slowest decision',
      headline: withinLimit
        ? `New trade licences decided within the ${limitPhrase(tln)}`
        : `New trade licences: median ${formatDays(tln.medianDays)}`,
      detail: withinLimit
        ? `Even the slowest decided application met the legal limit. Median ${formatDays(tln.medianDays)}, across ${formatINR(tln.received)} applications.`
        : `Against a ${limitPhrase(tln)}, across ${formatINR(tln.received)} applications.`,
    });
  }

  // Build: building permit median as a share of its legal limit.
  const bp = byId('bp');
  if (bp && bp.medianDays <= bp.rtsLimitDays) {
    const ratio = bp.medianDays / bp.rtsLimitDays;
    out.push({
      id: 'build',
      stage: 'Build',
      figure: formatDays(bp.medianDays),
      figureCaption: 'median',
      headline:
        ratio >= 0.4 && ratio <= 0.6
          ? 'Building permits in about half the legal time'
          : 'Building permits within the legal time limit',
      detail: `Against a ${limitPhrase(bp)}. ${formatINR(bp.approved)} permits approved; ${pct(bp.rejected, bp.received)} rejected.`,
    });
  }

  // Connect: telecom infrastructure approvals.
  const mt = byId('mt');
  if (mt) {
    const all = mt.approved === mt.received;
    const clean = mt.returned === 0 && mt.rejected === 0 && remaining(mt) === 0;
    out.push({
      id: 'connect',
      stage: 'Connect',
      figure: all ? '100%' : pct(mt.approved, mt.received),
      figureCaption: 'approved',
      headline: all ? 'Every mobile tower application approved' : 'Mobile tower applications approved',
      detail: `${all ? 'All' : formatINR(mt.approved) + ' of'} ${formatINR(mt.received)} applications for towers and communication infrastructure${clean ? ', none returned or rejected' : ''}. Median ${formatDays(mt.medianDays)}.`,
    });
  }

  // Renew: established businesses already use K-SMART at scale.
  const tlr = byId('tlr');
  if (tlr) {
    const t = totals(services);
    const mostUsed = services.every((s) => s.received <= tlr.received);
    out.push({
      id: 'renew',
      stage: 'Renew',
      figure: formatINR(tlr.received),
      figureCaption: 'applications',
      headline: mostUsed
        ? 'Licence renewal is the most-used service'
        : 'Trade licence renewals handled online',
      detail: `${pct(tlr.received, t.received)} of all ${formatINR(t.received)} applications on K-SMART, with ${pct(tlr.approved, tlr.received)} approved so far.`,
    });
  }

  return out;
}
