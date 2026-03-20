/**
 * Lists section — collapsible sidebar section with template picker.
 * Users can add vet-specific list views from a templates modal.
 * @module components/lists
 */

import { getLists, setLists } from '../utils/storage.js';
import { refreshIcons } from '../utils/dom.js';
import { toggleSection } from './sidebar.js';
import { VIEW_SOURCES } from '../data/view-sources.js';

/** Template categories for the sidebar */
const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'layers' },
  { id: 'billing', label: 'Billing', icon: 'receipt' },
  { id: 'clinical', label: 'Clinical', icon: 'stethoscope' },
  { id: 'operations', label: 'Operations', icon: 'clipboard-list' },
  { id: 'communication', label: 'Communication', icon: 'message-circle' },
];

/** Available list templates */
const LIST_TEMPLATES = [
  {
    id: 'invoices',
    name: 'All Invoices',
    icon: 'receipt',
    color: '#57ab5a',
    category: 'billing',
    description: 'Track and manage all invoices across clients. Monitor payment status, overdue amounts, and revenue.',
    tags: ['Billing', 'Finance'],
    nav: 'invoices',
  },
  {
    id: 'estimates',
    name: 'Estimates',
    icon: 'file-text',
    color: '#5e6ad2',
    category: 'billing',
    description: 'Manage treatment estimates and cost approvals. Track pending, approved, and expired quotes for clients.',
    tags: ['Billing', 'Clients'],
    nav: 'estimates',
  },
  {
    id: 'health-plans',
    name: 'Health Plans',
    icon: 'heart-pulse',
    color: '#c96198',
    category: 'clinical',
    description: 'Wellness and preventive care plans for patients. Track enrolment, renewals, and covered services.',
    tags: ['Clinical', 'Wellness'],
    nav: 'health-plans',
  },
  {
    id: 'diagnostic-imaging',
    name: 'Diagnostic Imaging Requests',
    icon: 'scan',
    color: '#cf8e3e',
    category: 'clinical',
    description: 'Radiology, ultrasound, and other imaging requests. Track request status, results, and follow-ups.',
    tags: ['Clinical', 'Diagnostics'],
    nav: 'diagnostic-imaging',
  },
  {
    id: 'lab-requests',
    name: 'Laboratory Requests',
    icon: 'flask-conical',
    color: '#4dab9a',
    category: 'clinical',
    description: 'Lab test orders and results tracking. Monitor pending tests, completed panels, and abnormal results.',
    tags: ['Clinical', 'Diagnostics'],
    nav: 'lab-requests',
  },
  {
    id: 'patient-referrals',
    name: 'Patient Referrals',
    icon: 'send',
    color: '#986ee2',
    category: 'clinical',
    description: 'Referrals to specialists and external clinics. Track referral status, outcomes, and follow-up care.',
    tags: ['Clinical', 'Operations'],
    nav: 'patient-referrals',
  },
  {
    id: 'reminders',
    name: 'Reminders',
    icon: 'bell',
    color: '#539bf5',
    category: 'communication',
    description: 'Vaccination, check-up, and follow-up reminders. Manage automated notifications to clients.',
    tags: ['Communication', 'Wellness'],
    nav: 'reminders',
  },
  {
    id: 'written-prescriptions',
    name: 'Written Prescriptions',
    icon: 'pill',
    color: '#e5534b',
    category: 'clinical',
    description: 'Prescriptions issued to patients. Track active medications, refills, and prescription history.',
    tags: ['Clinical', 'Pharmacy'],
    nav: 'written-prescriptions',
  },
  {
    id: 'stock',
    name: 'Stock',
    icon: 'package',
    color: '#4dab9a',
    category: 'operations',
    description: 'Track inventory levels, reorder points, expiry dates, and supplier information across all locations.',
    tags: ['Operations', 'Inventory'],
    nav: 'stock',
  },
  {
    id: 'orders',
    name: 'Upcoming Orders',
    icon: 'clipboard-list',
    color: '#cf8e3e',
    category: 'operations',
    description: 'Track clinical orders for rounds, nursing tasks, ward assignments, and patient care workflows.',
    tags: ['Operations', 'Clinical'],
    nav: 'orders',
  },
];

let navigateTo = null;
let selectedTemplateId = null;
let activeCategory = 'all';

/**
 * Initialize the lists section.
 * @param {Object} opts
 * @param {Function} opts.navigateTo - App navigation function
 */
