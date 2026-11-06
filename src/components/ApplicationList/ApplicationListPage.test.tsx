import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SERVICES } from '../../data/services';
import { sampleApplications } from '../../data/applications';
import { formatRupees } from '../../lib/format';
import { ApplicationListPage } from './ApplicationListPage';

const svc = (id: string) => SERVICES.find((s) => s.id === id)!;
const bodyRows = () => within(screen.getByRole('table')).getAllByRole('row').slice(1);

describe('ApplicationListPage', () => {
  it('lists approved Building Permit applications with the real count and pages of 10', async () => {
    const user = userEvent.setup();
    render(<ApplicationListPage service={svc('bp')} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Building Permit · Approved applications' })).toHaveFocus();
    expect(screen.getByText(/1,70,580 approved applications on K-SMART/)).toBeInTheDocument();
    expect(screen.getByText('Sample data')).toBeInTheDocument();
    expect(bodyRows()).toHaveLength(10);
    expect(screen.getByText(/Showing 1–10 of 24 sample applications/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Page 3' }));
    expect(bodyRows()).toHaveLength(4);
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('filters by decision and by application number', async () => {
    const user = userEvent.setup();
    render(<ApplicationListPage service={svc('bp')} />);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Decision' }), 'rejected');
    expect(screen.getByRole('heading', { level: 1, name: 'Building Permit · Rejected applications' })).toBeInTheDocument();
    expect(screen.getByText(/917 rejected applications/)).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rejected on' })).toBeInTheDocument();

    const target = sampleApplications(svc('bp'), 'rejected')[5].applicationNo;
    await user.type(screen.getByRole('searchbox', { name: 'Search by application number' }), target.slice(-6));
    expect(bodyRows()).toHaveLength(1);
    expect(screen.getByRole('rowheader', { name: target })).toBeInTheDocument();

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'ZZZ');
    expect(screen.getByText('No application number matches “ZZZ”.')).toBeInTheDocument();
  });

  it('opens fee details, closes on Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    render(<ApplicationListPage service={svc('bp')} />);
    const a = sampleApplications(svc('bp'), 'approved')[0];
    const opener = screen.getByRole('button', { name: `View fees for ${a.applicationNo}` });
    await user.click(opener);

    const dialog = screen.getByRole('dialog', { name: 'Fee details' });
    expect(within(dialog).getByText(`${a.applicationNo} · ${a.localBody}`)).toBeInTheDocument();
    expect(within(dialog).getByText(a.receiptNo!)).toBeInTheDocument();
    const total = a.fees!.reduce((n, f) => n + f.amount, 0);
    const totalRow = within(dialog).getByRole('rowheader', { name: 'Total paid' }).closest('tr')!;
    expect(totalRow).toHaveTextContent(formatRupees(total));
    expect(within(dialog).getByRole('button', { name: 'Close fee details' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('shows "No fee" for services without a fee, and an empty state with no applications', () => {
    const { unmount } = render(<ApplicationListPage service={svc('tla')} />);
    expect(screen.getAllByText('No fee').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: /View fees/ })).not.toBeInTheDocument();
    unmount();

    render(<ApplicationListPage service={svc('pt')} />);
    expect(screen.getByText('No applications recorded for Property Tax.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
