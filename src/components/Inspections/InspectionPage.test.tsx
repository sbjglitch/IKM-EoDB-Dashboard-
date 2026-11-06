import { render, screen, within } from '@testing-library/react';
import { SERVICES } from '../../data/services';
import { InspectionPage } from './InspectionPage';

const bp = SERVICES.find((s) => s.id === 'bp')!;
const oc = SERVICES.find((s) => s.id === 'oc')!;

describe('InspectionPage', () => {
  it('shows Inspection Performance as its own page with every building permit category and a total', () => {
    render(<InspectionPage page="inspection-performance" service={bp} />);
    const h1 = screen.getByRole('heading', { level: 1, name: 'Inspection Performance' });
    expect(h1).toHaveFocus();
    expect(screen.queryByText('Sample data')).not.toBeInTheDocument();

    const table = screen.getByRole('table', { name: 'Inspection Performance · Building permit services' });
    for (const h of ['Inspections', 'Conducted', 'Inspection reports', 'Reports beyond timeline']) {
      expect(within(table).getAllByRole('columnheader', { name: h }).length).toBeGreaterThan(0);
    }
    const names = within(table).getAllByRole('rowheader').map((c) => c.textContent);
    expect(names).toEqual([
      'General Building Permit',
      'Regularized Completion',
      'Revised Permit',
      'Partially / Completed Permits for Occupancy',
      'Total',
    ]);

    const row = within(table).getByRole('rowheader', { name: 'General Building Permit' }).closest('tr')!;
    expect(within(row).getByText('3,16,914')).toBeInTheDocument();
    expect(within(row).getByText('30.8% of applications')).toBeInTheDocument();
    expect(within(row).getByText('22.2% of conducted')).toBeInTheDocument();
    expect(within(row).getByText('2,26,90,662')).toBeInTheDocument();
    expect(row).not.toHaveTextContent('of received');

    const total = within(table).getByRole('rowheader', { name: 'Total' }).closest('tr')!;
    expect(total.closest('tfoot')).not.toBeNull();
    expect(within(total).getByText('6,43,587')).toBeInTheDocument();
    expect(within(total).getByText('3,38,116')).toBeInTheDocument();
    expect(within(total).getByText('5,10,93,220')).toBeInTheDocument();
    expect(screen.getByText(/do not add up to conducted/)).toBeInTheDocument();

    // Only this page's table; the other is one link away.
    expect(screen.queryByRole('table', { name: /Self-Certification/ })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Self-Certification and Third-Party Inspection' })).toHaveAttribute(
      'href',
      '#/service/bp/self-certification',
    );
    expect(screen.getByRole('link', { name: 'Back to EoDB Dashboard' })).toHaveAttribute('href', '#/');
  });

  it('shows Self-Certification and Third-Party Inspection as its own page', () => {
    render(<InspectionPage page="self-certification" service={bp} />);
    expect(
      screen.getByRole('heading', { level: 1, name: 'Self-Certification and Third-Party Inspection' }),
    ).toBeInTheDocument();
    const table = screen.getByRole('table', { name: /Self-Certification and Third-Party Inspection/ });
    expect(within(table).getByRole('columnheader', { name: 'Exempted from inspection' })).toBeInTheDocument();
    expect(within(table).getByText('42,310')).toBeInTheDocument();
    expect(within(table).getByText('23.3% of enterprises')).toBeInTheDocument();
    expect(screen.getByText('Sample data')).toBeInTheDocument();
    expect(screen.getByText(/Not real K-SMART data/)).toBeInTheDocument();
    expect(screen.queryByRole('table', { name: /Inspection Performance/ })).not.toBeInTheDocument();
  });

  it('says so when a service has no inspection figures', () => {
    render(<InspectionPage page="inspection-performance" service={oc} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('No inspection figures are published for Ownership Change.')).toBeInTheDocument();
  });
});
