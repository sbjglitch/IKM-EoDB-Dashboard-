import { ChevronRightIcon, HomeIcon } from '../Icons/Icons';
import styles from './Breadcrumb.module.css';

export function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className={styles.bar}>
      <ol className={styles.list}>
        <li className={styles.item}>
          <HomeIcon size={20} />
          <a href="/" className={styles.link}>K-SMART</a>
          <ChevronRightIcon size={16} className={styles.sep} />
        </li>
        <li className={`${styles.item} ${styles.active}`} aria-current="page">
          EoDB Dashboard
        </li>
      </ol>
    </nav>
  );
}
