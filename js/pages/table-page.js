/**
 * Table page renderer for sub-navigation pages.
 * Includes list menu with settings, notifications, and delete.
 * @module pages/table-page
 */

import { TABLE_DATA } from '../data/table-data.js';
import { getLists, setLists } from '../utils/storage.js';
import { renderListsNav } from '../components/lists.js';
import { INBOX_ITEMS, INBOX_CONTEXT, DRAWER_CONTEXT_MAP } from '../data/inbox-data.js';
import { VIEW_SOURCES } from '../data/view-sources.js';

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
    <div class="table-page" data-list-nav="${navKey}">
      <div class="page-topbar">
        <span class="page-topbar-title">${page.title}</span>
        <div class="list-menu-wrap">
          <button class="list-menu-trigger" id="listMenuTrigger"><i data-lucide="more-horizontal"></i></button>
          <div class="list-menu-dropdown" id="listMenuDropdown">
            <div class="list-menu-option" data-action="settings"><i data-lucide="settings"></i><span>List settings</span></div>
            <div class="list-menu-option" data-action="attributes"><i data-lucide="sliders-horizontal"></i><span>Manage attributes</span></div>
            <div class="list-menu-option" data-action="duplicate"><i data-lucide="copy"></i><span>Duplicate list</span></div>
            <div class="list-menu-option" data-action="copy-id"><i data-lucide="clipboard"></i><span>Copy list ID</span></div>
            <div class="list-menu-divider"></div>
            <div class="list-menu-option has-sub" data-action="notifications"><i data-lucide="bell"></i><span>Notifications</span><i data-lucide="chevron-right" class="list-menu-chevron"></i></div>
            <div class="list-menu-divider"></div>
            <div class="list-menu-option danger" data-action="delete"><i data-lucide="trash-2"></i><span>Delete list</span></div>
          </div>
        </div>
        <div class="page-topbar-right">
          <button><i data-lucide="filter"></i></button>
          <button><i data-lucide="sliders-horizontal"></i></button>
          <button><i data-lucide="columns-3"></i></button>
        </div>
      </div>
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

/* ═══ List Menu Wiring ═══ */

/**
 * Wire the list menu interactions after the table page is rendered.
 * @param {HTMLElement} container - The page view content container
 * @param {string} navKey - Current navigation key
 * @param {Function} navigateToFn - Navigation function
 */
export function wireTablePage(container, navKey, navigateToFn) {
  const trigger = container.querySelector('#listMenuTrigger');
  const dropdown = container.querySelector('#listMenuDropdown');
  if (!trigger || !dropdown) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close any open sub-panels
    container.querySelectorAll('.list-menu-sub').forEach(s => s.remove());
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', function closeMenu(e) {
    if (!e.target.closest('.list-menu-wrap')) {
      dropdown.classList.remove('open');
      container.querySelectorAll('.list-menu-sub').forEach(s => s.remove());
    }
  });

  dropdown.querySelectorAll('.list-menu-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const action = opt.dataset.action;

      if (action === 'delete') {
        dropdown.classList.remove('open');
        deleteList(navKey, navigateToFn);
      } else if (action === 'settings') {
        dropdown.classList.remove('open');
        showListSettings(container, navKey);
      } else if (action === 'notifications') {
        showNotificationsPanel(container, dropdown, navKey);
      } else if (action === 'copy-id') {
        dropdown.classList.remove('open');
        navigator.clipboard.writeText(navKey).catch(() => {});
      } else if (action === 'duplicate') {
        dropdown.classList.remove('open');
        duplicateList(navKey, navigateToFn);
      } else {
        dropdown.classList.remove('open');
      }
    });
  });
}

function deleteList(navKey, navigateToFn) {
  const lists = getLists();
  const idx = lists.findIndex(l => l.nav === navKey);
  if (idx >= 0) {
    lists.splice(idx, 1);
    setLists(lists);
  }
  renderListsNav();
  if (navigateToFn) navigateToFn('inbox');
}

