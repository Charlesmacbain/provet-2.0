/* global React */
const { Icon: IconAside } = window.PROVET_PRIM;

const HISTORY = [
  { group: "Today", items: [
    { id: "h1", title: "Bella bloodwork summary", time: "just now" },
    { id: "h2", title: "Draft discharge note — Pixel", time: "just now" },
  ]},
  { group: "Last week", items: [
    { id: "h3", title: "Count overdue follow-ups", time: "3d" },
    { id: "h4", title: "Add CHA todo for document", time: "6d" },
    { id: "h5", title: "Add CHA todo for document", time: "6d" },
  ]},
  { group: "2 weeks ago", items: [
    { id: "h6", title: "Prescribe Excel", time: "1w" },
    { id: "h7", title: "Inquire team name", time: "2w" },
    { id: "h8", title: "Find patient history PDF issue", time: "2w" },
  ]},
  { group: "3 weeks ago", items: [
    { id: "h9", title: "Add todo to answer Niclas email", time: "16d" },
    { id: "h10", title: "Summarize weekly Linear team updates", time: "16d" },
    { id: "h11", title: "Add Joana team US trip tasks", unread: true, time: "17d" },
    { id: "h12", title: "Check patient history summary PDF status", time: "17d" },
    { id: "h13", title: "Assign Charles team issues to me", time: "17d" },
  ]},
  { group: "Older", items: [
    { id: "h14", title: "Identify Amy's current work", time: "16d" },
    { id: "h15", title: "Identify stale assigned issues", time: "24d" },
    { id: "h16", title: "List vet teams", time: "27d" },
    { id: "h17", title: "Add health checkup todo", unread: true, time: "29d" },
    { id: "h18", title: "Inquire about memory capabilities", time: "29d" },
    { id: "h19", title: "Identify ChatRT", unread: true, time: "29d" },
    { id: "h20", title: "Suggest cleanup for vet excom team", time: "29d" },
    { id: "h21", title: "Provide search project update", time: "4w" },
    { id: "h22", title: "Create Vet Product Excom item", time: "4w" },
    { id: "h23", title: "Add confirm leadership salary to-do", time: "4w" },
    { id: "h24", title: "Create tasks in Linear vet-excom", time: "4w" },
    { id: "h25", title: "Draft project update", time: "4w" },
  ]},
];

const AIStar = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z"/>
  </svg>
);

const SidebarIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="3" width="12" height="10" rx="1.75" />
    <line x1="10.25" y1="3.25" x2="10.25" y2="12.75" />
  </svg>
);

