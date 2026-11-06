import { useEffect, useRef, type KeyboardEvent } from 'react';
import type { Application } from '../../data/applications';
import { formatDate, formatRupees } from '../../lib/format';
import { Button } from '../Button/Button';
import { CloseIcon } from '../Icons/Icons';
import { Tag } from '../Tag/Tag';
import styles from './FeeDialog.module.css';

interface Props {
  application: Application;
  isSample: boolean;
  /** The caller returns focus to the button that opened the dialog. */
  onClose: () => void;
}

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function FeeDialog({ application: a, isSample, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fees = a.fees ?? [];
  const total = fees.reduce((sum, f) => sum + f.amount, 0);

  useEffect(() => {
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !dialogRef.current) return;
    // Keep focus inside the dialog.
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fee-dialog-title"
        aria-describedby="fee-dialog-sub"
        onKeyDown={onKeyDown}
      >
        <div className={styles.header}>
          <div className={styles.headText}>
            <h2 id="fee-dialog-title" className={styles.title}>Fee details</h2>
            <p id="fee-dialog-sub" className={`${styles.sub} num`}>
              {a.applicationNo} · {a.localBody}
            </p>
          </div>
          <button ref={closeRef} type="button" className={styles.close} aria-label="Close fee details" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        <dl className={styles.receipt}>
          <div className={styles.receiptItem}>
            <dt>Receipt number</dt>
            <dd className="num">{a.receiptNo ?? '—'}</dd>
          </div>
          <div className={styles.receiptItem}>
            <dt>Receipt date</dt>
            <dd className="num">{formatDate(a.appliedOn)}</dd>
          </div>
        </dl>

        <table className={styles.fees}>
          <caption className="visually-hidden">Fee breakdown</caption>
          <thead>
            <tr>
              <th scope="col">Fee</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f) => (
              <tr key={f.label}>
                <th scope="row">{f.label}</th>
                <td className="num">{formatRupees(f.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total paid</th>
              <td className="num">{formatRupees(total)}</td>
            </tr>
          </tfoot>
        </table>

        <div className={styles.footer}>
          <div className={styles.note}>
            {isSample && <Tag variant="warning">Sample data</Tag>}
            <span>Amounts as recorded on the receipt.</span>
          </div>
          <Button size="sm" hierarchy="primary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
