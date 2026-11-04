import type { CSSProperties } from 'react';
import type { WaffleCounts } from '../../lib/derive';
import styles from './OutcomeWaffle.module.css';

const KINDS = ['approved', 'returned', 'rejected', 'remaining'] as const;

interface Props {
  counts: WaffleCounts;
  /** Total number of squares drawn (240 main, 50 per service row). */
  squares: number;
  rows: number;
  squareSize: number;
  gap: number;
  ariaLabel: string;
}

/** Squares fill column by column: approved → returned → rejected → remaining. */
export function OutcomeWaffle({ counts, squares, rows, squareSize, gap, ariaLabel }: Props) {
  const cells: (typeof KINDS)[number][] = [];
  counts.forEach((n, i) => {
    for (let k = 0; k < n; k++) cells.push(KINDS[i]);
  });
  // No applications: draw an empty grid rather than a misleading "remaining" block.
  const empty = cells.length === 0;
  const style = {
    '--square': `${squareSize}px`,
    '--gap': `${gap}px`,
    '--rows': rows,
  } as CSSProperties;

  return (
    <div className={styles.waffle} style={style} role="img" aria-label={ariaLabel}>
      {Array.from({ length: squares }, (_, i) => (
        <span key={i} className={`${styles.square} ${styles[empty ? 'empty' : cells[i] ?? 'remaining']}`} />
      ))}
    </div>
  );
}
