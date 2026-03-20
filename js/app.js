/**
 * Main application entry point — initializes all modules and handles navigation.
 * @module app
 */

import { NAV_PAGES } from './data/nav-config.js';
import { SEARCH_RECORDS } from './data/search-records.js';

import { refreshIcons } from './utils/dom.js';
import { getJSON, getSidebarCollapsed, getFavourites, getCollapsedSections, getLists, setLists } from './utils/storage.js';
// import { renderListPage } from './utils/templates.js';

import { initDarkMode } from './components/dark-mode.js';
import { initSidebar, applySidebarState, updateActiveStates } from './components/sidebar.js';
import { initOrgDropdown } from './components/org-dropdown.js';
import { initSearch } from './components/search.js';
import { initCustomizeModal, applySidebarConfig, openCustomizeModal } from './components/customize-modal.js';

import { renderInbox, initInbox } from './pages/inbox.js';
import { openRecordView } from './pages/record.js';
import { renderCustomersPage } from './pages/customers.js';
import { renderTablePage, wireTablePage } from './pages/table-page.js';
// import { renderDbView, wireDbView } from './pages/database-view.js';
import { enterSettingsMode } from './pages/settings.js';
import { renderPlaceholderPage } from './pages/placeholder.js';
import { renderReportsPage } from './pages/reports.js';
// import { renderAskAiPage, wireAskAi } from './pages/ask-ai.js';
import { wireBillingDelegation } from './tabs/billing-tab.js';
import { initGlobalAiDrawer, onNavigate as onAiNavigate } from './components/global-ai-drawer.js';
import { initLists, getCustomListConfig, renderListsNav } from './components/lists.js';
import { VIEW_SOURCES } from './data/view-sources.js';

/* ═══ Application State ═══ */

const appState = {
  activeNav: null,
  favourites: getFavourites(),
  collapsedSections: getCollapsedSections(),
  sidebarCollapsed: getSidebarCollapsed(),
  navigateTo,
};

/* ═══ Navigation Router ═══ */

/**
 * Navigate to a page by its nav key.
 * @param {string} navKey - The navigation key from NAV_PAGES
 */
function navigateTo(navKey) {
  if (window.inSettingsMode && navKey !== 'settings') {
    window.inSettingsMode = false;
    document.getElementById('sidebar').classList.remove('settings-mode');
    document.getElementById('settingsSidebarNav').innerHTML = '';
  }

  appState.activeNav = navKey;
  updateActiveStates();

  const welcome = document.getElementById('welcomeScreen');
  const inbox = document.getElementById('inboxPanel');
  const pageView = document.getElementById('pageView');

  welcome.style.display = 'none';
  inbox.classList.remove('active');
  pageView.style.display = 'none';

  // Update global AI drawer context
  onAiNavigate(navKey);

  const page = NAV_PAGES[navKey];
  if (!page) {
    // Check if it's a custom list
    const customCfg = getCustomListConfig(navKey);
    if (customCfg) {
      showPageView();
      renderCustomListPage(customCfg);
      return;
    }
    welcome.style.display = 'flex';
    return;
  }

  switch (page.type) {
    case 'inbox':
      inbox.classList.add('active');
      renderInbox();
      return;

    case 'page':
      showPageView();
      renderCalendarPage();
      return;

    case 'reports':
      showPageView();
      renderPage(renderReportsPage());
      return;

    case 'settings':
      enterSettingsMode();
      return;

    case 'customers':
      showPageView();
      renderPage(renderCustomersPage());
      wireClientRowClicks();
      return;

    case 'table':
      showPageView();
      renderPage(renderTablePage(navKey, page));
      wireTablePage(document.getElementById('pageViewContent'), navKey, navigateTo);
      return;

    default:
      showPageView();
      renderPage(renderPlaceholderPage(page.title));
      return;
  }
}

/** Show the page view container. */
function showPageView() {
  const pageView = document.getElementById('pageView');
  pageView.style.display = 'flex';
  pageView.style.overflow = 'hidden';
}

/** Render HTML content into the page view and refresh icons. */
function renderPage(html) {
  const container = document.getElementById('pageViewContent');
  container.innerHTML = html;
  refreshIcons(container);
}

