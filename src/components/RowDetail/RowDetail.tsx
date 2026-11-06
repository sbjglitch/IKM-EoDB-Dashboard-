import type { CSSProperties } from 'react';
import type { Service } from '../../data/services';
import { formatDays, formatINR, pct } from '../../lib/format';
import { outcomesOf } from '../../lib/derive';
import { applicationsHref, inspectionLinksFor } from '../../lib/routes';
import { timeTrack } from '../../lib/timeTrack';
import { Button } from '../Button/Button';
import styles from './RowDetail.module.css';

const at = (left: number, width?: number) =>
  ({ left: `${left}%`, ...(width !== undefined && { width: `${width}%` }) }) as CSSProperties;

function TimeTrack({ service: s }: { service: Service }) {
  const t = timeTrack(s);
  // Part of the min–max range inside the limit, and the part beyond it.
  const inEnd = Math.max(t.min, Math.min(t.max, t.limit));
  const overStart = Math.max(t.limit, t.min);
  const limitText = s.rtsLimitLabel === 'Same day' ? 'same day' : formatDays(s.rtsLimitDays);

  return (
    <div className={styles.time}>
      <div className={styles.timeHead}>
        <span className={styles.eyebrow}>Time to process</span>
        {/* No applications: the times are published figures, so make no claim about them. */}
        {s.received > 0 && (
          <span className={`${styles.status} ${t.status === 'within' ? '' : styles.statusOver}`}>{t.statusText}</span>
        )}
      </div>
      <div className={styles.track} role="img" aria-label={t.label}>
        <span className={styles.base} />
        {inEnd > t.min && <span className={styles.range} style={at(t.min, inEnd - t.min)} />}
        {t.max > overStart && <span className={styles.over} style={at(overStart, t.max - overStart)} />}
        <span className={styles.limitTick} style={at(t.limit)} />
        <span className={styles.median} style={at(t.median)} />
        <span className={styles.average} style={at(t.average)} />
      </div>
      <ul className={`${styles.timeLegend} num`} aria-hidden="true">
        <li><span className={styles.keyMedian} />Median <strong>{formatDays(s.medianDays)}</strong></li>
        <li><span className={styles.keyAverage} />Average <strong>{formatDays(s.avgDays)}</strong></li>
        <li><span className={styles.keyRange} />Range <strong>{s.minDays}–{formatDays(s.maxDays)}</strong></li>
        <li><span className={styles.keyLimit} />Limit <strong>{limitText}</strong></li>
        {t.max > t.limit && <li><span className={styles.keyOver} />Over limit</li>}
      </ul>
    </div>
  );
}

const KINDS = [
  ['approved', 'Approved'],
  ['returned', 'Returned'],
  ['rejected', 'Rejected'],
  ['remaining', 'Remaining'],
] as const;

/** Always shows the figures of the service it belongs to (CLAUDE.md §11, question 2). */
export function RowDetail({ service }: { service: Service }) {
  const o = outcomesOf(service);
  const has = o.received > 0;

  return (
    <div className={styles.detail}>
      <div className={styles.top}>
        {has ? (
          <dl className={styles.stats} aria-label={`${service.name} outcomes`}>
            {KINDS.map(([key, label]) => (
              <div key={key} className={styles.stat}>
                <dt className={styles.statLabel}>
                  <span className={`${styles.swatch} ${styles[key]}`} />
                  {label}
                </dt>
                <dd className={`${styles.statPct} num`}>{pct(o[key], o.received)}</dd>
                <dd className={`${styles.statCount} num`}>{formatINR(o[key])}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No applications recorded</p>
            <p className={styles.note}>Time figures for this service are shown as published in the source data.</p>
          </div>
        )}
        <span className={styles.divider} aria-hidden="true" />
        <TimeTrack service={service} />
      </div>
      <div className={styles.actions}>
        <Button size="sm" hierarchy="secondary" href={applicationsHref(service.id)}>
          View Application List
        </Button>
        {inspectionLinksFor(service.id).map((l) => (
          <Button key={l.href} size="sm" hierarchy="secondary" href={l.href}>
            {l.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
