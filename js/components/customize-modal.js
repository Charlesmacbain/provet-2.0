/**
 * Customize Sidebar Modal: open/close, drag-and-drop reordering,
 * visibility configuration, and sidebar config persistence.
 * @module components/customize-modal
 */

import { getSidebarConfig, setSidebarConfig } from '../utils/storage.js';
import { refreshIcons } from '../utils/dom.js';

/** Sidebar items config matching the nav items in the sidebar. */
const SIDEBAR_ITEMS = [
  { id: 'inbox', label: 'Inbox', icon: 'inbox', group: 'navigation' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', group: 'navigation' },
  { id: 'customers', label: 'Clients', icon: 'users', group: 'workspace' },
  { id: 'views-page', label: 'Views', icon: 'layout-grid', group: 'workspace' },
  { id: 'billing-page', label: 'Billing', icon: 'receipt', group: 'workspace' },
  { id: 'care-page', label: 'Care', icon: 'heart-pulse', group: 'workspace' },
  { id: 'inventory-page', label: 'Inventory', icon: 'package', group: 'workspace' },
  { id: 'reports', label: 'Reports', icon: 'bar-chart-3', group: 'workspace' },
];

/** Available visibility options for sidebar items. */
const VISIBILITY_OPTIONS = ['Always show', 'Show when badged', 'Hide'];

/** @type {HTMLElement} */
let overlay;
/** @type {HTMLElement} */
let closeBtn;
/** @type {HTMLElement} */
let body;

/**
 * Loads the sidebar configuration from localStorage.
 * Returns a default config if nothing is saved.
 *
 * @returns {Object<string, {order: number, visibility: string}>} The config map.
 */
export function loadConfig() {
  const saved = getSidebarConfig();
  if (saved) return saved;
  const cfg = {};
  SIDEBAR_ITEMS.forEach((item, i) => {
    cfg[item.id] = { order: i, visibility: 'Always show' };
  });
  return cfg;
}

/**
 * Saves the sidebar configuration to localStorage.
 *
 * @param {Object<string, {order: number, visibility: string}>} cfg - The config to save.
 */
export function saveConfig(cfg) {
  setSidebarConfig(cfg);
}

/**
 * Applies the saved sidebar configuration to the DOM.
 * Reorders nav items and toggles visibility based on config.
 */
export function applySidebarConfig() {
  const cfg = loadConfig();
  const nav = document.getElementById('sidebarNav');
  const navItems = Array.from(nav.querySelectorAll('.nav-item[data-nav]'));
  const sorted = navItems.sort((a, b) => {
    const oa = cfg[a.dataset.nav] ? cfg[a.dataset.nav].order : 99;
    const ob = cfg[b.dataset.nav] ? cfg[b.dataset.nav].order : 99;
    return oa - ob;
  });
  const favSection = document.getElementById('favouritesSection');
  sorted.forEach(item => {
    nav.insertBefore(item, favSection);
    const vis = cfg[item.dataset.nav] ? cfg[item.dataset.nav].visibility : 'Always show';
    item.classList.toggle('sidebar-hidden', vis === 'Hide');
  });
}

/**
 * Sets up drag-and-drop reordering for customize rows within a group.
 *
 * @param {HTMLElement} group - The container element holding .customize-row elements.
 */
function setupDragAndDrop(group) {
  let dragItem = null;

  group.querySelectorAll('.customize-row').forEach(row => {
    row.addEventListener('dragstart', (e) => {
      dragItem = row;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.itemId);
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      group.querySelectorAll('.customize-row').forEach(r => r.classList.remove('drag-over'));
      dragItem = null;
      const cfg = loadConfig();
      const allRows = group.closest('.customize-body') || body;
      let order = 0;
      allRows.querySelectorAll('.customize-row').forEach(r => {
        const id = r.dataset.itemId;
        if (cfg[id]) cfg[id].order = order;
        order++;
      });
      saveConfig(cfg);
      applySidebarConfig();
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (row !== dragItem) {
        group.querySelectorAll('.customize-row').forEach(r => r.classList.remove('drag-over'));
        row.classList.add('drag-over');
      }
    });

    row.addEventListener('dragleave', () => {
      row.classList.remove('drag-over');
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      if (dragItem && dragItem !== row) {
        const rows = Array.from(group.querySelectorAll('.customize-row'));
        const fromIdx = rows.indexOf(dragItem);
        const toIdx = rows.indexOf(row);
        if (fromIdx < toIdx) {
          row.after(dragItem);
        } else {
          row.before(dragItem);
        }
      }
    });
  });
}

