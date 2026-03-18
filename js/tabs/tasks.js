/**
 * Tasks tab renderer.
 * @module tabs/tasks
 */

import { TASKS_LIST_TEMPLATE } from '../data/tasks-data.js';

/**
 * Render the tasks tab.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, client
 * @returns {string} HTML string
 */
export function renderTasksTab(idx, ctx) {
  const tasks = TASKS_LIST_TEMPLATE(ctx);

  const openCount = tasks.filter(t => !t.done).length;
  const doneCount = tasks.filter(t => t.done).length;

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="check-square"></i> Tasks \u2014 ${ctx.pet} <span style="font-weight:400;text-transform:none;letter-spacing:0;margin-left:4px">(${openCount} open, ${doneCount} completed)</span></div>
      ${tasks.map(t => `
        <div class="task-item${t.done ? ' done' : ''}">
          <div class="task-check${t.done ? ' done' : ''}"></div>
          <div class="task-body">
            <div class="task-title">${t.title}</div>
            <div class="task-meta">
              <i data-lucide="user"></i> ${t.assignee}
              <span>\u00B7</span>
              <i data-lucide="calendar"></i> ${t.due}
              <span class="task-priority"><span class="status-pill ${t.priority}">${t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}</span></span>
            </div>
          </div>
        </div>`).join('')}
    </div>`;
}
