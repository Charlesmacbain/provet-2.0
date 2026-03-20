/**
 * LocalStorage utility helpers for Provet Cloud.
 * Provides typed JSON read/write and application-specific storage keys.
 * @module utils/storage
 */

/** Storage key for sidebar collapsed state. */
export const KEY_SIDEBAR_COLLAPSED = 'provet-sidebar-collapsed';

/** Storage key for collapsed nav sections. */
export const KEY_COLLAPSED_SECTIONS = 'provet-collapsed';

/** Storage key for dark mode preference. */
export const KEY_DARK_MODE = 'provet-dark';

/** Storage key for favourites list. */
export const KEY_FAVOURITES = 'provet-favourites';

/** Storage key for sidebar customize config. */
export const KEY_SIDEBAR_CUSTOMIZE = 'provet-sidebar-customize';

/** Storage key for user-added lists. */
export const KEY_LISTS = 'provet-lists';

/**
 * Reads and parses a JSON value from localStorage.
 * Returns the defaultValue if the key is missing or the value cannot be parsed.
 *
 * @param {string} key - The localStorage key.
 * @param {*} defaultValue - Fallback value when key is absent or parse fails.
 * @returns {*} The parsed value or the defaultValue.
 */
export function getJSON(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Stringifies a value and saves it to localStorage.
 *
 * @param {string} key - The localStorage key.
 * @param {*} value - The value to stringify and store.
 */
export function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Reads the sidebar collapsed state from localStorage.
 * @returns {boolean} True if the sidebar is collapsed.
 */
export function getSidebarCollapsed() {
  return localStorage.getItem(KEY_SIDEBAR_COLLAPSED) === 'true';
}

/**
 * Saves the sidebar collapsed state to localStorage.
 * @param {boolean} collapsed - Whether the sidebar is collapsed.
 */
export function setSidebarCollapsed(collapsed) {
  localStorage.setItem(KEY_SIDEBAR_COLLAPSED, String(collapsed));
}

/**
 * Reads the dark mode preference from localStorage.
 * @returns {boolean} True if dark mode is enabled.
 */
export function getDarkMode() {
  return localStorage.getItem(KEY_DARK_MODE) === 'true';
}

/**
 * Saves the dark mode preference to localStorage.
 * @param {boolean} isDark - Whether dark mode is enabled.
 */
export function setDarkMode(isDark) {
  localStorage.setItem(KEY_DARK_MODE, String(isDark));
}

/**
 * Reads the favourites list from localStorage.
 * @returns {string[]} Array of favourite keys.
 */
export function getFavourites() {
  return getJSON(KEY_FAVOURITES, []);
}

/**
 * Saves the favourites list to localStorage.
 * @param {string[]} favourites - Array of favourite keys.
 */
export function setFavourites(favourites) {
  setJSON(KEY_FAVOURITES, favourites);
}

/**
 * Reads collapsed sections state from localStorage.
 * @returns {Object<string, boolean>} Map of section keys to collapsed state.
 */
export function getCollapsedSections() {
  return getJSON(KEY_COLLAPSED_SECTIONS, {});
}

/**
 * Saves collapsed sections state to localStorage.
 * @param {Object<string, boolean>} sections - Map of section keys to collapsed state.
 */
export function setCollapsedSections(sections) {
  setJSON(KEY_COLLAPSED_SECTIONS, sections);
}

/**
 * Reads the saved lists from localStorage.
 * @returns {Array} Array of list objects.
 */
export function getLists() {
  return getJSON(KEY_LISTS, []);
}

/**
 * Saves the lists to localStorage.
 * @param {Array} lists - Array of list objects.
 */
export function setLists(lists) {
  setJSON(KEY_LISTS, lists);
}

/**
 * Reads the sidebar customize config from localStorage.
 * @returns {Object|null} The config object or null if not set.
 */
export function getSidebarConfig() {
  return getJSON(KEY_SIDEBAR_CUSTOMIZE, null);
}

/**
 * Saves the sidebar customize config to localStorage.
 * @param {Object} config - The sidebar customization config.
 */
export function setSidebarConfig(config) {
  setJSON(KEY_SIDEBAR_CUSTOMIZE, config);
}
