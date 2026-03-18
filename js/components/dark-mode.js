/**
 * Dark mode toggle logic and initialization for Provet Cloud.
 * @module components/dark-mode
 */

import { getDarkMode, setDarkMode } from '../utils/storage.js';
import { refreshIcons } from '../utils/dom.js';

/**
 * Applies the current dark mode state to the UI.
 * Updates the body class, label text, icon, and calendar iframe if present.
 *
 * @param {boolean} isDark - Whether dark mode should be active.
 */
export function applyDarkMode(isDark) {
  document.body.classList.toggle('dark', isDark);
  setDarkMode(isDark);

  const dmLabel = document.getElementById('darkModeLabel');
  if (dmLabel) {
    dmLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  }

  const dmIcon = document.querySelector('[data-action="dark-mode"] .dd-icon');
  if (dmIcon) {
    dmIcon.innerHTML = '<i data-lucide="' + (isDark ? 'sun' : 'moon') + '"></i>';
    refreshIcons(dmIcon);
  }

  const calFrame = document.getElementById('calFrame');
  if (calFrame && calFrame.contentDocument) {
    calFrame.contentDocument.body.classList.toggle('dark', isDark);
  }
}

/**
 * Toggles dark mode on or off and persists the preference.
 */
export function toggleDarkMode() {
  const isDark = !document.body.classList.contains('dark');
  applyDarkMode(isDark);
}

/**
 * Initializes dark mode on page load based on saved preference.
 * Should be called once during application startup.
 */
export function initDarkMode() {
  if (getDarkMode()) {
    document.body.classList.add('dark');
    const dmLabel = document.getElementById('darkModeLabel');
    if (dmLabel) dmLabel.textContent = 'Light mode';
    const dmIcon = document.querySelector('[data-action="dark-mode"] .dd-icon');
    if (dmIcon) {
      dmIcon.innerHTML = '<i data-lucide="sun"></i>';
      refreshIcons(dmIcon);
    }
  }
}