export function initLists(opts) {
  navigateTo = opts.navigateTo;

  // Collapsible section
  toggleSection('listsHeader', 'listsContent', 'lists');

  // New list button
  const newBtn = document.getElementById('listsNewBtn');
  if (newBtn) {
    newBtn.addEventListener('click', openTemplatesModal);
  }

  // Templates modal close
  const overlay = document.getElementById('templatesOverlay');
  const closeBtn = document.getElementById('templatesClose');
  if (closeBtn) closeBtn.addEventListener('click', closeTemplatesModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeTemplatesModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) closeTemplatesModal();
  });

  // Clean up any broken lists
  const knownTemplateIds = LIST_TEMPLATES.map(t => t.id);
  const lists = getLists();
  const cleaned = lists.filter(l => {
    // Valid template list (id matches a known template)
    if (knownTemplateIds.includes(l.id)) return true;
    // Valid custom list (has objectKey in VIEW_SOURCES)
    if (l.objectKey && VIEW_SOURCES[l.objectKey]) return true;
    // Everything else is broken — remove it
    return false;
  });
  if (cleaned.length !== lists.length) {
    setLists(cleaned);
  }

  // Render saved lists
  renderListsNav();
}

/**
 * Render the lists in the sidebar navigation.
 */
export function renderListsNav() {
  const container = document.getElementById('listsList');
  if (!container) return;
  const lists = getLists();
  container.innerHTML = '';

  lists.forEach(list => {
    const el = document.createElement('div');
    el.className = 'list-nav-item';
    el.dataset.nav = list.nav;
    el.tabIndex = 0;
    el.innerHTML = `
      <span class="list-nav-icon"><i data-lucide="${list.icon}"></i></span>
      <span class="list-nav-label">${list.name}</span>`;
    el.addEventListener('click', () => {
      if (navigateTo) navigateTo(list.nav);
    });
    container.appendChild(el);
  });

  refreshIcons(container);
}

/**
 * Open the templates modal.
 */
function openTemplatesModal() {
  const overlay = document.getElementById('templatesOverlay');
  selectedTemplateId = null;
  activeCategory = 'all';
  renderTemplatesSidebar();
  renderTemplatesList('');
  wireTemplatesModal();
  overlay.classList.add('open');

  const searchInput = document.getElementById('templatesSearchInput');
  if (searchInput) {
    searchInput.value = '';
    setTimeout(() => searchInput.focus(), 50);
  }
}

/**
 * Close the templates modal.
 */
function closeTemplatesModal() {
  const overlay = document.getElementById('templatesOverlay');
  overlay.classList.remove('open');
  selectedTemplateId = null;
}

/**
 * Render the categories sidebar in the templates modal.
 */
function renderTemplatesSidebar() {
  const sidebar = document.getElementById('templatesSidebar');
  const existingLists = getLists();
  const existingIds = new Set(existingLists.map(l => l.id));

  sidebar.innerHTML = `
    <div class="templates-sidebar-label">USE CASES</div>
    ${TEMPLATE_CATEGORIES.map(cat => `
      <div class="templates-cat-item${cat.id === activeCategory ? ' active' : ''}" data-cat="${cat.id}">
        <span class="templates-cat-icon"><i data-lucide="${cat.icon}"></i></span>
        <span class="templates-cat-label">${cat.label}</span>
      </div>`).join('')}`;
  refreshIcons(sidebar);
}

/**
 * Render the templates list, optionally filtered.
 */
