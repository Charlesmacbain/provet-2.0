/**
 * Tasks data template.
 * @module data/tasks-data
 */

/**
 * Generate a tasks list from context.
 * @param {Object} ctx - Context with pet and client
 * @returns {Array<Object>} Tasks list
 */
export function TASKS_LIST_TEMPLATE(ctx) {
  return [
    { title: `Review ${ctx.pet}'s lab results and update treatment plan`, assignee: 'Dr. Sarah Smith', due: 'Today', priority: 'high', done: false },
    { title: `Call ${ctx.client} to discuss follow-up options`, assignee: 'Katie Brown', due: 'Today', priority: 'medium', done: false },
    { title: `Schedule ${ctx.pet}'s next vaccination appointment`, assignee: 'Reception', due: 'Mar 18', priority: 'medium', done: false },
    { title: `Order prescription refill`, assignee: 'Pharmacy', due: 'Mar 19', priority: 'low', done: false },
    { title: `Update ${ctx.pet}'s weight in medical record`, assignee: 'Dr. Sarah Smith', due: 'Mar 14', priority: 'low', done: true },
    { title: `Send vaccination certificate to ${ctx.client}`, assignee: 'Katie Brown', due: 'Mar 10', priority: 'medium', done: true },
    { title: `File insurance claim for dental procedure`, assignee: 'Billing', due: 'Mar 5', priority: 'medium', done: true },
  ];
}
