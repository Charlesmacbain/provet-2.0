// Table page row data — keyed by nav route, used by renderTablePage
export const TABLE_DATA = {
  'diagnostic-imaging': [
    { icon: 'scan', color: '#cf8e3e', name: 'X-Ray \u2014 Milo (Labrador)', sub: 'Left hind leg', health: 'On track', hTime: '2h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 16th', pct: '100%', trend: 'up' },
    { icon: 'scan', color: '#cf8e3e', name: 'Ultrasound \u2014 Bella (Persian)', sub: 'Abdominal scan', health: 'On track', hTime: '3h', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 17th', pct: '40%', trend: 'up' },
    { icon: 'scan', color: '#cf8e3e', name: 'X-Ray \u2014 Rex (Shepherd)', sub: 'Chest radiograph', health: 'At risk', hTime: '5h', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 15th', pct: '80%', trend: 'down' },
    { icon: 'scan', color: '#cf8e3e', name: 'CT Scan \u2014 Daisy (Beagle)', sub: 'Post-surgery follow-up', health: 'On track', hTime: '6h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 18th', pct: '25%', trend: 'up' },
    { icon: 'scan', color: '#cf8e3e', name: 'Ultrasound \u2014 Luna (Siamese)', sub: 'Cardiac assessment', health: 'On track', hTime: '8h', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 19th', pct: '10%', trend: '' },
  ],
  'estimates': [
    { icon: 'file-text', color: '#5e6ad2', name: 'Spay procedure \u2014 Nala', sub: 'Estimate #EST-2041', health: 'On track', hTime: '1h', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 16th', pct: 'Approved', trend: 'up' },
    { icon: 'file-text', color: '#5e6ad2', name: 'Dental cleaning \u2014 Archie', sub: 'Estimate #EST-2042', health: 'On track', hTime: '3h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 17th', pct: 'Pending', trend: '' },
    { icon: 'file-text', color: '#5e6ad2', name: 'Lump removal \u2014 Daisy', sub: 'Estimate #EST-2038', health: 'On track', hTime: '5h', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 14th', pct: 'Approved', trend: 'up' },
    { icon: 'file-text', color: '#5e6ad2', name: 'Vaccination package \u2014 Puppies', sub: 'Estimate #EST-2043', health: 'At risk', hTime: '1d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 20th', pct: 'Declined', trend: 'down' },
    { icon: 'file-text', color: '#5e6ad2', name: 'Emergency surgery \u2014 Tigger', sub: 'Estimate #EST-2039', health: 'On track', hTime: '2d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 12th', pct: 'Approved', trend: 'up' },
  ],
  'invoices': [
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10232 \u2014 Amy Collins', sub: 'Annual check-up \u00B7 Milo', health: 'On track', hTime: '1h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 16th', pct: 'Paid', trend: 'up' },
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10231 \u2014 David Turner', sub: 'Vaccination \u00B7 Archie', health: 'On track', hTime: '3h', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 15th', pct: 'Paid', trend: 'up' },
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10230 \u2014 Emma Patel', sub: 'Surgery \u00B7 Daisy', health: 'At risk', hTime: '1d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 14th', pct: 'Overdue', trend: 'down' },
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10229 \u2014 Rebecca Young', sub: 'Spay \u00B7 Nala', health: 'On track', hTime: '2d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 13th', pct: 'Pending', trend: '' },
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10228 \u2014 Daniel Reyes', sub: 'Consultation \u00B7 Luna', health: 'On track', hTime: '3d', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 12th', pct: 'Paid', trend: 'up' },
    { icon: 'receipt', color: '#57ab5a', name: 'INV-10227 \u2014 Olivia Zhang', sub: 'Follow-up \u00B7 Rex', health: 'On track', hTime: '3d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 12th', pct: 'Paid', trend: 'up' },
  ],
  'written-prescriptions': [
    { icon: 'pill', color: '#e5534b', name: 'Metacam 1.5mg \u2014 Milo', sub: 'Anti-inflammatory \u00B7 14 days', health: 'On track', hTime: '2h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 16th', pct: 'Active', trend: 'up' },
    { icon: 'pill', color: '#e5534b', name: 'Amoxicillin 250mg \u2014 Rex', sub: 'Antibiotic \u00B7 10 days', health: 'On track', hTime: '1d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 15th', pct: 'Active', trend: '' },
    { icon: 'pill', color: '#e5534b', name: 'Gabapentin 100mg \u2014 Pepper', sub: 'Pain relief \u00B7 7 days', health: 'At risk', hTime: '2d', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 14th', pct: 'Expiring', trend: 'down' },
    { icon: 'pill', color: '#e5534b', name: 'Apoquel 16mg \u2014 Luna', sub: 'Allergy \u00B7 30 days', health: 'On track', hTime: '3d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 10th', pct: 'Active', trend: 'up' },
  ],
  'health-plans': [
    { icon: 'heart-pulse', color: '#c96198', name: 'Puppy Wellness \u2014 Archie', sub: 'David Turner \u00B7 6-month plan', health: 'On track', hTime: '1h', lead: 'KB', leadColor: '#4dab9a', date: 'Sep 2026', pct: '35%', trend: 'up' },
    { icon: 'heart-pulse', color: '#c96198', name: 'Senior Care \u2014 Milo', sub: 'Amy Collins \u00B7 Annual', health: 'On track', hTime: '3h', lead: 'SS', leadColor: '#5e6ad2', date: 'Jan 2027', pct: '60%', trend: 'up' },
    { icon: 'heart-pulse', color: '#c96198', name: 'Kitten Package \u2014 Bella', sub: 'Sarah Chen \u00B7 12-month', health: 'On track', hTime: '2d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 2027', pct: '15%', trend: 'up' },
    { icon: 'heart-pulse', color: '#c96198', name: 'Dental Care \u2014 Daisy', sub: 'Emma Patel \u00B7 6-month', health: 'At risk', hTime: '5d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Jun 2026', pct: '80%', trend: 'down' },
  ],
  'patient-referrals': [
    { icon: 'send', color: '#986ee2', name: 'Rex \u2014 Orthopaedic specialist', sub: 'Olivia Zhang \u00B7 Hip dysplasia', health: 'On track', hTime: '2h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 18th', pct: 'Sent', trend: '' },
    { icon: 'send', color: '#986ee2', name: 'Daisy \u2014 Oncology', sub: 'Emma Patel \u00B7 Lump biopsy', health: 'On track', hTime: '1d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 20th', pct: 'Accepted', trend: 'up' },
    { icon: 'send', color: '#986ee2', name: 'Tigger \u2014 Cardiology', sub: 'Michael Green \u00B7 Heart murmur', health: 'At risk', hTime: '3d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 15th', pct: 'Pending', trend: 'down' },
  ],
  'reminders': [
    { icon: 'bell', color: '#539bf5', name: 'Vaccination \u2014 Luna', sub: 'Daniel Reyes \u00B7 Booster due', health: 'On track', hTime: '1h', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 17th', pct: 'Scheduled', trend: '' },
    { icon: 'bell', color: '#539bf5', name: 'Annual check-up \u2014 Milo', sub: 'Amy Collins \u00B7 Overdue 2 weeks', health: 'At risk', hTime: '2h', lead: 'SS', leadColor: '#5e6ad2', date: 'Mar 2nd', pct: 'Overdue', trend: 'down' },
    { icon: 'bell', color: '#539bf5', name: 'Dental cleaning \u2014 Archie', sub: 'David Turner \u00B7 6 months', health: 'On track', hTime: '1d', lead: 'KB', leadColor: '#4dab9a', date: 'Sep 16th', pct: 'Scheduled', trend: '' },
    { icon: 'bell', color: '#539bf5', name: 'Flea treatment \u2014 Pepper', sub: 'Hannah Wells \u00B7 Monthly', health: 'On track', hTime: '2d', lead: 'SS', leadColor: '#5e6ad2', date: 'Apr 1st', pct: 'Scheduled', trend: 'up' },
    { icon: 'bell', color: '#539bf5', name: 'Spay follow-up \u2014 Nala', sub: 'Rebecca Young \u00B7 2 weeks post-op', health: 'On track', hTime: '3d', lead: 'MJ', leadColor: '#cf8e3e', date: 'Mar 22nd', pct: 'Scheduled', trend: '' },
    { icon: 'bell', color: '#539bf5', name: 'Blood test \u2014 Rex', sub: 'Olivia Zhang \u00B7 Pre-surgery', health: 'On track', hTime: '5d', lead: 'KB', leadColor: '#4dab9a', date: 'Mar 25th', pct: 'Scheduled', trend: 'up' },
  ],
};