function renderTemplatesList(query) {
  const list = document.getElementById('templatesList');
  const existingLists = getLists();
  const existingIds = new Set(existingLists.map(l => l.id));
  const q = (query || '').toLowerCase();

  let templates = LIST_TEMPLATES;
  if (activeCategory !== 'all') {
    templates = templates.filter(t => t.category === activeCategory);
  }
  if (q) {
    templates = templates.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  if (templates.length === 0) {
    list.innerHTML = '<div class="templates-empty">No templates found</div>';
    return;
  }

  list.innerHTML = templates.map(t => {
    const added = existingIds.has(t.id);
    return `
    <div class="templates-card${t.id === selectedTemplateId ? ' selected' : ''}${added ? ' added' : ''}" data-template-id="${t.id}">
      <div class="templates-card-preview" style="border-left: 3px solid ${t.color}">
        <span class="templates-card-preview-icon"><i data-lucide="${t.icon}"></i></span>
      </div>
      <div class="templates-card-body">
        <div class="templates-card-header">
          <div class="templates-card-name">${t.name}</div>
          ${added ? '<span class="templates-card-added">Added</span>' : ''}
        </div>
        <div class="templates-card-desc">${t.description}</div>
        <div class="templates-card-tags">${t.tags.map(tag => `<span class="templates-tag">${tag}</span>`).join('')}</div>
      </div>
    </div>`;
  }).join('');

  refreshIcons(list);
}

/**
 * Wire up the templates modal interactions.
 */
function wireTemplatesModal() {
  // Category clicks
  document.getElementById('templatesSidebar').addEventListener('click', (e) => {
    const cat = e.target.closest('.templates-cat-item');
    if (!cat) return;
    activeCategory = cat.dataset.cat;
    renderTemplatesSidebar();
    renderTemplatesList(document.getElementById('templatesSearchInput').value);
    wireTemplateCardClicks();
  });

  // Search
  const searchInput = document.getElementById('templatesSearchInput');
  searchInput.addEventListener('input', () => {
    renderTemplatesList(searchInput.value);
    wireTemplateCardClicks();
  });

  // Card clicks
  wireTemplateCardClicks();

  // Use template button
  const useBtn = document.getElementById('templatesUseBtn');
  useBtn.addEventListener('click', () => {
    if (selectedTemplateId) {
      addListFromTemplate(selectedTemplateId);
    }
  });

  // Start from scratch
  const scratchBtn = document.getElementById('templatesScratchBtn');
  scratchBtn.addEventListener('click', () => {
    // Add a blank custom list
    addCustomList();
  });
}

function wireTemplateCardClicks() {
  document.querySelectorAll('.templates-card').forEach(card => {
    card.addEventListener('click', () => {
      selectedTemplateId = card.dataset.templateId;
      document.querySelectorAll('.templates-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
    card.addEventListener('dblclick', () => {
      addListFromTemplate(card.dataset.templateId);
    });
  });
}

/**
 * Add a list from a template.
 */
function addListFromTemplate(templateId) {
  const template = LIST_TEMPLATES.find(t => t.id === templateId);
  if (!template) return;

  const lists = getLists();
  if (lists.some(l => l.id === template.id)) {
    // Already added — just navigate to it
    closeTemplatesModal();
    if (navigateTo) navigateTo(template.nav);
    return;
  }

  lists.push({
    id: template.id,
    name: template.name,
    icon: template.icon,
    color: template.color,
    nav: template.nav,
  });
  setLists(lists);
  renderListsNav();
  closeTemplatesModal();
  if (navigateTo) navigateTo(template.nav);
}

/**
 * Launch the custom list creation wizard.
 */
function addCustomList() {
  closeTemplatesModal();
  showCustomListWizard();
}

/* ═══ Custom List Wizard ═══ */

const WIZARD_OBJECTS = Object.entries(VIEW_SOURCES).map(([key, src]) => ({
  key, label: src.label, icon: src.icon, columns: src.columns, filterFields: src.filterFields,
}));

const VIEW_TYPES = [
  { id: 'list', label: 'List', icon: 'list', desc: 'Table rows with sortable columns' },
  { id: 'kanban', label: 'Board', icon: 'columns', desc: 'Kanban board grouped by status' },
];

let wizardState = { step: 0, object: null, viewType: 'list', filters: [], groupBy: '', name: '' };

function showCustomListWizard() {
  wizardState = { step: 0, object: null, viewType: 'list', filters: [], groupBy: '', name: '' };

  const overlay = document.createElement('div');
  overlay.className = 'wizard-overlay';
  overlay.id = 'wizardOverlay';
  overlay.innerHTML = `<div class="wizard-modal"><div class="wizard-content" id="wizardContent"></div></div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeWizard(); });
  document.addEventListener('keydown', function esc(e) {
    if (e.key === 'Escape') { closeWizard(); document.removeEventListener('keydown', esc); }
  });

  renderWizardStep();
}

function closeWizard() {
  const el = document.getElementById('wizardOverlay');
  if (el) el.remove();
}

function renderWizardStep() {
  const c = document.getElementById('wizardContent');
  if (!c) return;

  const steps = ['Select object', 'Choose view', 'Add filters', 'Group by', 'Name & create'];
  const progress = steps.map((s, i) => `<div class="wizard-step-dot${i === wizardState.step ? ' active' : ''}${i < wizardState.step ? ' done' : ''}"><span>${i + 1}</span></div><div class="wizard-step-label${i === wizardState.step ? ' active' : ''}">${s}</div>`).join('');

  let body = '';
  switch (wizardState.step) {
    case 0: body = renderStep0(); break;
    case 1: body = renderStep1(); break;
    case 2: body = renderStep2(); break;
    case 3: body = renderStep3(); break;
    case 4: body = renderStep4(); break;
  }

  const canBack = wizardState.step > 0;
  const isLast = wizardState.step === 4;
  const canNext = wizardState.step === 0 ? !!wizardState.object : true;

  c.innerHTML = `
    <div class="wizard-header">
      <h3>Create custom list</h3>
      <button class="wizard-close" id="wizardClose"><i data-lucide="x"></i></button>
    </div>
    <div class="wizard-progress">${progress}</div>
    <div class="wizard-body">${body}</div>
    <div class="wizard-footer">
      ${canBack ? '<button class="wizard-btn secondary" id="wizardBack">Back</button>' : '<div></div>'}
      <button class="wizard-btn primary${!canNext ? ' disabled' : ''}" id="wizardNext">${isLast ? 'Create list' : 'Next'}</button>
    </div>`;
  refreshIcons(c);

  c.querySelector('#wizardClose').addEventListener('click', closeWizard);
  if (canBack) c.querySelector('#wizardBack').addEventListener('click', () => { wizardState.step--; renderWizardStep(); });
  c.querySelector('#wizardNext').addEventListener('click', () => {
    // Re-check canNext at click time, not render time
    const nextOk = wizardState.step === 0 ? !!wizardState.object : true;
    if (!nextOk) return;
    if (isLast) { finalizeCustomList(); return; }
    wizardState.step++;
    renderWizardStep();
  });

  wireStepInteractions();
}

// Step 0: Select object
function renderStep0() {
  return `
    <div class="wizard-section-title">What do you want to display?</div>
    <div class="wizard-object-grid">
      ${WIZARD_OBJECTS.map(o => `
        <div class="wizard-object-card${wizardState.object === o.key ? ' selected' : ''}" data-obj="${o.key}">
          <div class="wizard-object-icon"><i data-lucide="${o.icon}"></i></div>
          <div class="wizard-object-label">${o.label}</div>
        </div>`).join('')}
    </div>`;
}

// Step 1: Choose view type
function renderStep1() {
  return `
    <div class="wizard-section-title">How do you want to view it?</div>
    <div class="wizard-view-grid">
      ${VIEW_TYPES.map(v => `
        <div class="wizard-view-card${wizardState.viewType === v.id ? ' selected' : ''}" data-view="${v.id}">
          <div class="wizard-view-icon"><i data-lucide="${v.icon}"></i></div>
          <div class="wizard-view-info">
            <div class="wizard-view-label">${v.label}</div>
            <div class="wizard-view-desc">${v.desc}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// Step 2: Add filters
function renderStep2() {
  const obj = WIZARD_OBJECTS.find(o => o.key === wizardState.object);
  const fields = obj ? obj.filterFields : [];
  return `
    <div class="wizard-section-title">Add filters <span class="wizard-optional">(optional)</span></div>
    <div class="wizard-filters">
      ${wizardState.filters.map((f, i) => `
        <div class="wizard-filter-row" data-fi="${i}">
          <select class="wizard-select" data-filter-field="${i}">
            ${fields.map(fd => `<option${f.field === fd ? ' selected' : ''}>${fd}</option>`).join('')}
          </select>
          <select class="wizard-select small" data-filter-op="${i}">
            <option${f.op === 'is' ? ' selected' : ''}>is</option>
            <option${f.op === 'is not' ? ' selected' : ''}>is not</option>
            <option${f.op === 'contains' ? ' selected' : ''}>contains</option>
          </select>
          <input class="wizard-input" data-filter-val="${i}" value="${f.value}" placeholder="Value..." />
          <button class="wizard-remove-btn" data-remove-filter="${i}"><i data-lucide="x"></i></button>
        </div>`).join('')}
      <button class="wizard-add-btn" id="wizardAddFilter"><i data-lucide="plus"></i> Add filter</button>
    </div>`;
}

// Step 3: Group by
function renderStep3() {
  const obj = WIZARD_OBJECTS.find(o => o.key === wizardState.object);
  const cols = obj ? obj.columns : [];
  return `
    <div class="wizard-section-title">Group by <span class="wizard-optional">(optional)</span></div>
    <div class="wizard-group-options">
      <div class="wizard-group-option${wizardState.groupBy === '' ? ' selected' : ''}" data-group="">
        <i data-lucide="minus"></i> <span>No grouping</span>
      </div>
      ${cols.map(col => `
        <div class="wizard-group-option${wizardState.groupBy === col ? ' selected' : ''}" data-group="${col}">
          <i data-lucide="folder"></i> <span>${col}</span>
        </div>`).join('')}
    </div>`;
}

// Step 4: Name & create
function renderStep4() {
  const obj = WIZARD_OBJECTS.find(o => o.key === wizardState.object);
  const defaultName = obj ? obj.label : 'Custom List';
  if (!wizardState.name) wizardState.name = defaultName;
  return `
    <div class="wizard-section-title">Name your list</div>
    <input class="wizard-name-input" id="wizardNameInput" value="${wizardState.name}" placeholder="List name..." />
    <div class="wizard-summary">
      <div class="wizard-summary-row"><span class="wizard-summary-label">Object</span><span>${obj ? obj.label : '—'}</span></div>
      <div class="wizard-summary-row"><span class="wizard-summary-label">View</span><span>${wizardState.viewType === 'kanban' ? 'Board' : 'List'}</span></div>
      <div class="wizard-summary-row"><span class="wizard-summary-label">Filters</span><span>${wizardState.filters.length || 'None'}</span></div>
      <div class="wizard-summary-row"><span class="wizard-summary-label">Group by</span><span>${wizardState.groupBy || 'None'}</span></div>
    </div>`;
}

function wireStepInteractions() {
  const c = document.getElementById('wizardContent');
  if (!c) return;

  // Step 0: object selection
  c.querySelectorAll('.wizard-object-card').forEach(card => {
    card.addEventListener('click', () => {
      wizardState.object = card.dataset.obj;
      wizardState.filters = [];
      wizardState.groupBy = '';
      c.querySelectorAll('.wizard-object-card').forEach(x => x.classList.remove('selected'));
      card.classList.add('selected');
      c.querySelector('#wizardNext').classList.remove('disabled');
    });
  });

  // Step 1: view type
  c.querySelectorAll('.wizard-view-card').forEach(card => {
    card.addEventListener('click', () => {
      wizardState.viewType = card.dataset.view;
      c.querySelectorAll('.wizard-view-card').forEach(x => x.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  // Step 2: filters
  const addFilterBtn = c.querySelector('#wizardAddFilter');
  if (addFilterBtn) {
    addFilterBtn.addEventListener('click', () => {
      const obj = WIZARD_OBJECTS.find(o => o.key === wizardState.object);
      wizardState.filters.push({ field: obj.filterFields[0], op: 'is', value: '' });
      renderWizardStep();
    });
  }
  c.querySelectorAll('[data-remove-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      wizardState.filters.splice(parseInt(btn.dataset.removeFilter), 1);
      renderWizardStep();
    });
  });
  c.querySelectorAll('[data-filter-field]').forEach(sel => {
    sel.addEventListener('change', () => { wizardState.filters[parseInt(sel.dataset.filterField)].field = sel.value; });
  });
  c.querySelectorAll('[data-filter-op]').forEach(sel => {
    sel.addEventListener('change', () => { wizardState.filters[parseInt(sel.dataset.filterOp)].op = sel.value; });
  });
  c.querySelectorAll('[data-filter-val]').forEach(inp => {
    inp.addEventListener('input', () => { wizardState.filters[parseInt(inp.dataset.filterVal)].value = inp.value; });
  });

  // Step 3: group by
  c.querySelectorAll('.wizard-group-option').forEach(opt => {
    opt.addEventListener('click', () => {
      wizardState.groupBy = opt.dataset.group;
      c.querySelectorAll('.wizard-group-option').forEach(x => x.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Step 4: name input
  const nameInput = c.querySelector('#wizardNameInput');
  if (nameInput) {
    nameInput.addEventListener('input', () => { wizardState.name = nameInput.value; });
    nameInput.focus();
    nameInput.select();
  }
}

function finalizeCustomList() {
  const id = 'custom-' + Date.now();
  const obj = WIZARD_OBJECTS.find(o => o.key === wizardState.object);
  const lists = getLists();
  lists.push({
    id,
    name: wizardState.name || 'Untitled List',
    icon: obj ? obj.icon : 'list',
    color: '#5e6ad2',
    nav: id,
    custom: true,
    objectKey: wizardState.object,
    viewType: wizardState.viewType,
    filters: wizardState.filters,
    groupBy: wizardState.groupBy,
  });
  setLists(lists);
  renderListsNav();
  closeWizard();
  if (navigateTo) navigateTo(id);
}

/** Get custom list config by nav key */
export function getCustomListConfig(navKey) {
  const lists = getLists();
  return lists.find(l => l.nav === navKey && l.custom);
}
