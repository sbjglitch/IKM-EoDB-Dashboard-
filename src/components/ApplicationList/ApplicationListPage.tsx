import { useEffect, useMemo, useRef, useState } from 'react';
import type { Service } from '../../data/services';
import {
  APPLICATIONS_ARE_SAMPLE,
  sampleApplications,
  type Application,
  type Decision,
} from '../../data/applications';
import { formatDate, formatDays, formatINR, limitPhrase } from '../../lib/format';
import { DASHBOARD_HREF } from '../../lib/routes';
import { Button } from '../Button/Button';
import { ChevronDownIcon, EyeIcon, SearchIcon } from '../Icons/Icons';
import { Tag } from '../Tag/Tag';
import t from '../ServiceTable/ServiceTable.module.css';
import { FeeDialog } from './FeeDialog';
import styles from './ApplicationList.module.css';

const PAGE_SIZE = 10;

const DECISIONS: { value: Decision; label: string }[] = [
  { value: 'approved', label: 'Approved' },
  { value: 'returned', label: 'Returned' },
  { value: 'rejected', label: 'Rejected' },
];

export function ApplicationListPage({ service: s }: { service: Service }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [decision, setDecision] = useState<Decision>('approved');
  const [query, setQuery] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [open, setOpen] = useState<Application | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus();
  }, [s.id]);

  const all = useMemo(() => sampleApplications(s, decision), [s, decision]);
  const q = query.trim().toLowerCase();
  const rows = q ? all.filter((a) => a.applicationNo.toLowerCase().includes(q)) : all;
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(pageNo, pages);
  const shown = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const label = DECISIONS.find((d) => d.value === decision)!.label;

  const closeDialog = () => {
    setOpen(null);
    openerRef.current?.focus();
  };

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div className={styles.headText}>
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {s.name} · {label} applications
          </h1>
          <p className={`${styles.subtitle} num`}>
            {formatINR(s[decision])} {decision} applications on K-SMART
            {s.received > 0 && ` · median ${formatDays(s.medianDays)} to decide against a ${limitPhrase(s)}`}
          </p>
        </div>
        {s.received > 0 && (
          <div className={styles.controls}>
            <label className={styles.search}>
              <SearchIcon size={16} />
              <span className="visually-hidden">Search by application number</span>
              <input
                type="search"
                value={query}
                placeholder="Search by application number"
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPageNo(1);
                }}
              />
            </label>
            <label className={styles.select}>
              <span className="visually-hidden">Decision</span>
              <select
                value={decision}
                onChange={(e) => {
                  setDecision(e.target.value as Decision);
                  setPageNo(1);
                }}
              >
                {DECISIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
              <ChevronDownIcon size={16} />
            </label>
          </div>
        )}
      </div>

      <div className={t.card}>
        <div className={styles.caption}>
          <h2 id="application-list-title" className={t.title}>Application wise break up</h2>
          {APPLICATIONS_ARE_SAMPLE && <Tag variant="warning">Sample data</Tag>}
        </div>

        {s.received === 0 ? (
          <p className={styles.empty}>No applications recorded for {s.name}.</p>
        ) : (
          <>
            <div className={t.scroll} role="region" aria-labelledby="application-list-title" tabIndex={0}>
              <table className={styles.table}>
                <caption className="visually-hidden">
                  {s.name} · {label} applications, page {current} of {pages}
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className={styles.sl}>Sl No</th>
                    <th scope="col">Application No</th>
                    <th scope="col">Applicant</th>
                    <th scope="col">Local body</th>
                    <th scope="col" className={styles.right}>Applied on</th>
                    <th scope="col" className={styles.right}>{label} on</th>
                    <th scope="col" className={styles.right}>Days taken</th>
                    <th scope="col" className={styles.right}>Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((a, i) => (
                    <tr key={a.applicationNo}>
                      <td className={`${styles.sl} num`}>{(current - 1) * PAGE_SIZE + i + 1}</td>
                      <th scope="row" className={`${styles.appNo} num`}>{a.applicationNo}</th>
                      <td>{a.applicant}</td>
                      <td className={styles.muted}>{a.localBody}</td>
                      <td className={`${styles.right} num`}>{formatDate(a.appliedOn)}</td>
                      <td className={`${styles.right} num`}>{formatDate(a.decidedOn)}</td>
                      <td className={`${styles.right} ${styles.strong} num ${a.daysTaken > s.rtsLimitDays ? t.over : ''}`}>
                        {a.daysTaken}
                      </td>
                      <td className={styles.right}>
                        {a.fees ? (
                          <button
                            type="button"
                            className={styles.feeBtn}
                            aria-label={`View fees for ${a.applicationNo}`}
                            onClick={(e) => {
                              openerRef.current = e.currentTarget;
                              setOpen(a);
                            }}
                          >
                            <EyeIcon size={16} />
                            View fees
                          </button>
                        ) : (
                          <span className={styles.muted}>No fee</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {shown.length === 0 && (
                    <tr>
                      <td colSpan={8} className={styles.noMatch}>
                        No application number matches “{query.trim()}”.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.footer}>
              <p className="num">
                {rows.length > 0
                  ? `Showing ${(current - 1) * PAGE_SIZE + 1}–${(current - 1) * PAGE_SIZE + shown.length} of ${rows.length} ${APPLICATIONS_ARE_SAMPLE ? 'sample ' : ''}applications.`
                  : 'No applications to show.'}{' '}
                Names are masked to protect applicants.
                {APPLICATIONS_ARE_SAMPLE && ' Sample records for design review, not real K-SMART data.'}
                {' '}Days taken over the time limit are shown in pink.
              </p>
              {pages > 1 && (
                <nav aria-label="Pagination" className={styles.pager}>
                  <button type="button" disabled={current === 1} onClick={() => setPageNo(current - 1)}>
                    Previous
                  </button>
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={n === current ? styles.currentPage : undefined}
                      aria-current={n === current ? 'page' : undefined}
                      aria-label={`Page ${n}`}
                      onClick={() => setPageNo(n)}
                    >
                      {n}
                    </button>
                  ))}
                  <button type="button" disabled={current === pages} onClick={() => setPageNo(current + 1)}>
                    Next
                  </button>
                </nav>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <Button size="sm" hierarchy="secondary" href={DASHBOARD_HREF}>
          Back to EoDB Dashboard
        </Button>
      </div>

      {open && <FeeDialog application={open} isSample={APPLICATIONS_ARE_SAMPLE} onClose={closeDialog} />}
    </div>
  );
}
