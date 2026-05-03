/* global React, PROVET_PRIM */
const { Icon: IconC, Avatar: AvatarC, getInitials: giC } = window.PROVET_PRIM;

// === Inbox-style threads (mirrors Linear "Inbox") ===========================

const CONV_THREADS = [
  {
    id: "t1", code: "VETEX2-546",
    title: "Greencross update",
    by: "danny",
    byColor: "highlight",
    preview: "danny commented: @scott.good…",
    time: "2h",
    unread: false,
    icon: "interface-chat",
    meta: {
      status: "To Discuss",
      priority: "—",
      assignee: { name: "scott.goodsir-smyth", color: "info" },
      project: "Project",
      labels: "Labels",
    },
    description: "",
    activity: [
      { kind: "system", who: "charles.macbain", action: "created the issue", time: "3h ago", color: "warning" },
      {
        kind: "comment",
        who: "danny",
        color: "highlight",
        time: "2h ago",
        body: "@scott.goodsir-smyth I'm getting questions from our onboarding teams as to when we should begin hiring resources in-country. If you could advise async, that would be very helpful.",
      },
    ],
    client: {"name":"Sarah Andersen","phone":"+44 7700 900 305","email":"sarah.andersen@gmail.com","since":"Jan 2022","balance":"£0.00"},
    pet: {"name":"Bella","species":"Canine","breed":"Labrador Retriever","sex":"F (sp.)","age":"6 yr","weight":"28.4 kg","microchip":"956 000 010 234 567","lastVisit":"3 days ago","nextAppt":"Apr 30 · 10:30"},
    subscribed: true,
  },
  {
    id: "t2", code: "VETEX2-512",
    title: "Users days 2026",
    by: "rebecca.s",
    byColor: "success",
    preview: "New project update by rebecca.s…",
    time: "3h",
    unread: false,
    icon: "interface-calendar",
    meta: { status: "Triage", priority: "Medium", assignee: { name: "rebecca.s", color: "success" }, project: "Events", labels: "ux-research" },
    description: "Plan the agenda for Users Days 2026. Sessions for both clinical and admin tracks.",
    activity: [
      { kind: "system", who: "rebecca.s", action: "created the project update", time: "3h ago", color: "success" },
      { kind: "comment", who: "rebecca.s", color: "success", time: "3h ago", body: "Posted a draft of the agenda — would love feedback on the clinical track." },
    ],
    client: {"name":"Maria Schmidt","phone":"+44 7700 900 922","email":"maria.s@me.com","since":"Mar 2024","balance":"£82.50"},
    pet: {"name":"Pixel","species":"Feline","breed":"Domestic Shorthair","sex":"M (n.)","age":"3 yr","weight":"4.2 kg","microchip":"956 000 010 998 112","lastVisit":"Yesterday","nextAppt":"Tomorrow · 10:30"},
  },
  {
    id: "t3", code: "VETEX2-498",
    title: "Vetera rebranding v2: further design exploration",
    by: "dawid.nitka",
    byColor: "info",
    preview: "New project update by dawid.nitka…",
    time: "3d",
    unread: false,
    badge: "design",
    icon: "interface-edit",
    meta: { status: "In Progress", priority: "High", assignee: { name: "dawid.nitka", color: "info" }, project: "Brand", labels: "design, brand" },
    description: "Second pass on the Vetera rebrand. Exploring quieter palettes and a more clinical type system.",
    activity: [
      { kind: "system", who: "dawid.nitka", action: "shared design exploration", time: "3d ago", color: "info" },
    ],
    client: {"name":"Eeva Setälä","phone":"+44 7700 900 110","email":"eeva.setala@hotmail.com","since":"Jun 2019","balance":"£0.00"},
    pet: {"name":"Bella","species":"Canine","breed":"Border Collie","sex":"F","age":"9 yr","weight":"19.1 kg","microchip":"956 000 010 555 902","lastVisit":"Apr 22","nextAppt":"—"},
  },
  {
    id: "t4", code: "VETEX2-455",
    title: "Reduce time to go live from 19 weeks to 12",
    by: "janne",
    byColor: "warning",
    preview: "New initiative update by janne…",
    time: "3d",
    unread: false,
    icon: "interface-time",
    meta: { status: "Initiative", priority: "High", assignee: { name: "janne", color: "warning" }, project: "Onboarding", labels: "ops" },
    description: "Reduce average customer onboarding from 19 weeks to 12 by Q3.",
    activity: [
      { kind: "system", who: "janne", action: "updated the initiative", time: "3d ago", color: "warning" },
    ],
    client: {"name":"Tom Romano","phone":"+44 7700 900 077","email":"tom.romano@stables.co.uk","since":"Sep 2020","balance":"£284.50"},
    pet: {"name":"Pepper","species":"Equine","breed":"Warmblood","sex":"M (g.)","age":"12 yr","weight":"525 kg","microchip":"—","lastVisit":"Apr 18","nextAppt":"May 4 · 09:00"},
  },
  {
    id: "t5", code: "VETEX2-440",
    title: "Repeatable Data Migrations",
    by: "janne",
    byColor: "warning",
    preview: "New project update by janne",
    time: "3d",
    unread: false,
    icon: "interface-share",
    meta: { status: "In Progress", priority: "Medium", assignee: { name: "janne", color: "warning" }, project: "Migrations", labels: "infra" },
    description: "Standardise the legacy → Provet migration pipeline for new clinics.",
    activity: [
      { kind: "system", who: "janne", action: "posted an update", time: "3d ago", color: "warning" },
    ],
    client: {"name":"Adam Park","phone":"+44 7700 900 188","email":"adam.park@gmail.com","since":"Feb 2023","balance":"£0.00"},
    pet: {"name":"Charlie","species":"Canine","breed":"Cocker Spaniel","sex":"M (n.)","age":"5 yr","weight":"12.7 kg","microchip":"956 000 010 411 008","lastVisit":"2 weeks ago","nextAppt":"—"},
  },
  {
    id: "t6", code: "VETEX2-431",
    title: "Create enterprise customer contract template",
    by: "matti.junkkarinen",
    byColor: "danger",
    preview: "matti.junkkarinen replied: I think…",
    time: "3d",
    unread: false,
    icon: "interface-edit",
    meta: { status: "In Review", priority: "Medium", assignee: { name: "matti.junkkarinen", color: "danger" }, project: "Legal", labels: "contracts" },
    description: "Draft a template for multi-site contracts.",
    activity: [
      { kind: "comment", who: "matti.junkkarinen", color: "danger", time: "3d ago", body: "I think we should split it into a base MSA and a per-site SOW." },
    ],
    client: {"name":"Linda Olsen","phone":"+44 7700 900 412","email":"linda@olsen.dk","since":"Nov 2021","balance":"£0.00"},
    pet: {"name":"Milo","species":"Canine","breed":"Beagle","sex":"M","age":"2 yr","weight":"11.0 kg","microchip":"956 000 010 712 446","lastVisit":"Apr 14","nextAppt":"—"},
  },
  {
    id: "t7", code: "VETEX2-417",
    title: "AI Upsell - Unavets",
    by: "carlos.archanco",
    byColor: "info",
    preview: "carlos.archanco replied: Here it i…",
    time: "4d",
    unread: false,
    icon: "interface-chat",
    meta: { status: "To Discuss", priority: "Low", assignee: { name: "carlos.archanco", color: "info" }, project: "Sales", labels: "ai" },
    description: "Pitch deck for the Unavets AI upsell.",
    activity: [
      { kind: "comment", who: "carlos.archanco", color: "info", time: "4d ago", body: "Here it is — let me know if the framing lands." },
    ],
    client: {"name":"Ola Kowalski","phone":"+44 7700 900 711","email":"ola.k@proton.me","since":"Aug 2023","balance":"£0.00"},
    pet: {"name":"Luna","species":"Canine","breed":"Whippet","sex":"F (sp.)","age":"4 yr","weight":"12.0 kg","microchip":"956 000 010 222 117","lastVisit":"5 days ago","nextAppt":"—"},
  },
  {
    id: "t8", code: "VETEX2-401",
    title: "Nets audit",
    by: "matti.junkkarinen",
    byColor: "danger",
    preview: "matti.junkkarinen commented: N…",
    time: "5d",
    unread: false,
    icon: "interface-checked",
    meta: { status: "In Progress", priority: "Medium", assignee: { name: "matti.junkkarinen", color: "danger" }, project: "Compliance", labels: "audit" },
    description: "Review and remediate findings from the Nets audit.",
    activity: [
      { kind: "comment", who: "matti.junkkarinen", color: "danger", time: "5d ago", body: "Need to circle back on action item 3 — owner unclear." },
    ],
    client: {"name":"Andrea Pianetti","phone":"+44 7700 900 011","email":"a.pianetti@gmail.com","since":"Apr 2018","balance":"£0.00"},
    pet: {"name":"Pepper","species":"Equine","breed":"Thoroughbred","sex":"F","age":"8 yr","weight":"470 kg","microchip":"—","lastVisit":"Apr 10","nextAppt":"—"},
  },
];

