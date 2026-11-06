import { DASHBOARD_HREF } from '../../lib/routes';
import { ChevronRightIcon, HomeIcon } from '../Icons/Icons';
import styles from './Breadcrumb.module.css';

/** Pages below the dashboard, e.g. [{ label: 'Inspection Performance' }]. The last item is the current page. */
export function Breadcrumb({ trail = [] }: { trail?: { label: string }[] }) {
  const atDashboard = trail.length === 0;
  return (
    <nav aria-label="Breadcrumb" className={styles.bar}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <HomeIcon size={20} />
          <a href="/" className={styles.link}>K-SMART</a>
          <ChevronRightIcon size={16} className={styles.sep} />
        </li>
        {atDashboard ? (
          <li className={`${styles.item} ${styles.active}`} aria-current="page">
            EoDB Dashboard
          </li>
        ) : (
          <>
            <li className={styles.item}>
              <a href={DASHBOARD_HREF} className={styles.link}>EoDB Dashboard</a>
              <ChevronRightIcon size={16} className={styles.sep} />
            </li>
            {trail.map((t, i) => {
              const last = i === trail.length - 1;
              return (
                <li
                  key={t.label}
                  className={`${styles.item} ${last ? styles.active : ''}`}
                  aria-current={last ? 'page' : undefined}
                >
                  {t.label}
                  {!last && <ChevronRightIcon size={16} className={styles.sep} />}
                </li>
              );
            })}
          </>
        )}
      </ol>
    </nav>
  );
}
