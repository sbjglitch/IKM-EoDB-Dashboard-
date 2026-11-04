import { Fragment, useMemo, useState, type ReactNode } from 'react';
import type { Service } from '../../data/services';
import { formatINR, formatRupees, pct } from '../../lib/format';
import { exceedsLimit, hasNoApplications, maxOverLimit, totals } from '../../lib/derive';
import { ChevronRightIcon } from '../Icons/Icons';
import { RowDetail } from '../RowDetail/RowDetail';
import { Tag } from '../Tag/Tag';
import styles from './ServiceTable.module.css';

type SortKey =
  | 'name' | 'rts' | 'received' | 'approved' | 'returned' | 'rejected'
  | 'min' | 'median' | 'avg' | 'max';
type Dir = 'asc' | 'desc';

const VALUE: Record<Exclude<SortKey, 'name'>, (s: Service) => number> = {
  rts: (s) => s.rtsLimitDays,
  received: (s) => s.received,
  approved: (s) => s.approved,
  returned: (s) => s.returned,
  rejected: (s) => s.rejected,
  min: (s) => s.minDays,
  median: (s) => s.medianDays,
  avg: (s) => s.avgDays,
  max: (s) => s.maxDays,
};

interface Props {
  services: Service[];
  /** Rendered inside the table card, under the table (the definitions). */
  children?: ReactNode;
  /** Called when a row is opened, so the outcome picker can follow it. */
  onServiceOpen?: (id: string) => void;
}

function FeeCell({ s }: { s: Service }) {
  if (s.statutoryFee === null) {
    return <span className={styles.main}>{s.feeNote ?? '—'}</span>;
  }
  return (
    <>
      <span className={`${styles.main} num`}>{formatRupees(s.statutoryFee)}</span>
      {s.averageFee !== null && (
        <span className={`${styles.sub} num`}>Avg {formatRupees(s.averageFee)}</span>
      )}
    </>
  );
}

function Count({ n, of }: { n: number; of: number }) {
  return (
    <>
      <span className={`${styles.main} num`}>{formatINR(n)}</span>
      <span className={`${styles.sub} num`}>{pct(n, of)}</span>
    </>
  );
}

