/**
 * Global Ask AI Drawer — persistent AI sidebar available on every page.
 * @module components/global-ai-drawer
 */

import { refreshIcons } from '../utils/dom.js';

let drawerOpen = false;
let chatMessages = [];

/* ═══ Page Context ═══ */

const PAGE_CONTEXTS = {
  'calendar': {
    task: 'Manage today\'s appointments and schedule.',
    actions: [
      ['calendar', 'Show today\'s schedule summary'],
      ['clock', 'Find available appointment slots'],
      ['users', 'Check upcoming client appointments'],
      ['alert-circle', 'Flag scheduling conflicts'],
    ]
  },
  'customers': {
    task: 'Browse and manage client records.',
    actions: [
      ['search', 'Look up a client record'],
      ['file-text', 'Summarize client history'],
      ['send', 'Draft a message to a client'],
      ['user-plus', 'Help with new client intake'],
    ]
  },
  'views-page': {
    task: 'Explore data views and reports.',
    actions: [
      ['bar-chart-3', 'Summarize view data'],
      ['filter', 'Help build a custom filter'],
      ['download', 'Prepare data for export'],
      ['sparkles', 'Suggest useful views'],
    ]
  },
  'billing-page': {
    task: 'Review billing and invoices.',
    actions: [
      ['receipt', 'Summarize outstanding balances'],
      ['credit-card', 'Check payment history'],
      ['file-text', 'Draft an invoice reminder'],
      ['alert-circle', 'Flag overdue accounts'],
    ]
  },
  'care-page': {
    task: 'Manage patient care workflows.',
    actions: [
      ['heart-pulse', 'Summarize active care plans'],
      ['pill', 'Review current medications'],
      ['clipboard-check', 'Check pending tasks'],
      ['stethoscope', 'Prepare for next consultation'],
    ]
  },
  'inventory-page': {
    task: 'Monitor inventory and stock levels.',
    actions: [
      ['package', 'Check low stock items'],
      ['truck', 'Review pending orders'],
      ['alert-triangle', 'Flag expiring items'],
      ['bar-chart-3', 'Usage trends report'],
    ]
  },
  'reports': {
    task: 'Analyse clinic performance and data.',
    actions: [
      ['bar-chart-3', 'Generate a performance summary'],
      ['trending-up', 'Show revenue trends'],
      ['users', 'Patient volume analysis'],
      ['calendar', 'Compare time periods'],
    ]
  },
};

const DEFAULT_CONTEXT = {
  task: 'How can I help you today?',
  actions: [
    ['search', 'Look up a patient or client'],
    ['file-text', 'Draft a clinical document'],
    ['pill', 'Check drug interactions'],
    ['flask-conical', 'Interpret lab results'],
    ['calendar', 'Schedule an appointment'],
  ]
};

/* ═══ Render ═══ */

function getContext(navKey) {
  return PAGE_CONTEXTS[navKey] || DEFAULT_CONTEXT;
}

function renderSuggestionsView(ctx) {
  return `
    <div class="gai-welcome-scroll">
      <div class="gai-welcome-hero">
        <div class="gai-welcome-icon"><i data-lucide="sparkles"></i></div>
        <h2 class="gai-welcome-title">How can I help you today?</h2>
      </div>
      <div class="gai-suggestions-list">
        ${ctx.actions.map(a => `<div class="gai-suggestion-item" data-gai-action="${a[1]}"><i data-lucide="${a[0]}"></i> <span>${a[1]}</span></div>`).join('')}
      </div>
    </div>
    <div class="global-ai-input-bar">
      <div class="global-ai-input-row">
        <textarea class="global-ai-textarea" id="globalAiInput" placeholder="Do anything with AI..." rows="1"></textarea>
        <button class="global-ai-send-btn" id="gaiSendBtn"><i data-lucide="arrow-up"></i></button>
      </div>
      <div class="global-ai-hint">Enter to send</div>
    </div>`;
}

