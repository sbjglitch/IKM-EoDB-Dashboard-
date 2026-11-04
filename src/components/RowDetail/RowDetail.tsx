import type { Service } from '../../data/services';
import { APPLICATION_LIST_URL } from '../../config';
import { formatINR, pct } from '../../lib/format';
import { outcomesOf, waffleCounts } from '../../lib/derive';
import { Button } from '../Button/Button';
import { OutcomeWaffle } from '../OutcomeWaffle/OutcomeWaffle';
import styles from './RowDetail.module.css';

/** Always shows the figures of the service it belongs to (CLAUDE.md §11, question 2). */
export function RowDetail({ service }: { service: Service }) {
  const o = outcomesOf(service);
  const has = o.received > 0;
  const summary = has
    ? `Approved ${pct(o.approved, o.received)} · Returned ${pct(o.returned, o.received)} · ` +
      `Rejected ${pct(o.rejected, o.received)} · Remaining ${formatINR(o.remaining)} (${pct(o.remaining, o.received)})`
    : 'No applications recorded';

  return (
    <div className={styles.detail}>
      <div className={styles.outcomes}>
        <span className={styles.label}>Outcomes</span>
        <OutcomeWaffle
          counts={waffleCounts(o, 50)}
          squares={50}
          rows={2}
          squareSize={13}
          gap={3}
          ariaLabel={`${service.name}: ${summary}`}
        />
        <span className={`${styles.summary} num`}>{summary}</span>
        {!has && (
          <span className={styles.note}>
            Time figures for this service are shown as published in the source data.
          </span>
        )}
      </div>
      <Button size="sm" hierarchy="primary" href={APPLICATION_LIST_URL}>
        View Application List
      </Button>
    </div>
  );
}