function HistoryList({ onPick, onClose, className }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.closest(".ai-chat__history-trigger") && !e.target.closest(".ai-pill")) onClose();
    };
    setTimeout(() => document.addEventListener("mousedown", close), 0);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);
  return (
    <div className={"ai-history " + (className || "")} ref={ref}>
      <div className="ai-history__title">Chat history</div>
      <div className="ai-history__scroll">
        {HISTORY.map(g => (
          <div key={g.group} className="ai-history__group">
            <div className="ai-history__group-label">{g.group}</div>
            {g.items.map(it => (
              <button key={it.id} className="ai-history__item" onClick={() => onPick(it)}>
                {it.unread && <span className="ai-history__dot" />}
                <span className="ai-history__item-title">{it.title}</span>
                <span className="ai-history__item-time">{it.time}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ModeMenu({ mode, setMode, onClose }) {
  React.useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".ai-mode-menu") && !e.target.closest(".ai-mode-trigger")) onClose();
    };
    setTimeout(() => document.addEventListener("click", close), 0);
    return () => document.removeEventListener("click", close);
  }, [onClose]);
  const opts = [
    { id: "sidebar",    label: "Sidebar",     icon: "interface-grid" },
    { id: "floating",   label: "Floating",    icon: "interface-tag" },
    { id: "fullscreen", label: "Full screen", icon: "interface-new-window-small" },
  ];
  return (
    <div className="ai-mode-menu">
      {opts.map(o => (
        <button key={o.id} className="ai-mode-menu__item" onClick={() => { setMode(o.id); onClose(); }}>
          <IconAside name={o.icon} size={13} />
          <span>{o.label}</span>
          {mode === o.id && <IconAside name="interface-checked-small" size={12} style={{ marginInlineStart: "auto" }} />}
        </button>
      ))}
    </div>
  );
}

function ChatPanelHeader({ fullscreen, onClose, onModeMenu, menuOpen, mode, setMode, onPickHistory }) {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  return (
    <div className={"ai-chat__header" + (fullscreen ? " ai-chat__header--fs" : "")}>
      <span className="ai-chat__beta">Beta</span>
      <span className="ai-chat__title">New chat</span>
      <span style={{ flex: 1 }} />
      <div style={{ position: "relative" }}>
        <button className="icon-btn ai-mode-trigger" title="Display options" onClick={onModeMenu}>
          <SidebarIcon size={18} />
        </button>
        {menuOpen && <ModeMenu mode={mode} setMode={setMode} onClose={onModeMenu} />}
      </div>
      <div style={{ position: "relative" }}>
        <button className="icon-btn ai-chat__history-trigger" title="Chat history"
          onClick={() => setHistoryOpen(o => !o)}>
          <IconAside name="interface-history" size={14} />
        </button>
        {historyOpen && (
          <HistoryList className="ai-history--dropdown"
            onPick={(it) => { setHistoryOpen(false); onPickHistory && onPickHistory(it); }}
            onClose={() => setHistoryOpen(false)} />
        )}
      </div>
      <button className="icon-btn" title="Close" onClick={onClose}>
        <IconAside name="interface-close-small" size={14} />
      </button>
    </div>
  );
}

function ChatComposer({ input, setInput, send, busy }) {
  return (
    <form className="ai-chat__composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <textarea
        className="ai-chat__input"
        placeholder="Ask Provet..."
        value={input}
        rows={1}
        autoFocus
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
      />
      <div className="ai-chat__bar">
        <button type="button" className="ai-chat__skills">
          <IconAside name="interface-grid" size={11} />
          <span>Skills</span>
          <IconAside name="interface-dropdown-small" size={9} />
        </button>
        <span style={{ flex: 1 }} />
        <button type="button" className="icon-btn" title="Voice"><IconAside name="interface-microphone" size={13} /></button>
        <button type="button" className="icon-btn" title="Attach"><IconAside name="interface-attachment" size={13} /></button>
        <button type="submit" className="icon-btn ai-chat__send" title="Send" disabled={!input.trim() || busy}>
          <IconAside name="arrow-up-small" size={13} />
        </button>
      </div>
    </form>
  );
}

function ChatBody({ messages, busy, scrollerRef }) {
  if (messages.length === 0 && !busy) {
    return <div className="ai-chat__body ai-chat__body--empty" />;
  }
  return (
    <div className="ai-chat__body" ref={scrollerRef}>
      {messages.map((m, i) => (
        <div key={i} className={"ai__msg ai__msg--" + m.role}>
          {m.role === "ai" && <div className="ai__avatar ai__avatar--sm"><AIStar size={11} /></div>}
          <div className="ai__bubble">{m.text}</div>
        </div>
      ))}
      {busy && (
        <div className="ai__msg ai__msg--ai">
          <div className="ai__avatar ai__avatar--sm"><AIStar size={11} /></div>
          <div className="ai__bubble ai__bubble--typing"><span></span><span></span><span></span></div>
        </div>
      )}
    </div>
  );
}

function ChatPanel({ mode, setMode, onClose, fullscreen }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const scrollerRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, busy]);

  const send = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const reply = await window.claude.complete(
        "You are Provet AI, an assistant inside a veterinary practice management app. " +
        "Reply concisely (max 4 short sentences) in a calm, clinical tone. Question: " + q
      );
      setMessages(m => [...m, { role: "ai", text: reply }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Sorry — I couldn't reach the assistant." }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={"ai-chat" + (fullscreen ? " ai-chat--fs" : "")}>
      <ChatPanelHeader
        fullscreen={fullscreen}
        onClose={onClose}
        onModeMenu={() => setMenuOpen(o => !o)}
        menuOpen={menuOpen}
        mode={mode}
        setMode={setMode}
        onPickHistory={(it) => {
          setMessages([{ role: "user", text: it.title }, { role: "ai", text: "Loaded conversation: " + it.title + "." }]);
        }}
      />
      <ChatBody messages={messages} busy={busy} scrollerRef={scrollerRef} />
      <ChatComposer input={input} setInput={setInput} send={send} busy={busy} />
    </div>
  );
}

function AskPill({ onClick }) {
  return (
    <div className="ai-pill-wrap">
      <button className="ai-pill" onClick={onClick}>
        <span className="ai-pill__icon"><AIStar size={10} /></span>
        <span>Ask Provet</span>
      </button>
    </div>
  );
}

function AskAI({ mode = "closed", setMode, onClose }) {
  const [showChat, setShowChat] = React.useState(false);

  React.useEffect(() => {
    if (mode === "floating") setShowChat(false);
  }, [mode]);

  if (mode === "closed" || (mode === "floating" && !showChat)) {
    return <AskPill onClick={() => { setMode("floating"); setShowChat(true); }} />;
  }

  if (mode === "floating") {
    return (
      <>
        <AskPill onClick={() => setShowChat(false)} />
        <div className="ai-floating">
          <ChatPanel mode={mode} setMode={setMode}
            onClose={() => { setShowChat(false); onClose && onClose(); }} />
        </div>
      </>
    );
  }

  if (mode === "fullscreen") {
    return (
      <div className="ai-fullscreen">
        <ChatPanel mode={mode} setMode={setMode}
          onClose={onClose} fullscreen />
      </div>
    );
  }

  return (
    <aside className="aside aside--ai">
      <ChatPanel mode={mode} setMode={setMode}
        onClose={onClose} />
    </aside>
  );
}

window.AskAI = AskAI;
window.AskAIChatPanel = ChatPanel;
