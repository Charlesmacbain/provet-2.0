/**
 * Medications tab renderer.
 * @module tabs/medications
 */

import { MEDICATIONS_LIST } from '../data/medications-data.js';

/**
 * Render the medications tab.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, species
 * @returns {string} HTML string
 */
export function renderMedicationsTab(idx, ctx) {
  const meds = MEDICATIONS_LIST(ctx);

  const rows = meds.map(m => `
    <tr>
      <td><strong>${m.name}</strong><br><span style="font-size:11px;color:rgba(0,0,0,0.4)">${m.dose}</span></td>
      <td>${m.freq}</td>
      <td><span class="status-pill ${m.status}">${m.status.charAt(0).toUpperCase() + m.status.slice(1)}</span></td>
      <td>${m.refills}</td>
      <td style="font-size:11px;color:rgba(0,0,0,0.4)">${m.prescribed}</td>
    </tr>`).join('');

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="pill"></i> Current & Past Medications \u2014 ${ctx.pet}</div>
      <table class="tab-table">
        <thead><tr><th>Medication</th><th>Dosage</th><th>Status</th><th>Refills</th><th>Prescribed</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
