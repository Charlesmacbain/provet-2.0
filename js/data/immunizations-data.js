/**
 * Immunization/vaccine data.
 * @module data/immunizations-data
 */

const CANINE_VACCINES = [
  { name: 'DA2PP (Core)', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '4/4' },
  { name: 'Rabies', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '2/2' },
  { name: 'Bordetella', last: 'Jan 15, 2026', next: 'Jul 15, 2026', status: 'current', series: '2/2' },
  { name: 'Leptospirosis', last: 'Jan 15, 2026', next: 'Jan 15, 2027', status: 'current', series: '2/2' },
  { name: 'Canine Influenza (H3N2/H3N8)', last: 'Oct 5, 2025', next: 'Oct 5, 2026', status: 'current', series: '2/2' },
  { name: 'Lyme Disease', last: '\u2014', next: '\u2014', status: 'not started', series: '0/2' },
];

const FELINE_VACCINES = [
  { name: 'FVRCP (Core)', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '3/3' },
  { name: 'Rabies', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '2/2' },
  { name: 'FeLV (Feline Leukemia)', last: 'Mar 10, 2023', next: 'Mar 10, 2026', status: 'overdue', series: '2/2' },
  { name: 'Bordetella', last: '\u2014', next: '\u2014', status: 'not started', series: '0/1' },
];

/**
 * Get the vaccine list based on species.
 * @param {boolean} isCat - True if feline, false if canine
 * @returns {Array<Object>} Vaccine records
 */
export function getVaccineList(isCat) {
  return isCat ? FELINE_VACCINES : CANINE_VACCINES;
}
