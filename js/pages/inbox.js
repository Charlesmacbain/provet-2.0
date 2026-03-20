/**
 * Inbox page module — renders inbox list, detail view, and AI drawer.
 * Supports category filtering (All, Notifications, Tasks, Chat, Conversations)
 * and multi-select with bulk actions.
 * @module pages/inbox
 */

import { INBOX_ITEMS, INBOX_CONTEXT, DRAWER_CONTEXT_MAP, INBOX_CATEGORIES } from '../data/inbox-data.js';
import { DETAIL_TABS } from '../data/nav-config.js';
import { SEARCH_RECORDS } from '../data/search-records.js';
import { renderTabContent } from '../tabs/tab-router.js';

let selectedInboxIdx = -1;
let activeDrawerTab = 'ask-ai';
let activeFilterSet = new Set();
let multiSelectMode = false;
let selectedItems = new Set();
const activeDetailTabs = {};

/* ═══ Category icon mapping ═══ */

const CATEGORY_ICONS = {
  notification: 'bell',
  task: 'clipboard-check',
  chat: 'message-circle',
  conversation: 'messages-square',
  consultation: 'stethoscope',
};

/* ═══ Render Inbox ═══ */

/**
 * Render the inbox list panel.
 */
export function renderInbox() {
  const list = document.getElementById('inboxList');
  const topbar = document.querySelector('.inbox-left .page-topbar');

  // Render filter tabs + topbar
  topbar.innerHTML = renderTopbar();
  lucide.createIcons({ nodes: topbar.querySelectorAll('i') });
  wireTopbar();

  // Render items
  renderInboxList();
}

function renderTopbar() {
  const unreadCount = INBOX_ITEMS.filter(i => i.unread && !i.archived && !i.snoozed).length;
  document.getElementById('inboxBadge').textContent = unreadCount;
  document.getElementById('inboxEmptyText').textContent = unreadCount + ' unread notifications';

  const activeFilters = activeFilterSet.size === 0
    ? [{ label: 'All', count: INBOX_ITEMS.length }]
    : [...activeFilterSet].map(id => {
        const cat = INBOX_CATEGORIES.find(c => c.id === id);
        return { label: cat.label, count: INBOX_ITEMS.filter(i => i.category === id).length };
      });
  const filterSummary = activeFilterSet.size === 0
    ? ''
    : activeFilters.map(f => `<span class="inbox-active-filter">${f.label} <span class="inbox-filter-count">${f.count}</span></span>`).join('');

  return `
    <div class="inbox-topbar-main">
      <span class="page-topbar-title">Inbox</span>
      <span class="inbox-unread-count">${unreadCount}</span>
      <div class="page-topbar-right">
        <div class="inbox-new-wrap">
          <button class="inbox-new-btn" id="inboxNewBtn" title="Create new"><i data-lucide="plus"></i></button>
          <div class="inbox-new-dropdown" id="inboxNewDropdown">
            <div class="inbox-new-dropdown-title">Create new</div>
            <div class="inbox-new-option" data-new-type="consultation"><i data-lucide="stethoscope"></i><span>Consultation</span></div>
            <div class="inbox-new-option" data-new-type="message"><i data-lucide="message-circle"></i><span>Message</span></div>
            <div class="inbox-new-option" data-new-type="refill"><i data-lucide="pill"></i><span>Refill Request</span></div>
          </div>
        </div>
        <button class="inbox-multiselect-btn" id="inboxMultiSelectBtn" title="Multi-select"><i data-lucide="check-square"></i></button>
        <div class="inbox-filter-wrap">
          <button class="inbox-filter-btn${activeFilterSet.size > 0 ? ' has-filter' : ''}" id="inboxFilterBtn" title="Filter"><i data-lucide="filter"></i>${activeFilterSet.size > 0 ? `<span class="inbox-filter-badge">${activeFilterSet.size}</span>` : ''}</button>
          <div class="inbox-filter-dropdown" id="inboxFilterDropdown">
            ${INBOX_CATEGORIES.filter(c => c.id !== 'all').map(c => {
              const count = INBOX_ITEMS.filter(i => i.category === c.id).length;
              const checked = activeFilterSet.has(c.id);
              return `
              <label class="inbox-filter-option${checked ? ' checked' : ''}" data-filter="${c.id}">
                <input type="checkbox" ${checked ? 'checked' : ''} />
                <i data-lucide="${c.icon}"></i>
                <span class="inbox-filter-option-label">${c.label}</span>
                <span class="inbox-filter-option-count">${count}</span>
              </label>`;
            }).join('')}
            <div class="inbox-filter-dropdown-footer">
              <button class="inbox-filter-clear" id="inboxFilterClear">Clear filters</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${filterSummary ? `<div class="inbox-active-filters" id="inboxActiveFilters">${filterSummary}</div>` : ''}`;
}

