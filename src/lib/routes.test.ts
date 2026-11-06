import { inspectionHref, inspectionLinksFor, parseRoute } from './routes';

describe('routes', () => {
  it('parses inspection pages and treats everything else as the dashboard', () => {
    expect(parseRoute('#/service/bp/inspection-performance')).toEqual({
      page: 'inspection-performance',
      serviceId: 'bp',
    });
    expect(parseRoute('#/service/bp/self-certification/')).toEqual({ page: 'self-certification', serviceId: 'bp' });
    for (const h of ['', '#/', '#terms', '#service-table', '#application-list', '#/service/bp/unknown']) {
      expect(parseRoute(h)).toEqual({ page: 'dashboard' });
    }
  });

  it('round-trips the links it builds', () => {
    expect(parseRoute(inspectionHref('bp', 'self-certification'))).toEqual({
      page: 'self-certification',
      serviceId: 'bp',
    });
  });

  it('offers inspection pages only for services that have inspection data', () => {
    expect(inspectionLinksFor('bp').map((l) => l.label)).toEqual([
      'Inspection Performance',
      'Self-Certification and Third-Party Inspection',
    ]);
    expect(inspectionLinksFor('tlr')).toEqual([]);
  });
});