// === Inbox row ==============================================================

function ConvIconChip({ name, color = "var(--linear-faint)" }) {
  return (
    <span style={{
      width: 14, height: 14, flex: "none",
      display: "inline-grid", placeItems: "center",
      color,
    }}>
      <IconC name={name} size={11} />
    </span>
  );
}

function ConvInboxRow({ t, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="conv-row"
      data-active={active ? "true" : "false"}
    >
      <AvatarC initials={giC(t.by)} color={t.byColor} size="s" />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{
          fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {t.title}
        </div>
        <div style={{
          fontSize: 'var(--n-font-size-body)', color: "var(--linear-faint)",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {t.preview}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flex: "none" }}>
        <ConvIconChip name={t.icon} />
        <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--linear-faint)", fontFeatureSettings: "'tnum' 1" }}>{t.time}</span>
      </div>
    </button>
  );
}

// === Detail pane ============================================================

function ConvDetailHeader({ t }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 16px",
      borderBottom: "1px solid var(--n-color-border)",
      background: "var(--n-color-surface)",
      minHeight: 44,
    }}>
      <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--linear-faint)", fontFeatureSettings: "'tnum' 1" }}>{t.code}</span>
      <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text)", fontWeight: 500 }}>{t.title}</span>
      <button className="conv-iconbtn" title="Star"><IconC name="interface-star" size={13} /></button>
      <span style={{ flex: 1 }} />
      <button className="conv-iconbtn" title="More"><IconC name="interface-menu-small" size={13} /></button>
    </div>
  );
}