function renderChatView() {
  const msgs = chatMessages.map(m => {
    if (m.role === 'user') {
      return `<div class="gai-msg user">
        <div class="gai-msg-bubble">${escapeHtml(m.text)}</div>
        <div class="gai-msg-avatar user-av">CM</div>
      </div>`;
    }
    return `<div class="gai-msg assistant">
      <div class="gai-msg-avatar assistant"><i data-lucide="sparkles"></i></div>
      <div class="gai-msg-bubble">${m.html}</div>
    </div>`;
  }).join('');

  return `
    <div class="global-ai-chat-messages">
      <div class="global-ai-chat-scroll" id="gaiChatScroll">${msgs}</div>
    </div>
    <div class="global-ai-input-bar">
      <div class="global-ai-input-row">
        <textarea class="global-ai-textarea" id="globalAiInput" placeholder="Ask AI..." rows="1"></textarea>
        <button class="global-ai-send-btn" id="gaiSendBtn"><i data-lucide="arrow-up"></i></button>
      </div>
      <div class="global-ai-hint">Enter to send</div>
    </div>`;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ═══ Update Drawer Content ═══ */

function updateDrawerContent(navKey) {
  const body = document.getElementById('globalAiDrawerBody');
  if (!body) return;

  if (chatMessages.length > 0) {
    body.innerHTML = renderChatView();
  } else {
    const ctx = getContext(navKey);
    body.innerHTML = renderSuggestionsView(ctx);
  }
  refreshIcons(body);
  wireDrawerInput();
}

/* ═══ Input Wiring ═══ */

function wireDrawerInput() {
  const input = document.getElementById('globalAiInput');
  const sendBtn = document.getElementById('gaiSendBtn');
  if (!input) return;

  // Handle Enter to send (suggestions view uses textarea.ask-ai-input)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value.trim());
    }
  });

  // Auto-resize
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    if (sendBtn) sendBtn.classList.toggle('active', input.value.trim().length > 0);
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', () => sendMessage(input.value.trim()));
  }

  // Wire suggestion clicks
  document.querySelectorAll('#globalAiDrawerBody .ask-ai-suggestion[data-gai-action]').forEach(s => {
    s.addEventListener('click', () => {
      sendMessage(s.dataset.gaiAction);
    });
  });
}

function sendMessage(text) {
  if (!text) return;

  chatMessages.push({ role: 'user', text });
  updateDrawerContent();
  scrollChat();

  // Typing indicator
  setTimeout(() => {
    const scroll = document.getElementById('gaiChatScroll');
    if (scroll) {
      scroll.insertAdjacentHTML('beforeend', `
        <div class="gai-msg assistant" id="gaiTyping">
          <div class="gai-msg-avatar assistant"><i data-lucide="sparkles"></i></div>
          <div class="gai-msg-bubble"><div class="gai-typing"><span></span><span></span><span></span></div></div>
        </div>`);
      refreshIcons(scroll);
      scrollChat();
    }
  }, 200);

  // Simulate response
  setTimeout(() => {
    const typing = document.getElementById('gaiTyping');
    if (typing) typing.remove();
    chatMessages.push({ role: 'assistant', html: generateResponse(text) });
    updateDrawerContent();
    scrollChat();
  }, 1400 + Math.random() * 800);
}

function scrollChat() {
  requestAnimationFrame(() => {
    const scroll = document.getElementById('gaiChatScroll');
    if (scroll) scroll.scrollTop = scroll.scrollHeight;
  });
}

