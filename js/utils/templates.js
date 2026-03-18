/**
 * Shared HTML template builders for Provet Cloud pages.
 * @module utils/templates
 */

import { createIconHTML, refreshIcons } from './dom.js';

/**
 * Renders the page topbar pattern used across list pages.
 *
 * @param {string} title - The page title text.
 * @param {number} count - The item count shown as a badge.
 * @param {string} [actionsHTML=''] - Additional HTML to render in the right-hand actions area.
 * @returns {string} HTML string for the page topbar.
 */
export function renderPageTopbar(title, count, actionsHTML = '') {
  return `
    <div class="page-topbar" style="border-bottom:none; padding-bottom:4px;">
      <span class="page-topbar-title">${title}</span>
      <span class="page-topbar-count">${count}</span>
      <div class="page-topbar-right">
        <button class="ptb-add"><i data-lucide="plus"></i></button>
        ${actionsHTML}
      </div>
    </div>`;
}

/**
 * Renders a list page with a topbar, search bar, and rows of views.
 * Replaces the duplicated renderBillingPage / renderCarePage pattern.
 *
 * @param {string} title - The page title (e.g. "Billing", "Care").
 * @param {Array<{nav: string, icon: string, name: string, desc: string, owner: string, color: string}>} views - Array of view definitions.
 * @returns {string} HTML string for the complete list page.
 */
export function renderListPage(title, views) {
  const rows = views.map(v => `
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
      ${renderPageTopbar(title, views.length)}
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
 * Renders the AI drawer content used in both inbox drawer and record drawer.
 * Replaces the duplicated renderDrawerContent / renderRecordDrawer pattern.
 *
 * @param {string} task - Description of the current task.
 * @param {Array<[string, string]>} actions - Array of [iconName, label] pairs for suggested actions.
 * @param {string} targetId - The ID of the drawer body element to populate.
 * @returns {string} HTML string for the AI drawer content.
 */
export function renderAIDrawer(task, actions, targetId) {
  const actionsHTML = actions.map(a =>
    `<div class="ask-ai-suggestion"><i data-lucide="${a[0]}"></i> ${a[1]}</div>`
  ).join('');

  return `
    <div class="ask-ai-scroll">
      <div class="current-task-card">
        <div class="current-task-label"><i data-lucide="clipboard-check"></i> Current Task</div>
        <div class="current-task-text">${task}</div>
      </div>
      <div class="ask-ai-suggestions">
        <div class="inbox-drawer-section-title">Suggested Actions</div>
        ${actionsHTML}
      </div>
    </div>
    <div class="ask-ai-input-bar">
      <textarea class="ask-ai-input" placeholder="Ask AI about this patient, client, or case..."></textarea>
      <div class="ask-ai-hint">Press Enter to ask</div>
    </div>`;
}
