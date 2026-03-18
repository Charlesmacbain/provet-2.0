/**
 * Labs tab renderer.
 * @module tabs/labs
 */

import { LAB_PANELS } from '../data/labs-data.js';

/**
 * Render the labs tab with lab panel results.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context object
 * @returns {string} HTML string
 */
export function renderLabsTab(idx, ctx) {
  return LAB_PANELS.map(panel => {
    const rows = panel.results.map(r => {
      return `<tr>
        <td>${r.test}</td>
        <td style="font-weight:600">${r.value}</td>
        <td style="font-size:11px;color:rgba(0,0,0,0.35)">${r.range}</td>
        <td>${r.flag ? `<span class="status-pill abnormal">${r.flag === 'H' ? 'High' : 'Low'}</span>` : '<span class="status-pill normal">Normal</span>'}</td>
      </tr>`;
    }).join('');

    return `
      <div class="tab-section">
        <div class="tab-section-title"><i data-lucide="test-tubes"></i> ${panel.name}</div>
        <div style="display:flex;gap:12px;margin-bottom:8px;font-size:11px;color:rgba(0,0,0,0.35);">
          <span>${panel.date}</span><span>\u00B7</span><span>${panel.lab}</span><span>\u00B7</span><span>${panel.orderedBy}</span>
        </div>
        <table class="tab-table">
          <thead><tr><th>Test</th><th>Result</th><th>Reference Range</th><th>Flag</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');
}
