/**
 * Table page renderer for sub-navigation pages.
 * @module pages/table-page
 */

import { TABLE_DATA } from '../data/table-data.js';

/**
 * Render a table page by navigation key.
 * @param {string} navKey - Navigation key (e.g. 'diagnostic-imaging')
 * @param {Object} page - Page config from NAV_PAGES with title
 * @returns {string} HTML string
 */
export function renderTablePage(navKey, page) {
  const data = TABLE_DATA[navKey] || [];
  const rows = data.map(r => {
    const hColor = r.health === 'On track' ? '#57ab5a' : '#cf8e3e';
    const trendIcon = r.trend === 'up' ? 'chevron-up' : r.trend === 'down' ? 'chevron-down' : 'minus';
    const trendClass = r.trend === 'up' ? 'up' : r.trend === 'down' ? 'down' : '';
    return `
      <div class="tp-row">
        <div class="tp-col-name">
          <span class="tp-row-icon" style="color:${r.color}"><i data-lucide="${r.icon}"></i></span>
          <span class="tp-row-title">${r.name}</span>
          <span class="tp-row-sub">${r.sub}</span>
        </div>
        <div class="tp-col-health">
          <span class="tp-health">
            <span class="tp-health-dot" style="background:${hColor}"></span>
            <span class="tp-health-text">${r.health}</span>
            <span class="tp-health-time">\u00B7 ${r.hTime}</span>
          </span>
        </div>
        <div class="tp-col-priority"><span class="tp-priority"><i data-lucide="signal"></i></span></div>
        <div class="tp-col-lead"><span class="tp-lead" style="background:${r.leadColor}">${r.lead}</span></div>
        <div class="tp-col-date"><span class="tp-date"><i data-lucide="calendar"></i> ${r.date}</span></div>
        <div class="tp-col-status">
          <span class="tp-status-val"><i data-lucide="target"></i> ${r.pct}</span>
        </div>
      </div>`;
  }).join('');

  return `
    <div class="table-page">
      <div class="page-topbar">
        <span class="page-topbar-title">${page.title}</span>
        <span class="page-topbar-count">${data.length}</span>
        <span class="page-topbar-dots">\u00B7\u00B7\u00B7</span>
        <div class="page-topbar-right">
          <button><i data-lucide="filter"></i></button>
          <button><i data-lucide="sliders-horizontal"></i></button>
          <button><i data-lucide="columns-3"></i></button>
        </div>
      </div>
      <div class="tp-count">${data.length} items</div>
      <div class="tp-scroll">
        <div class="tp-table-head">
          <div class="tp-col-name">Name</div>
          <div class="tp-col-health">Health \u2191</div>
          <div class="tp-col-priority">Priority</div>
          <div class="tp-col-lead">Lead</div>
          <div class="tp-col-date">Target date</div>
          <div class="tp-col-status">Status</div>
        </div>
        ${rows}
      </div>
    </div>`;
}
