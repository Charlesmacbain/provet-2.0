/**
 * Stock tabs renderer — order history and usage log.
 * @module tabs/stock
 */

import { STOCK_ORDERS, STOCK_USAGE } from '../data/stock-data.js';

/**
 * Render the stock order history tab.
 * @returns {string} HTML string
 */
export function renderStockHistoryTab() {
  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="truck"></i> Order History \u2014 Metacam</div>
      <table class="tab-table">
        <thead><tr><th>Date</th><th>Quantity</th><th>Supplier</th><th>PO Number</th><th>Cost</th><th>Status</th></tr></thead>
        <tbody>${STOCK_ORDERS.map(o => `
          <tr>
            <td>${o.date}</td>
            <td>${o.qty}</td>
            <td>${o.supplier}</td>
            <td style="font-family:'SF Mono',monospace;font-size:11px;color:rgba(0,0,0,0.4)">${o.po}</td>
            <td style="font-weight:600">${o.cost}</td>
            <td><span class="status-pill active">Delivered</span></td>
          </tr>`).join('')}</tbody>
      </table>
    </div>`;
}

/**
 * Render the stock usage tab.
 * @returns {string} HTML string
 */
export function renderStockUsageTab() {
  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="bar-chart-3"></i> Usage Log \u2014 Metacam (Last 30 days)</div>
      <div class="billing-summary" style="grid-template-columns:repeat(3,1fr)">
        <div class="billing-card">
          <div class="bc-label">Used This Month</div>
          <div class="bc-value">7<span style="font-size:12px;font-weight:400;color:rgba(0,0,0,0.35);margin-left:2px">units</span></div>
        </div>
        <div class="billing-card">
          <div class="bc-label">Avg Weekly</div>
          <div class="bc-value">~5<span style="font-size:12px;font-weight:400;color:rgba(0,0,0,0.35);margin-left:2px">units</span></div>
        </div>
        <div class="billing-card overdue">
          <div class="bc-label">Est. Stockout</div>
          <div class="bc-value">4 days</div>
        </div>
      </div>
      <table class="tab-table">
        <thead><tr><th>Date</th><th>Patient</th><th>Quantity</th><th>Dispensed By</th></tr></thead>
        <tbody>${STOCK_USAGE.map(u => `
          <tr>
            <td>${u.date}</td>
            <td>${u.patient}</td>
            <td>${u.qty}</td>
            <td>${u.vet}</td>
          </tr>`).join('')}</tbody>
      </table>
    </div>`;
}
