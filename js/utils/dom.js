/**
 * DOM utility helpers for Provet Cloud UI.
 * @module utils/dom
 */

/**
 * Returns a CSS class name for a status pill based on the status string.
 * @param {string} status - The status value (e.g. "Paid", "Pending", "Overdue").
 * @returns {string} One of "green", "yellow", "red", "gray", or "blue".
 */
export function statusPillClass(status) {
  const v = (status || '').toLowerCase();
  if ('paid completed active approved confirmed'.includes(v)) return 'green';
  if ('pending in progress sent sent to lab scheduled partial'.includes(v)) return 'yellow';
  if ('overdue inactive expired cancelled'.includes(v)) return 'red';
  if ('draft pending approval'.includes(v)) return 'gray';
  return 'blue';
}

/**
 * Returns HTML for a circular avatar element.
 * @param {string} initials - The initials to display inside the avatar.
 * @param {string} color - CSS background color for the avatar.
 * @param {string} [className='inbox-avatar'] - CSS class name for the avatar div.
 * @returns {string} HTML string for the avatar element.
 */
export function createAvatarHTML(initials, color, className = 'inbox-avatar') {
  return `<div class="${className}" style="background:${color}">${initials}</div>`;
}

/**
 * Returns HTML for a Lucide icon element.
 * @param {string} iconName - The name of the Lucide icon (e.g. "calendar", "user").
 * @returns {string} HTML string for the icon element.
 */
export function createIconHTML(iconName) {
  return `<i data-lucide="${iconName}"></i>`;
}

/**
 * Initializes Lucide icons within a container element.
 * @param {HTMLElement} container - The DOM element containing icon elements to refresh.
 */
export function refreshIcons(container) {
  lucide.createIcons({ nodes: container.querySelectorAll('i') });
}

/**
 * Renders a tab section with a title, icon, and table.
 * This is the shared pattern used across most tab content renderers:
 * a tab-section-title followed by a tab-table with thead and tbody.
 *
 * @param {string} title - The section title text.
 * @param {string} icon - Lucide icon name for the section title.
 * @param {string[]} columns - Array of column header labels.
 * @param {string} rowsHTML - Pre-built HTML string for the table body rows.
 * @returns {string} HTML string for the complete tab section.
 */
export function renderTabTable(title, icon, columns, rowsHTML) {
  const thHTML = columns.map(c => `<th>${c}</th>`).join('');
  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="${icon}"></i> ${title}</div>
      <table class="tab-table">
        <thead><tr>${thHTML}</tr></thead>
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>`;
}
