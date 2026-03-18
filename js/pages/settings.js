/**
 * Settings page module — sidebar takeover mode with settings navigation.
 * @module pages/settings
 */

import { SETTINGS_NAV } from '../data/settings-nav.js';

const SETTINGS_LOCATIONS = [
  'Canadian department',
  'Helsinki Main Clinic',
  'Stockholm Branch',
];

let settingsActiveSection = 'personal-details';
let settingsSelectedLocation = 'Canadian department';

/**
 * Enter settings mode — takes over sidebar and renders settings content.
 */
export function enterSettingsMode() {
  window.inSettingsMode = true;
  const sb = document.getElementById('sidebar');
  sb.classList.add('settings-mode');

  const nav = document.getElementById('settingsSidebarNav');
  let html = `<button class="settings-sidebar-back" id="settingsBackBtn"><i data-lucide="chevron-left"></i> Back to app</button>`;

  SETTINGS_NAV.forEach(item => {
    if (item.type === 'section') {
      html += `<div class="settings-nav-section">${item.label}</div>`;
    } else if (item.type === 'subgroup') {
      html += `<div class="settings-nav-subgroup">${item.label}</div>`;
    } else if (item.type === 'location-picker') {
      html += `<button class="settings-location-picker" id="settingsLocationPicker">
        <i data-lucide="map-pin"></i>
        <span>${settingsSelectedLocation}</span>
        <i data-lucide="chevron-down" class="chevron"></i>
      </button>`;
    } else if (item.type === 'link') {
      html += `<div class="settings-nav-item${item.key === settingsActiveSection ? ' active' : ''}" data-settings-nav="${item.key}">${item.label}</div>`;
    }
  });

  nav.innerHTML = html;
  lucide.createIcons({ nodes: nav.querySelectorAll('i') });

  const welcome = document.getElementById('welcomeScreen');
  const inbox = document.getElementById('inboxPanel');
  const pageView = document.getElementById('pageView');
  welcome.style.display = 'none';
  inbox.classList.remove('active');
  pageView.style.display = 'flex';
  pageView.style.overflow = 'hidden';
  const c = document.getElementById('pageViewContent');
  c.innerHTML = `<div class="settings-content" id="settingsContent">${renderSettingsSection(settingsActiveSection)}</div>`;
  lucide.createIcons({ nodes: c.querySelectorAll('i') });
  wireSettingsToggles(c);
  wireThemeSelect(c);

  document.getElementById('settingsBackBtn').addEventListener('click', exitSettingsMode);

  nav.querySelectorAll('[data-settings-nav]').forEach(item => {
    item.addEventListener('click', () => {
      settingsActiveSection = item.dataset.settingsNav;
      nav.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const content = document.getElementById('settingsContent');
      if (content) {
        content.innerHTML = renderSettingsSection(settingsActiveSection);
        lucide.createIcons({ nodes: content.querySelectorAll('i') });
        wireSettingsToggles(content);
        wireThemeSelect(content);
      }
    });
  });

  const locPicker = nav.querySelector('#settingsLocationPicker');
  if (locPicker) {
    locPicker.addEventListener('click', () => {
      const idx = SETTINGS_LOCATIONS.indexOf(settingsSelectedLocation);
      settingsSelectedLocation = SETTINGS_LOCATIONS[(idx + 1) % SETTINGS_LOCATIONS.length];
      locPicker.querySelector('span').textContent = settingsSelectedLocation;
    });
  }
}

/**
 * Exit settings mode and return to the welcome screen.
 */
export function exitSettingsMode() {
  window.inSettingsMode = false;
  const sb = document.getElementById('sidebar');
  sb.classList.remove('settings-mode');
  document.getElementById('settingsSidebarNav').innerHTML = '';
  window.activeNav = null;
  window.updateActiveStates();
  document.getElementById('welcomeScreen').style.display = 'flex';
  document.getElementById('inboxPanel').classList.remove('active');
  document.getElementById('pageView').style.display = 'none';
}

/**
 * Render a settings section by key.
 * @param {string} key - Settings section key
 * @returns {string} HTML string
 */
export function renderSettingsSection(key) {
  if (key === 'preferences') return renderPreferencesSection();
  const navItem = SETTINGS_NAV.find(n => n.key === key);
  const title = navItem ? navItem.label : key;
  return `<div class="settings-title">${title}</div><div class="ph-desc" style="margin-top:8px;">This section is under development.</div>`;
}

/**
 * Render the preferences settings section.
 * @returns {string} HTML string
 */