function renderInboxList() {
  const list = document.getElementById('inboxList');
  list.innerHTML = '';

  const visible = INBOX_ITEMS.filter(i => !i.archived && !i.snoozed);
  const filtered = activeFilterSet.size === 0
    ? visible
    : visible.filter(i => activeFilterSet.has(i.category));

  if (filtered.length === 0) {
    list.innerHTML = '<div class="inbox-list-empty"><i data-lucide="inbox"></i><span>No items</span></div>';
    lucide.createIcons({ nodes: list.querySelectorAll('i') });
    return;
  }

  // Bulk action bar
  if (multiSelectMode) {
    const bar = document.createElement('div');
    bar.className = 'inbox-bulk-bar';
    bar.id = 'inboxBulkBar';
    bar.innerHTML = `
      <label class="inbox-select-all">
        <input type="checkbox" id="inboxSelectAll" ${selectedItems.size === filtered.length ? 'checked' : ''} />
        <span>Select all</span>
      </label>
      <div class="inbox-bulk-actions" style="display:${selectedItems.size > 0 ? 'flex' : 'none'}">
        <span class="inbox-bulk-count">${selectedItems.size} selected</span>
        <button class="inbox-bulk-btn" data-action="read" title="Mark read"><i data-lucide="check"></i></button>
        <button class="inbox-bulk-btn" data-action="archive" title="Archive"><i data-lucide="archive"></i></button>
        <button class="inbox-bulk-btn" data-action="snooze" title="Snooze"><i data-lucide="clock"></i></button>
      </div>`;
    list.appendChild(bar);
    lucide.createIcons({ nodes: bar.querySelectorAll('i') });
    wireBulkBar(filtered);
  }

  filtered.forEach((item, fi) => {
    const realIdx = INBOX_ITEMS.indexOf(item);
    const el = document.createElement('div');
    el.className = 'inbox-item' + (item.unread ? ' unread' : '') + (realIdx === selectedInboxIdx ? ' selected' : '');
    el.dataset.realIdx = realIdx;

    const catIcon = CATEGORY_ICONS[item.category] || 'circle';
    const checkbox = multiSelectMode
      ? `<input type="checkbox" class="inbox-item-check" data-idx="${realIdx}" ${selectedItems.has(realIdx) ? 'checked' : ''} />`
      : '';

    el.innerHTML = `
      ${checkbox}
      <div class="inbox-avatar-wrap">
        <div class="inbox-avatar" style="background:${item.color}">${item.initials}</div>
        <span class="inbox-avatar-badge" style="color:rgba(0,0,0,0.4)"><i data-lucide="${catIcon}"></i></span>
      </div>
      <div class="inbox-content">
        <div class="inbox-title-row">
          ${item.unread ? '<span class="inbox-unread-dot"></span>' : ''}
          <span class="inbox-title">${item.title}</span>
        </div>
        <div class="inbox-subtitle">
          <span class="inbox-subtitle-icon"><i data-lucide="${catIcon}"></i></span>
          ${item.subtitle}
        </div>
      </div>
      <div class="inbox-meta">
        <span class="inbox-type-icon"><i data-lucide="circle"></i></span>
        <span class="inbox-time">${item.time}</span>
      </div>
      <div class="inbox-item-actions">
        <button class="inbox-item-action" data-item-action="archive" data-idx="${realIdx}" title="Archive"><i data-lucide="archive"></i></button>
        <button class="inbox-item-action" data-item-action="snooze" data-idx="${realIdx}" title="Snooze"><i data-lucide="clock"></i></button>
      </div>`;

    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('inbox-item-check')) return;
      if (e.target.closest('.inbox-item-action')) return;
      if (multiSelectMode) {
        toggleItemSelection(realIdx);
        renderInboxList();
        return;
      }
      selectInboxItem(realIdx);
    });

    // Hover action buttons
    el.querySelectorAll('.inbox-item-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.itemAction;
        const idx = parseInt(btn.dataset.idx);
        if (action === 'archive') {
          archiveItem(idx);
        } else if (action === 'snooze') {
          showSnoozeMenu(btn, idx);
        }
      });
    });

    // Wire checkbox
    const cb = el.querySelector('.inbox-item-check');
    if (cb) {
      cb.addEventListener('change', () => {
        toggleItemSelection(realIdx);
        renderInboxList();
      });
    }

    list.appendChild(el);
  });

  lucide.createIcons({ nodes: list.querySelectorAll('i') });
}