function ConvPill({ icon, label, dot }) {
  return (
    <button className="conv-pill">
      {dot && <span className="conv-pill__dot" style={{ background: dot }} />}
      {!dot && icon && <IconC name={icon} size={12} />}
      <span>{label}</span>
    </button>
  );
}

function ConvAssigneePill({ a }) {
  return (
    <button className="conv-pill">
      <AvatarC initials={giC(a.name)} color={a.color} size="xs" />
      <span>{a.name}</span>
    </button>
  );
}

function ConvStatusBar({ t }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 16px",
      borderBottom: "1px solid var(--n-color-border)",
      background: "var(--n-color-surface)",
      flexWrap: "wrap",
    }}>
      <ConvPill icon="interface-chat" label={t.meta.status} />
      <ConvPill icon="interface-menu-small" label={"Priority"} />
      <ConvAssigneePill a={t.meta.assignee} />
      <ConvPill icon="interface-folder" label={t.meta.project} />
      <ConvPill icon="interface-tag" label={t.meta.labels} />
      <span style={{ flex: 1 }} />
      <button className="conv-iconbtn" title="Link"><IconC name="interface-link" size={13} /></button>
      <button className="conv-iconbtn" title="Copy"><IconC name="interface-copy" size={13} /></button>
      <button className="conv-iconbtn" title="Branch"><IconC name="interface-share" size={13} /></button>
      <button className="conv-iconbtn" title="Subscribe"><IconC name="interface-bookmark" size={13} /></button>
      <button className="conv-iconbtn" title="More"><IconC name="interface-dropdown-small" size={11} /></button>
    </div>
  );
}

function ConvActivityItem({ ev }) {
  if (ev.kind === "system") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--linear-faint)", fontSize: 'var(--n-font-size-body)' }}>
        <AvatarC initials={giC(ev.who)} color={ev.color} size="xs" />
        <span><span style={{ color: "var(--n-color-text)" }}>{ev.who}</span> {ev.action}</span>
        <span style={{ color: "var(--linear-faint)" }}>· {ev.time}</span>
      </div>
    );
  }
  // comment
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <AvatarC initials={giC(ev.who)} color={ev.color} size="s" />
        <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>{ev.who}</span>
        <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--linear-faint)" }}>{ev.time}</span>
      </div>
      <div style={{
        fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text)", lineHeight: 1.55,
        paddingLeft: 28,
      }}>
        {ev.body.split(/(@[a-z0-9.\-_]+)/i).map((part, i) =>
          part.match(/^@/)
            ? <span key={i} style={{ color: "#5e6ad2", fontWeight: 500 }}>{part}</span>
            : <span key={i}>{part}</span>
        )}
      </div>
    </div>
  );
}

