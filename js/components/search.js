/**
 * Global search overlay: open/close, results rendering, preview panel,
 * and keyboard navigation.
 * @module components/search
 */

import { refreshIcons } from '../utils/dom.js';

/** @type {HTMLElement} */
let searchOverlay;
/** @type {HTMLInputElement} */
let searchInput;
/** @type {HTMLElement} */
let searchList;
/** @type {HTMLElement} */
let searchPreview;

/** @type {number} Index of the currently focused search result. */
let searchFocusedIdx = 0;

/** @type {Array<Object>} The currently filtered search results. */
let searchFilteredResults = [];

/** @type {Array<Object>} The full set of searchable records. */
let SEARCH_RECORDS = [];

/** @type {Function|null} Callback to open a record view when a result is selected. */
let openRecordViewCallback = null;

/**
 * Opens the search overlay, clears the input, and renders initial results.
 */
export function openSearch() {
  searchOverlay.classList.add('open');
  searchInput.value = '';
  searchInput.focus();
  renderSearchResults('');
}

/**
 * Closes the search overlay.
 */
export function closeSearch() {
  searchOverlay.classList.remove('open');
}

/**
 * Renders the filtered search results list grouped by type (Clients, Patients).
 *
 * @param {string} q - The search query string.
 */
export function renderSearchResults(q) {
  searchList.innerHTML = '';
  q = q.toLowerCase().trim();
  searchFilteredResults = q
    ? SEARCH_RECORDS.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.owner && r.owner.toLowerCase().includes(q)) ||
        (r.breed && r.breed.toLowerCase().includes(q))
      )
    : SEARCH_RECORDS;

  if (!searchFilteredResults.length) {
    searchList.innerHTML = '<div class="search-empty">No results</div>';
    searchPreview.innerHTML = '<div class="search-preview-empty">No record selected</div>';
    return;
  }

  const clients = searchFilteredResults.filter(r => r.type === 'client');
  const patients = searchFilteredResults.filter(r => r.type === 'patient');
  searchFocusedIdx = 0;

  if (clients.length) {
    const label = document.createElement('div');
    label.className = 'search-section-label';
    label.textContent = 'Clients';
    searchList.appendChild(label);
    clients.forEach(r => searchList.appendChild(createSearchResultEl(r)));
  }
  if (patients.length) {
    const label = document.createElement('div');
    label.className = 'search-section-label';
    label.textContent = 'Patients';
    searchList.appendChild(label);
    patients.forEach(r => searchList.appendChild(createSearchResultEl(r)));
  }

  const allResults = searchList.querySelectorAll('.search-result');
  if (allResults[0]) allResults[0].classList.add('focused');
  updateSearchPreview(searchFilteredResults[0]);
  refreshIcons(searchList);
}

/**
 * Creates a DOM element for a single search result row.
 *
 * @param {Object} r - The search record object.
 * @returns {HTMLElement} The search result element.
 */
export function createSearchResultEl(r) {
  const idx = searchFilteredResults.indexOf(r);
  const el = document.createElement('div');
  el.className = 'search-result';
  el.dataset.idx = idx;
  const sub = r.type === 'client' ? r.email : (r.breed + ' \u00B7 ' + r.owner);
  const badge = r.type === 'client'
    ? '<span class="r-badge client">Client</span>'
    : '<span class="r-badge patient">Patient</span>';
  el.innerHTML = `<div class="r-avatar" style="background:${r.color}">${r.initials}</div><span class="r-name">${r.name}</span><span class="r-sub">${sub}</span>${badge}`;
  el.addEventListener('click', () => {
    searchList.querySelectorAll('.search-result').forEach(e => e.classList.remove('focused'));
    el.classList.add('focused');
    searchFocusedIdx = idx;
    updateSearchPreview(r);
  });
  el.addEventListener('dblclick', () => {
    searchFocusedIdx = idx;
    openSearchRecord();
  });
  return el;
}

/**
 * Updates the search preview panel with details for the given record.
 *
 * @param {Object} r - The search record to preview.
 */