function wireTopbar() {
  // New button dropdown
  const newBtn = document.getElementById('inboxNewBtn');
  const newDropdown = document.getElementById('inboxNewDropdown');
  if (newBtn && newDropdown) {
    newBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      newDropdown.classList.toggle('open');
      // Close filter dropdown if open
      const fd = document.getElementById('inboxFilterDropdown');
      if (fd) fd.classList.remove('open');
    });

    newDropdown.querySelectorAll('.inbox-new-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const type = opt.dataset.newType;
        newDropdown.classList.remove('open');
        createNewInboxItem(type);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.inbox-new-wrap')) {
        newDropdown.classList.remove('open');
      }
    });
  }

  // Filter dropdown toggle
  const filterBtn = document.getElementById('inboxFilterBtn');
  const dropdown = document.getElementById('inboxFilterDropdown');
  if (filterBtn && dropdown) {
    filterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.inbox-filter-wrap')) {
        dropdown.classList.remove('open');
      }
    });

    // Checkbox changes
    dropdown.querySelectorAll('.inbox-filter-option input').forEach(cb => {
      cb.addEventListener('change', () => {
        const filterId = cb.closest('.inbox-filter-option').dataset.filter;
        if (cb.checked) {
          activeFilterSet.add(filterId);
        } else {
          activeFilterSet.delete(filterId);
        }
        selectedInboxIdx = -1;
        selectedItems.clear();
        document.getElementById('inboxMiddleEmpty').style.display = '';
        document.getElementById('inboxDetail').style.display = 'none';
        renderInbox();
      });
    });

    // Clear filters
    const clearBtn = document.getElementById('inboxFilterClear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        activeFilterSet.clear();
        selectedInboxIdx = -1;
        selectedItems.clear();
        document.getElementById('inboxMiddleEmpty').style.display = '';
        document.getElementById('inboxDetail').style.display = 'none';
        renderInbox();
      });
    }
  }

  // Active filter chip clicks (remove filter)
  document.querySelectorAll('.inbox-active-filter').forEach(chip => {
    chip.addEventListener('click', () => {
      const label = chip.textContent.trim().split(/\s+/)[0];
      const cat = INBOX_CATEGORIES.find(c => c.label === label);
      if (cat) {
        activeFilterSet.delete(cat.id);
        selectedInboxIdx = -1;
        renderInbox();
      }
    });
  });

  // Multi-select toggle
  const msBtn = document.getElementById('inboxMultiSelectBtn');
  if (msBtn) {
    msBtn.addEventListener('click', () => {
      multiSelectMode = !multiSelectMode;
      selectedItems.clear();
      msBtn.classList.toggle('active', multiSelectMode);
      renderInboxList();
    });
  }
}

