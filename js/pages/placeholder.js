/**
 * Placeholder page renderer for pages under development.
 * @module pages/placeholder
 */

/**
 * Render a placeholder page with a given title.
 * @param {string} title - Page title
 * @returns {string} HTML string
 */
export function renderPlaceholderPage(title) {
  return `
    <div class="page-topbar">
      <span class="page-topbar-title">${title}</span>
    </div>
    <div class="ph-page">
      <p class="ph-desc">This view is under development.</p>
      <div class="ph-box">Content area</div>
    </div>`;
}
