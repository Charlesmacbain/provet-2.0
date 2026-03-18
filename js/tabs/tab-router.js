/**
 * Tab content router — dispatches to individual tab renderers.
 * @module tabs/tab-router
 */

import { renderChartTab } from './chart.js';
import { renderMedicationsTab } from './medications.js';
import { renderImmunizationsTab } from './immunizations.js';
import { renderLabsTab } from './labs.js';
import { renderBillingTab } from './billing-tab.js';
import { renderMessagesTab } from './messages.js';
import { renderTasksTab } from './tasks.js';
import { renderFormsTab } from './forms.js';
import { renderConsultationsTab } from './consultations.js';
import { renderInfoTab } from './info.js';
import { renderStockHistoryTab, renderStockUsageTab } from './stock.js';

/**
 * Render tab content by tab name.
 * @param {string} tabName - Name of the tab to render
 * @param {number} idx - Item index
 * @param {Object} ctx - Context object with patient/client data
 * @returns {string} HTML string
 */
export function renderTabContent(tabName, idx, ctx) {
  switch (tabName) {
    case 'Chart': return renderChartTab(idx, ctx);
    case 'Medications': return renderMedicationsTab(idx, ctx);
    case 'Immunizations': return renderImmunizationsTab(idx, ctx);
    case 'Labs': return renderLabsTab(idx, ctx);
    case 'Billing': return renderBillingTab(idx, ctx);
    case 'Messages': return renderMessagesTab(idx, ctx);
    case 'Tasks': return renderTasksTab(idx, ctx);
    case 'Forms': return renderFormsTab(idx, ctx);
    case 'Consultations': return renderConsultationsTab(idx, ctx);
    case 'Info': return renderInfoTab(idx, ctx);
    case 'History': return renderStockHistoryTab();
    case 'Usage': return renderStockUsageTab();
    default: return '';
  }
}
