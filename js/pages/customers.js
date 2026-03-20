/**
 * Clients page renderer.
 * @module pages/customers
 */

import { CLIENTS_LIST } from '../data/customers-data.js';

/**
 * Render the clients page with table layout.
 * Rows are clickable and include data-client-name for wiring.
 * @returns {string} HTML string
 */
export function renderCustomersPage() {
  const rows = CLIENTS_LIST.map(c => `
    <div class="cust-row" data-client-name="${c.name}">
      <div class="cust-col-name">
        <span class="cust-row-avatar" style="background:${c.color}">${c.initials}</span>
        <span class="cust-row-name">${c.name}</span>
      </div>
      <div class="cust-col-visits">${c.pets}</div>
      <div class="cust-col-spend">${c.visits}</div>
      <div class="cust-col-pets">${c.revenue}</div>
      <div class="cust-col-status"><span class="cust-status-badge active">${c.status}</span></div>
      <div class="cust-col-plan">${c.since}</div>
      <div class="cust-col-vet">${c.phone}</div>
      <div class="cust-col-phone">${c.email}</div>
    </div>
  `).join('');

  return `
    <div class="cust-page">
      <div class="page-topbar">
        <span class="page-topbar-title">Clients</span>
        <span class="page-topbar-count">${CLIENTS_LIST.length}</span>
        <div class="cust-topbar-search">
          <i data-lucide="search"></i>
          <input type="text" placeholder="Find by name or email..." />
        </div>
        <div class="page-topbar-right">
          <button><i data-lucide="filter"></i></button>
          <button><i data-lucide="sliders-horizontal"></i></button>
          <button class="ptb-add"><i data-lucide="plus"></i></button>
        </div>
      </div>
      <div class="cust-scroll">
        <div class="cust-table-head">
          <div class="cust-col-name">Name</div>
          <div class="cust-col-visits">Pets</div>
          <div class="cust-col-spend">Visits</div>
          <div class="cust-col-pets">Revenue</div>
          <div class="cust-col-status">Status</div>
          <div class="cust-col-plan">Since</div>
          <div class="cust-col-vet">Phone</div>
          <div class="cust-col-phone">Email</div>
        </div>
        ${rows}
      </div>
    </div>`;
}
