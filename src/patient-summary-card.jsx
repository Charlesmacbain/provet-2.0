/* global React */
const { Icon: IconPSC, Avatar: AvatarPSC, getInitials: giPSC } = window.PROVET_PRIM;

function PSCRow({ label, value, mono }) {
  return (
    <div className="psc__row">
      <span className="psc__row-label">{label}</span>
      <span className={"psc__row-value" + (mono ? " tnum" : "")}>{value}</span>
    </div>
  );
}

function PSCSection({ title, children }) {
  return (
    <div className="psc__section">
      {title && <div className="psc__sec-head">{title}</div>}
      {children}
    </div>
  );
}

function speciesIconName(species) {
  if (!species) return "generic-pet-paw";
  const s = String(species).toLowerCase();
  if (s.startsWith("can")) return "generic-canine";
  if (s.startsWith("fel")) return "generic-feline";
  if (s.startsWith("equ")) return "generic-equidae";
  if (s.startsWith("av") || s === "bird") return "generic-avian";
  return "generic-pet-paw";
}

/* ---------- Per-tab content ---------- */

function PatientTab({ p }) {
  return (
    <PSCSection>
      {p.species   && <PSCRow label="Species"   value={p.species} />}
      {p.weight    && <PSCRow label="Weight"    value={p.weight} />}
      {p.microchip && <PSCRow label="Microchip" value={p.microchip} mono />}
      {p.lastVisit && <PSCRow label="Last visit" value={p.lastVisit} />}
      {p.nextAppt  && <PSCRow label="Next appt"  value={p.nextAppt} />}
      {p.sex       && <PSCRow label="Sex"        value={p.sex} />}
      {p.age       && <PSCRow label="Age"        value={p.age} />}
      {p.breed     && <PSCRow label="Breed"      value={p.breed} />}
    </PSCSection>
  );
}

function ClientTab({ c }) {
  if (!c || !c.name) {
    return (
      <PSCSection>
        <div className="psc__empty">No client linked.</div>
      </PSCSection>
    );
  }
  return (
    <>
      <PSCSection>
        <div className="psc__client">
          <AvatarPSC initials={giPSC(c.name)} color="info" size="s" />
          <div style={{ minWidth: 0 }}>
            <div className="psc__clientname">{c.name}</div>
            {c.since && <div className="psc__clientmeta">Client since {c.since}</div>}
          </div>
        </div>
        <div className="psc__cta-row">
          <button className="n-button n-button--s"><IconPSC name="interface-phone" size={12} /> Call</button>
          <button className="n-button n-button--s"><IconPSC name="interface-message" size={12} /> SMS</button>
          <button className="n-button n-button--s" title="Email" aria-label="Email"><IconPSC name="interface-email" size={12} /></button>
        </div>
        <div className="psc__rows">
          {c.phone   && <PSCRow label="Phone"   value={c.phone} mono />}
          {c.email   && <PSCRow label="Email"   value={c.email} />}
          {c.balance && <PSCRow label="Balance" value={c.balance} mono />}
        </div>
      </PSCSection>
    </>
  );
}

const PATIENT_HISTORY = [
  { date: "Apr 22 2026", title: "Bloodwork — CBC, Chem-17", sub: "Dr. Lindqvist · All values within reference. ALT slightly elevated — recheck in 6 mo.", tone: "amber" },
  { date: "Mar 14 2026", title: "Annual wellness exam",     sub: "Dr. Lindqvist · Healthy. Weight up 0.4 kg. Recommend dental in Q3.", tone: "green" },
  { date: "Feb 02 2026", title: "Booster — DHPP",           sub: "Dr. Patel · DHPP administered. No reaction during 15-min hold.", tone: "blue" },
  { date: "Dec 11 2025", title: "Skin irritation — left flank", sub: "Dr. Lindqvist · Localised dermatitis. Apoquel 16 mg × 14 d prescribed.", tone: "red" },
  { date: "Nov 03 2025", title: "Dental cleaning + X-rays", sub: "Dr. Patel · Grade 2 tartar removed. No extractions needed.", tone: "blue" },
  { date: "Aug 19 2025", title: "Estimate emailed",         sub: "Surgical neuter — £284.50 · Approved Aug 24.", tone: "neutral" },
  { date: "Jun 04 2025", title: "Microchip implanted",      sub: "Dr. Patel · 956 000 010 234 567 — registered with Petlog.", tone: "neutral" },
  { date: "Mar 28 2025", title: "Annual wellness exam",     sub: "Dr. Lindqvist · Within normal limits.", tone: "green" },
];

