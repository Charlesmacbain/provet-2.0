/**
 * Main application entry point — initializes all modules and handles navigation.
 * @module app
 */

import { NAV_PAGES } from './data/nav-config.js';
import { SEARCH_RECORDS } from './data/search-records.js';
import { BILLING_PAGE_VIEWS, CARE_PAGE_VIEWS } from './data/view-sources.js';

import { refreshIcons } from './utils/dom.js';
import { getJSON, getSidebarCollapsed, getFavourites, getCollapsedSections } from './utils/storage.js';
import { renderListPage } from './utils/templates.js';

import { initDarkMode } from './components/dark-mode.js';
import { initSidebar, applySidebarState, updateActiveStates } from './components/sidebar.js';
import { initOrgDropdown } from './components/org-dropdown.js';
import { initSearch } from './components/search.js';
import { initCustomizeModal, applySidebarConfig, openCustomizeModal } from './components/customize-modal.js';

import { renderInbox, initInbox } from './pages/inbox.js';
import { openRecordView } from './pages/record.js';
import { renderCustomersPage } from './pages/customers.js';
import { renderTablePage } from './pages/table-page.js';
import { renderDbView, wireDbView } from './pages/database-view.js';
import { enterSettingsMode } from './pages/settings.js';
import { renderPlaceholderPage } from './pages/placeholder.js';
import { renderAskAiPage, wireAskAi } from './pages/ask-ai.js';
import { wireBillingDelegation } from './tabs/billing-tab.js';
import { initGlobalAiDrawer, onNavigate as onAiNavigate } from './components/global-ai-drawer.js';

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

    case 'views':
      showPageView();
      renderViewsPage();
      return;

    case 'billing':
      showPageView();
      renderNavListPage('Billing', BILLING_PAGE_VIEWS);
      return;

    case 'care':
      showPageView();
      renderNavListPage('Care', CARE_PAGE_VIEWS);
      return;

    case 'ask-ai':
      showPageView();
      renderPage(renderAskAiPage());
      wireAskAi(document.getElementById('pageViewContent'));
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

/** Render the calendar iframe page. */
function renderCalendarPage() {
  const container = document.getElementById('pageViewContent');
  const darkParam = document.body.classList.contains('dark') ? '?dark=1' : '';
  container.innerHTML = `<iframe id="calFrame" src="calendar.html${darkParam}" style="width:100%;flex:1;border:none;"></iframe>`;
}

/** Render the views page with database view. */
function renderViewsPage() {
  const container = document.getElementById('pageViewContent');
  container.innerHTML = renderDbView();
  refreshIcons(container);
  wireDbView(container);
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

/** Render a list page (billing/care) and wire row navigation. */
function renderNavListPage(title, views) {
  const container = document.getElementById('pageViewContent');
  container.innerHTML = renderListPage(title, views);
  refreshIcons(container);
  container.querySelectorAll('.vp-row[data-nav]').forEach(row => {
    row.onclick = function () { navigateTo(this.dataset.nav); };
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

  // Billing tab delegation (global event listeners)
  wireBillingDelegation();

  // Keyboard navigation
  initKeyboardNav();

  // Global AI drawer
  initGlobalAiDrawer(() => appState.activeNav);

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