export function updateSearchPreview(r) {
  if (!r) {
    searchPreview.innerHTML = '<div class="search-preview-empty">Select a record to preview</div>';
    return;
  }

  if (r.type === 'client') {
    searchPreview.innerHTML = `
      <div class="search-preview-header">
        <div class="search-preview-avatar" style="background:${r.color}">${r.initials}</div>
        <span class="search-preview-name">${r.name}</span>
        <span class="search-preview-badge" style="background:rgba(94,106,210,0.08);color:#5e6ad2;">Client</span>
      </div>
      <div class="search-preview-section">Details</div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="mail"></i></span><span class="spf-value">${r.email}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="phone"></i></span><span class="spf-value">${r.phone}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="map-pin"></i></span><span class="spf-value">${r.address}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="calendar"></i></span><span class="spf-value">Client since ${r.since}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="paw-print"></i></span><span class="spf-value">${r.pets.join(', ')}</span></div>
    `;
  } else {
    searchPreview.innerHTML = `
      <div class="search-preview-header">
        <div class="search-preview-avatar" style="background:${r.color}">${r.initials}</div>
        <span class="search-preview-name">${r.name}</span>
        <span class="search-preview-badge" style="background:rgba(87,171,90,0.08);color:#57ab5a;">Patient</span>
      </div>
      <div class="search-preview-section">Details</div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="user"></i></span><span class="spf-value">${r.owner}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="info"></i></span><span class="spf-value">${r.species} \u00B7 ${r.breed}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="clock"></i></span><span class="spf-value">${r.age} \u00B7 ${r.sex}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="scale"></i></span><span class="spf-value">${r.weight}</span></div>
      <div class="search-preview-field"><span class="spf-icon"><i data-lucide="hash"></i></span><span class="spf-value">ID: ${r.id}</span></div>
      <div class="search-preview-section">Tags</div>
      <div class="search-preview-tags">
        <span class="search-preview-tag">${r.species}</span>
        <span class="search-preview-tag">${r.breed}</span>
        <span class="search-preview-tag">${r.sex.split(' ')[0]}</span>
      </div>
    `;
  }
  refreshIcons(searchPreview);
}

/**
 * Opens the currently focused search record by invoking the record view callback.
 */
function openSearchRecord() {
  const r = searchFilteredResults[searchFocusedIdx];
  closeSearch();
  if (r && openRecordViewCallback) openRecordViewCallback(r);
}

/**
 * Initializes the search module.
 * Caches DOM references, registers event listeners for input, keyboard
 * navigation, click-to-close, and the Cmd/Ctrl+K shortcut.
 *
 * @param {Object} options
 * @param {Array<Object>} options.records - The full set of searchable records (SEARCH_RECORDS).
 * @param {Function} options.openRecordView - Callback invoked when a search result is opened.
 */
export function initSearch({ records, openRecordView }) {
  SEARCH_RECORDS = records;
  openRecordViewCallback = openRecordView;

  searchOverlay = document.getElementById('searchOverlay');
  searchInput = document.getElementById('searchInput');
  searchList = document.getElementById('searchList');
  searchPreview = document.getElementById('searchPreview');

  searchInput.addEventListener('input', () => renderSearchResults(searchInput.value));

  searchInput.addEventListener('keydown', (e) => {
    const results = searchList.querySelectorAll('.search-result');
    const cur = searchList.querySelector('.search-result.focused');
    let idx = cur ? Array.from(results).indexOf(cur) : -1;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (idx < results.length - 1) {
        if (cur) cur.classList.remove('focused');
        results[idx + 1].classList.add('focused');
        results[idx + 1].scrollIntoView({ block: 'nearest' });
        searchFocusedIdx = parseInt(results[idx + 1].dataset.idx);
        updateSearchPreview(searchFilteredResults[searchFocusedIdx]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (idx > 0) {
        if (cur) cur.classList.remove('focused');
        results[idx - 1].classList.add('focused');
        results[idx - 1].scrollIntoView({ block: 'nearest' });
        searchFocusedIdx = parseInt(results[idx - 1].dataset.idx);
        updateSearchPreview(searchFilteredResults[searchFocusedIdx]);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      openSearchRecord();
    }
  });

  document.getElementById('searchOpenBtn').addEventListener('click', openSearchRecord);
  document.getElementById('searchBtn').addEventListener('click', openSearch);

  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('open')) closeSearch();
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchOverlay.classList.contains('open') ? closeSearch() : openSearch();
    }
  });
}