function ConvComposer({ placeholder, avatar }) {
  return (
    <div className="conv-composer">
      {avatar && <AvatarC initials={avatar.initials} color={avatar.color} size="s" />}
      <div className="conv-composer__field">
        <input placeholder={placeholder} />
        <button className="conv-iconbtn" title="Attach"><IconC name="interface-attachment" size={13} /></button>
        <button className="conv-iconbtn" title="Send"><IconC name="arrow-up-small" size={13} /></button>
      </div>
    </div>
  );
}

function ConvDetailBody({ t }) {
  return (
    <div className="conv-detail__scroll">
      <div className="conv-detail__inner">
        <h2 className="conv-detail__title">{t.title}</h2>
        <button className="conv-detail__addDesc">
          {t.description ? <span style={{ color: "var(--n-color-text)" }}>{t.description}</span> : <span>Add description…</span>}
        </button>

        <div style={{ display: "flex", gap: 10, marginTop: 14, color: "var(--linear-faint)" }}>
          <button className="conv-iconbtn" title="Mention"><IconC name="interface-chat" size={13} /></button>
          <button className="conv-iconbtn" title="Attach"><IconC name="interface-attachment" size={13} /></button>
        </div>

        <button className="conv-detail__subissues">+ Add sub-issues</button>

        {/* Activity */}
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>Activity</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--linear-faint)", fontSize: 'var(--n-font-size-body)' }}>
            <button className="conv-textbtn">Unsubscribe</button>
            <span className="conv-stack">
              <span className="conv-stack__dot" style={{ background: "#7c5cff" }}>C</span>
              <span className="conv-stack__dot" style={{ background: "#3aa17e" }}>S</span>
              <span className="conv-stack__dot" style={{ background: "#d3a64a" }}>M</span>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 12 }}>
          {t.activity.map((ev, i) => <ConvActivityItem key={i} ev={ev} />)}
        </div>

        {/* Reply (inline within last comment area) */}
        <div style={{ marginTop: 14, paddingLeft: 0 }}>
          <ConvComposer placeholder="Leave a reply…" avatar={{ initials: "CM", color: "danger" }} />
        </div>

        {/* Top-level comment */}
        <div style={{ marginTop: 12 }}>
          <ConvComposer placeholder="Leave a comment…" />
        </div>
      </div>
    </div>
  );
}

// === Right sidebar: client + pet =====================================

function ConvSideSection({ title, action, children }) {
  return (
    <div className="conv-side__section">
      <div className="conv-side__sec-head">
        <span>{title}</span>
        {action}
      </div>
      <div className="conv-side__sec-body">{children}</div>
    </div>
  );
}

function ConvSideRow({ label, value, mono }) {
  return (
    <div className="conv-side__row">
      <span className="conv-side__row-label">{label}</span>
      <span className="conv-side__row-value" style={mono ? { fontFeatureSettings: "'tnum' 1" } : undefined}>{value}</span>
    </div>
  );
}

