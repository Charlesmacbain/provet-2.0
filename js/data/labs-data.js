/**
 * Lab panel data.
 * @module data/labs-data
 */

/** @type {Array<Object>} Lab panels with test results */
export const LAB_PANELS = [
  {
    name: 'Complete Blood Panel', date: 'Jan 15, 2026', lab: 'VetPath Diagnostics', orderedBy: 'Dr. Sarah Smith',
    results: [
      { test: 'WBC', value: '8.2 \u00d710\u00b3/\u00b5L', range: '5.5\u201316.9', flag: '' },
      { test: 'RBC', value: '7.1 \u00d710\u2076/\u00b5L', range: '5.5\u20138.5', flag: '' },
      { test: 'Hemoglobin', value: '16.2 g/dL', range: '12.0\u201318.0', flag: '' },
      { test: 'Hematocrit', value: '47%', range: '37\u201355', flag: '' },
      { test: 'Platelets', value: '285 \u00d710\u00b3/\u00b5L', range: '175\u2013500', flag: '' },
      { test: 'BUN', value: '18 mg/dL', range: '7\u201327', flag: '' },
      { test: 'Creatinine', value: '1.1 mg/dL', range: '0.5\u20131.8', flag: '' },
      { test: 'ALT', value: '42 U/L', range: '10\u2013125', flag: '' },
      { test: 'Glucose', value: '95 mg/dL', range: '74\u2013143', flag: '' },
      { test: 'Total Protein', value: '6.8 g/dL', range: '5.2\u20138.2', flag: '' },
    ]
  },
  {
    name: 'Thyroid Panel', date: 'Nov 20, 2025', lab: 'VetPath Diagnostics', orderedBy: 'Dr. Mike Johnson',
    results: [
      { test: 'T4 (Total)', value: '2.1 \u00b5g/dL', range: '1.0\u20134.0', flag: '' },
      { test: 'Free T4', value: '22 pmol/L', range: '12\u201335', flag: '' },
      { test: 'TSH', value: '0.18 ng/mL', range: '0.05\u20130.42', flag: '' },
    ]
  },
  {
    name: 'Urinalysis', date: 'Sep 5, 2025', lab: 'In-house', orderedBy: 'Dr. Sarah Smith',
    results: [
      { test: 'Specific Gravity', value: '1.035', range: '1.015\u20131.045', flag: '' },
      { test: 'pH', value: '6.5', range: '5.5\u20137.5', flag: '' },
      { test: 'Protein', value: 'Negative', range: 'Negative', flag: '' },
      { test: 'Glucose', value: 'Negative', range: 'Negative', flag: '' },
      { test: 'WBC', value: '0\u20132 /HPF', range: '0\u20135', flag: '' },
    ]
  }
];
