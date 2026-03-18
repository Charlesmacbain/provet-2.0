/**
 * Record view module — renders patient/client record pages.
 * @module pages/record
 */

import { SEARCH_RECORDS } from '../data/search-records.js';
import { renderTabContent } from '../tabs/tab-router.js';
import { renderChartTab } from '../tabs/chart.js';

let recordDrawerTab = 'client';

/**
 * Open a patient or client record view.
 * @param {Object} record - The search record object
 * @param {string} [selectedPetName] - Optional pet name to display
 */
export function openRecordView(record, selectedPetName) {
  if (window.inSettingsMode) {
    window.inSettingsMode = false;
    document.getElementById('sidebar').classList.remove('settings-mode');
    document.getElementById('settingsSidebarNav').innerHTML = '';
  }
  window.activeNav = null;
  window.updateActiveStates();
  document.getElementById('welcomeScreen').style.display = 'none';
  document.getElementById('inboxPanel').classList.remove('active');
  const pageView = document.getElementById('pageView');
  pageView.style.display = 'flex';
  pageView.style.overflow = 'hidden';
  const c = document.getElementById('pageViewContent');

  const isPatient = record.type === 'patient';

  let client, patient, clientPets;
  if (isPatient) {
    patient = record;
    client = SEARCH_RECORDS.find(r => r.type === 'client' && r.name === record.owner);
  } else {
    client = record;
    const petName = selectedPetName || record.pets[0];
    patient = SEARCH_RECORDS.find(r => r.type === 'patient' && r.name === petName);
  }
  clientPets = client ? client.pets : [];

  let petSelector = '';
  if (clientPets.length > 1 && patient) {
    const opts = clientPets.map(p => `<option value="${p}"${p === patient.name ? ' selected' : ''}>${p}</option>`).join('');
    petSelector = `<select class="record-pet-select" id="recordPetSelect">${opts}</select>`;
  }

  let detailHeader;
  if (client && patient) {
    detailHeader = `<div class="inbox-detail-header-banner">
      <button class="record-back-btn" id="recordBackBtn"><i data-lucide="arrow-left"></i></button>
      <div class="inbox-detail-avatar" style="background:${patient.color}">${patient.initials}</div>
      <div class="inbox-detail-header-text">
        <div class="inbox-detail-header-top">
          <span class="inbox-detail-client-name">${client.name}</span>
          <span class="inbox-detail-sep">\u00BB</span>
          <span class="inbox-detail-pet-name">${patient.name}</span>
          ${petSelector}
        </div>
        <div class="inbox-detail-header-meta">
          ${patient.age} &middot; ${patient.sex} &middot; ${patient.species} &middot; ${patient.breed} &middot; <strong>Weight:</strong> ${patient.weight} &middot; <strong>DOB:</strong> ${patient.dob || '\u2014'} &middot; <strong>ID:</strong> ${patient.id}
        </div>
      </div>
    </div>`;
  } else if (client) {
    detailHeader = `<div class="inbox-detail-header-banner">
      <button class="record-back-btn" id="recordBackBtn"><i data-lucide="arrow-left"></i></button>
      <div class="inbox-detail-avatar" style="background:${client.color}">${client.initials}</div>
      <div class="inbox-detail-header-text">
        <div class="inbox-detail-header-top">
          <span class="inbox-detail-pet-name">${client.name}</span>
        </div>
        <div class="inbox-detail-header-meta">
          <strong>Email:</strong> ${client.email} &middot; <strong>Phone:</strong> ${client.phone} &middot; <strong>Since:</strong> ${client.since}
        </div>
      </div>
    </div>`;
  } else {
    detailHeader = `<div class="inbox-detail-header">
      <button class="record-back-btn" id="recordBackBtn"><i data-lucide="arrow-left"></i> Back</button>
      <div class="inbox-detail-avatar" style="background:${record.color}">${record.initials}</div>
      <div class="inbox-detail-title">${record.name}</div>
    </div>`;
  }

  const tabList = (patient) ? ['Chart','Medications','Immunizations','Labs','Billing','Messages','Tasks','Forms','Consultations'] : ['Overview','Pets','Billing','Messages','Tasks','Forms','Info'];
  let detailTabs = '<div class="inbox-detail-tabs">' + tabList.map((t,i) => '<div class="inbox-detail-tab' + (i===0?' active':'') + '">' + t + '</div>').join('') + '</div>';

  let detailBody = (patient) ? renderRecordChart(patient) : renderClientOverview(record);

  const drawerTabs = `<div class="inbox-drawer-tabs" id="recordDrawerTabs">
    <div class="inbox-drawer-tab active" data-drawer-tab="ask-ai">Ask AI</div>
  </div>`;

  c.innerHTML = `<div class="record-page">
    <div class="record-main">${detailHeader}${detailTabs}<div class="inbox-detail-body">${detailBody}</div></div>
    <div class="record-drawer" id="recordDrawer">${drawerTabs}<div class="inbox-drawer-body" id="recordDrawerBody"></div></div>
  </div>`;

  lucide.createIcons({ nodes: c.querySelectorAll('i') });

  document.getElementById('recordBackBtn').addEventListener('click', () => {
    pageView.style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'flex';
  });

  const petSelect = document.getElementById('recordPetSelect');
  if (petSelect) {
    petSelect.addEventListener('change', () => {
      openRecordView(client, petSelect.value);
    });
  }

  renderRecordDrawer(record, patient);

  c.querySelectorAll('.inbox-detail-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      c.querySelectorAll('.inbox-detail-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.textContent.replace(/Due$/,'').trim();
      const bodyEl = c.querySelector('.inbox-detail-body');
      if (patient) {
        const recCtx = { client: client ? client.name : '', pet: patient.name, species: patient.species, breed: patient.breed, sex: patient.sex, age: patient.age, weight: patient.weight, dob: patient.dob || '\u2014', id: patient.id };
        bodyEl.innerHTML = renderTabContent(tabName, 0, recCtx);
      } else if (tabName === 'Overview') {
        bodyEl.innerHTML = renderClientOverview(record);
      } else if (tabName === 'Pets') {
        bodyEl.innerHTML = renderClientOverview(record);
      } else {
        const recCtx = { client: record.name, pet: record.pets?.[0] || '\u2014', species: '\u2014', breed: '\u2014', sex: '\u2014', age: '\u2014', weight: '\u2014', dob: '\u2014', id: '\u2014' };
        bodyEl.innerHTML = renderTabContent(tabName, 0, recCtx);
      }
      if (tabName === 'Messages') {
        bodyEl.insertAdjacentHTML('afterend', '');
      }
      lucide.createIcons({ nodes: bodyEl.querySelectorAll('i') });
      c.querySelectorAll('[data-pet-name]').forEach(el => {
        el.addEventListener('click', () => {
          const pet = SEARCH_RECORDS.find(sr => sr.type === 'patient' && sr.name === el.dataset.petName);
          if (pet) openRecordView(client || record, pet.name);
        });
      });
    });
  });

  c.querySelectorAll('[data-pet-name]').forEach(el => {
    el.addEventListener('click', () => {
      const pet = SEARCH_RECORDS.find(sr => sr.type === 'patient' && sr.name === el.dataset.petName);
      if (pet) openRecordView(client || record, pet.name);
    });
  });
}

