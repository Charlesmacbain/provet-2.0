/**
 * Sidebar collapse, section toggling, favourites management, and active state logic.
 * @module components/sidebar
 */

import {
  getSidebarCollapsed,
  setSidebarCollapsed,
  getFavourites,
  setFavourites,
  getCollapsedSections,
  setCollapsedSections
} from '../utils/storage.js';
import { refreshIcons } from '../utils/dom.js';

/** Colours used for favourite item dots. */
const FAV_COLORS = ['#e5534b', '#cf8e3e', '#57ab5a', '#539bf5', '#986ee2', '#c96198', '#6cb6ff', '#4dab9a'];

/**
 * Shared state object, passed in from the main app via initSidebar.
 * @type {{ favourites: string[], collapsedSections: Object, sidebarCollapsed: boolean, activeNav: string|null, navigateTo: Function }}
 */
let state = null;

/**
 * Applies the sidebar collapsed or expanded state.
 * Toggles the 'collapsed' class on the sidebar and updates the toggle button icon.
 */
export function applySidebarState() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebarToggle');
  sidebar.classList.toggle('collapsed', state.sidebarCollapsed);
  const iconName = state.sidebarCollapsed ? 'panel-left-open' : 'panel-left-close';
  toggleBtn.innerHTML = '<i data-lucide="' + iconName + '"></i>';
  refreshIcons(toggleBtn);
}

/**
 * Sets up a collapsible section toggle.
 * Wires the header click handler and applies saved collapsed state.
 *
 * @param {string} headerId - DOM id of the section header element.
 * @param {string} itemsId - DOM id of the section items container element.
 * @param {string} key - Storage key for tracking this section's collapsed state.
 */
export function toggleSection(headerId, itemsId, key) {
  const header = document.getElementById(headerId);
  const items = document.getElementById(itemsId);
  if (!header || !items) return;

  const arrow = header.querySelector('.section-arrow');

  function setCollapsed(collapsed) {
    if (collapsed) {
      items.style.display = 'none';
      if (arrow) arrow.textContent = '\u25B6';
    } else {
      items.style.display = '';
      if (arrow) arrow.textContent = '\u25BC';
    }
    state.collapsedSections[key] = collapsed;
    setCollapsedSections(state.collapsedSections);
  }

  if (state.collapsedSections[key]) setCollapsed(true);

  header.onclick = function (e) {
    e.stopPropagation();
    const isCurrentlyHidden = items.style.display === 'none';
    setCollapsed(!isCurrentlyHidden);
  };
}

/**
 * Persists the current favourites list to localStorage.
 */
export function saveFavourites() {
  setFavourites(state.favourites);
}

/**
 * Toggles a favourite key on or off, then re-renders stars and favourites list.
 *
 * @param {string} key - The favourite item key to toggle.
 */
export function toggleStar(key) {
  const idx = state.favourites.indexOf(key);
  if (idx >= 0) state.favourites.splice(idx, 1);
  else state.favourites.push(key);
  saveFavourites();
  renderStars();
  renderFavourites();
}

/**
 * Updates the visual state of all star toggle buttons to match the current favourites list.
 */
export function renderStars() {
  document.querySelectorAll('.star-toggle').forEach(el => {
    const key = el.dataset.star;
    const starred = state.favourites.includes(key);
    el.classList.toggle('starred', starred);
    const icon = el.querySelector('i');
    icon.setAttribute('data-lucide', 'star');
    lucide.createIcons({ nodes: [icon] });
    if (starred) el.querySelector('svg').style.fill = '#cf8e3e';
  });
}

/**
 * Renders the favourites section in the sidebar.
 * Shows or hides the section based on whether there are any favourites.
 */
export function renderFavourites() {
  const section = document.getElementById('favouritesSection');
  const list = document.getElementById('favouritesList');
  list.innerHTML = '';
  if (state.favourites.length === 0) {
    section.classList.remove('visible');
    return;
  }
  section.classList.add('visible');

  state.favourites.forEach((key, i) => {
    const original = document.querySelector(`.star-toggle[data-star="${key}"]`);
    if (!original) return;
    const subitem = original.closest('.nav-subitem');
    if (!subitem) return;

    const el = document.createElement('div');
    el.className = 'fav-item' + (state.activeNav === subitem.dataset.nav ? ' active' : '');
    el.dataset.nav = subitem.dataset.nav;
    el.tabIndex = 0;

    const dot = document.createElement('span');
    dot.className = 'fav-dot';
    dot.style.background = FAV_COLORS[i % FAV_COLORS.length];

    const label = document.createElement('span');
    label.className = 'fav-label';
    label.textContent = subitem.dataset.label;

    el.appendChild(dot);
    el.appendChild(label);
    el.addEventListener('click', () => state.navigateTo(subitem.dataset.nav));
    list.appendChild(el);
  });
}

/**
 * Updates the active state CSS class on all nav items and sub-items,
 * then re-renders the favourites list to reflect the new active state.
 */
export function updateActiveStates() {
  document.querySelectorAll('.nav-item[data-nav]').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === state.activeNav)
  );
  document.querySelectorAll('.nav-subitem[data-nav]').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === state.activeNav)
  );
  document.querySelectorAll('.list-nav-item[data-nav]').forEach(el =>
    el.classList.toggle('active', el.dataset.nav === state.activeNav)
  );
  renderFavourites();
}

/**
 * Initializes the sidebar: applies saved state, wires event handlers for
 * toggle, collapsible sections, star toggles, and nav items.
 *
 * @param {Object} appState - The shared application state.
 * @param {string[]} appState.favourites - Current list of favourite keys.
 * @param {Object} appState.collapsedSections - Map of section collapse states.
 * @param {boolean} appState.sidebarCollapsed - Whether the sidebar is collapsed.
 * @param {string|null} appState.activeNav - Currently active nav key.
 * @param {Function} appState.navigateTo - Navigation callback function.
 */
export function initSidebar(appState) {
  state = appState;

  // Sidebar collapse toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  toggleBtn.addEventListener('click', () => {
    state.sidebarCollapsed = !state.sidebarCollapsed;
    setSidebarCollapsed(state.sidebarCollapsed);
    applySidebarState();
  });
  applySidebarState();

  // Collapsible favourites section
  toggleSection('favouritesHeader', 'favouritesList', 'favourites');

  // Star toggle buttons
  document.querySelectorAll('.star-toggle').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStar(el.dataset.star);
    });
  });
  renderStars();
  renderFavourites();

  // Nav item click handlers
  document.querySelectorAll('.nav-item[data-nav]').forEach(el => {
    el.addEventListener('click', () => state.navigateTo(el.dataset.nav));
  });
  document.querySelectorAll('.nav-subitem[data-nav]').forEach(el => {
    el.addEventListener('click', () => state.navigateTo(el.dataset.nav));
  });
}
