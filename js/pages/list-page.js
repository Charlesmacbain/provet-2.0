/**
 * Unified list page renderer — replaces duplicated renderBillingPage and renderCarePage.
 * @module pages/list-page
 */

import { BILLING_PAGE_VIEWS, CARE_PAGE_VIEWS } from '../data/view-sources.js';

/**
 * Render a list page with a title and array of view items.
 * @param {string} title - Page title (e.g. "Billing", "Care")
 * @param {Array} views - Array of view objects with nav, icon, name, desc, owner, color
 * @returns {string} HTML string
 */
export function renderListPage(title, views) {
  let rows = views.map(v => `
    <div class="vp-row" data-nav="${v.nav}">
      <div class="vp-row-icon" style="color:${v.color}"><i data-lucide="${v.icon}"></i></div>
      <div class="vp-row-content">
        <div class="vp-row-name">${v.name}</div>
        <div class="vp-row-desc">${v.desc}</div>
      </div>
      <div class="vp-row-owner">
        <span class="vp-avatar">PC</span>
        ${v.owner}
      </div>
    </div>
  `).join('');

  return `
    <div class="views-page">
      <div class="page-topbar" style="border-bottom:none; padding-bottom:4px;">
        <span class="page-topbar-title">${title}</span>
        <span class="page-topbar-count">${views.length}</span>
        <div class="page-topbar-right">
          <button class="ptb-add"><i data-lucide="plus"></i></button>
        </div>
      </div>
      <div class="cust-search-row">
        <div class="cust-search-input">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Find by name..." />
        </div>
        <div class="cust-search-actions">
          <button><i data-lucide="filter"></i></button>
          <button><i data-lucide="sliders-horizontal"></i></button>
        </div>
      </div>
      <div class="vp-scroll">
        <div class="vp-table-header">
          <div class="vp-col-name">Name <span style="font-size:10px;color:rgba(0,0,0,0.3);">\u2193</span></div>
          <div class="vp-col-owner">Owner</div>
        </div>
        ${rows}
      </div>
    </div>
  `;
}

/**
 * Render the Billing list page.
 * @returns {string} HTML string
 */
export function renderBillingPage() {
  return renderListPage('Billing', BILLING_PAGE_VIEWS);
}

/**
 * Render the Care list page.
 * @returns {string} HTML string
 */
export function renderCarePage() {
  return renderListPage('Care', CARE_PAGE_VIEWS);
}