function ConvClientSidebar({ t }) {
  const c = t.client; const p = t.pet;
  const [petCardOpen, setPetCardOpen] = React.useState(true);
  // Reset visibility when switching to a different conversation/pet.
  React.useEffect(() => { setPetCardOpen(true); }, [t && t.id, p && p.name]);
  if (!c) return null;
  return (
    <aside className="conv-side">
      {/* Pet header card */}
      {p && petCardOpen && (
        <div className="conv-side__petcard">
          <div className="conv-side__petavatar">
            <IconC name={
              p.species === "Canine" ? "generic-canine" :
              p.species === "Feline" ? "generic-feline" :
              p.species === "Equine" ? "generic-equidae" : "generic-pet-paw"
            } size={20} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="conv-side__petname">{p.name}</div>
            <div className="conv-side__petsub">{p.breed} · {p.sex} · {p.age}</div>
          </div>
          <button className="conv-iconbtn" title="Open patient"><IconC name="interface-new-window-small" size={13} /></button>
          <button className="conv-iconbtn" title="Close" aria-label="Close" onClick={() => setPetCardOpen(false)}>
            <IconC name="interface-close-small" size={13} />
          </button>
        </div>
      )}

      {p && (
        <ConvSideSection title="Patient">
          <ConvSideRow label="Species" value={p.species} />
          <ConvSideRow label="Weight" value={p.weight} />
          <ConvSideRow label="Microchip" value={p.microchip} mono />
          <ConvSideRow label="Last visit" value={p.lastVisit} />
          <ConvSideRow label="Next appt" value={p.nextAppt} />
        </ConvSideSection>
      )}

      <ConvSideSection title="Client">
        <div className="conv-side__client">
          <AvatarC initials={giC(c.name)} color="info" size="s" />
          <div style={{ minWidth: 0 }}>
            <div className="conv-side__clientname">{c.name}</div>
            <div className="conv-side__clientmeta">Client since {c.since}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button className="n-button"><IconC name="interface-phone" size={12} /> Call</button>
          <button className="n-button"><IconC name="interface-message" size={12} /> SMS</button>
          <button className="n-button"><IconC name="interface-email" size={12} /></button>
        </div>
        <div style={{ marginTop: 10 }}>
          <ConvSideRow label="Phone" value={c.phone} mono />
          <ConvSideRow label="Email" value={c.email} />
          <ConvSideRow label="Balance" value={c.balance} mono />
        </div>
      </ConvSideSection>

      <ConvSideSection title="Recent activity">
        <div className="conv-side__act">
          <IconC name="interface-calendar" size={11} style={{ color: "var(--linear-faint)" }} />
          <div>
            <div className="conv-side__act-title">Booked appointment</div>
            <div className="conv-side__act-sub">Apr 22 · Bloodwork</div>
          </div>
        </div>
        <div className="conv-side__act">
          <IconC name="medical-prescription" size={11} style={{ color: "var(--linear-faint)" }} />
          <div>
            <div className="conv-side__act-title">Apoquel 16mg refilled</div>
            <div className="conv-side__act-sub">Apr 18 · 30 tabs</div>
          </div>
        </div>
        <div className="conv-side__act">
          <IconC name="interface-email" size={11} style={{ color: "var(--linear-faint)" }} />
          <div>
            <div className="conv-side__act-title">Estimate emailed</div>
            <div className="conv-side__act-sub">Apr 14 · £284.50</div>
          </div>
        </div>
      </ConvSideSection>
    </aside>
  );
}

// === Page ===================================================================

function ConversationsPage() {
  const [activeId, setActiveId] = React.useState("t1");
  const active = CONV_THREADS.find(t => t.id === activeId) || CONV_THREADS[0];
  const { useDragResize: useDragResizeC, ResizeHandle: ResizeHandleC } = window.PROVET_PRIM;
  const [listW, onListResize] = useDragResizeC({ initial: 320, min: 220, max: 520, side: "right", storageKey: "provet.convList.width" });
  const [sideW, onSideResize] = useDragResizeC({ initial: 280, min: 220, max: 520, side: "left", storageKey: "provet.convSide.width" });

  return (
    <div className="linear-page conv-page" style={{ display: "flex", flexDirection: "row", gap: 8, padding: "8px 8px 8px 0", height: "100%", minHeight: 0 }}>
      {/* List + detail as one card */}
      <div style={{
        flex: 1, minWidth: 0,
        display: "grid", gridTemplateColumns: `${listW}px 1fr`,
        background: "var(--n-color-surface)",
        border: "1px solid var(--n-color-border)",
        borderRadius: 8, overflow: "hidden",
        position: "relative",
      }}>
        {/* List pane */}
        <div className="conv-list" style={{ position: "relative" }}>
          <ResizeHandleC side="right" onMouseDown={onListResize} style={{ right: -3, zIndex: 5 }} />
          <div className="conv-list__header">
            <span className="conv-list__title">Conversations</span>
            <button className="conv-iconbtn" title="More"><IconC name="interface-menu-small" size={13} /></button>
            <span style={{ flex: 1 }} />
            <button className="conv-iconbtn" title="Filter"><IconC name="interface-filter" size={13} /></button>
            <button className="conv-iconbtn" title="Sort"><IconC name="interface-setting-slider" size={13} /></button>
          </div>
          <div className="conv-list__scroll">
            {CONV_THREADS.map(t => (
              <ConvInboxRow key={t.id} t={t} active={t.id === activeId} onClick={() => setActiveId(t.id)} />
            ))}
          </div>
        </div>

        {/* Detail pane */}
        <div style={{ minWidth: 0, background: "var(--n-color-surface)", display: "flex", flexDirection: "column", borderLeft: "1px solid var(--n-color-border)" }}>
          <ConvDetailHeader t={active} />
          <ConvStatusBar t={active} />
          <ConvDetailBody t={active} />
        </div>
      </div>

      {/* Right sidebar: client + pet info as its own card */}
      <div style={{ width: sideW, flexShrink: 0, position: "relative", display: "flex" }}>
        <ResizeHandleC side="left" onMouseDown={onSideResize} />
        <ConvClientSidebar t={active} />
      </div>
    </div>
  );
}

window.ConversationsPage = ConversationsPage;
