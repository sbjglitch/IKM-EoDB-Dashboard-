import type { ReactNode } from 'react';
import styles from './KeyHighlights.module.css';

/**
 * Shell only. The card is empty in Figma (CLAUDE.md §11, question 1); the suggested
 * "Applications by Service" ranked bar list must be confirmed before it is built.
 * Pass children to fill the slot once the content is decided.
 */
export function KeyHighlights({ children }: { children?: ReactNode }) {
  return (
    <div className={styles.card}>
      <div>
        <h2 className={styles.title}>Key Highlights</h2>
        <p className={styles.subtitle}>Calculated from the service table</p>
      </div>
      <div className={styles.slot}>
        {children ?? <p className={styles.placeholder}>Key Highlights content to be confirmed.</p>}
      </div>
    </div>
  );
}
