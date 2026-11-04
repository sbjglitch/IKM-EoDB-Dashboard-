import type { ReactNode } from 'react';
import styles from './KpiCard.module.css';

interface Props {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
}

export function KpiCard({ icon, label, value, note }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.head}>
        {icon}
        <h3 className={styles.label}>{label}</h3>
      </div>
      <p className={`${styles.value} num`}>{value}</p>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