/** Calendar appointments data for list view */
const CAL_APPOINTMENTS = [
  { time: '9:00 AM', end: '9:30 AM', patient: 'Rex', owner: 'Olivia Zhang', type: 'Follow-up', vet: 'Dr. Jordan Nguyen', status: 'Confirmed', color: '#4dab9a', icon: 'stethoscope' },
  { time: '10:00 AM', end: '11:00 AM', patient: 'Milo', owner: 'Amy Collins', type: 'Consultation', vet: 'Dr. Sarah Smith', status: 'Confirmed', color: '#5e6ad2', icon: 'stethoscope' },
  { time: '10:00 AM', end: '11:00 AM', patient: 'Rex', owner: 'Olivia Zhang', type: 'Consultation', vet: 'Dr. Katie Brown', status: 'Confirmed', color: '#5e6ad2', icon: 'stethoscope' },
  { time: '11:00 AM', end: '11:15 AM', patient: 'Luna', owner: 'Daniel Reyes', type: 'Vaccination', vet: 'Dr. Katie Brown', status: 'Scheduled', color: '#57ab5a', icon: 'syringe' },
  { time: '11:30 AM', end: '12:30 PM', patient: 'Archie', owner: 'David Turner', type: 'Vaccination', vet: 'Dr. Sarah Smith', status: 'Confirmed', color: '#57ab5a', icon: 'syringe' },
  { time: '11:00 AM', end: '12:00 PM', patient: 'Tigger', owner: 'Michael Green', type: 'Follow-up', vet: 'Dr. Mike Johnson', status: 'Confirmed', color: '#4dab9a', icon: 'clipboard-check' },
  { time: '12:00 PM', end: '1:00 PM', patient: 'Daisy', owner: 'Emma Patel', type: 'Surgery', vet: 'Dr. Mike Johnson', status: 'Confirmed', color: '#e5534b', icon: 'scissors' },
  { time: '1:00 PM', end: '1:30 PM', patient: 'Pepper', owner: 'Hannah Wells', type: 'Dental cleaning', vet: 'Dr. Sarah Smith', status: 'Scheduled', color: '#cf8e3e', icon: 'sparkles' },
  { time: '2:00 PM', end: '2:30 PM', patient: 'Buddy', owner: 'Sarah Smith', type: 'Follow-up', vet: 'Dr. Katie Brown', status: 'Confirmed', color: '#4dab9a', icon: 'clipboard-check' },
  { time: '3:00 PM', end: '3:15 PM', patient: 'Nala', owner: 'Emma Patel', type: 'Vaccination', vet: 'Dr. Sarah Smith', status: 'Scheduled', color: '#57ab5a', icon: 'syringe' },
  { time: '4:00 PM', end: '5:00 PM', patient: 'Nala', owner: 'Rebecca Young', type: 'Surgery', vet: 'Dr. Mike Johnson', status: 'Confirmed', color: '#e5534b', icon: 'scissors' },
  { time: '5:00 PM', end: '5:30 PM', patient: 'Luna', owner: 'Daniel Reyes', type: 'Diagnostics', vet: 'Dr. Emily Carter', status: 'Scheduled', color: '#986ee2', icon: 'scan' },
];

let calendarViewMode = 'calendar';
let calendarPeriod = 'Day';