function wireBulkBar(filtered) {
  setTimeout(() => {
    const selectAll = document.getElementById('inboxSelectAll');
    if (selectAll) {
      selectAll.addEventListener('change', () => {
        if (selectAll.checked) {
          filtered.forEach(item => selectedItems.add(INBOX_ITEMS.indexOf(item)));
        } else {
          selectedItems.clear();
        }
        renderInboxList();
      });
    }

    document.querySelectorAll('.inbox-bulk-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'read') {
          selectedItems.forEach(idx => { INBOX_ITEMS[idx].unread = false; });
        } else if (action === 'archive') {
          selectedItems.forEach(idx => { INBOX_ITEMS[idx].archived = true; });
        } else if (action === 'snooze') {
          selectedItems.forEach(idx => { snoozeItem(idx, 60); });
        }
        selectedItems.clear();
        selectedInboxIdx = -1;
        document.getElementById('inboxMiddleEmpty').style.display = '';
        document.getElementById('inboxDetail').style.display = 'none';
        renderInbox();
      });
    });
  }, 0);
}

function toggleItemSelection(idx) {
  if (selectedItems.has(idx)) {
    selectedItems.delete(idx);
  } else {
    selectedItems.add(idx);
  }
}

/* ═══ Archive & Snooze ═══ */

function archiveItem(idx) {
  INBOX_ITEMS[idx].archived = true;
  if (selectedInboxIdx === idx) {
    selectedInboxIdx = -1;
    document.getElementById('inboxMiddleEmpty').style.display = '';
    document.getElementById('inboxDetail').style.display = 'none';
  }
  renderInbox();
}

function snoozeItem(idx, minutes) {
  INBOX_ITEMS[idx].snoozed = true;
  // Auto-unsnooze after duration (simulated)
  setTimeout(() => {
    INBOX_ITEMS[idx].snoozed = false;
    INBOX_ITEMS[idx].unread = true;
    renderInbox();
  }, minutes * 1000); // Use seconds for demo (minutes * 1000 instead of * 60000)
  if (selectedInboxIdx === idx) {
    selectedInboxIdx = -1;
    document.getElementById('inboxMiddleEmpty').style.display = '';
    document.getElementById('inboxDetail').style.display = 'none';
  }
  renderInbox();
}

function showSnoozeMenu(anchorBtn, idx) {
  // Remove any existing snooze menu
  document.querySelectorAll('.inbox-snooze-menu').forEach(m => m.remove());

  const menu = document.createElement('div');
  menu.className = 'inbox-snooze-menu';
  menu.innerHTML = `
    <div class="inbox-snooze-title">Snooze until</div>
    <div class="inbox-snooze-option" data-minutes="30"><i data-lucide="clock"></i> 30 minutes</div>
    <div class="inbox-snooze-option" data-minutes="60"><i data-lucide="clock-1"></i> 1 hour</div>
    <div class="inbox-snooze-option" data-minutes="180"><i data-lucide="clock-3"></i> 3 hours</div>
    <div class="inbox-snooze-option" data-minutes="1440"><i data-lucide="sun"></i> Tomorrow</div>
    <div class="inbox-snooze-option" data-minutes="10080"><i data-lucide="calendar"></i> Next week</div>`;

  anchorBtn.closest('.inbox-item').appendChild(menu);
  lucide.createIcons({ nodes: menu.querySelectorAll('i') });

  menu.querySelectorAll('.inbox-snooze-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      snoozeItem(idx, parseInt(opt.dataset.minutes));
      menu.remove();
    });
  });

  setTimeout(() => {
    const closer = (e) => {
      if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener('click', closer);
      }
    };
    document.addEventListener('click', closer);
  }, 0);
}

/* ═══ Create New Item ═══ */

