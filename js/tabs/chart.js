/**
 * Chart tab renderer — displays vitals and medical timeline.
 * @module tabs/chart
 */

import { CHART_TIMELINE_ENTRIES } from '../data/chart-data.js';

/**
 * Render the chart tab with vitals and medical timeline.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context object with pet, species, weight, etc.
 * @returns {string} HTML string
 */
export function renderChartTab(idx, ctx) {
  const petName = ctx.pet;
  const entries = CHART_TIMELINE_ENTRIES(petName);

  const vitals = `
    <div class="vitals-row">
      <div class="vital-card">
        <div class="vital-label">Weight</div>
        <div class="vital-value">${ctx.weight.replace(' kg', '')}<span class="vital-unit">kg</span></div>
        <div class="vital-note">Stable</div>
      </div>
      <div class="vital-card">
        <div class="vital-label">Temp</div>
        <div class="vital-value">38.5<span class="vital-unit">&deg;C</span></div>
        <div class="vital-note">Normal</div>
      </div>
      <div class="vital-card">
        <div class="vital-label">Heart Rate</div>
        <div class="vital-value">${ctx.species === 'Feline' ? '180' : '90'}<span class="vital-unit">bpm</span></div>
        <div class="vital-note">Normal</div>
      </div>
      <div class="vital-card">
        <div class="vital-label">Resp Rate</div>
        <div class="vital-value">${ctx.species === 'Feline' ? '28' : '18'}<span class="vital-unit">/min</span></div>
        <div class="vital-note">Normal</div>
      </div>
    </div>`;

  const timeline = entries.map(e => `
    <div class="chart-entry ${e.type}">
      <div class="entry-date">${e.date}</div>
      <div class="entry-title">${e.title}</div>
      <div class="entry-note">${e.note}</div>
      <div class="entry-vet"><i data-lucide="user"></i> ${e.vet}</div>
    </div>`).join('');

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="activity"></i> Latest Vitals \u2014 ${petName}</div>
      ${vitals}
    </div>
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="clock"></i> Medical Timeline</div>
      <div class="chart-timeline">${timeline}</div>
    </div>`;
}