function getCalendarDateStr() {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function renderCalendarTopbar() {
  return `
    <div class="page-topbar cal-topbar">
      <span class="page-topbar-title">${getCalendarDateStr()}</span>
      <span class="cal-today-badge">Today</span>
      <div class="page-topbar-right">
        <button class="cal-nav-btn cal-arrow" id="calPrev"><i data-lucide="chevron-left"></i></button>
        <button class="cal-nav-btn cal-arrow" id="calNext"><i data-lucide="chevron-right"></i></button>
        <div class="cal-view-toggle">
          <button class="cal-period-btn${calendarPeriod === 'Day' && calendarViewMode === 'calendar' ? ' active' : ''}" data-period="Day" data-cal-view="calendar">Day</button>
          <button class="cal-period-btn${calendarPeriod === 'Week' && calendarViewMode === 'calendar' ? ' active' : ''}" data-period="Week" data-cal-view="calendar">Week</button>
          <button class="cal-period-btn${calendarViewMode === 'list' ? ' active' : ''}" data-cal-view="list">List</button>
          <button class="cal-period-btn${calendarViewMode === 'board' ? ' active' : ''}" data-cal-view="board">Board</button>
        </div>
      </div>
    </div>`;
}

/** Render the calendar page with view toggle. */
function renderCalendarPage() {
  const container = document.getElementById('pageViewContent');
  if (calendarViewMode === 'list') {
    renderCalendarListView(container);
  } else if (calendarViewMode === 'board') {
    renderCalendarBoardView(container);
  } else {
    renderCalendarGridView(container);
  }
}

function renderCalendarGridView(container) {
  const darkParam = document.body.classList.contains('dark') ? '?dark=1&v=3' : '?v=3';
  container.innerHTML = renderCalendarTopbar() +
    `<iframe id="calFrame" src="calendar.html${darkParam}" style="width:100%;flex:1;border:none;"></iframe>`;
  refreshIcons(container);
  wireCalendarControls(container);
}

function renderCalendarListView(container) {
  const statusClass = (s) => s === 'Confirmed' ? 'active' : 'pending';
  const rows = CAL_APPOINTMENTS.map(a => `
    <div class="tp-row">
      <div class="tp-col-name" style="flex:1.5">
        <span class="tp-row-icon" style="color:${a.color}"><i data-lucide="${a.icon}"></i></span>
        <span class="tp-row-title">${a.patient}</span>
        <span class="tp-row-sub">${a.owner}</span>
      </div>
      <div class="cal-list-col" style="width:110px">${a.type}</div>
      <div class="cal-list-col" style="width:90px"><span class="cal-list-time">${a.time}</span></div>
      <div class="cal-list-col" style="width:90px"><span class="cal-list-time">${a.end}</span></div>
      <div class="cal-list-col" style="width:130px">${a.vet}</div>
      <div class="cal-list-col" style="width:80px"><span class="status-pill ${statusClass(a.status)} dot">${a.status}</span></div>
    </div>`).join('');

  container.innerHTML = `<div class="table-page">` + renderCalendarTopbar() + `
      <div class="tp-scroll">
        <div class="tp-table-head">
          <div class="tp-col-name" style="flex:1.5">Patient</div>
          <div class="cal-list-col" style="width:110px">Type</div>
          <div class="cal-list-col" style="width:90px">Start</div>
          <div class="cal-list-col" style="width:90px">End</div>
          <div class="cal-list-col" style="width:130px">Veterinarian</div>
          <div class="cal-list-col" style="width:80px">Status</div>
        </div>
        ${rows}
      </div>
    </div>`;
  refreshIcons(container);
  wireCalendarControls(container);
}

const BOARD_STATUSES = ['Scheduled', 'Checked In', 'In Progress', 'Late', 'Ready for Discharge', 'No Show'];
const BOARD_STATUS_COLORS = {
  'Scheduled': '#539bf5', 'Checked In': '#57ab5a', 'In Progress': '#5e6ad2',
  'Late': '#e5534b', 'Ready for Discharge': '#cf8e3e', 'No Show': 'rgba(0,0,0,0.25)',
};

// Assign board statuses to appointments for demo
const CAL_BOARD_STATUS = [
  'Checked In', 'In Progress', 'Checked In', 'Scheduled', 'Scheduled',
  'In Progress', 'In Progress', 'Scheduled', 'Ready for Discharge', 'Scheduled',
  'Late', 'No Show',
];

function renderCalendarBoardView(container) {
  const groups = {};
  BOARD_STATUSES.forEach(s => groups[s] = []);
  CAL_APPOINTMENTS.forEach((a, i) => {
    const status = CAL_BOARD_STATUS[i] || 'Scheduled';
    groups[status].push({ ...a, boardStatus: status });
  });

  const lanes = BOARD_STATUSES.map(status => {
    const items = groups[status];
    const color = BOARD_STATUS_COLORS[status];
    return `
    <div class="kanban-lane">
      <div class="kanban-lane-header">
        <span class="kanban-lane-dot" style="background:${color}"></span>
        <span class="kanban-lane-title">${status}</span>
        <span class="kanban-lane-count">${items.length}</span>
      </div>
      <div class="kanban-lane-cards">
        ${items.map(a => `
          <div class="kanban-card">
            <div class="kanban-card-title">${a.patient}</div>
            <div class="kanban-card-desc">${a.owner}</div>
            <div class="kanban-card-meta">${a.time} – ${a.end} · ${a.type}</div>
            <div class="kanban-card-vet">${a.vet}</div>
          </div>`).join('') || '<div class="kanban-lane-empty">No appointments</div>'}
      </div>
    </div>`;
  }).join('');

  container.innerHTML = `<div class="table-page">` + renderCalendarTopbar() + `<div class="kanban-board">${lanes}</div></div>`;
  refreshIcons(container);
  wireCalendarControls(container);
}

function wireCalendarControls(container) {
  container.querySelectorAll('.cal-period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      calendarViewMode = btn.dataset.calView;
      if (btn.dataset.period) calendarPeriod = btn.dataset.period;
      renderCalendarPage();
    });
  });
}

