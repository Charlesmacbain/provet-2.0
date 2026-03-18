/**
 * Chart timeline data.
 * @module data/chart-data
 */

/**
 * Generate chart timeline entries for a given pet name.
 * @param {string} petName - Name of the patient
 * @returns {Array<Object>} Timeline entries
 */
export function CHART_TIMELINE_ENTRIES(petName) {
  return [
    { date: 'Mar 14, 2026', type: 'consultation', title: 'Annual wellness exam', note: `${petName} appears healthy overall. Weight stable. Heart and lungs clear. Dental grade 1 \u2014 mild tartar on upper premolars. Recommend dental cleaning within 6 months.`, vet: 'Dr. Sarah Smith' },
    { date: 'Feb 28, 2026', type: 'vaccination', title: 'Rabies booster administered', note: '3-year rabies vaccine administered in right rear leg. No adverse reaction observed. Next due: Feb 2029.', vet: 'Dr. Katie Brown' },
    { date: 'Jan 15, 2026', type: 'lab', title: 'Blood panel \u2014 routine', note: 'CBC and chemistry panel within normal limits. BUN 18, creatinine 1.1, ALT 42. Glucose 95. All values WNL.', vet: 'Dr. Sarah Smith' },
    { date: 'Nov 20, 2025', type: 'consultation', title: 'Skin irritation \u2014 left flank', note: 'Owner reports intermittent scratching for 2 weeks. Mild erythema on left flank. No parasites on skin scraping. Prescribed Apoquel 16mg daily for 14 days.', vet: 'Dr. Mike Johnson' },
    { date: 'Sep 5, 2025', type: 'followup', title: 'Post-dental follow-up', note: 'Dental cleaning performed Sep 1. Healing well, no signs of infection. Owner reports eating normally. Suture site clean.', vet: 'Dr. Sarah Smith' },
    { date: 'Sep 1, 2025', type: 'surgery', title: 'Dental cleaning + extraction', note: 'Grade 2 periodontal disease. Full scaling and polishing. Tooth #108 extracted due to root resorption. Prescribed Metacam for 3 days.', vet: 'Dr. Mike Johnson' },
  ];
}
