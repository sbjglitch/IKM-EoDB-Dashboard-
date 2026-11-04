import { useState } from 'react';
import { SERVICES } from './data/services';
import { formatINR, pct } from './lib/format';
import { totals } from './lib/derive';
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
import { KeyHighlights } from './components/KeyHighlights/KeyHighlights';
import { KpiCard } from './components/KpiCard/KpiCard';
import { ALL_SERVICES, OutcomeCard } from './components/OutcomeCard/OutcomeCard';
import { ServiceTable } from './components/ServiceTable/ServiceTable';
import { WebPortalHeader, type Language } from './components/WebPortalHeader/WebPortalHeader';
import styles from './App.module.css';

export function App() {
  // Translations are not available yet, so the picker is stored but content stays English.
  const [language, setLanguage] = useState<Language>('en');
  const [selectedId, setSelectedId] = useState<string>(ALL_SERVICES);

  const t = totals(SERVICES);
  const active = SERVICES.filter((s) => s.received > 0).length;

  return (
    <>
      <WebPortalHeader language={language} onLanguageChange={setLanguage} />
      <Breadcrumb />
      <main>
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
                note={`Across ${active} services with applications`}
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
            <OutcomeCard services={SERVICES} selectedId={selectedId} onSelect={setSelectedId} />
            <KeyHighlights />
          </section>

          <ServiceTable services={SERVICES} onServiceOpen={setSelectedId}>
            <Definitions />
          </ServiceTable>
        </div>
      </main>
      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </>
  );
}