/** Render a custom list page from wizard config. */
function renderCustomListPage(cfg) {
  const container = document.getElementById('pageViewContent');
  const src = VIEW_SOURCES[cfg.objectKey];
  if (!src) {
    // No data source — remove this broken list and navigate home
    const lists = getLists();
    const idx = lists.findIndex(l => l.nav === cfg.nav);
    if (idx >= 0) { lists.splice(idx, 1); setLists(lists); }
    renderListsNav();
    document.getElementById('welcomeScreen').style.display = 'flex';
    return;
  }

  // Apply filters
  let data = [...src.data];
  if (cfg.filters && cfg.filters.length > 0) {
    cfg.filters.forEach(f => {
      if (!f.value) return;
      data = data.filter(row => {
        const val = (row[f.field] || '').toLowerCase();
        const target = f.value.toLowerCase();
        if (f.op === 'is') return val === target;
        if (f.op === 'is not') return val !== target;
        if (f.op === 'contains') return val.includes(target);
        return true;
      });
    });
  }

  if (cfg.viewType === 'kanban') {
    renderKanbanView(container, cfg, src, data);
  } else {
    renderListView(container, cfg, src, data);
  }
}

function renderListView(container, cfg, src, data) {
  const cols = src.columns;
  const groupBy = cfg.groupBy;

  let rows;
  if (groupBy && cols.includes(groupBy)) {
    const groups = {};
    data.forEach(row => {
      const key = row[groupBy] || 'Other';
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    rows = Object.entries(groups).map(([group, items]) => `
      <div class="tp-group-header">${groupBy}: ${group} <span class="tp-group-count">${items.length}</span></div>
      ${items.map(row => renderListRow(row, cols)).join('')}
    `).join('');
  } else {
    rows = data.map(row => renderListRow(row, cols)).join('');
  }

  const headerCols = cols.map((col, i) => `<div class="cl-col" style="${i === 0 ? 'flex:1' : 'width:110px'}">${col}</div>`).join('');

  container.innerHTML = `
    <div class="table-page" data-list-nav="${cfg.nav}">
      <div class="page-topbar">
        <span class="page-topbar-title">${cfg.name}</span>
        <div class="list-menu-wrap">
          <button class="list-menu-trigger" id="listMenuTrigger"><i data-lucide="more-horizontal"></i></button>
          <div class="list-menu-dropdown" id="listMenuDropdown">
            <div class="list-menu-option" data-action="settings"><i data-lucide="settings"></i><span>List settings</span></div>
            <div class="list-menu-option" data-action="attributes"><i data-lucide="sliders-horizontal"></i><span>Manage attributes</span></div>
            <div class="list-menu-divider"></div>
            <div class="list-menu-option has-sub" data-action="notifications"><i data-lucide="bell"></i><span>Notifications</span><i data-lucide="chevron-right" class="list-menu-chevron"></i></div>
            <div class="list-menu-divider"></div>
            <div class="list-menu-option danger" data-action="delete"><i data-lucide="trash-2"></i><span>Delete list</span></div>
          </div>
        </div>
        <div class="page-topbar-right">
          <button><i data-lucide="filter"></i></button>
          <button><i data-lucide="sliders-horizontal"></i></button>
        </div>
      </div>
      <div class="tp-scroll">
        <div class="tp-table-head">${headerCols}</div>
        ${rows}
      </div>
    </div>`;
  refreshIcons(container);
  wireTablePage(container, cfg.nav, navigateTo);
}

function renderListRow(row, cols) {
  return `<div class="tp-row">${cols.map((col, i) => {
    const val = row[col] || '';
    if (i === 0) return `<div class="cl-col" style="flex:1"><span class="tp-row-title">${val}</span></div>`;
    if (col === 'Status') return `<div class="cl-col" style="width:110px"><span class="status-pill ${val === 'Active' || val === 'Paid' || val === 'Completed' || val === 'Approved' ? 'active' : val === 'Overdue' || val === 'Inactive' || val === 'Expired' ? 'overdue' : 'pending'} dot">${val}</span></div>`;
    return `<div class="cl-col" style="width:110px">${val}</div>`;
  }).join('')}</div>`;
}

function renderKanbanView(container, cfg, src, data) {
  const groupCol = cfg.groupBy || 'Status';
  const groups = {};
  data.forEach(row => {
    const key = row[groupCol] || 'Other';
    if (!groups[key]) groups[key] = [];
    groups[key].push(row);
  });

  const nameCol = src.columns[0];
  const descCol = src.columns.length > 2 ? src.columns[2] : src.columns[1];

  const lanes = Object.entries(groups).map(([group, items]) => `
    <div class="kanban-lane">
      <div class="kanban-lane-header">
        <span class="kanban-lane-title">${group}</span>
        <span class="kanban-lane-count">${items.length}</span>
      </div>
      <div class="kanban-lane-cards">
        ${items.map(row => `
          <div class="kanban-card">
            <div class="kanban-card-title">${row[nameCol] || ''}</div>
            <div class="kanban-card-desc">${row[descCol] || ''}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  container.innerHTML = `
    <div class="table-page" data-list-nav="${cfg.nav}">
      <div class="page-topbar">
        <span class="page-topbar-title">${cfg.name}</span>
        <div class="list-menu-wrap">
          <button class="list-menu-trigger" id="listMenuTrigger"><i data-lucide="more-horizontal"></i></button>
          <div class="list-menu-dropdown" id="listMenuDropdown">
            <div class="list-menu-option" data-action="settings"><i data-lucide="settings"></i><span>List settings</span></div>
            <div class="list-menu-divider"></div>
            <div class="list-menu-option danger" data-action="delete"><i data-lucide="trash-2"></i><span>Delete list</span></div>
          </div>
        </div>
        <div class="page-topbar-right">
          <button><i data-lucide="filter"></i></button>
        </div>
      </div>
      <div class="kanban-board">${lanes}</div>
    </div>`;
  refreshIcons(container);
  wireTablePage(container, cfg.nav, navigateTo);
}

/** Wire client row clicks to open record view. */
function wireClientRowClicks() {
  const container = document.getElementById('pageViewContent');
  container.querySelectorAll('[data-client-name]').forEach(row => {
    row.addEventListener('click', () => {
      const record = SEARCH_RECORDS.find(r => r.type === 'client' && r.name === row.dataset.clientName);
      if (record) openRecordView(record);
    });
  });
}

/* ═══ Platform Detection ═══ */

function detectPlatform() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '\u2318' : 'Ctrl';
  const welcomeKbd = document.getElementById('welcomeKbd');
  const searchKbd = document.getElementById('searchActionsKbd');
  if (welcomeKbd) welcomeKbd.textContent = modKey + 'K';
  if (searchKbd) searchKbd.textContent = modKey + 'K';
  const navKbd = document.getElementById('searchNavKbd');
  if (navKbd) navKbd.textContent = modKey + 'K';
}

/* ═══ Keyboard Navigation ═══ */

function initKeyboardNav() {
  document.addEventListener('keydown', (e) => {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay && searchOverlay.classList.contains('open')) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const focusable = [...document.getElementById('sidebarNav').querySelectorAll('[tabindex="0"]')];
    const idx = focusable.indexOf(document.activeElement);

    if (e.key === 'ArrowDown' && idx >= 0) {
      e.preventDefault();
      if (idx < focusable.length - 1) focusable[idx + 1].focus();
    } else if (e.key === 'ArrowUp' && idx >= 0) {
      e.preventDefault();
      if (idx > 0) focusable[idx - 1].focus();
    }
  });
}

/* ═══ Nav Item Click Wiring ═══ */

function wireNavClicks() {
  document.querySelectorAll('#sidebarNav .nav-item[data-nav]').forEach(item => {
    item.addEventListener('click', () => navigateTo(item.dataset.nav));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') navigateTo(item.dataset.nav);
    });
  });
}