const NEW_TYPE_CONFIG = {
  consultation: {
    icon: 'stethoscope',
    label: 'New Consultation',
    category: 'consultation',
    activeTab: 'Consultations',
    titleFn: (pet) => `${pet.name} — New consultation`,
    subtitleFn: () => 'New consultation started just now',
  },
  message: {
    icon: 'message-circle',
    label: 'New Message',
    category: 'conversation',
    activeTab: 'Messages',
    titleFn: (pet) => `${pet.name} — New message`,
    subtitleFn: (client) => `New conversation with ${client.name}`,
  },
  refill: {
    icon: 'pill',
    label: 'Refill Request',
    category: 'conversation',
    activeTab: 'Medications',
    titleFn: (pet) => `${pet.name} — Refill request`,
    subtitleFn: (client) => `${client.name} requested a prescription refill`,
  },
};

function createNewInboxItem(type) {
  const config = NEW_TYPE_CONFIG[type];
  if (!config) return;
  showInlinePatientPicker(config);
}

function showInlinePatientPicker(config) {
  const patients = SEARCH_RECORDS.filter(r => r.type === 'patient');

  // Show picker in the inbox middle panel
  document.getElementById('inboxMiddleEmpty').style.display = 'none';
  const detail = document.getElementById('inboxDetail');
  detail.style.display = 'flex';

  detail.innerHTML = `
    <div class="patient-picker-inline">
      <div class="patient-picker-inline-header">
        <div class="patient-picker-header-icon"><i data-lucide="${config.icon}"></i></div>
        <div>
          <div class="patient-picker-inline-title">${config.label}</div>
          <div class="patient-picker-inline-subtitle">Select a patient to continue</div>
        </div>
      </div>
      <div class="patient-picker-search">
        <i data-lucide="search"></i>
        <input type="text" placeholder="Search patients..." id="patientPickerInput" />
      </div>
      <div class="patient-picker-list" id="patientPickerList"></div>
    </div>`;
  lucide.createIcons({ nodes: detail.querySelectorAll('i') });

  const input = detail.querySelector('#patientPickerInput');
  const listEl = detail.querySelector('#patientPickerList');

  function renderPickerList(filter) {
    const q = (filter || '').toLowerCase();
    const filtered = patients.filter(p =>
      !q || p.name.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q)
    );
    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="patient-picker-empty">No patients found</div>';
      return;
    }
    listEl.innerHTML = filtered.map(p => `
      <div class="patient-picker-item" data-patient="${p.name}">
        <div class="patient-picker-item-avatar" style="background:${p.color}">${p.initials}</div>
        <div class="patient-picker-item-info">
          <div class="patient-picker-item-name">${p.name}</div>
          <div class="patient-picker-item-meta">${p.species} · ${p.breed} · ${p.age} · ${p.weight}</div>
        </div>
        <div class="patient-picker-item-owner">${p.owner}</div>
      </div>`).join('');

    listEl.querySelectorAll('.patient-picker-item').forEach(item => {
      item.addEventListener('click', () => {
        const patient = patients.find(pp => pp.name === item.dataset.patient);
        if (patient) onPatientSelected(patient, config);
      });
    });
  }

  renderPickerList('');
  setTimeout(() => input.focus(), 50);
  input.addEventListener('input', () => renderPickerList(input.value));
}

