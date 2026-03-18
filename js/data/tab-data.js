// Chart tab — medical timeline entries (template, uses petName variable at runtime)
export const CHART_TIMELINE_ENTRIES = [
  { date: 'Mar 14, 2026', type: 'consultation', title: 'Annual wellness exam', noteTemplate: '{petName} appears healthy overall. Weight stable. Heart and lungs clear. Dental grade 1 \u2014 mild tartar on upper premolars. Recommend dental cleaning within 6 months.', vet: 'Dr. Sarah Smith' },
  { date: 'Feb 28, 2026', type: 'vaccination', title: 'Rabies booster administered', noteTemplate: '3-year rabies vaccine administered in right rear leg. No adverse reaction observed. Next due: Feb 2029.', vet: 'Dr. Katie Brown' },
  { date: 'Jan 15, 2026', type: 'lab', title: 'Blood panel \u2014 routine', noteTemplate: 'CBC and chemistry panel within normal limits. BUN 18, creatinine 1.1, ALT 42. Glucose 95. All values WNL.', vet: 'Dr. Sarah Smith' },
  { date: 'Nov 20, 2025', type: 'consultation', title: 'Skin irritation \u2014 left flank', noteTemplate: 'Owner reports intermittent scratching for 2 weeks. Mild erythema on left flank. No parasites on skin scraping. Prescribed Apoquel 16mg daily for 14 days.', vet: 'Dr. Mike Johnson' },
  { date: 'Sep 5, 2025', type: 'followup', title: 'Post-dental follow-up', noteTemplate: 'Dental cleaning performed Sep 1. Healing well, no signs of infection. Owner reports eating normally. Suture site clean.', vet: 'Dr. Sarah Smith' },
  { date: 'Sep 1, 2025', type: 'surgery', title: 'Dental cleaning + extraction', noteTemplate: 'Grade 2 periodontal disease. Full scaling and polishing. Tooth #108 extracted due to root resorption. Prescribed Metacam for 3 days.', vet: 'Dr. Mike Johnson' },
];

// Medications tab — current and past medications list (some values are species-dependent)
export const MEDICATIONS_LIST = [
  { name: 'Apoquel (Oclacitinib)', dose: '16mg tablet', freq: '1 tablet twice daily then once daily', prescribed: 'Nov 20, 2025', status: 'active', refills: '2 remaining' },
  { name: 'Metacam (Meloxicam)', dose: '1.5mg/mL oral suspension', freq: '0.1mg/kg once daily with food', prescribed: 'Sep 1, 2025', status: 'completed', refills: '\u2014' },
  { name: 'Heartgard Plus', doseCanine: '272mcg chewable', doseFeline: '57mcg chewable', freq: '1 tablet monthly', prescribed: 'Jan 15, 2026', status: 'active', refills: '6 remaining' },
  { name: 'Nexgard (Afoxolaner)', doseCanine: '68mg chewable', doseFeline: '11.3mg chewable', freq: '1 tablet monthly', prescribed: 'Jan 15, 2026', status: 'active', refills: '6 remaining' },
  { name: 'Amoxicillin-Clavulanate', dose: '250mg tablet', freq: '1 tablet twice daily for 10 days', prescribed: 'Sep 1, 2025', status: 'completed', refills: '\u2014' },
];

// Immunizations tab — canine vaccine schedule
export const CANINE_VACCINES = [
  { name: 'DA2PP (Core)', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '4/4' },
  { name: 'Rabies', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '2/2' },
  { name: 'Bordetella', last: 'Jan 15, 2026', next: 'Jul 15, 2026', status: 'current', series: '2/2' },
  { name: 'Leptospirosis', last: 'Jan 15, 2026', next: 'Jan 15, 2027', status: 'current', series: '2/2' },
  { name: 'Canine Influenza (H3N2/H3N8)', last: 'Oct 5, 2025', next: 'Oct 5, 2026', status: 'current', series: '2/2' },
  { name: 'Lyme Disease', last: '\u2014', next: '\u2014', status: 'not started', series: '0/2' },
];

// Immunizations tab — feline vaccine schedule
export const FELINE_VACCINES = [
  { name: 'FVRCP (Core)', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '3/3' },
  { name: 'Rabies', last: 'Feb 28, 2026', next: 'Feb 28, 2029', status: 'current', series: '2/2' },
  { name: 'FeLV (Feline Leukemia)', last: 'Mar 10, 2023', next: 'Mar 10, 2026', status: 'overdue', series: '2/2' },
  { name: 'Bordetella', last: '\u2014', next: '\u2014', status: 'not started', series: '0/1' },
];

// Labs tab — lab panel results with test values and reference ranges
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

// Billing tab — unbilled line items for the current visit
export const BILLING_LINE_ITEMS = [
  { id: 'LI-001', desc: 'Consultation \u2014 annual wellness exam', qty: 1, unitPrice: 85.00, total: 85.00, checked: true },
  { id: 'LI-002', desc: 'DA2PP vaccination', qty: 1, unitPrice: 32.00, total: 32.00, checked: true },
  { id: 'LI-003', desc: 'Rabies vaccination', qty: 1, unitPrice: 28.00, total: 28.00, checked: true },
  { id: 'LI-004', desc: 'Ear flush \u2014 Epi-Otic (in-clinic)', qty: 1, unitPrice: 18.00, total: 18.00, checked: false },
  { id: 'LI-005', desc: 'Epi-Otic ear cleanser \u2014 dispense 120ml', qty: 1, unitPrice: 22.50, total: 22.50, checked: false },
  { id: 'LI-006', desc: 'Fecal exam \u2014 routine', qty: 1, unitPrice: 35.00, total: 35.00, checked: false },
];

