import type { ReactNode } from 'react';
import styles from './Tag.module.css';

export function Tag({ variant, children }: { variant: 'warning' | 'neutral'; children: ReactNode }) {
  return <span className={`${styles.tag} ${styles[variant]}`}>{children}</span>;
}
