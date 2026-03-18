/**
 * Immunizations tab renderer.
 * @module tabs/immunizations
 */

import { getVaccineList } from '../data/immunizations-data.js';

/**
 * Render the immunizations tab with vaccination status.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, species
 * @returns {string} HTML string
 */
export function renderImmunizationsTab(idx, ctx) {
  const isCat = ctx.species === 'Feline';
  const vaccines = getVaccineList(isCat);

  const completed = vaccines.filter(v => v.status === 'current').length;
  const total = vaccines.length;
  const pct = Math.round((completed / total) * 100);

  const rows = vaccines.map(v => {
    const sCls = v.status === 'current' ? 'active' : v.status === 'overdue' ? 'overdue' : 'draft';
    const sLabel = v.status === 'current' ? 'Current' : v.status === 'overdue' ? 'Overdue' : 'Not started';
    return `<tr>
      <td><strong>${v.name}</strong></td>
      <td>${v.series}</td>
      <td>${v.last}</td>
      <td>${v.next}</td>
      <td><span class="status-pill ${sCls}">${sLabel}</span></td>
    </tr>`;
  }).join('');

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="shield-check"></i> Vaccination Status \u2014 ${ctx.pet}</div>
      <div class="imm-bar-wrap">
        <div class="imm-bar-label"><span>${completed} of ${total} up to date</span><span>${pct}%</span></div>
        <div class="imm-bar"><div class="imm-bar-fill" style="width:${pct}%"></div></div>
      </div>
      <table class="tab-table">
        <thead><tr><th>Vaccine</th><th>Series</th><th>Last Given</th><th>Next Due</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}