// Billing tab — invoice history for the patient
export const BILLING_INVOICES = [
  { id: 'INV-2026-0341', date: 'Mar 14, 2026', desc: 'Annual wellness exam', amount: '$145.00', status: 'unpaid' },
  { id: 'INV-2026-0298', date: 'Feb 28, 2026', desc: 'Rabies booster vaccination', amount: '$65.00', status: 'paid' },
  { id: 'INV-2026-0215', date: 'Jan 15, 2026', desc: 'Blood panel \u2014 routine', amount: '$210.00', status: 'paid' },
  { id: 'INV-2025-1104', date: 'Nov 20, 2025', desc: 'Consultation \u2014 skin irritation + Apoquel Rx', amount: '$185.00', status: 'paid' },
  { id: 'INV-2025-0901', date: 'Sep 1, 2025', desc: 'Dental cleaning + extraction (#108)', amount: '$890.00', status: 'paid' },
  { id: 'INV-2025-0905', date: 'Sep 5, 2025', desc: 'Post-dental follow-up', amount: '$0.00', status: 'paid' },
];

// Tasks tab — task items (templates, use ctx.pet and ctx.client at runtime)
export const TASKS_LIST_TEMPLATE = [
  { titleTemplate: 'Review {pet}\'s lab results and update treatment plan', assignee: 'Dr. Sarah Smith', due: 'Today', priority: 'high', done: false },
  { titleTemplate: 'Call {client} to discuss follow-up options', assignee: 'Katie Brown', due: 'Today', priority: 'medium', done: false },
  { titleTemplate: 'Schedule {pet}\'s next vaccination appointment', assignee: 'Reception', due: 'Mar 18', priority: 'medium', done: false },
  { titleTemplate: 'Order prescription refill', assignee: 'Pharmacy', due: 'Mar 19', priority: 'low', done: false },
  { titleTemplate: 'Update {pet}\'s weight in medical record', assignee: 'Dr. Sarah Smith', due: 'Mar 14', priority: 'low', done: true },
  { titleTemplate: 'Send vaccination certificate to {client}', assignee: 'Katie Brown', due: 'Mar 10', priority: 'medium', done: true },
  { titleTemplate: 'File insurance claim for dental procedure', assignee: 'Billing', due: 'Mar 5', priority: 'medium', done: true },
];

// Forms tab — consent and documentation forms
export const FORMS_LIST = [
  { name: 'Patient Intake Form', desc: 'New patient registration and medical history', icon: 'clipboard-list', color: 'blue', status: 'completed', date: 'Jan 8, 2024' },
  { name: 'Surgical Consent Form', desc: 'Anaesthesia and procedure consent', icon: 'file-heart', color: 'red', status: 'completed', date: 'Sep 1, 2025' },
  { name: 'Vaccination Consent', desc: 'Annual vaccination authorisation', icon: 'shield-check', color: 'green', status: 'completed', date: 'Feb 28, 2026' },
  { name: 'Estimate Approval', desc: 'Treatment cost estimate \u2014 dental cleaning', icon: 'receipt', color: 'orange', status: 'completed', date: 'Aug 25, 2025' },
  { name: 'Discharge Instructions', desc: 'Post-procedure care and medication guide', icon: 'file-text', color: 'purple', status: 'completed', date: 'Sep 1, 2025' },
  { name: 'Annual Wellness Consent', desc: 'Wellness exam and blood panel authorisation', icon: 'heart-pulse', color: 'blue', status: 'pending', date: '' },
  { name: 'Boarding Agreement', desc: 'Terms and conditions for overnight boarding', icon: 'home', color: 'orange', status: 'not sent', date: '' },
];

// Stock history tab — Metacam order history
export const STOCK_HISTORY_ORDERS = [
  { date: 'Mar 1, 2026', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0089', cost: '$285.00' },
  { date: 'Feb 1, 2026', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0054', cost: '$285.00' },
  { date: 'Jan 5, 2026', qty: '15 units', supplier: 'Boehringer Ingelheim', po: 'PO-2026-0012', cost: '$427.50' },
  { date: 'Dec 2, 2025', qty: '10 units', supplier: 'Boehringer Ingelheim', po: 'PO-2025-0298', cost: '$285.00' },
];

// Stock usage tab — Metacam dispensing log
export const STOCK_USAGE_LOG = [
  { date: 'Mar 14, 2026', patient: 'Milo (Labrador)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 12, 2026', patient: 'Rex (German Shepherd)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
  { date: 'Mar 10, 2026', patient: 'Nala (Mixed Breed)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
  { date: 'Mar 8, 2026', patient: 'Buddy (Golden Retriever)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 5, 2026', patient: 'Daisy (Beagle)', qty: '1 unit', vet: 'Dr. Katie Brown' },
  { date: 'Mar 3, 2026', patient: 'Archie (Mixed Breed)', qty: '1 unit', vet: 'Dr. Sarah Smith' },
  { date: 'Mar 1, 2026', patient: 'Pepper (Domestic Shorthair)', qty: '1 unit', vet: 'Dr. Mike Johnson' },
];
