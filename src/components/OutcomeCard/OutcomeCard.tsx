import { useId } from 'react';
import type { Service } from '../../data/services';
import { formatINR, pct } from '../../lib/format';
import { outcomesOf, totals, waffleCounts } from '../../lib/derive';
import { OutcomeWaffle } from '../OutcomeWaffle/OutcomeWaffle';
import { ChevronDownIcon } from '../Icons/Icons';
import styles from './OutcomeCard.module.css';

export const ALL_SERVICES = 'all';

interface Props {
  services: Service[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function OutcomeCard({ services, selectedId, onSelect }: Props) {
  const selectId = useId();
  const selected = services.find((s) => s.id === selectedId);
  const o = selected ? outcomesOf(selected) : totals(services);
  const scope = selected ? selected.name : 'All services';
  const hasData = o.received > 0;

  const legend = [
    { key: 'approved', label: 'Approved', value: o.approved },
    { key: 'returned', label: 'Returned', value: o.returned },
    { key: 'rejected', label: 'Rejected', value: o.rejected },
    { key: 'remaining', label: 'Remaining*', value: o.remaining },
  ] as const;

  const ariaLabel = hasData
    ? `Outcomes of ${formatINR(o.received)} applications · ${scope}: ` +
      `${pct(o.approved, o.received)} approved, ${pct(o.returned, o.received)} returned, ` +
      `${pct(o.rejected, o.received)} rejected, ${pct(o.remaining, o.received)} remaining.`
    : `No applications recorded · ${scope}.`;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Application Outcomes</h2>
          <p className={styles.subtitle}>
            What happened to applications received · each square is about 0.4%
          </p>
        </div>
        <div className={styles.picker}>
          <label htmlFor={selectId} className="visually-hidden">
            Service
          </label>
          <select id={selectId} value={selectedId} onChange={(e) => onSelect(e.target.value)}>
            <option value={ALL_SERVICES}>All services (total)</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon size={16} />
        </div>
      </div>

      <div className={styles.headline}>
        <p className={`${styles.big} num`}>{pct(o.approved, o.received)}</p>
        <p className={styles.bigText}>
          {hasData
            ? `approved, of ${formatINR(o.received)} applications · ${scope}`
            : `No applications recorded · ${scope}`}
        </p>
      </div>

      <OutcomeWaffle
        counts={waffleCounts(o, 240)}
        squares={240}
        rows={6}
        squareSize={12}
        gap={4}
        ariaLabel={ariaLabel}
      />

      <ul className={styles.legend}>
        {legend.map((item) => (
          <li key={item.key} className={styles.legendItem}>
            <span className={styles.legendLabel}>
              <span className={`${styles.swatch} ${styles[item.key]}`} aria-hidden="true" />
              {item.label}
            </span>
            <span className={`${styles.legendValue} num`}>{formatINR(item.value)}</span>
            <span className={`${styles.legendPct} num`}>{pct(item.value, o.received)}</span>
          </li>
        ))}
      </ul>
      <p className={styles.footnote}>
        * Remaining = received − approved − returned − rejected.
      </p>
    </div>
  );
}