function generateResponse(text) {
  const lower = text.toLowerCase();
  if (lower.includes('medication') || lower.includes('drug') || lower.includes('interaction')) {
    return `<p>No critical interactions found with the current medication list. Recommend monitoring for GI sensitivity if combining NSAIDs with antibiotics.</p>`;
  }
  if (lower.includes('lab') || lower.includes('result') || lower.includes('blood')) {
    return `<p>Latest results show values within normal ranges. ALT slightly elevated at 125 U/L — recommend monitoring in 4 weeks.</p>`;
  }
  if (lower.includes('schedul') || lower.includes('appointment') || lower.includes('slot')) {
    return `<p>Next available slots: <strong>Today 3:30 PM</strong>, <strong>Tomorrow 9:00 AM</strong>, and <strong>Tomorrow 2:15 PM</strong>. Shall I book one?</p>`;
  }
  if (lower.includes('summar') || lower.includes('history')) {
    return `<p>Here's a quick summary:</p><ul><li>Last visit: <strong>12 Mar 2026</strong> — routine check-up</li><li>Active medications: Metacam, Amoxicillin</li><li>Upcoming: DHPP booster due in 3 weeks</li><li>No outstanding balance</li></ul>`;
  }
  if (lower.includes('draft') || lower.includes('message') || lower.includes('note')) {
    return `<p>Here's a draft:</p><p><em>"Dear [Client], this is a follow-up regarding [Patient]'s recent visit. Everything looks good and we recommend a follow-up in 2 weeks. Please don't hesitate to reach out if you have any concerns."</em></p>`;
  }
  if (lower.includes('stock') || lower.includes('inventory') || lower.includes('low')) {
    return `<p>Current low-stock items:</p><ul><li><strong>Metacam 1.5mg/ml</strong> — 3 units remaining</li><li><strong>Amoxicillin 250mg</strong> — 8 units</li><li><strong>Surgical gloves (M)</strong> — 1 box</li></ul><p>Auto-order threshold triggered for Metacam.</p>`;
  }
  return `<p>I've looked into that for you. Based on the current records, everything appears to be in order. Would you like me to go into more detail or help with something specific?</p>`;
}

/* ═══ Mode Management ═══ */

// Modes: 'floating' | 'sidebar' | 'fullpage'
let currentMode = 'floating';
let getNavFn = null;

function setMode(mode) {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (!drawer) return;

  currentMode = mode;
  drawer.classList.remove('mode-floating', 'mode-sidebar', 'mode-fullpage', 'collapsed');
  toggle.classList.add('hidden');

  drawer.classList.add('mode-' + mode);
  drawerOpen = true;
  updateDrawerContent(getNavFn ? getNavFn() : null);
}

function openDrawer() {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (!drawer) return;
  drawer.classList.remove('collapsed');
  drawer.classList.add('mode-' + currentMode);
  toggle.classList.add('hidden');
  drawerOpen = true;
}

function closeDrawer() {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (!drawer) return;
  drawer.classList.add('collapsed');
  drawer.classList.remove('mode-floating', 'mode-sidebar', 'mode-fullpage');
  toggle.classList.remove('hidden');
  drawerOpen = false;
}

/* ═══ Init ═══ */

export function initGlobalAiDrawer(getActiveNav) {
  getNavFn = getActiveNav;
  const toggle = document.getElementById('globalAiToggle');
  const closeBtn = document.getElementById('globalAiClose');

  if (toggle) {
    toggle.addEventListener('click', () => {
      openDrawer();
      updateDrawerContent(getActiveNav());
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Mode switch buttons
  document.querySelectorAll('.gai-mode-btn[data-ai-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      setMode(btn.dataset.aiMode);
    });
  });
}

/**
 * Called after navigation to update the drawer context.
 */
export function onNavigate(navKey) {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (!drawer || !toggle) return;

  drawer.style.display = '';
  toggle.style.display = '';

  if (drawerOpen) {
    updateDrawerContent(navKey);
  }
}

export function hideGlobalDrawer() {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (drawer) drawer.style.display = 'none';
  if (toggle) toggle.style.display = 'none';
}

export function showGlobalDrawer() {
  const drawer = document.getElementById('globalAiDrawer');
  const toggle = document.getElementById('globalAiToggle');
  if (drawer) drawer.style.display = '';
  if (toggle) toggle.style.display = '';
}

export function resetChat() {
  chatMessages = [];
}