export function renderPreferencesSection() {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '\u2318' : 'Ctrl';
  const isDark = document.body.classList.contains('dark');
  return `
    <div class="settings-title">Preferences</div>

    <div class="settings-section-label">General</div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Default home view</div>
        <div class="settings-row-desc">Select which view to display when launching Provet Cloud</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select">
          <option>Active issues</option><option>Inbox</option><option>Calendar</option><option>Customers</option>
        </select>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Display names</div>
        <div class="settings-row-desc">Select how names are displayed in the interface</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>Username</option><option>Full name</option></select>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">First day of the week</div>
        <div class="settings-row-desc">Used for date pickers</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>Monday</option><option>Sunday</option><option>Saturday</option></select>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Convert text emoticons into emojis</div>
        <div class="settings-row-desc">Strings like :) will be converted to \u{1F600}</div>
      </div>
      <div class="settings-row-action">
        <button class="settings-toggle on" data-toggle="emoticons"></button>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Send comment on...</div>
        <div class="settings-row-desc">Choose which key press is used to submit a comment</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>${modKey}+Enter</option><option>Enter</option></select>
      </div>
    </div>

    <div class="settings-section-gap"></div>
    <div class="settings-section-label">Interface and theme</div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">App sidebar</div>
        <div class="settings-row-desc">Customize sidebar item visibility, ordering, and badge style</div>
      </div>
      <div class="settings-row-action"><button class="settings-btn">Customize</button></div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Font size</div>
        <div class="settings-row-desc">Adjust the size of text across the app</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>Default</option><option>Small</option><option>Large</option></select>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Use pointer cursors</div>
        <div class="settings-row-desc">Change the cursor to a pointer when hovering over any interactive elements</div>
      </div>
      <div class="settings-row-action">
        <button class="settings-toggle" data-toggle="pointer-cursors"></button>
      </div>
    </div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Interface theme</div>
        <div class="settings-row-desc">Select or customize your interface color scheme</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select" id="settingsThemeSelect">
          <option value="system">System preference</option>
          <option value="light"${!isDark ? ' selected' : ''}>Light</option>
          <option value="dark"${isDark ? ' selected' : ''}>Dark</option>
        </select>
      </div>
    </div>
    <div class="settings-theme-row">
      <div class="settings-theme-icon light">Aa</div>
      <div class="settings-theme-info">
        <div class="settings-theme-name">Light</div>
        <div class="settings-theme-desc">Theme to use for light system appearance</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>Light</option></select>
      </div>
    </div>
    <div class="settings-theme-row">
      <div class="settings-theme-icon dark">Aa</div>
      <div class="settings-theme-info">
        <div class="settings-theme-name">Dark</div>
        <div class="settings-theme-desc">Theme to use for dark system appearance</div>
      </div>
      <div class="settings-row-action">
        <select class="settings-select"><option>Dark</option></select>
      </div>
    </div>

    <div class="settings-section-gap"></div>
    <div class="settings-section-label">Desktop application</div>
    <div class="settings-row">
      <div class="settings-row-info">
        <div class="settings-row-label">Open in desktop app</div>
        <div class="settings-row-desc">Automatically open links in desktop app when possible</div>
      </div>
      <div class="settings-row-action">
        <button class="settings-toggle" data-toggle="desktop-app"></button>
      </div>
    </div>
  `;
}

/**
 * Wire settings toggle buttons within a container.
 * @param {HTMLElement} container
 */
export function wireSettingsToggles(container) {
  container.querySelectorAll('.settings-toggle').forEach(btn => {
    btn.addEventListener('click', () => btn.classList.toggle('on'));
  });
}

/**
 * Wire theme select dropdown within a container.
 * @param {HTMLElement} container
 */
export function wireThemeSelect(container) {
  const sel = container.querySelector('#settingsThemeSelect');
  if (!sel) return;
  sel.addEventListener('change', () => {
    const val = sel.value;
    if (val === 'dark') {
      document.body.classList.add('dark');
      localStorage.setItem('provet-dark', true);
    } else if (val === 'light') {
      document.body.classList.remove('dark');
      localStorage.setItem('provet-dark', false);
    }
    const isDark = document.body.classList.contains('dark');
    document.getElementById('darkModeLabel').textContent = isDark ? 'Light mode' : 'Dark mode';
    const dmIcon = document.querySelector('[data-action="dark-mode"] .dd-icon');
    if (dmIcon) { dmIcon.innerHTML = '<i data-lucide="' + (isDark ? 'sun' : 'moon') + '"></i>'; lucide.createIcons({ nodes: dmIcon.querySelectorAll('i') }); }
    var calFrame = document.getElementById('calFrame');
    if (calFrame && calFrame.contentDocument) { calFrame.contentDocument.body.classList.toggle('dark', isDark); }
  });
}