function onPatientSelected(patient, config) {
  const client = SEARCH_RECORDS.find(r => r.type === 'client' && r.name === patient.owner);
  if (!client) return;

  const newItem = {
    initials: client.initials,
    color: patient.color,
    title: config.titleFn(patient),
    subtitle: config.subtitleFn(client),
    time: 'now',
    unread: true,
    badge: 'new',
    badgeColor: '#5e6ad2',
    category: config.category,
  };

  const newContext = {
    client: client.name,
    pet: patient.name,
    species: patient.species,
    breed: patient.breed,
    sex: patient.sex,
    age: patient.age,
    weight: patient.weight,
    dob: patient.dob || '\u2014',
    id: patient.id,
    activeTab: config.activeTab,
  };

  const drawerActions = {
    consultation: [
      ['stethoscope', `Begin SOAP note for ${patient.name}`],
      ['mic', 'Start AI Scribe recording'],
      ['clipboard-list', 'Review previous consultations'],
      ['send', `Notify ${client.name} about the visit`],
    ],
    message: [
      ['send', `Draft message to ${client.name}`],
      ['file-text', `Summarize ${patient.name}\u2019s recent history`],
      ['calendar', 'Schedule a follow-up'],
      ['clipboard-check', 'Create a task from this conversation'],
    ],
    refill: [
      ['pill', `Review ${patient.name}\u2019s current medications`],
      ['check-circle', 'Approve and process the refill'],
      ['send', `Confirm refill with ${client.name}`],
      ['alert-triangle', 'Check for refill frequency concerns'],
    ],
  };

  const newDrawer = {
    task: `${config.label} for ${patient.name} (${client.name})`,
    actions: drawerActions[Object.keys(NEW_TYPE_CONFIG).find(k => NEW_TYPE_CONFIG[k] === config)] || [],
  };

  // Insert at top of inbox
  INBOX_ITEMS.unshift(newItem);
  INBOX_CONTEXT.unshift(newContext);
  DRAWER_CONTEXT_MAP.unshift(newDrawer);

  // Re-render inbox list and select the new item
  selectedInboxIdx = 0;
  renderInbox();
  selectInboxItem(0);
}

/* ═══ Detail View ═══ */

/**
 * Handle selection of an inbox item by index.
 * @param {number} idx
 */
export function selectInboxItem(idx) {
  selectedInboxIdx = idx;
  document.querySelectorAll('#inboxList .inbox-item').forEach(el => {
    el.classList.toggle('selected', parseInt(el.dataset.realIdx) === idx);
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
  if (!ctx) return '<div class="inbox-detail-body" style="padding:40px;color:rgba(0,0,0,0.3);text-align:center;">No details available</div>';

  const isStock = idx === 9;
  const isChatDirect = item.category === 'chat' && (ctx.client === '\u2014');
  const currentTab = activeDetailTabs[idx] || ctx.activeTab;

  let header = '';
  if (isChatDirect) {
    header = `
    <div class="inbox-detail-header">
      <div class="inbox-detail-avatar" style="background:${item.color}">${item.initials}</div>
      <div class="inbox-detail-title">${item.title}</div>
      <div class="inbox-detail-time">${item.time} ago</div>
    </div>`;
  } else if (!isStock && ctx.client !== '\u2014') {
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
  if (isChatDirect) {
    // Direct chat — no tabs, just messages
    tabs = '';
  } else if (!isStock) {
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

  let body;
  if (isChatDirect) {
    body = renderDirectChat(item);
  } else {
    body = renderTabContent(currentTab, idx, ctx);
  }

  let chatBar = (currentTab === 'Messages' || isChatDirect) ?
    `<div class="chat-input-row"><input class="chat-input" placeholder="Type a message..." /><button class="chat-send-btn"><i data-lucide="send"></i></button></div>` : '';

  return header + tabs + `<div class="inbox-detail-body">${body}</div>` + chatBar;
}

function renderDirectChat(item) {
  return `
    <div class="chat-messages">
      <div class="chat-msg">
        <div class="chat-msg-avatar" style="background:${item.color}">${item.initials}</div>
        <div>
          <div class="chat-msg-bubble">${item.subtitle}</div>
          <div class="chat-msg-time">${item.time} ago</div>
        </div>
      </div>
    </div>`;
}

/* ═══ Drawer ═══ */

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

/* ═══ Init ═══ */

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

export function initInbox() {
  wireInboxDrawerToggle();
  wireDetailTabDelegation();
}

export { selectedInboxIdx, INBOX_ITEMS, INBOX_CONTEXT };
