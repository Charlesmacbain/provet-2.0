/**
 * Stock order history and usage data.
 * @module data/stock-data
 */

/** @type {Array<Object>} Stock order history entries */
export const STOCK_ORDERS = [
  { date: 'Mar 1, 2026', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0089', cost: '$285.00' },
  { date: 'Feb 1, 2026', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0054', cost: '$285.00' },
  { date: 'Jan 5, 2026', qty: '15 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0012', cost: '$427.50' },
  { date: 'Dec 2, 2025', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2025-0298', cost: '$285.00' },
];

/** @type {Array<Object>} Stock usage log entries */
export const STOCK_USAGE = [
  { date: 'Mar 14, 2026', patient: 'Milo (Labrador)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 12, 2026', patient: 'Rex (German Shepherd)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
  { date: 'Mar 10, 2026', patient: 'Nala (Mixed Breed)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
  { date: 'Mar 8, 2026', patient: 'Buddy (Golden Retriever)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 5, 2026', patient: 'Daisy (Beagle)', qty: '1 unit', vet: 'Dr. Katie Brown' },
  { date: 'Mar 3, 2026', patient: 'Archie (Mixed Breed)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 1, 2026', patient: 'Pepper (Domestic Shorthair)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
];
