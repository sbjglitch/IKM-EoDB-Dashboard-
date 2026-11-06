import { render, screen, within } from '@testing-library/react';
import { SERVICES } from '../../data/services';
import { InspectionPage } from './InspectionPage';

const bp = SERVICES.find((s) => s.id === 'bp')!;
const oc = SERVICES.find((s) => s.id === 'oc')!;

describe('InspectionPage', () => {
  it('shows Inspection Performance as its own page with the Building Permit row', () => {
    render(<InspectionPage page="inspection-performance" service={bp} />);
    const h1 = screen.getByRole('heading', { level: 1, name: 'Inspection Performance' });
    expect(h1).toHaveFocus();
    expect(screen.getByText('Sample data')).toBeInTheDocument();

    const table = screen.getByRole('table', { name: 'Inspection Performance · Building Permit' });
    for (const h of ['Inspections', 'Conducted', 'Reports uploaded', 'Beyond 24 hours']) {
      expect(within(table).getAllByRole('columnheader', { name: h }).length).toBeGreaterThan(0);
    }
    const row = within(table).getByRole('rowheader', { name: 'Building Permit' }).closest('tr')!;
    expect(within(row).getByText('1,18,420')).toBeInTheDocument();
    expect(within(row).getByText('95.3% of requiring')).toBeInTheDocument();
    expect(within(row).getByText('3.5% of conducted')).toBeInTheDocument();
    // No share of received: that would divide sample figures by real totals.
    expect(row).not.toHaveTextContent('of received');
    expect(screen.getByText(/Not real K-SMART data/)).toBeInTheDocument();

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
    expect(screen.queryByRole('table', { name: /Inspection Performance/ })).not.toBeInTheDocument();
  });

  it('says so when a service has no inspection figures', () => {
    render(<InspectionPage page="inspection-performance" service={oc} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByText('No inspection figures are published for Ownership Change.')).toBeInTheDocument();
  });
});
