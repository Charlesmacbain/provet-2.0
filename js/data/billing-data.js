/**
 * Billing tab data — line items and invoices.
 * @module data/billing-data
 */

/** @type {Array<Object>} Billing line items */
export const BILLING_LINE_ITEMS = [
  { id: 'LI-001', desc: 'Consultation \u2014 annual wellness exam', qty: 1, unitPrice: 85.00, total: 85.00, checked: true },
  { id: 'LI-002', desc: 'DA2PP vaccination', qty: 1, unitPrice: 32.00, total: 32.00, checked: true },
  { id: 'LI-003', desc: 'Rabies vaccination', qty: 1, unitPrice: 28.00, total: 28.00, checked: true },
  { id: 'LI-004', desc: 'Ear flush \u2014 Epi-Otic (in-clinic)', qty: 1, unitPrice: 18.00, total: 18.00, checked: false },
  { id: 'LI-005', desc: 'Epi-Otic ear cleanser \u2014 dispense 120ml', qty: 1, unitPrice: 22.50, total: 22.50, checked: false },
  { id: 'LI-006', desc: 'Fecal exam \u2014 routine', qty: 1, unitPrice: 35.00, total: 35.00, checked: false },
];

/** @type {Array<Object>} Billing invoices */
export const BILLING_INVOICES = [
  { id: 'INV-2026-0341', date: 'Mar 14, 2026', desc: 'Annual wellness exam', amount: '$145.00', status: 'unpaid' },
  { id: 'INV-2026-0298', date: 'Feb 28, 2026', desc: 'Rabies booster vaccination', amount: '$65.00', status: 'paid' },
  { id: 'INV-2026-0215', date: 'Jan 15, 2026', desc: 'Blood panel \u2014 routine', amount: '$210.00', status: 'paid' },
  { id: 'INV-2025-1104', date: 'Nov 20, 2025', desc: 'Consultation \u2014 skin irritation + Apoquel Rx', amount: '$185.00', status: 'paid' },
  { id: 'INV-2025-0901', date: 'Sep 1, 2025', desc: 'Dental cleaning + extraction (#108)', amount: '$890.00', status: 'paid' },
  { id: 'INV-2025-0905', date: 'Sep 5, 2025', desc: 'Post-dental follow-up', amount: '$0.00', status: 'paid' },
];