function HistoryTab({ p }) {
  return (
    <PSCSection>
      <div className="psc__hist">
        {PATIENT_HISTORY.map((e, i) => (
          <div key={i} className={"psc__hist-row psc__hist-row--" + e.tone}>
            <div className="psc__hist-date">{e.date}</div>
            <div className="psc__hist-body">
              <div className="psc__hist-title">{e.title}</div>
              <div className="psc__hist-sub">{e.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </PSCSection>
  );
}

function ChatTab({ chatProps }) {
  // Render the AskAI ChatPanel inline. It supplies its own header + composer.
  if (!window.AskAIChatPanel) return <PSCSection><div className="psc__empty">Chat unavailable.</div></PSCSection>;
  const Panel = window.AskAIChatPanel;
  return (
    <div className="psc__chat-wrap">
      <Panel
        mode={chatProps?.mode || "sidebar"}
        setMode={chatProps?.setMode || (() => {})}
        onMinimize={chatProps?.onMinimize || (() => {})}
        onClose={chatProps?.onClose || (() => {})}
      />
    </div>
  );
}

/* ---------- Main card ---------- */

const TABS = [
  { id: "patient", label: "Patient",  icon: "generic-pet-paw" },
  { id: "client",  label: "Client",   icon: "interface-user" },
  { id: "chat",    label: "Chat",     icon: "interface-message" },
  { id: "history", label: "History",  icon: "interface-history" },
];

/**
 * PatientSummaryCard — single right-rail card with tabbed sections.
 *
 * Props:
 *   patient: { name, species, breed, sex, age, weight, microchip, lastVisit, nextAppt }
 *   client:  { name, since, phone, email, balance }
 *   chatProps?: props forwarded to the embedded chat panel (mode/setMode/onClose)
 *   defaultTab?: initial tab id
 *   onClose?: hide the whole card
 *   onOpen?:  open patient page (header link)
 */
function PatientSummaryCard({ patient, client, chatProps, defaultTab = "patient", onOpen, onClose }) {
  const p = patient || {};
  const c = client || {};
  const [tab, setTab] = React.useState(defaultTab);
  const isChat = tab === "chat";

  return (
    <aside className={"aside aside--patient psc psc--tabbed" + (isChat ? " psc--chat" : "")}>
      {/* Pet header (always visible) */}
      <div className="psc__petcard">
        <div className="psc__petavatar">
          <IconPSC name={speciesIconName(p.species)} size={20} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="psc__petname">{p.name || c.name || "—"}</div>
          <div className="psc__petsub">
            {p.name
              ? [p.breed, p.sex, p.age].filter(Boolean).join(" · ")
              : (c.since ? "Client since " + c.since : "")}
          </div>
        </div>
        {onOpen && (
          <button className="psc__iconbtn" title="Open patient" onClick={onOpen}>
            <IconPSC name="interface-new-window-small" size={13} />
          </button>
        )}
        {onClose && (
          <button className="psc__iconbtn" title="Hide panel" onClick={onClose} aria-label="Hide panel">
            <IconPSC name="interface-close-small" size={13} />
          </button>
        )}
      </div>

      {/* Tab strip */}
      <div className="psc__tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={"psc__tab" + (tab === t.id ? " psc__tab--active" : "")}
            onClick={() => setTab(t.id)}
            title={t.label}
          >
            <IconPSC name={t.icon} size={12} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={"psc__panel" + (isChat ? " psc__panel--chat" : "")}>
        {tab === "patient" && <PatientTab p={p} />}
        {tab === "client"  && <ClientTab c={c} />}
        {tab === "chat"    && <ChatTab chatProps={chatProps} />}
        {tab === "history" && <HistoryTab p={p} />}
      </div>
    </aside>
  );
}

window.PatientSummaryCard = PatientSummaryCard;
