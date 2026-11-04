import { PRIVACY_URL, TERMS_URL } from '../../config';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} Local Self Government Department, Government of Kerala</p>
      <nav aria-label="Legal">
        <ul className={styles.links}>
          <li><a href={TERMS_URL}>Terms &amp; Conditions</a></li>
          <li><a href={PRIVACY_URL}>Privacy Policy</a></li>
        </ul>
      </nav>
    </footer>
  );
}
