/**
 * Inbox page module — renders inbox list, detail view, and AI drawer.
 * @module pages/inbox
 */

import { INBOX_ITEMS, INBOX_CONTEXT, DRAWER_CONTEXT_MAP } from '../data/inbox-data.js';
import { DETAIL_TABS } from '../data/nav-config.js';
import { SEARCH_RECORDS } from '../data/search-records.js';
import { renderTabContent } from '../tabs/tab-router.js';

let selectedInboxIdx = -1;
let activeDrawerTab = 'ask-ai';
const activeDetailTabs = {};

/**
 * Render the inbox list panel.
 */
export function renderInbox() {
  const list = document.getElementById('inboxList');
  list.innerHTML = '';
  const unreadCount = INBOX_ITEMS.filter(i => i.unread).length;
  document.getElementById('inboxEmptyText').textContent = unreadCount + ' unread notifications';
  document.getElementById('inboxBadge').textContent = unreadCount;

  INBOX_ITEMS.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'inbox-item' + (item.unread ? ' unread' : '') + (idx === selectedInboxIdx ? ' selected' : '');
    el.innerHTML = `
      <div class="inbox-avatar-wrap">
        <div class="inbox-avatar" style="background:${item.color}">${item.initials}</div>
        <span class="inbox-avatar-badge" style="color:rgba(0,0,0,0.4)"><i data-lucide="at-sign"></i></span>
      </div>
      <div class="inbox-content">
        <div class="inbox-title-row">
          ${item.unread ? '<span class="inbox-unread-dot"></span>' : ''}
          <span class="inbox-title">${item.title}</span>
        </div>
        <div class="inbox-subtitle">
          <span class="inbox-subtitle-icon"><i data-lucide="message-circle"></i></span>
          ${item.subtitle}
        </div>
      </div>
      <div class="inbox-meta">
        <span class="inbox-type-icon"><i data-lucide="circle"></i></span>
        <span class="inbox-time">${item.time}</span>
      </div>`;
    el.addEventListener('click', () => selectInboxItem(idx));
    list.appendChild(el);
  });
  lucide.createIcons({ nodes: list.querySelectorAll('i') });
  wireInboxDrawer();
}

/**
 * Handle selection of an inbox item by index.
 * @param {number} idx
 */
export function selectInboxItem(idx) {
  selectedInboxIdx = idx;
  document.querySelectorAll('#inboxList .inbox-item').forEach((el, i) => {
    el.classList.toggle('selected', i === idx);
  });
  document.getElementById('inboxMiddleEmpty').style.display = 'none';
  const detail = document.getElementById('inboxDetail');
  detail.style.display = 'flex';
  const item = INBOX_ITEMS[idx];
  detail.innerHTML = renderInboxDetail(item, idx);
  lucide.createIcons({ nodes: detail.querySelectorAll('i') });
  renderDrawerContent();
}

/**
 * Render detail view for a selected inbox item.
 * @param {Object} item - The inbox item
 * @param {number} idx - Item index
 * @returns {string} HTML string
 */
export function renderInboxDetail(item, idx) {
  const ctx = INBOX_CONTEXT[idx];
  const isStock = idx === 9;
  const currentTab = activeDetailTabs[idx] || ctx.activeTab;

  let header = '';
  if (!isStock && ctx.client !== '\u2014') {
    const clientRec = SEARCH_RECORDS.find(r => r.type === 'client' && r.name === ctx.client);
    let petSelector = '';
    if (clientRec && clientRec.pets.length > 1) {
      const opts = clientRec.pets.map(p => `<option value="${p}"${p === ctx.pet ? ' selected' : ''}>${p}</option>`).join('');
      petSelector = `<select class="record-pet-select" id="inboxPetSelect">${opts}</select>`;
    }
    header = `
    <div class="inbox-detail-header-banner">
      <div class="inbox-detail-avatar" style="background:${item.color}">${item.initials}</div>
      <div class="inbox-detail-header-text">
        <div class="inbox-detail-header-top">
          <span class="inbox-detail-client-name">${ctx.client}</span>
          <span class="inbox-detail-sep">\u00BB</span>
          <span class="inbox-detail-pet-name">${ctx.pet}</span>
          ${petSelector}
        </div>
        <div class="inbox-detail-header-meta">
          ${ctx.age} &middot; ${ctx.sex} &middot; ${ctx.species} &middot; ${ctx.breed} &middot; <strong>Weight:</strong> ${ctx.weight} &middot; <strong>DOB:</strong> ${ctx.dob} &middot; <strong>ID:</strong> ${ctx.id}
        </div>
      </div>
    </div>`;
  } else {
    header = `
    <div class="inbox-detail-header">
      <div class="inbox-detail-avatar" style="background:${item.color}">${item.initials}</div>
      <div class="inbox-detail-title">${item.title}</div>
      <div class="inbox-detail-time">${item.time} ago</div>
    </div>`;
  }

  let tabs = '';
  if (!isStock) {
    tabs = '<div class="inbox-detail-tabs">' + DETAIL_TABS.map(t => {
      let cls = t === currentTab ? ' active' : '';
      let badge = '';
      if (t === 'Billing' && (idx === 0 || idx === 4)) badge = '<span class="tab-badge due">Due</span>';
      return `<div class="inbox-detail-tab${cls}" data-detail-tab="${t}" data-inbox-idx="${idx}">${t}${badge}</div>`;
    }).join('') + '</div>';
  } else {
    tabs = `<div class="inbox-detail-tabs">
      <div class="inbox-detail-tab${currentTab === 'Info' ? ' active' : ''}" data-detail-tab="Info" data-inbox-idx="${idx}">Stock Info</div>
      <div class="inbox-detail-tab${currentTab === 'History' ? ' active' : ''}" data-detail-tab="History" data-inbox-idx="${idx}">Order History</div>
      <div class="inbox-detail-tab${currentTab === 'Usage' ? ' active' : ''}" data-detail-tab="Usage" data-inbox-idx="${idx}">Usage</div>
    </div>`;
  }

  let body = renderTabContent(currentTab, idx, ctx);
  let chatBar = currentTab === 'Messages' ?
    `<div class="chat-input-row"><input class="chat-input" placeholder="Type a message..." /><button class="chat-send-btn"><i data-lucide="send"></i></button></div>` : '';

  return header + tabs + `<div class="inbox-detail-body">${body}</div>` + chatBar;
}