/* ═══ Initialization ═══ */

function init() {
  // Create initial icons
  lucide.createIcons();

  // Dark mode
  initDarkMode();

  // Platform detection
  detectPlatform();

  // Sidebar
  initSidebar(appState);
  applySidebarState();

  // Customize modal
  initCustomizeModal();
  applySidebarConfig();

  // Org dropdown
  initOrgDropdown({ navigateTo, openCustomizeModal });

  // Search
  initSearch({ records: SEARCH_RECORDS, openRecordView });

  // Navigation clicks
  wireNavClicks();

  // Inbox initialization
  initInbox();

  // Lists section
  initLists({ navigateTo });

  // Billing tab delegation (global event listeners)
  wireBillingDelegation();

  // Keyboard navigation
  initKeyboardNav();

  // Global AI drawer
  initGlobalAiDrawer(() => appState.activeNav);

  // Profile menu
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');
  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.sidebar-profile')) profileMenu.classList.remove('open');
    });
  }

  // Expose globals needed by page modules
  window.navigateTo = navigateTo;
  window.inSettingsMode = false;
  window.activeNav = appState.activeNav;
  window.updateActiveStates = updateActiveStates;
}

// Run on DOM ready
try {
  init();
} catch (e) {
  document.body.insertAdjacentHTML('afterbegin',
    `<div style="position:fixed;top:0;left:0;right:0;background:red;color:white;padding:10px;z-index:99999;font-family:monospace;font-size:12px;">
      INIT ERROR: ${e.message}<br>${e.stack}
    </div>`);
}
