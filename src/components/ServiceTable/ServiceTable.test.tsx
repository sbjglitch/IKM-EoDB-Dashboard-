import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SERVICES } from '../../data/services';
import { ServiceTable } from './ServiceTable';

const bodyRows = () =>
  screen
    .getAllByRole('row')
    .filter((r) => r.closest('tbody') && within(r).queryByRole('rowheader'));
const names = () => bodyRows().map((r) => within(r).getByRole('rowheader').textContent ?? '');

describe('ServiceTable', () => {
  it('renders 9 services and a total row', () => {
    render(<ServiceTable services={SERVICES} />);
    expect(bodyRows()).toHaveLength(9);
    const foot = screen.getAllByRole('row').find((r) => r.closest('tfoot'))!;
    expect(within(foot).getByText('Total · All services')).toBeInTheDocument();
    expect(within(foot).getByText('16,51,551')).toBeInTheDocument();
    expect(within(foot).getByText('11,19,131')).toBeInTheDocument();
    expect(within(foot).getByText('67.8%')).toBeInTheDocument();
    expect(within(foot).getByText('1,66,563')).toBeInTheDocument();
    expect(within(foot).getByText('19,053')).toBeInTheDocument();
  });

  it('sorts numbers descending first, then reverses; name ascending first', async () => {
    const user = userEvent.setup();
    render(<ServiceTable services={SERVICES} />);
    const received = screen.getByRole('button', { name: /^Received/ });
    await user.click(received);
    expect(names()[0]).toMatch(/Trade License – Renewal/);
    expect(screen.getByRole('columnheader', { name: /Received/ })).toHaveAttribute('aria-sort', 'descending');
    await user.click(received);
    expect(names()[0]).toMatch(/Property Tax/);
    expect(screen.getByRole('columnheader', { name: /Received/ })).toHaveAttribute('aria-sort', 'ascending');

    await user.click(screen.getByRole('button', { name: /^Service/ }));
    expect(names()[0]).toMatch(/Building Permit/);
    expect(screen.getByRole('columnheader', { name: /Service/ })).toHaveAttribute('aria-sort', 'ascending');
  });

  it('keeps the total row in the footer when sorting', async () => {
    const user = userEvent.setup();
    render(<ServiceTable services={SERVICES} />);
    await user.click(screen.getByRole('button', { name: /^Max/ }));
    const rows = screen.getAllByRole('row');
    expect(rows[rows.length - 1].closest('tfoot')).not.toBeNull();
  });

  it('expands a row with its own figures, supports several open rows, and reports the service', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<ServiceTable services={SERVICES} onServiceOpen={onOpen} />);
    const bp = screen.getByRole('button', { name: /Show outcomes for Building Permit/ });
    expect(bp).toHaveAttribute('aria-expanded', 'false');
    await user.click(bp);
    expect(bp).toHaveAttribute('aria-expanded', 'true');
    expect(onOpen).toHaveBeenCalledWith('bp');

    const tlr = screen.getByRole('button', { name: /Show outcomes for Trade License – Renewal/ });
    await user.click(tlr);
    expect(bp).toHaveAttribute('aria-expanded', 'true');
    expect(onOpen).toHaveBeenLastCalledWith('tlr');

    const bpDetail = document.getElementById(bp.getAttribute('aria-controls')!)!;
    const tlrDetail = document.getElementById(tlr.getAttribute('aria-controls')!)!;
    expect(bpDetail).toBeVisible();
    // Building Permit: 170580 / 276849 = 61.6%, never Renewal's 82.4%
    expect(bpDetail).toHaveTextContent('Approved 61.6%');
    expect(bpDetail).not.toHaveTextContent('82.4%');
    expect(tlrDetail).toHaveTextContent('Approved 82.4%');
    expect(tlrDetail).toHaveTextContent('Remaining 73,476 (10.4%)');
    expect(within(tlrDetail).getByRole('link', { name: 'View Application List' })).toBeInTheDocument();

    await user.click(bp);
    expect(bp).toHaveAttribute('aria-expanded', 'false');
    expect(bpDetail).not.toBeVisible();
  });

  it('flags only the services that exceed the limit or have no applications', () => {
    render(<ServiceTable services={SERVICES} />);
    const tags = (text: string) =>
      bodyRows().filter((r) => within(within(r).getByRole('rowheader')).queryByText(text));
    expect(tags('Exceeds RTS limit')).toHaveLength(1);
    expect(tags('No applications recorded')).toHaveLength(1);
    expect(within(tags('No applications recorded')[0]).getByRole('rowheader')).toHaveTextContent('Property Tax');
    const renewal = bodyRows().find((r) => /Renewal/.test(r.textContent ?? ''))!;
    expect(within(renewal).getByText('Exceeds RTS limit')).toBeInTheDocument();
  });
});
