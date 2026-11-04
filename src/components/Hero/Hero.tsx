import type { Service } from '../../data/services';
import { APPLY_URL, SOURCE_READ_DATE } from '../../config';
import { formatDays, formatINR, pct } from '../../lib/format';
import { totals, withinLimitCount } from '../../lib/derive';
import { Button } from '../Button/Button';
import { AwardIcon } from '../Icons/Icons';
import styles from './Hero.module.css';

function RankingBadge() {
  return (
    <p className={styles.badge}>
      <AwardIcon size={16} className={styles.badgeIcon} />
      <span>Top Achiever · National Ease of Doing Business rankings 2024</span>
    </p>
  );
}

function ProofTile({ value, description }: { value: string; description: string }) {
  return (
    <div className={styles.tile}>
      <p className={`${styles.tileValue} num`}>{value}</p>
      <p className={styles.tileText}>{description}</p>
    </div>
  );
}

export function Hero({ services }: { services: Service[] }) {
  const t = totals(services);
  const { within, of } = withinLimitCount(services);
  const newLicence = services.find((s) => s.id === 'tln');

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.photo} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.left}>
          <RankingBadge />
          <h1 id="hero-title" className={styles.title}>
            Do Business in Kerala, Online
          </h1>
          <p className={styles.message}>
            Apply for building permits, trade licences and property services on K-SMART, and see how
            quickly local bodies across Kerala process applications.
          </p>
          <div className={styles.actions}>
            <Button size="xl" hierarchy="primary" href={APPLY_URL}>
              Apply on K-SMART
            </Button>
            <Button size="xl" hierarchy="tertiary-grey" href="#service-table">
              See Time Limits
            </Button>
          </div>
        </div>

        <div className={styles.right}>
          <p className={styles.eyebrow}>ACROSS KERALA, THROUGH K-SMART</p>
          <div className={styles.tiles}>
            {newLicence && (
              <ProofTile
                value={formatDays(newLicence.medianDays)}
                description={`Median time to process a new Trade License · limit ${formatDays(newLicence.rtsLimitDays)}`}
              />
            )}
            <ProofTile value={formatINR(t.approved)} description="Applications approved" />
            <ProofTile
              value={`${within} of ${of}`}
              description="Services with applications processed within the RTS limit on average"
            />
            <ProofTile value={pct(t.rejected, t.received)} description="Of applications rejected" />
          </div>
          <p className={styles.source}>Source: K-SMART EoDB dashboard, figures as read on {SOURCE_READ_DATE}.</p>
        </div>
      </div>
    </section>
  );
}
