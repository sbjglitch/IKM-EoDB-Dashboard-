import { useEffect, useState } from 'react';
import { SERVICES } from './data/services';
import { formatINR, pct } from './lib/format';
import { totals } from './lib/derive';
import { pageTitle, useHashRoute } from './lib/routes';
import { ApplicationListPage } from './components/ApplicationList/ApplicationListPage';
import { Breadcrumb } from './components/Breadcrumb/Breadcrumb';
import { Definitions } from './components/Definitions/Definitions';
import { Footer } from './components/Footer/Footer';
import { Hero } from './components/Hero/Hero';
import {
  ChartSquareIcon,
  CheckIcon,
  ClockIcon,
  CrossIcon,
  ReturnIcon,
} from './components/Icons/Icons';
import { InspectionPage } from './components/Inspections/InspectionPage';
import { KeyHighlights } from './components/KeyHighlights/KeyHighlights';
import { KpiCard } from './components/KpiCard/KpiCard';
import { ALL_SERVICES, OutcomeCard } from './components/OutcomeCard/OutcomeCard';
import { ServiceTable } from './components/ServiceTable/ServiceTable';
import { WebPortalHeader, type Language } from './components/WebPortalHeader/WebPortalHeader';
import styles from './App.module.css';

const DASHBOARD_TITLE = 'EoDB Dashboard · K-SMART';

function Dashboard({
  selectedId,
  onSelect,
  returning,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  /** True when coming back from an inspection page: land on the service table, not the hero. */
  returning: boolean;
}) {
  const t = totals(SERVICES);
  const active = SERVICES.filter((s) => s.received > 0).length;

  useEffect(() => {
    if (returning) document.getElementById('service-table')?.scrollIntoView();
  }, [returning]);

  return (
    <>
      <Hero services={SERVICES} />
      <div className={styles.content}>
        <section aria-labelledby="summary-title" className={styles.section}>
          <h2 id="summary-title" className={styles.sectionTitle}>
            Summary · All services
          </h2>
          <div className={styles.kpis}>
            <KpiCard
              icon={<ChartSquareIcon style={{ color: 'var(--colour-icon-subtle)' }} />}
              label="Received"
              value={formatINR(t.received)}
              note={`Across ${active} services`}
            />
            <KpiCard
              icon={<CheckIcon style={{ color: 'var(--colour-icon-success)' }} />}
              label="Approved"
              value={formatINR(t.approved)}
              note={`${pct(t.approved, t.received)} of received`}
            />
            <KpiCard
              icon={<ReturnIcon style={{ color: 'var(--colour-icon-brand-lightblue)' }} />}
              label="Returned"
              value={formatINR(t.returned)}
              note={`${pct(t.returned, t.received)} of received`}
            />
            <KpiCard
              icon={<CrossIcon style={{ color: 'var(--colour-red-500)' }} />}
              label="Rejected"
              value={formatINR(t.rejected)}
              note={`${pct(t.rejected, t.received)} of received`}
            />
            <KpiCard
              icon={<ClockIcon style={{ color: 'var(--colour-icon-brand-darkblue)' }} />}
              label="Remaining*"
              value={formatINR(t.remaining)}
              note={`${pct(t.remaining, t.received)} of received`}
            />
          </div>
        </section>

        <section aria-label="Application outcomes and key highlights" className={styles.outcomes}>
          <OutcomeCard services={SERVICES} selectedId={selectedId} onSelect={onSelect} />
          <KeyHighlights services={SERVICES} />
        </section>

        <ServiceTable services={SERVICES} onServiceOpen={onSelect}>
          <Definitions />
        </ServiceTable>
      </div>
    </>
  );
}

export function App() {
  // Translations are not available yet, so the picker is stored but content stays English.
  const [language, setLanguage] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState<string>(ALL_SERVICES);
  const route = useHashRoute();

  const pageRoute = route.page === 'dashboard' ? null : route;
  const service = pageRoute ? SERVICES.find((s) => s.id === pageRoute.serviceId) : undefined;
  // An unknown service id falls back to the dashboard.
  const page = pageRoute && service ? pageRoute.page : null;
  const title = page && service ? pageTitle(page, service.name) : undefined;

  // Coming back from an inspection page lands on the service table (state adjusted during render).
  const [prevPage, setPrevPage] = useState(page);
  const [returning, setReturning] = useState(false);
  if (prevPage !== page) {
    setPrevPage(page);
    setReturning(prevPage !== null && page === null);
  }

  useEffect(() => {
    const named = page === 'applications' || !service ? title : `${title} · ${service.name}`;
    document.title = title ? `${named} · ${DASHBOARD_TITLE}` : DASHBOARD_TITLE;
  }, [title, service, page]);

  return (
    <>
      <WebPortalHeader language={language} onLanguageChange={setLanguage} />
      <Breadcrumb trail={title ? [{ label: title }] : []} />
      <main>
        {service && page === 'applications' ? (
          <ApplicationListPage key={service.id} service={service} />
        ) : service && (page === 'inspection-performance' || page === 'self-certification') ? (
          <InspectionPage page={page} service={service} />
        ) : (
          <Dashboard selectedId={selectedId} onSelect={setSelectedId} returning={returning} />
        )}
      </main>
      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </>
  );
}
