import type { ReactNode } from 'react';
import type { InspectionPerformance, SelfCertification } from '../../data/inspections';
import { formatINR, pct } from '../../lib/format';
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

export function InspectionPerformanceTable({ serviceName, row: p, isSample }: TableProps<InspectionPerformance>) {
  return (
    <Card
      caption={`Inspection Performance · ${serviceName}`}
      footnote={join(isSample && SAMPLE_NOTE, 'Beyond-timeline and beyond-24-hour counts are shown in pink.')}
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
          <th scope="colgroup" colSpan={2} className={t.groupHead}>Reports uploaded</th>
        </tr>
        <tr>
          <th scope="col" className={t.subHead}>Requiring inspection</th>
          <th scope="col" className={t.subHead}>Scheduled</th>
          <th scope="col" className={t.subHead}>Conducted</th>
          <th scope="col" className={t.subHead}>Within timeline</th>
          <th scope="col" className={t.subHead}>Beyond timeline</th>
          <th scope="col" className={t.subHead}>Within 24 hours</th>
          <th scope="col" className={t.subHead}>Beyond 24 hours</th>
        </tr>
      </thead>
      <tbody>
        <tr className={t.row}>
          <th scope="row" className={t.serviceCell}>
            <span className={t.name}>{serviceName}</span>
          </th>
          {/* Count only: a share of all received applications would mix sample and real data. */}
          <td className={t.num}><Count n={p.requiringInspection} /></td>
          <td className={t.num}><Count n={p.scheduled} of={p.requiringInspection} ofLabel="requiring" /></td>
          <td className={t.num}><Count n={p.conducted} of={p.scheduled} ofLabel="scheduled" /></td>
          <td className={t.num}><Count n={p.conductedWithinTimeline} of={p.conducted} ofLabel="conducted" /></td>
          <td className={t.num}><Count n={p.conductedBeyondTimeline} of={p.conducted} ofLabel="conducted" over /></td>
          <td className={t.num}><Count n={p.reportsWithin24h} of={p.conducted} ofLabel="conducted" /></td>
          <td className={t.num}><Count n={p.reportsBeyond24h} of={p.conducted} ofLabel="conducted" over /></td>
        </tr>
      </tbody>
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
