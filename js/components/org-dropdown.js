/**
 * Organisation dropdown open/close logic.
 * @module components/org-dropdown
 */

import { toggleDarkMode } from './dark-mode.js';

/**
 * Initializes the organisation dropdown.
 * Wires click, outside-click, and Escape key handlers for opening and closing,
 * plus item action handlers for settings navigation, dark mode toggle, and
 * customize sidebar.
 *
 * @param {Object} options
 * @param {Function} options.navigateTo - Navigation callback for the "settings" action.
 * @param {Function} options.openCustomizeModal - Callback to open the customize sidebar modal.
 */
export function initOrgDropdown({ navigateTo, openCustomizeModal }) {
  const orgBtn = document.getElementById('orgBtn');
  const orgDropdown = document.getElementById('orgDropdown');

  orgBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    orgDropdown.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!orgDropdown.contains(e.target) && e.target !== orgBtn) {
      orgDropdown.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') orgDropdown.classList.remove('open');
  });

  orgDropdown.querySelectorAll('.org-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      orgDropdown.classList.remove('open');
      const action = item.dataset.action;

      if (action === 'settings') {
        navigateTo('settings');
      }

      if (action === 'dark-mode') {
        toggleDarkMode();
      }

      if (action === 'customize-sidebar') {
        openCustomizeModal();
      }
    });
  });
}
