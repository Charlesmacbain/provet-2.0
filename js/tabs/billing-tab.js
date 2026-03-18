/**
 * Billing tab renderer.
 * @module tabs/billing-tab
 */

import { BILLING_LINE_ITEMS, BILLING_INVOICES } from '../data/billing-data.js';

/**
 * Render the billing tab with line items and invoices.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context object
 * @returns {string} HTML string
 */
export function renderBillingTab(idx, ctx) {
  const lineItems = BILLING_LINE_ITEMS;
  const selectedTotal = lineItems.filter(li => li.checked).reduce((s, li) => s + li.total, 0);
  const allTotal = lineItems.reduce((s, li) => s + li.total, 0);

  const invoices = BILLING_INVOICES;

  const lineItemRows = lineItems.map(li => `
    <tr>
      <td><input type="checkbox" class="billing-check" data-amount="${li.total}" ${li.checked ? 'checked' : ''} /></td>
      <td>${li.desc}</td>
      <td style="text-align:center">${li.qty}</td>
      <td style="text-align:right">$${li.unitPrice.toFixed(2)}</td>
      <td style="text-align:right;font-weight:600">$${li.total.toFixed(2)}</td>
    </tr>`).join('');

  const invoiceRows = invoices.map(inv => `
    <tr>
      <td style="font-family:'SF Mono',monospace;font-size:11px;color:rgba(0,0,0,0.4)">${inv.id}</td>
      <td>${inv.date}</td>
      <td>${inv.desc}</td>
      <td style="font-weight:600">${inv.amount}</td>
      <td><span class="status-pill ${inv.status}">${inv.status === 'paid' ? 'Paid' : 'Unpaid'}</span></td>
    </tr>`).join('');

  return `
    <div class="tab-section">
      <div class="billing-summary">
        <div class="billing-card overdue">
          <div class="bc-label">Outstanding</div>
          <div class="bc-value">$145.00</div>
          <div class="bc-sub">1 invoice</div>
        </div>
        <div class="billing-card">
          <div class="bc-label">Unbilled Items</div>
          <div class="bc-value">$${allTotal.toFixed(2)}</div>
          <div class="bc-sub">${lineItems.length} items</div>
        </div>
        <div class="billing-card">
          <div class="bc-label">Last Payment</div>
          <div class="bc-value">$210</div>
          <div class="bc-sub">Jan 15, 2026</div>
        </div>
      </div>
    </div>
    <div class="billing-subtabs">
      <div class="billing-subtab active" data-billing-subtab="items">Items to Bill</div>
      <div class="billing-subtab" data-billing-subtab="invoices">Invoices</div>
    </div>
    <div class="billing-subtab-content" id="billingSubtabContent">
      <div class="billing-items-panel" id="billingItemsPanel">
        <table class="tab-table">
          <thead><tr><th style="width:32px"></th><th>Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Unit Price</th><th style="text-align:right">Total</th></tr></thead>
          <tbody>${lineItemRows}</tbody>
        </table>
        <div class="billing-actions-bar">
          <div class="billing-selected-total">
            Selected: <strong id="billingSelectedTotal">$${selectedTotal.toFixed(2)}</strong>
          </div>
          <div class="billing-actions-right">
            <button class="billing-add-item-btn"><i data-lucide="plus"></i> Add Item</button>
            <button class="billing-pay-btn"><i data-lucide="credit-card"></i> Create Invoice & Pay</button>
          </div>
        </div>
      </div>
    </div>`;
}

/**
 * Wire billing subtab switching via event delegation (call once).
 */
export function wireBillingDelegation() {
  let _billingItemsHTML = '';

  document.addEventListener('click', function(e) {
    const subtab = e.target.closest('.billing-subtab');
    if (!subtab) return;
    const container = subtab.parentElement;
    container.querySelectorAll('.billing-subtab').forEach(t => t.classList.remove('active'));
    subtab.classList.add('active');
    const panel = document.getElementById('billingSubtabContent');
    if (!panel) return;
    if (subtab.dataset.billingSubtab === 'invoices') {
      _billingItemsHTML = panel.innerHTML;
      const invoices = BILLING_INVOICES;
      panel.innerHTML = `<table class="tab-table">
        <thead><tr><th>Invoice</th><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>${invoices.map(inv => `<tr>
          <td style="font-family:'SF Mono',monospace;font-size:11px;color:rgba(0,0,0,0.4)">${inv.id}</td>
          <td>${inv.date}</td><td>${inv.desc}</td>
          <td style="font-weight:600">${inv.amount}</td>
          <td><span class="status-pill ${inv.status}">${inv.status === 'paid' ? 'Paid' : 'Unpaid'}</span></td>
        </tr>`).join('')}</tbody></table>`;
    } else if (_billingItemsHTML) {
      panel.innerHTML = _billingItemsHTML;
    }
  });

  document.addEventListener('change', function(e) {
    if (!e.target.classList.contains('billing-check')) return;
    const checks = document.querySelectorAll('.billing-check');
    let total = 0;
    checks.forEach(cb => { if (cb.checked) total += parseFloat(cb.dataset.amount); });
    const el = document.getElementById('billingSelectedTotal');
    if (el) el.textContent = '$' + total.toFixed(2);
  });
}
