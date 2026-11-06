import { useEffect, useRef } from 'react';
import type { Service } from '../../data/services';
import { INSPECTION_PERFORMANCE, INSPECTIONS_ARE_SAMPLE, SELF_CERTIFICATION } from '../../data/inspections';
import { DASHBOARD_HREF, INSPECTION_PAGE_TITLES, inspectionHref, type InspectionPage as Page } from '../../lib/routes';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import { InspectionPerformanceTable, SelfCertificationTable } from './InspectionTables';
import styles from './Inspections.module.css';

const INTRO: Record<Page, string> = {
  'inspection-performance':
    'Applications that need a site inspection, and how quickly inspections and their reports are completed.',
  'self-certification':
    'Enterprises that fall under the inspection regime, and how many are exempt from a department inspection.',
};

const OTHER: Record<Page, Page> = {
  'inspection-performance': 'self-certification',
  'self-certification': 'inspection-performance',
};

interface Props {
  page: Page;
  service: Service;
}

export function InspectionPage({ page, service }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const title = INSPECTION_PAGE_TITLES[page];
  const performance = INSPECTION_PERFORMANCE.find((r) => r.serviceId === service.id);
  const selfCert = SELF_CERTIFICATION.find((r) => r.serviceId === service.id);
  const other = OTHER[page];
  const hasOther = other === 'inspection-performance' ? !!performance : !!selfCert;

  // A new page: start at the top and move focus to its heading so screen readers announce it.
  useEffect(() => {
    window.scrollTo(0, 0);
    titleRef.current?.focus();
  }, [page, service.id]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHead}>
        <span className={styles.eyebrow}>{service.name}</span>
        <div className={styles.titleRow}>
          <h1 ref={titleRef} tabIndex={-1} className={styles.pageTitle}>{title}</h1>
          {INSPECTIONS_ARE_SAMPLE && <Tag variant="warning">Sample data</Tag>}
        </div>
        <p className={styles.intro}>{INTRO[page]}</p>
      </div>

      {page === 'inspection-performance' && performance && (
        <InspectionPerformanceTable serviceName={service.name} row={performance} isSample={INSPECTIONS_ARE_SAMPLE} />
      )}
      {page === 'self-certification' && selfCert && (
        <SelfCertificationTable serviceName={service.name} row={selfCert} isSample={INSPECTIONS_ARE_SAMPLE} />
      )}
      {((page === 'inspection-performance' && !performance) || (page === 'self-certification' && !selfCert)) && (
        <p className={styles.empty}>No inspection figures are published for {service.name}.</p>
      )}

      <div className={styles.actions}>
        <Button size="sm" hierarchy="secondary" href={DASHBOARD_HREF}>
          Back to EoDB Dashboard
        </Button>
        {hasOther && (
          <Button size="sm" hierarchy="secondary" href={inspectionHref(service.id, other)}>
            {INSPECTION_PAGE_TITLES[other]}
          </Button>
        )}
      </div>
    </div>
  );
}
