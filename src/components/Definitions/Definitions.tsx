import styles from './Definitions.module.css';

// Draft copy: confirm wording with the K-SMART team before launch.
const TERMS: { term: string; description: string }[] = [
  {
    term: 'Statutory / avg fee',
    description: 'The statutory fee for the service and, where recorded, the average fee. Some services are slab-based or have no fee.',
  },
  {
    term: 'RTS limit',
    description: 'The time limit set for the service under the Right to Service rules. A service is tagged "Exceeds RTS limit" when its average or maximum time is above this limit.',
  },
  {
    term: 'Returned and Rejected',
    description: 'Returned applications were sent back to the applicant. Rejected applications were refused. Percentages are shares of applications received.',
  },
  {
    term: 'Remaining*',
    description: 'Applications received that are not counted as approved, returned or rejected: received minus those three.',
  },
  {
    term: 'Time taken to process (days)',
    description: 'The minimum, median, average and maximum number of days taken. Times are not totalled across services.',
  },
];

export function Definitions() {
  return (
    <div className={styles.wrap}>
      <h3 className="visually-hidden">Definitions</h3>
      <dl className={styles.list}>
        {TERMS.map((t) => (
          <div key={t.term} className={styles.item}>
            <dt className={styles.term}>{t.term}</dt>
            <dd className={styles.description}>{t.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
