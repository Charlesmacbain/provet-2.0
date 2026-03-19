/**
 * Ask AI — full-page chat interface.
 * @module pages/ask-ai
 */

/* ═══ Conversation Data ═══ */

const HISTORY = [
  { group: 'Today', items: [
    { id: 'c1', label: 'Bella — medication interactions', active: true },
    { id: 'c2', label: 'Summarize Max\'s lab results' },
  ]},
  { group: 'Yesterday', items: [
    { id: 'c3', label: 'Draft discharge note for Luna' },
    { id: 'c4', label: 'Vaccination schedule for kittens' },
    { id: 'c5', label: 'Invoice discrepancy — Henderson' },
  ]},
  { group: 'Last 7 days', items: [
    { id: 'c6', label: 'Dental procedure guidelines' },
    { id: 'c7', label: 'Flea treatment options comparison' },
    { id: 'c8', label: 'Lab reference ranges — canine CBC' },
  ]},
];

const SUGGESTIONS = [
  { icon: 'stethoscope', title: 'Patient summary', desc: 'Get a quick overview of any patient\'s history' },
  { icon: 'pill', title: 'Check interactions', desc: 'Review drug interactions and contraindications' },
  { icon: 'file-text', title: 'Draft a document', desc: 'Discharge notes, referral letters, and more' },
  { icon: 'flask-conical', title: 'Interpret lab results', desc: 'Analyse bloodwork, urinalysis, and imaging' },
];

const DEMO_MESSAGES = [
  { role: 'user', text: 'Can you check if there are any drug interactions between Bella\'s current medications? She\'s on Metacam and Amoxicillin.' },
  { role: 'assistant', html: `
    <p>I've reviewed Bella's current medications. Here's what I found:</p>
    <p><strong>Metacam (Meloxicam)</strong> + <strong>Amoxicillin</strong> — No significant direct interaction. However, there are a few considerations:</p>
    <ul>
      <li><strong>GI sensitivity:</strong> Both medications can cause gastrointestinal upset. Administering with food is recommended.</li>
      <li><strong>Renal function:</strong> NSAIDs like Metacam should be used cautiously in patients with compromised kidney function. Amoxicillin is renally excreted, so monitoring is advisable.</li>
      <li><strong>Duration:</strong> If both are needed long-term, periodic bloodwork (renal panel) is recommended.</li>
    </ul>
    <p>Bella's last renal panel from <strong>12 Feb 2026</strong> showed values within normal range. No immediate concerns, but a follow-up in 2 weeks would be prudent if both medications continue.</p>
  `, sources: [
    { icon: 'file-text', label: 'Patient record — Bella' },
    { icon: 'pill', label: 'Drug interaction database' },
    { icon: 'flask-conical', label: 'Lab results — 12 Feb' },
  ]},
];

/* ═══ Render Functions ═══ */

function renderHistory() {
  return HISTORY.map(g => `
    <div class="ai-chat-history-group">${g.group}</div>
    ${g.items.map(i => `
      <div class="ai-chat-history-item${i.active ? ' active' : ''}" data-conv="${i.id}">${i.label}</div>
    `).join('')}
  `).join('');
}