function duplicateList(navKey, navigateToFn) {
  const lists = getLists();
  const original = lists.find(l => l.nav === navKey);

  const newId = 'custom-' + Date.now();
  const newNav = newId;

  // Determine the data source key — either the original's objectKey (custom list)
  // or the navKey itself (template list like 'invoices')
  const objectKey = (original && original.objectKey) ? original.objectKey : navKey;

  // Only duplicate if the objectKey exists in VIEW_SOURCES
  if (!VIEW_SOURCES[objectKey]) return;

  const copy = {
    id: newId,
    name: (original ? original.name : navKey) + ' (copy)',
    icon: original ? original.icon : 'list',
    color: original ? (original.color || '#5e6ad2') : '#5e6ad2',
    nav: newNav,
    custom: true,
    objectKey: objectKey,
    viewType: (original && original.viewType) || 'list',
    filters: (original && original.filters) ? [...original.filters] : [],
    groupBy: (original && original.groupBy) || '',
  };
  lists.push(copy);
  setLists(lists);
  renderListsNav();
  if (navigateToFn) navigateToFn(newNav);
}

/* ═══ List Settings Panel ═══ */

function showListSettings(container, navKey) {
  const lists = getLists();
  const list = lists.find(l => l.nav === navKey);
  const listName = list ? list.name : navKey;

  const existing = container.querySelector('.list-settings-panel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.className = 'list-settings-panel';
  panel.innerHTML = `
    <div class="list-settings-overlay"></div>
    <div class="list-settings-drawer">
      <div class="list-settings-header">
        <h3>List Settings</h3>
        <button class="list-settings-close"><i data-lucide="x"></i></button>
      </div>
      <div class="list-settings-body">
        <div class="list-settings-section">
          <label class="list-settings-label">List name</label>
          <input type="text" class="list-settings-input" id="listSettingsName" value="${listName}" />
        </div>
        <div class="list-settings-section">
          <label class="list-settings-label">Description</label>
          <textarea class="list-settings-textarea" id="listSettingsDesc" placeholder="Add a description..."></textarea>
        </div>
        <div class="list-settings-section">
          <label class="list-settings-label">Default view</label>
          <select class="list-settings-select">
            <option selected>Table</option>
            <option>Board</option>
            <option>Calendar</option>
            <option>Timeline</option>
          </select>
        </div>
        <div class="list-settings-section">
          <label class="list-settings-label">Visibility</label>
          <select class="list-settings-select">
            <option selected>Everyone</option>
            <option>Only me</option>
            <option>Admins only</option>
          </select>
        </div>
        <div class="list-settings-footer">
          <button class="list-settings-save" id="listSettingsSave">Save changes</button>
        </div>
      </div>
    </div>`;
  container.appendChild(panel);
  lucide.createIcons({ nodes: panel.querySelectorAll('i') });

  panel.querySelector('.list-settings-close').addEventListener('click', () => panel.remove());
  panel.querySelector('.list-settings-overlay').addEventListener('click', () => panel.remove());

  panel.querySelector('#listSettingsSave').addEventListener('click', () => {
    const newName = panel.querySelector('#listSettingsName').value.trim();
    if (newName && list) {
      list.name = newName;
      setLists(lists);
      renderListsNav();
      const titleEl = container.querySelector('.page-topbar-title');
      if (titleEl) titleEl.textContent = newName;
    }
    panel.remove();
  });
}

/* ═══ Notifications Sub-Panel ═══ */

const NOTIFICATION_RULES = [
  { id: 'new-item', label: 'New item created', desc: 'When a new record is added to this list', icon: 'plus-circle' },
  { id: 'status-change', label: 'Status changed', desc: 'When an item\'s status is updated', icon: 'refresh-cw' },
  { id: 'overdue', label: 'Item overdue', desc: 'When an item passes its target date', icon: 'alert-triangle' },
  { id: 'assigned', label: 'Assigned to me', desc: 'When an item is assigned to you', icon: 'user-check' },
  { id: 'high-priority', label: 'High priority added', desc: 'When a high priority item is created', icon: 'alert-circle' },
];

function showNotificationsPanel(container, dropdown, navKey) {
  container.querySelectorAll('.list-menu-sub').forEach(s => s.remove());

  const sub = document.createElement('div');
  sub.className = 'list-menu-sub';

  const lists = getLists();
  const list = lists.find(l => l.nav === navKey);
  const activeRules = (list && list.notificationRules) ? list.notificationRules : [];

  sub.innerHTML = `
    <div class="list-menu-sub-header">
      <button class="list-menu-sub-back"><i data-lucide="arrow-left"></i></button>
      <span>Notifications</span>
    </div>
    <div class="list-menu-sub-body">
      ${NOTIFICATION_RULES.map(rule => {
        const active = activeRules.includes(rule.id);
        return `
        <label class="list-notif-rule" data-rule="${rule.id}">
          <div class="list-notif-rule-icon"><i data-lucide="${rule.icon}"></i></div>
          <div class="list-notif-rule-info">
            <div class="list-notif-rule-label">${rule.label}</div>
            <div class="list-notif-rule-desc">${rule.desc}</div>
          </div>
          <input type="checkbox" class="list-notif-toggle" ${active ? 'checked' : ''} />
        </label>`;
      }).join('')}
    </div>`;

  dropdown.appendChild(sub);
  lucide.createIcons({ nodes: sub.querySelectorAll('i') });

  sub.querySelector('.list-menu-sub-back').addEventListener('click', (e) => {
    e.stopPropagation();
    sub.remove();
  });

  sub.querySelectorAll('.list-notif-toggle').forEach(toggle => {
    toggle.addEventListener('change', (e) => {
      e.stopPropagation();
      const ruleId = toggle.closest('.list-notif-rule').dataset.rule;
      if (!list) return;
      if (!list.notificationRules) list.notificationRules = [];
      if (toggle.checked) {
        if (!list.notificationRules.includes(ruleId)) {
          list.notificationRules.push(ruleId);
          // Generate a sample inbox notification
          createNotificationForRule(ruleId, navKey, list);
        }
      } else {
        list.notificationRules = list.notificationRules.filter(r => r !== ruleId);
      }
      setLists(lists);
    });
  });

  sub.querySelectorAll('.list-notif-rule').forEach(label => {
    label.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.type !== 'checkbox') {
        const cb = label.querySelector('.list-notif-toggle');
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });
  });
}

function createNotificationForRule(ruleId, navKey, list) {
  const rule = NOTIFICATION_RULES.find(r => r.id === ruleId);
  if (!rule) return;

  const listName = list.name || navKey;
  INBOX_ITEMS.push({
    initials: 'SY',
    color: '#5e6ad2',
    title: `${listName} — ${rule.label}`,
    subtitle: `Notification rule enabled: ${rule.desc.toLowerCase()}`,
    time: 'now',
    unread: true,
    badge: 'bell',
    badgeColor: '#539bf5',
    category: 'notification',
  });
  INBOX_CONTEXT.push({
    client: '\u2014', pet: '\u2014', species: '\u2014', breed: '\u2014',
    sex: '\u2014', age: '\u2014', weight: '\u2014', dob: '\u2014', id: '\u2014',
    activeTab: 'Messages',
  });
  DRAWER_CONTEXT_MAP.push({
    task: `Review notification rule for ${listName}.`,
    actions: [
      ['bell', 'View notification settings'],
      ['settings', 'Edit list settings'],
    ],
  });

  // Update badge count
  const badge = document.getElementById('inboxBadge');
  if (badge) badge.textContent = INBOX_ITEMS.filter(i => i.unread).length;
}
