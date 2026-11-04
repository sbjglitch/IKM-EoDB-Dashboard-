import { LOGIN_URL } from '../../config';
import ksmartLogo from '../../assets/header/ksmart-logo.svg';
import dividerLine from '../../assets/header/divider-line.svg';
import keralaLogo from '../../assets/header/government-of-kerala-logo.png';
import lsgdLogo from '../../assets/header/lsgd-logo.png';
import { Button } from '../Button/Button';
import { LanguageMenu, type Language } from '../LanguageMenu/LanguageMenu';
import styles from './WebPortalHeader.module.css';

export type { Language };

interface Props {
  language: Language;
  onLanguageChange: (l: Language) => void;
}

/** Figma: _Webportal-Header (29:385), 1440 × 80. */
export function WebPortalHeader({ language, onLanguageChange }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <a href="/" className={styles.ksmart}>
            <img src={ksmartLogo} alt="K-SMART home" width={84.634} height={36.871} />
          </a>
          <span className={styles.divider} aria-hidden="true">
            <img src={dividerLine} alt="" width={44} height={2} />
          </span>
          <span className={styles.keralaSlot}>
            <img src={keralaLogo} alt="Government of Kerala emblem" />
          </span>
          <span className={styles.lsgdSlot}>
            <img src={lsgdLogo} alt="Local Self Government Department logo" />
          </span>
          <div className={styles.org}>
            <p className={styles.orgTop}>Government of Kerala</p>
            <p className={styles.orgBottom}>Local Self Government Department</p>
          </div>
        </div>
        <div className={styles.actions}>
          <LanguageMenu language={language} onChange={onLanguageChange} />
          <Button size="sm" hierarchy="primary" href={LOGIN_URL} className={styles.login}>
            Login
          </Button>
        </div>
      </div>
    </header>
  );
}
