import { useEffect, useState } from 'react';
import { INSPECTION_PERFORMANCE_SERVICE_IDS, SELF_CERTIFICATION } from '../data/inspections';

/**
 * Hash routes, so the build stays a static page with no server rewrites.
 * Only hashes starting with "#/" are routes; plain anchors (#terms, #service-table) stay on the dashboard.
 */
export type InspectionPage = 'inspection-performance' | 'self-certification';
export type ServicePage = InspectionPage | 'applications';
export type Route = { page: 'dashboard' } | { page: ServicePage; serviceId: string };

export const DASHBOARD_HREF = '#/';

export const INSPECTION_PAGE_TITLES: Record<InspectionPage, string> = {
  'inspection-performance': 'Inspection Performance',
  'self-certification': 'Self-Certification and Third-Party Inspection',
};

/** Breadcrumb / tab title for a service page. */
export function pageTitle(page: ServicePage, serviceName: string): string {
  return page === 'applications' ? `${serviceName} applications` : INSPECTION_PAGE_TITLES[page];
}

export function servicePageHref(serviceId: string, page: ServicePage): string {
  return `#/service/${serviceId}/${page}`;
}
export const inspectionHref = (serviceId: string, page: InspectionPage) => servicePageHref(serviceId, page);
export const applicationsHref = (serviceId: string) => servicePageHref(serviceId, 'applications');

export function parseRoute(hash: string): Route {
  const m = /^#\/service\/([a-z0-9-]+)\/(applications|inspection-performance|self-certification)\/?$/.exec(hash);
  return m ? { page: m[2] as ServicePage, serviceId: m[1] } : { page: 'dashboard' };
}

/** Inspection pages that have data for this service, in display order. */
export function inspectionLinksFor(serviceId: string): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  if (INSPECTION_PERFORMANCE_SERVICE_IDS.includes(serviceId)) {
    links.push({
      label: INSPECTION_PAGE_TITLES['inspection-performance'],
      href: inspectionHref(serviceId, 'inspection-performance'),
    });
  }
  if (SELF_CERTIFICATION.some((r) => r.serviceId === serviceId)) {
    links.push({
      label: INSPECTION_PAGE_TITLES['self-certification'],
      href: inspectionHref(serviceId, 'self-certification'),
    });
  }
  return links;
}

export function useHashRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}
