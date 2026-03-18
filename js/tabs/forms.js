/**
 * Forms tab renderer.
 * @module tabs/forms
 */

import { FORMS_LIST } from '../data/forms-data.js';

/**
 * Render the forms tab with consent and form items.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet
 * @returns {string} HTML string
 */
export function renderFormsTab(idx, ctx) {
  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="file-text"></i> Forms & Consent \u2014 ${ctx.pet}</div>
      ${FORMS_LIST.map(f => {
        const sCls = f.status === 'completed' ? 'completed' : f.status === 'pending' ? 'pending' : 'draft';
        const sLabel = f.status === 'completed' ? 'Completed' : f.status === 'pending' ? 'Pending signature' : 'Not sent';
        return `
          <div class="form-item">
            <div class="form-icon ${f.color}"><i data-lucide="${f.icon}"></i></div>
            <div class="form-body">
              <div class="form-name">${f.name}</div>
              <div class="form-desc">${f.desc}${f.date ? ' \u00B7 ' + f.date : ''}</div>
            </div>
            <div class="form-status"><span class="status-pill ${sCls}">${sLabel}</span></div>
          </div>`;
      }).join('')}
    </div>`;
}
