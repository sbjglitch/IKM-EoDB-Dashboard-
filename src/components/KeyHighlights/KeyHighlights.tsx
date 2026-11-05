import type { Service } from '../../data/services';
import { buildHighlights } from '../../lib/highlights';
import styles from './KeyHighlights.module.css';

/**
 * Four business-facing insights derived from the service table (CLAUDE.md §11.1).
 * Wording comes from `buildHighlights`, which only makes claims the data supports.
 */
export function KeyHighlights({ services }: { services: Service[] }) {
  const highlights = buildHighlights(services);

  return (
    <div className={styles.card}>
      <div>
        <h2 className={styles.title}>Key Highlights</h2>
        <p className={styles.subtitle}>What the service table means for starting and running a business</p>
      </div>
      <ul className={styles.list}>
        {highlights.map((h) => (
          <li key={h.id} className={styles.item}>
            <p className={styles.stage}>{h.stage}</p>
            <p className={styles.figureBlock}>
              <span className={`${styles.figure} num`}>{h.figure}</span>
              <span className={styles.caption}>{h.figureCaption}</span>
            </p>
            <div className={styles.body}>
              <h3 className={styles.headline}>{h.headline}</h3>
              <p className={styles.detail}>{h.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