/**
 * Render the patient chart for the record view.
 * Delegates to renderChartTab for the timeline, with a simplified context.
 * @param {Object} r - Patient record object
 * @returns {string} HTML string
 */
export function renderRecordChart(r) {
  const ctx = {
    pet: r.name,
    species: r.species,
    breed: r.breed,
    sex: r.sex,
    age: r.age,
    weight: r.weight
  };
  return renderChartTab(0, ctx);
}

/**
 * Render client overview section.
 * @param {Object} r - Client record object
 * @returns {string} HTML string
 */
export function renderClientOverview(r) {
  const petList = r.pets.map(p => {
    const pr = SEARCH_RECORDS.find(sr => sr.type === 'patient' && sr.name === p);
    if (!pr) return '';
    return `<div class="form-item" style="cursor:pointer;" data-pet-name="${p}">
      <div class="form-icon green"><i data-lucide="paw-print"></i></div>
      <div class="form-body"><div class="form-name">${p}</div><div class="form-desc">${pr.species} · ${pr.breed} · ${pr.age}</div></div>
      <span class="status-pill active dot">${pr.sex.split(' ')[0]}</span>
    </div>`;
  }).join('');
  return `
    <div class="tab-section-title"><i data-lucide="user"></i> CLIENT DETAILS</div>
    <div class="info-grid">
      <div><div class="info-label">EMAIL</div><div class="info-value">${r.email}</div></div>
      <div><div class="info-label">PHONE</div><div class="info-value">${r.phone}</div></div>
      <div><div class="info-label">ADDRESS</div><div class="info-value">${r.address}</div></div>
      <div><div class="info-label">CLIENT SINCE</div><div class="info-value">${r.since}</div></div>
    </div>
    <div class="tab-section-title"><i data-lucide="paw-print"></i> PETS (${r.pets.length})</div>
    ${petList}`;
}

/**
 * Render the AI drawer for a record view.
 * @param {Object} record - The record object
 * @param {Object|null} patient - The patient object if applicable
 */
export function renderRecordDrawer(record, patient) {
  const body = document.getElementById('recordDrawerBody');
  if (!body) return;
  const petName = patient ? patient.name : (record.type === 'patient' ? record.name : record.pets?.[0] || 'patient');

  const actions = patient ? [
    ['file-text', 'Summarize ' + petName + '\u2019s history'],
    ['send', 'Draft a message to the client'],
    ['pill', 'Review current medications'],
    ['alert-triangle', 'Check for drug interactions'],
    ['calendar', 'Schedule next appointment'],
  ] : [
    ['file-text', 'Summarize client account'],
    ['send', 'Draft a message to ' + record.name],
    ['clipboard-list', 'Review outstanding balance'],
    ['calendar', 'Schedule next visit'],
  ];

  body.innerHTML = `
    <div class="ask-ai-scroll">
      <div class="current-task-card">
        <div class="current-task-label"><i data-lucide="clipboard-check"></i> Current Task</div>
        <div class="current-task-text">Review ${petName}\u2019s medical records and update chart.</div>
      </div>
      <div class="ask-ai-suggestions">
        <div class="inbox-drawer-section-title">Suggested Actions</div>
        ${actions.map(a => `<div class="ask-ai-suggestion"><i data-lucide="${a[0]}"></i> ${a[1]}</div>`).join('')}
      </div>
    </div>
    <div class="ask-ai-input-bar">
      <textarea class="ask-ai-input" placeholder="Ask AI about this patient, client, or case..."></textarea>
      <div class="ask-ai-hint">Press Enter to ask</div>
    </div>`;
  lucide.createIcons({ nodes: body.querySelectorAll('i') });
}
