import { LOGIN_URL } from '../../config';
import { Button } from '../Button/Button';
import { ChevronDownIcon, GlobeIcon } from '../Icons/Icons';
import styles from './WebPortalHeader.module.css';

export type Language = 'en' | 'ml';

interface Props {
  language: Language;
  onLanguageChange: (l: Language) => void;
}

export function WebPortalHeader({ language, onLanguageChange }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.ksmart} src="/assets/ksmart-logo.svg" alt="K-SMART" width={140} height={40} />
        <span className={styles.divider} aria-hidden="true" />
        <img src="/assets/government-of-kerala-logo.svg" alt="Government of Kerala emblem" width={48} height={48} />
        <div className={styles.org}>
          <span className={styles.orgTop}>Government of Kerala</span>
          <span className={styles.orgBottom}>Local Self Government Department</span>
        </div>
        <img src="/assets/lsgd-logo.svg" alt="LSGD logo" width={48} height={48} />
      </div>
      <div className={styles.actions}>
        <label className={styles.language}>
          <GlobeIcon size={20} />
          <span className="visually-hidden">Language</span>
          <select value={language} onChange={(e) => onLanguageChange(e.target.value as Language)}>
            <option value="en">English</option>
            <option value="ml" lang="ml">മലയാളം</option>
          </select>
          <ChevronDownIcon size={16} />
        </label>
        <Button size="sm" hierarchy="primary" href={LOGIN_URL}>
          Login
        </Button>
      </div>
    </header>
  );
}