/**
 * Bind drawer tab events.
 */
export function wireInboxDrawer() {
  const drawer = document.getElementById('inboxDrawer');

  document.querySelectorAll('#inboxDrawerTabs .inbox-drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      activeDrawerTab = tab.dataset.drawerTab;
      document.querySelectorAll('#inboxDrawerTabs .inbox-drawer-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderDrawerContent();
    });
  });

  renderDrawerContent();
  lucide.createIcons({ nodes: drawer.querySelectorAll('i') });
}

/**
 * Render AI drawer content based on selected inbox item.
 */
export function renderDrawerContent() {
  const body = document.getElementById('inboxDrawerBody');
  const item = selectedInboxIdx >= 0 ? INBOX_ITEMS[selectedInboxIdx] : null;
  const ctx = selectedInboxIdx >= 0 ? INBOX_CONTEXT[selectedInboxIdx] : null;
  const empty = '<div style="color:rgba(0,0,0,0.3);font-size:13px;text-align:center;padding:24px;">Select an item to view details</div>';

  if (!item || !ctx) { body.innerHTML = empty; return; }

  const dctx = DRAWER_CONTEXT_MAP[selectedInboxIdx] || { task: 'No task context available.', actions: [] };

  body.innerHTML = `
    <div class="ask-ai-scroll">
      <div class="current-task-card">
        <div class="current-task-label"><i data-lucide="clipboard-check"></i> Current Task</div>
        <div class="current-task-text">${dctx.task}</div>
      </div>
      <div class="ask-ai-suggestions">
        <div class="inbox-drawer-section-title">Suggested Actions</div>
        ${dctx.actions.map(a => `<div class="ask-ai-suggestion"><i data-lucide="${a[0]}"></i> ${a[1]}</div>`).join('')}
      </div>
    </div>
    <div class="ask-ai-input-bar">
      <textarea class="ask-ai-input" placeholder="Ask AI about this patient, client, or case..."></textarea>
      <div class="ask-ai-hint">Press Enter to ask</div>
    </div>`;
  lucide.createIcons({ nodes: body.querySelectorAll('i') });
}

/**
 * Wire inbox drawer toggle button.
 */
function wireInboxDrawerToggle() {
  const drawer = document.getElementById('inboxDrawer');
  const toggleBtn = document.getElementById('inboxDrawerToggle');
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      const isCollapsed = drawer.classList.toggle('collapsed');
      const iconName = isCollapsed ? 'panel-right-open' : 'panel-right-close';
      toggleBtn.innerHTML = '<i data-lucide="' + iconName + '"></i>';
      lucide.createIcons({ nodes: toggleBtn.querySelectorAll('i') });
    });
  }
}

/**
 * Wire tab clicks via event delegation for inbox detail tabs.
 */
function wireDetailTabDelegation() {
  document.addEventListener('click', (e) => {
    const tab = e.target.closest('.inbox-detail-tab[data-inbox-idx]');
    if (!tab) return;
    const idx = parseInt(tab.dataset.inboxIdx);
    const tabName = tab.dataset.detailTab;
    activeDetailTabs[idx] = tabName;
    const detail = document.getElementById('inboxDetail');
    const item = INBOX_ITEMS[idx];
    detail.innerHTML = renderInboxDetail(item, idx);
    lucide.createIcons({ nodes: detail.querySelectorAll('i') });
  });
}

/**
 * Initialize the inbox module.
 */
export function initInbox() {
  wireInboxDrawerToggle();
  wireDetailTabDelegation();
}

export { selectedInboxIdx, INBOX_ITEMS, INBOX_CONTEXT };
