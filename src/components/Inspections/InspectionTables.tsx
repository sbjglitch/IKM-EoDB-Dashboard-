import type { ReactNode } from 'react';
import type { InspectionPerformanceRow, SelfCertification } from '../../data/inspections';
import { formatINR, pct } from '../../lib/format';
import { inspectionTotals } from '../../lib/inspections';
import t from '../ServiceTable/ServiceTable.module.css';
import styles from './Inspections.module.css';

function Count({ n, of, ofLabel, over }: { n: number; of?: number; ofLabel?: string; over?: boolean }) {
  return (
    <>
      <span className={`${t.main} num ${over && n > 0 ? t.over : ''}`}>{formatINR(n)}</span>
      {of !== undefined && (
        <span className={`${t.sub} num`}>
          {pct(n, of)} of {ofLabel}
        </span>
      )}
    </>
  );
}

/** Table card shared by both inspection pages. The page heading names the table, so the caption is for screen readers. */
function Card({
  caption,
  footnote,
  minWidth,
  children,
}: {
  caption: string;
  footnote?: string;
  minWidth: number;
  children: ReactNode;
}) {
  return (
    <div className={t.card}>
      <div className={t.scroll} role="region" aria-label={caption} tabIndex={0}>
        <table className={t.table} style={{ minWidth }}>
          <caption className="visually-hidden">{caption}</caption>
          {children}
        </table>
      </div>
      {footnote && <p className={styles.footnote}>{footnote}</p>}
    </div>
  );
}

const SAMPLE_NOTE = 'Sample figures for design review. Not real K-SMART data.';
const join = (...parts: (string | false)[]) => parts.filter(Boolean).join(' ') || undefined;

interface TableProps<R> {
  serviceName: string;
  row: R;
  isSample: boolean;
}

type PerfFigures = Omit<InspectionPerformanceRow, 'id' | 'name'>;

/** Cells for one row (or the total). Report figures carry no share: their unit is not confirmed. */
function PerformanceCells({ r }: { r: PerfFigures }) {
  return (
    <>
      <td className={t.num}><Count n={r.requiringInspection} /></td>
      <td className={t.num}><Count n={r.scheduled} of={r.requiringInspection} ofLabel="applications" /></td>
      <td className={t.num}><Count n={r.conducted} of={r.scheduled} ofLabel="scheduled" /></td>
      <td className={t.num}><Count n={r.conductedWithinTimeline} of={r.conducted} ofLabel="conducted" /></td>
      <td className={t.num}><Count n={r.conductedBeyondTimeline} of={r.conducted} ofLabel="conducted" over /></td>
      <td className={t.num}><Count n={r.reportsWithinTimeline} /></td>
      <td className={t.num}><Count n={r.reportsBeyondTimeline} over /></td>
    </>
  );
}

const PERFORMANCE_NOTES = [
  'Within and beyond timeline do not add up to conducted in the source figures.',
  'Report figures are shown as supplied; their unit is being confirmed.',
  'Beyond-timeline figures are shown in pink.',
];

interface PerformanceProps {
  rows: InspectionPerformanceRow[];
  isSample: boolean;
}

export function InspectionPerformanceTable({ rows, isSample }: PerformanceProps) {
  const total = inspectionTotals(rows);
  return (
    <Card
      caption="Inspection Performance · Building permit services"
      footnote={join(isSample && SAMPLE_NOTE, ...PERFORMANCE_NOTES)}
      minWidth={1376}
    >
      <colgroup>
        <col style={{ width: 285 }} />
        {Array.from({ length: 7 }, (_, i) => (
          <col key={i} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th scope="col" rowSpan={2} className={t.serviceHead}>Service</th>
          <th scope="colgroup" colSpan={3} className={t.groupHead}>Inspections</th>
          <th scope="colgroup" colSpan={2} className={t.groupHead}>Conducted</th>
          <th scope="colgroup" colSpan={2} className={t.groupHead}>Inspection reports</th>
        </tr>
        <tr>
          <th scope="col" className={t.subHead}>Applications for inspection</th>
          <th scope="col" className={t.subHead}>Scheduled</th>
          <th scope="col" className={t.subHead}>Conducted</th>
          <th scope="col" className={t.subHead}>Within timeline</th>
          <th scope="col" className={t.subHead}>Beyond timeline</th>
          <th scope="col" className={t.subHead}>Reports within timeline</th>
          <th scope="col" className={t.subHead}>Reports beyond timeline</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className={t.row}>
            <th scope="row" className={t.serviceCell}>
              <span className={t.name}>{r.name}</span>
            </th>
            <PerformanceCells r={r} />
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className={t.totalRow}>
          <th scope="row" className={t.totalLabel}>Total</th>
          <PerformanceCells r={total} />
        </tr>
      </tfoot>
    </Card>
  );
}

export function SelfCertificationTable({ serviceName, row: c, isSample }: TableProps<SelfCertification>) {
  return (
    <Card
      caption={`Self-Certification and Third-Party Inspection · ${serviceName}`}
      footnote={join(isSample && SAMPLE_NOTE)}
      minWidth={960}
    >
      <colgroup>
        <col style={{ width: 285 }} />
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th scope="col" rowSpan={2} className={t.serviceHead}>Service</th>
          <th scope="col" rowSpan={2} className={`${t.subHead} ${styles.bottom}`}>
            Enterprises under inspection regime
          </th>
          <th scope="colgroup" colSpan={2} className={t.groupHead}>Exempted from inspection</th>
        </tr>
        <tr>
          <th scope="col" className={t.subHead}>Self-certification</th>
          <th scope="col" className={t.subHead}>Third-party certification</th>
        </tr>
      </thead>
      <tbody>
        <tr className={t.row}>
          <th scope="row" className={t.serviceCell}>
            <span className={t.name}>{serviceName}</span>
          </th>
          <td className={t.num}><Count n={c.enterprisesUnderRegime} /></td>
          <td className={t.num}>
            <Count n={c.exemptedSelfCertification} of={c.enterprisesUnderRegime} ofLabel="enterprises" />
          </td>
          <td className={t.num}>
            <Count n={c.exemptedThirdParty} of={c.enterprisesUnderRegime} ofLabel="enterprises" />
          </td>
        </tr>
      </tbody>
    </Card>
  );
}
