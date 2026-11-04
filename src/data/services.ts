// Source: live K-SMART EoDB dashboard, read 2 Nov 2026.
// The live dashboard writes fees as "150/4000" (statutory / average) and
// Rejected/Returned as one "917/33267" cell; we store them split.
// It also spells "Ammendment"; we display "Amendment".
export type Category = 'build' | 'trade' | 'prop';

export interface Service {
  id: string;
  name: string;
  category: Category;
  statutoryFee: number | null; // ₹
  averageFee: number | null; // ₹
  feeNote?: 'Slab-based' | 'No fee';
  rtsLimitDays: number; // 'Same day' is stored as 1
  rtsLimitLabel: string;
  received: number;
  approved: number;
  rejected: number;
  returned: number;
  avgDays: number;
  medianDays: number;
  maxDays: number;
  minDays: number;
}

export const SERVICES: Service[] = [
  { id: 'bp', name: 'Building Permit', category: 'build', statutoryFee: 150, averageFee: 4000, rtsLimitDays: 15, rtsLimitLabel: '15 days', received: 276849, approved: 170580, rejected: 917, returned: 33267, avgDays: 13, medianDays: 8, maxDays: 15, minDays: 6 },
  { id: 'cli', name: 'Construction Level Inspection', category: 'build', statutoryFee: 150, averageFee: 4000, rtsLimitDays: 15, rtsLimitLabel: '15 days', received: 7922, approved: 3569, rejected: 73, returned: 723, avgDays: 12, medianDays: 7, maxDays: 15, minDays: 7 },
  { id: 'occ', name: 'Occupancy Certificate', category: 'build', statutoryFee: 100, averageFee: null, rtsLimitDays: 15, rtsLimitLabel: '15 days', received: 115860, approved: 52919, rejected: 487, returned: 12564, avgDays: 11, medianDays: 12, maxDays: 15, minDays: 3 },
  { id: 'mt', name: 'Mobile Tower and Communication', category: 'build', statutoryFee: 10000, averageFee: null, rtsLimitDays: 15, rtsLimitLabel: '15 days', received: 669, approved: 669, rejected: 0, returned: 0, avgDays: 12, medianDays: 7, maxDays: 15, minDays: 7 },
  { id: 'tln', name: 'Trade License – New', category: 'trade', statutoryFee: null, averageFee: null, feeNote: 'Slab-based', rtsLimitDays: 7, rtsLimitLabel: '7 days', received: 201150, approved: 116524, rejected: 6946, returned: 32303, avgDays: 4, medianDays: 3, maxDays: 7, minDays: 1 },
  { id: 'tlr', name: 'Trade License – Renewal', category: 'trade', statutoryFee: null, averageFee: null, feeNote: 'Slab-based', rtsLimitDays: 1, rtsLimitLabel: 'Same day', received: 704281, approved: 580159, rejected: 6261, returned: 44385, avgDays: 2, medianDays: 2, maxDays: 5, minDays: 1 },
  { id: 'tla', name: 'Trade License – Amendment', category: 'trade', statutoryFee: null, averageFee: null, feeNote: 'No fee', rtsLimitDays: 7, rtsLimitLabel: '7 days', received: 25319, approved: 18216, rejected: 1785, returned: 1091, avgDays: 4, medianDays: 3, maxDays: 7, minDays: 1 },
  { id: 'pt', name: 'Property Tax', category: 'prop', statutoryFee: null, averageFee: null, feeNote: 'No fee', rtsLimitDays: 15, rtsLimitLabel: '15 days', received: 0, approved: 0, rejected: 0, returned: 0, avgDays: 12, medianDays: 7, maxDays: 15, minDays: 7 },
  { id: 'oc', name: 'Ownership Change', category: 'prop', statutoryFee: 100, averageFee: null, rtsLimitDays: 30, rtsLimitLabel: '30 days', received: 319501, approved: 176495, rejected: 2584, returned: 42230, avgDays: 18, medianDays: 16, maxDays: 30, minDays: 9 },
];