export function ServiceTable({ services, onServiceOpen, children }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: Dir } | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    if (!sort) return services;
    const sign = sort.dir === 'asc' ? 1 : -1;
    return [...services].sort((a, b) =>
      sort.key === 'name'
        ? sign * a.name.localeCompare(b.name)
        : sign * (VALUE[sort.key](a) - VALUE[sort.key](b)),
    );
  }, [services, sort]);

  const grand = useMemo(() => totals(services), [services]);

  const toggleSort = (key: SortKey) =>
    setSort((cur) => {
      if (cur?.key === key) return { key, dir: cur.dir === 'asc' ? 'desc' : 'asc' };
      return { key, dir: key === 'name' ? 'asc' : 'desc' };
    });

  const toggleOpen = (id: string) => {
    const opening = !open.has(id);
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (opening) onServiceOpen?.(id);
  };

  const ariaSort = (key: SortKey) =>
    sort?.key === key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none';

  const sortButton = (k: SortKey, label: string, align?: 'right') => (
    <button
      type="button"
      className={`${styles.sortBtn} ${align === 'right' ? styles.right : ''}`}
      onClick={() => toggleSort(k)}
    >
      {label}
      <span className={styles.arrow} data-dir={sort?.key === k ? sort.dir : undefined} aria-hidden="true" />
    </button>
  );

  const subHead = (k: SortKey, label: string) => (
    <th scope="col" className={styles.subHead} aria-sort={ariaSort(k)}>
      {sortButton(k, label, 'right')}
    </th>
  );

  return (
    <div className={styles.card} id="service-table">
      <div className={styles.scroll} role="region" aria-label="Service-wise approval details table" tabIndex={0}>
        <table className={styles.table}>
          <caption className={styles.caption}>
            <h2 className={styles.title}>Service-wise Approval Details</h2>
            <p className={styles.subtitle}>
              Fees, time limits, application outcomes and processing times for each service.
            </p>
          </caption>
          <colgroup>
            <col style={{ width: 285 }} />
            <col style={{ width: 182 }} />
            <col style={{ width: 181 }} />
            {Array.from({ length: 8 }, (_, i) => (
              <col key={i} style={{ width: 91 }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col" rowSpan={2} className={styles.serviceHead} aria-sort={ariaSort('name')}>
                {sortButton('name', 'Service')}
              </th>
              <th scope="colgroup" colSpan={2} className={styles.groupHead}>Fee and time limit</th>
              <th scope="colgroup" colSpan={4} className={styles.groupHead}>Applications</th>
              <th scope="colgroup" colSpan={4} className={styles.groupHead}>Time taken to process (days)</th>
            </tr>
            <tr>
              <th scope="col" className={styles.subHead}>
                <span className={`${styles.sortBtn} ${styles.right}`}>Statutory / avg fee</span>
              </th>
              {subHead('rts', 'RTS limit')}
              {subHead('received', 'Received')}
              {subHead('approved', 'Approved')}
              {subHead('returned', 'Returned')}
              {subHead('rejected', 'Rejected')}
              {subHead('min', 'Min')}
              {subHead('median', 'Median')}
              {subHead('avg', 'Average')}
              {subHead('max', 'Max')}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const isOpen = open.has(s.id);
              const detailId = `detail-${s.id}`;
              return (
                <Fragment key={s.id}>
                  <tr className={styles.row}>
                    <th scope="row" className={styles.serviceCell}>
                      <div className={styles.serviceInner}>
                        <button
                          type="button"
                          className={styles.chevron}
                          aria-expanded={isOpen}
                          aria-controls={detailId}
                          aria-label={`${isOpen ? 'Hide' : 'Show'} outcomes for ${s.name}`}
                          onClick={() => toggleOpen(s.id)}
                        >
                          <ChevronRightIcon size={24} />
                        </button>
                        <div className={styles.nameBlock}>
                          <span className={styles.name}>{s.name}</span>
                          {(exceedsLimit(s) || hasNoApplications(s)) && (
                            <span className={styles.tags}>
                              {exceedsLimit(s) && <Tag variant="warning">Exceeds RTS limit</Tag>}
                              {hasNoApplications(s) && <Tag variant="neutral">No applications recorded</Tag>}
                            </span>
                          )}
                        </div>
                      </div>
                    </th>
                    <td className={styles.num}><FeeCell s={s} /></td>
                    <td className={styles.num}><span className={styles.main}>{s.rtsLimitLabel}</span></td>
                    <td className={styles.num}><span className={`${styles.main} num`}>{formatINR(s.received)}</span></td>
                    <td className={styles.num}><Count n={s.approved} of={s.received} /></td>
                    <td className={styles.num}><Count n={s.returned} of={s.received} /></td>
                    <td className={styles.num}><Count n={s.rejected} of={s.received} /></td>
                    <td className={styles.num}><span className={`${styles.main} num`}>{s.minDays}</span></td>
                    <td className={styles.num}><span className={`${styles.main} num`}>{s.medianDays}</span></td>
                    <td className={styles.num}><span className={`${styles.main} num`}>{s.avgDays}</span></td>
                    <td className={styles.num}>
                      <span className={`${styles.main} num ${maxOverLimit(s) ? styles.over : ''}`}>{s.maxDays}</span>
                    </td>
                  </tr>
                  <tr id={detailId} className={styles.detailRow} hidden={!isOpen}>
                    <td colSpan={11}>
                      <RowDetail service={s} />
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <th scope="row" className={styles.totalLabel}>Total · All services</th>
              <td colSpan={2} />
              <td className={styles.num}><span className={`${styles.main} num`}>{formatINR(grand.received)}</span></td>
              <td className={styles.num}><Count n={grand.approved} of={grand.received} /></td>
              <td className={styles.num}><Count n={grand.returned} of={grand.received} /></td>
              <td className={styles.num}><Count n={grand.rejected} of={grand.received} /></td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>
      {children}
    </div>
  );
}
