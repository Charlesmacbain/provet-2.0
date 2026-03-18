/**
 * Medications data.
 * @module data/medications-data
 */

/**
 * Generate medications list based on context (species-aware dosing).
 * @param {Object} ctx - Context with species property
 * @returns {Array<Object>} Medications list
 */
export function MEDICATIONS_LIST(ctx) {
  return [
    { name: 'Apoquel (Oclacitinib)', dose: '16mg tablet', freq: '1 tablet twice daily then once daily', prescribed: 'Nov 20, 2025', status: 'active', refills: '2 remaining' },
    { name: 'Metacam (Meloxicam)', dose: '1.5mg/mL oral suspension', freq: '0.1mg/kg once daily with food', prescribed: 'Sep 1, 2025', status: 'completed', refills: '\u2014' },
    { name: 'Heartgard Plus', dose: ctx.species === 'Feline' ? '57mcg chewable' : '272mcg chewable', freq: '1 tablet monthly', prescribed: 'Jan 15, 2026', status: 'active', refills: '6 remaining' },
    { name: 'Nexgard (Afoxolaner)', dose: ctx.species === 'Feline' ? '11.3mg chewable' : '68mg chewable', freq: '1 tablet monthly', prescribed: 'Jan 15, 2026', status: 'active', refills: '6 remaining' },
    { name: 'Amoxicillin-Clavulanate', dose: '250mg tablet', freq: '1 tablet twice daily for 10 days', prescribed: 'Sep 1, 2025', status: 'completed', refills: '\u2014' },
  ];
}