function renderWelcome() {
  return `
    <div class="ai-chat-welcome">
      <div class="ai-chat-welcome-icon"><i data-lucide="sparkles"></i></div>
      <h2>Ask AI</h2>
      <p>Ask questions about patients, medications, lab results, or get help drafting clinical documents.</p>
      <div class="ai-chat-suggestions">
        ${SUGGESTIONS.map(s => `
          <div class="ai-chat-suggestion" data-suggestion="${s.title}">
            <div class="ai-chat-suggestion-title"><i data-lucide="${s.icon}"></i> ${s.title}</div>
            <div class="ai-chat-suggestion-desc">${s.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderUserMsg(text) {
  return `
    <div class="ai-msg user">
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">${escapeHtml(text)}</div>
      </div>
      <div class="ai-msg-avatar user-avatar">CM</div>
    </div>
  `;
}

function renderAssistantMsg(html, sources) {
  const srcHtml = sources && sources.length ? `
    <div class="ai-msg-sources">
      ${sources.map(s => `<span class="ai-msg-source"><i data-lucide="${s.icon}"></i> ${s.label}</span>`).join('')}
    </div>
  ` : '';
  return `
    <div class="ai-msg assistant">
      <div class="ai-msg-avatar assistant"><i data-lucide="sparkles"></i></div>
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">${html}</div>
        ${srcHtml}
      </div>
    </div>
  `;
}

function renderTyping() {
  return `
    <div class="ai-msg assistant" id="aiTypingMsg">
      <div class="ai-msg-avatar assistant"><i data-lucide="sparkles"></i></div>
      <div class="ai-msg-content">
        <div class="ai-msg-bubble">
          <div class="ai-msg-typing"><span></span><span></span><span></span></div>
        </div>
      </div>
    </div>
  `;
}

function renderMessages() {
  return DEMO_MESSAGES.map(m => {
    if (m.role === 'user') return renderUserMsg(m.text);
    return renderAssistantMsg(m.html, m.sources);
  }).join('');
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ═══ Main Render ═══ */

export function renderAskAiPage() {
  return `
    <div class="ai-chat-page">
      <div class="ai-chat-topbar">
        <div class="ai-chat-topbar-title"><i data-lucide="sparkles"></i> Ask AI</div>
        <div class="ai-chat-topbar-right">
          <button id="aiHistoryToggle" title="Toggle history"><i data-lucide="panel-left-close"></i></button>
          <button title="New conversation" id="aiNewChat"><i data-lucide="plus"></i></button>
        </div>
      </div>
      <div class="ai-chat-body">
        <div class="ai-chat-history" id="aiChatHistory">
          <div class="ai-chat-history-header">
            <span class="ai-chat-history-label">Conversations</span>
            <button class="ai-chat-new-btn" title="New conversation"><i data-lucide="plus"></i></button>
          </div>
          <div class="ai-chat-history-list">${renderHistory()}</div>
        </div>
        <div class="ai-chat-main">
          <div class="ai-chat-messages" id="aiChatMessages">
            <div class="ai-chat-messages-inner" id="aiChatMessagesInner">
              ${renderMessages()}
            </div>
          </div>
          <div class="ai-chat-input-area">
            <div class="ai-chat-input-wrap">
              <div class="ai-chat-input-row">
                <textarea class="ai-chat-textarea" id="aiChatInput" placeholder="Ask about patients, medications, labs..." rows="1"></textarea>
                <button class="ai-chat-send-btn" id="aiChatSend" title="Send"><i data-lucide="arrow-up"></i></button>
              </div>
              <div class="ai-chat-input-hints">
                <span><kbd>Enter</kbd> to send</span>
                <span><kbd>Shift + Enter</kbd> for new line</span>
              </div>
            </div>
          </div>
          <div class="ai-chat-disclaimer">AI responses are for clinical decision support only. Always verify with authoritative sources.</div>
        </div>
      </div>
    </div>
  `;
}

/* ═══ Wire Interactions ═══ */

export function wireAskAi(container) {
  const textarea = container.querySelector('#aiChatInput');
  const sendBtn = container.querySelector('#aiChatSend');
  const messagesInner = container.querySelector('#aiChatMessagesInner');
  const messagesScroll = container.querySelector('#aiChatMessages');
  const historyPanel = container.querySelector('#aiChatHistory');
  const historyToggle = container.querySelector('#aiHistoryToggle');
  const newChatBtn = container.querySelector('#aiNewChat');
  const newChatBtn2 = container.querySelector('.ai-chat-new-btn');

  // Auto-resize textarea
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
    sendBtn.classList.toggle('active', textarea.value.trim().length > 0);
  });

  // Send message
  function sendMessage() {
    const text = textarea.value.trim();
    if (!text) return;

    // Add user message
    messagesInner.insertAdjacentHTML('beforeend', renderUserMsg(text));
    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.classList.remove('active');
    scrollToBottom();
    refreshIcons();

    // Show typing indicator
    setTimeout(() => {
      messagesInner.insertAdjacentHTML('beforeend', renderTyping());
      refreshIcons();
      scrollToBottom();
    }, 300);

    // Simulate AI response
    setTimeout(() => {
      const typing = container.querySelector('#aiTypingMsg');
      if (typing) typing.remove();

      const response = generateResponse(text);
      messagesInner.insertAdjacentHTML('beforeend', renderAssistantMsg(response.html, response.sources));
      refreshIcons();
      scrollToBottom();
    }, 1800 + Math.random() * 1200);
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesScroll.scrollTop = messagesScroll.scrollHeight;
    });
  }

  // Enter to send
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // Toggle history sidebar
  if (historyToggle) {
    historyToggle.addEventListener('click', () => {
      historyPanel.style.display = historyPanel.style.display === 'none' ? '' : 'none';
    });
  }

  // New chat
  function startNewChat() {
    messagesInner.innerHTML = renderWelcome();
    refreshIcons();
    // Wire suggestion clicks
    messagesInner.querySelectorAll('.ai-chat-suggestion').forEach(s => {
      s.addEventListener('click', () => {
        const title = s.dataset.suggestion;
        textarea.value = getSuggestionPrompt(title);
        textarea.dispatchEvent(new Event('input'));
        textarea.focus();
      });
    });
    // Remove active from history
    container.querySelectorAll('.ai-chat-history-item').forEach(i => i.classList.remove('active'));
  }

  if (newChatBtn) newChatBtn.addEventListener('click', startNewChat);
  if (newChatBtn2) newChatBtn2.addEventListener('click', startNewChat);

  // History item clicks
  container.querySelectorAll('.ai-chat-history-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.ai-chat-history-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      if (item.dataset.conv === 'c1') {
        messagesInner.innerHTML = renderMessages();
      } else {
        messagesInner.innerHTML = renderAssistantMsg(
          `<p>This is a previous conversation about "<strong>${item.textContent}</strong>". The full history would be loaded here.</p>`,
          []
        );
      }
      refreshIcons();
      scrollToBottom();
    });
  });

  // Initial scroll
  scrollToBottom();

  function refreshIcons() {
    if (window.lucide) lucide.createIcons({ nameAttr: 'data-lucide' });
  }
}