/**
 * Opens the customize sidebar modal.
 * Builds the UI, wires drag-and-drop and visibility button handlers.
 */
export function openCustomizeModal() {
  const cfg = loadConfig();
  const items = [...SIDEBAR_ITEMS].sort((a, b) => {
    const oa = cfg[a.id] ? cfg[a.id].order : 99;
    const ob = cfg[b.id] ? cfg[b.id].order : 99;
    return oa - ob;
  });

  body.innerHTML = '';

  const group = document.createElement('div');
  group.className = 'customize-group';

  items.forEach(item => {
    const vis = cfg[item.id] ? cfg[item.id].visibility : 'Always show';
    const row = document.createElement('div');
    row.className = 'customize-row';
    row.draggable = true;
    row.dataset.itemId = item.id;
    row.innerHTML =
      '<span class="customize-drag-handle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="6" r="1"/><circle cx="15" cy="6" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="18" r="1"/><circle cx="15" cy="18" r="1"/></svg></span>' +
      '<span class="customize-row-icon"><i data-lucide="' + item.icon + '"></i></span>' +
      '<span class="customize-row-label">' + item.label + '</span>' +
      '<button class="customize-visibility-btn" data-item-id="' + item.id + '">' + vis + ' <i data-lucide="chevron-down"></i></button>';
    group.appendChild(row);
  });

  body.appendChild(group);
  setupDragAndDrop(group);

  refreshIcons(body);

  body.querySelectorAll('.customize-visibility-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      body.querySelectorAll('.customize-visibility-menu.open').forEach(m => m.remove());

      const row = btn.closest('.customize-row');
      const itemId = btn.dataset.itemId;
      const currentVis = cfg[itemId] ? cfg[itemId].visibility : 'Always show';

      const menu = document.createElement('div');
      menu.className = 'customize-visibility-menu open';
      VISIBILITY_OPTIONS.forEach(opt => {
        const option = document.createElement('div');
        option.className = 'customize-vis-option' + (opt === currentVis ? ' active' : '');
        option.innerHTML =
          '<span class="vis-check">' + (opt === currentVis ? '<i data-lucide="check"></i>' : '') + '</span>' +
          '<span>' + opt + '</span>';
        option.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (!cfg[itemId]) cfg[itemId] = { order: 0, visibility: opt };
          else cfg[itemId].visibility = opt;
          saveConfig(cfg);
          btn.innerHTML = opt + ' <i data-lucide="chevron-down"></i>';
          refreshIcons(btn);
          menu.remove();
          applySidebarConfig();
        });
        menu.appendChild(option);
      });
      refreshIcons(menu);
      row.appendChild(menu);

      setTimeout(() => {
        const closer = (ev) => {
          if (!menu.contains(ev.target)) {
            menu.remove();
            document.removeEventListener('click', closer);
          }
        };
        document.addEventListener('click', closer);
      }, 0);
    });
  });

  overlay.classList.add('open');
}

/**
 * Closes the customize sidebar modal and cleans up any open menus.
 */
export function closeCustomizeModal() {
  overlay.classList.remove('open');
  body.querySelectorAll('.customize-visibility-menu').forEach(m => m.remove());
}

/**
 * Initializes the customize modal module.
 * Caches DOM references, wires close handlers, and applies saved config on load.
 *
 * @returns {{ openCustomizeModal: Function, closeCustomizeModal: Function, applySidebarConfig: Function }}
 */
export function initCustomizeModal() {
  overlay = document.getElementById('customizeOverlay');
  closeBtn = document.getElementById('customizeClose');
  body = document.getElementById('customizeBody');

  closeBtn.addEventListener('click', closeCustomizeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeCustomizeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeCustomizeModal();
  });

  applySidebarConfig();

  return { openCustomizeModal, closeCustomizeModal, applySidebarConfig };
}
