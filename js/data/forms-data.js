/**
 * Forms and consent data.
 * @module data/forms-data
 */

/** @type {Array<Object>} Form items for the Forms tab */
export const FORMS_LIST = [
  { name: 'Patient Intake Form', desc: 'New patient registration and medical history', icon: 'clipboard-list', color: 'blue', status: 'completed', date: 'Jan 8, 2024' },
  { name: 'Surgical Consent Form', desc: 'Anaesthesia and procedure consent', icon: 'file-heart', color: 'red', status: 'completed', date: 'Sep 1, 2025' },
  { name: 'Vaccination Consent', desc: 'Annual vaccination authorisation', icon: 'shield-check', color: 'green', status: 'completed', date: 'Feb 28, 2026' },
  { name: 'Estimate Approval', desc: 'Treatment cost estimate \u2014 dental cleaning', icon: 'receipt', color: 'orange', status: 'completed', date: 'Aug 25, 2025' },
  { name: 'Discharge Instructions', desc: 'Post-procedure care and medication guide', icon: 'file-text', color: 'purple', status: 'completed', date: 'Sep 1, 2025' },
  { name: 'Annual Wellness Consent', desc: 'Wellness exam and blood panel authorisation', icon: 'heart-pulse', color: 'blue', status: 'pending', date: '' },
  { name: 'Boarding Agreement', desc: 'Terms and conditions for overnight boarding', icon: 'home', color: 'orange', status: 'not sent', date: '' },
];