/* ═══ Response Generator ═══ */

function generateResponse(text) {
  const lower = text.toLowerCase();

  if (lower.includes('medication') || lower.includes('drug') || lower.includes('interaction')) {
    return {
      html: `<p>I've checked the medication database for potential interactions. Based on the current prescription records, here are my findings:</p>
        <ul>
          <li>No <strong>critical interactions</strong> were identified with the current medication regimen.</li>
          <li>Recommend monitoring for <strong>GI sensitivity</strong> if combining NSAIDs with antibiotics.</li>
          <li>Consider scheduling a follow-up renal panel in 2 weeks.</li>
        </ul>
        <p>Would you like me to pull up the specific medication details or check against a different drug?</p>`,
      sources: [
        { icon: 'pill', label: 'Drug interaction DB' },
        { icon: 'file-text', label: 'Patient medications' },
      ]
    };
  }

  if (lower.includes('lab') || lower.includes('blood') || lower.includes('result')) {
    return {
      html: `<p>Here's a summary of the most recent lab results:</p>
        <ul>
          <li><strong>CBC:</strong> All values within normal reference ranges. WBC 8.2 (ref: 5.5–16.9).</li>
          <li><strong>Chemistry panel:</strong> BUN and Creatinine normal. ALT slightly elevated at 125 U/L (ref: 10–120) — recommend monitoring.</li>
          <li><strong>Urinalysis:</strong> Specific gravity 1.035, no abnormalities detected.</li>
        </ul>
        <p>The mild ALT elevation could be related to recent medication. I'd recommend a recheck in 4 weeks.</p>`,
      sources: [
        { icon: 'flask-conical', label: 'Lab results' },
        { icon: 'file-text', label: 'Reference ranges' },
      ]
    };
  }

  if (lower.includes('vaccin') || lower.includes('immuniz')) {
    return {
      html: `<p>Based on current guidelines, here's the recommended vaccination schedule:</p>
        <ul>
          <li><strong>Core vaccines:</strong> DHPP (Distemper, Hepatitis, Parainfluenza, Parvovirus) — due in 3 weeks.</li>
          <li><strong>Rabies:</strong> Current, next booster due 14 Aug 2027.</li>
          <li><strong>Non-core:</strong> Bordetella — recommended if boarding or daycare planned. Leptospirosis — consider based on exposure risk.</li>
        </ul>
        <p>Shall I create a reminder for the upcoming DHPP booster?</p>`,
      sources: [
        { icon: 'syringe', label: 'Immunization record' },
        { icon: 'calendar', label: 'Schedule' },
      ]
    };
  }

  return {
    html: `<p>I can help with that. Let me look into the relevant records and clinical references for you.</p>
      <p>Based on what I've found, here are a few key points to consider:</p>
      <ul>
        <li>The patient's history shows no previous concerns related to this topic.</li>
        <li>Current protocols and guidelines support the standard approach.</li>
        <li>I'd recommend documenting this in the patient's chart for continuity of care.</li>
      </ul>
      <p>Would you like me to go deeper into any specific aspect, or draft a clinical note?</p>`,
    sources: [
      { icon: 'file-text', label: 'Patient record' },
    ]
  };
}

function getSuggestionPrompt(title) {
  const prompts = {
    'Patient summary': 'Can you give me a summary of Bella\'s recent visits and current treatment plan?',
    'Check interactions': 'Check for any drug interactions with the current medications for Bella.',
    'Draft a document': 'Help me draft a discharge note for today\'s visit.',
    'Interpret lab results': 'Can you interpret the latest blood panel results?',
  };
  return prompts[title] || 'Tell me more about ' + title.toLowerCase();
}
