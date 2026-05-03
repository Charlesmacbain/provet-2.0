/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconCl, Avatar: AvatarCl, Badge: BadgeCl, speciesIcon: spCl, useDragResize: useDragResizeCl, ResizeHandle: ResizeHandleCl } = window.PROVET_PRIM;
const { CLIENTS, CLIENT_TIMELINE } = window.PROVET_DATA;

// ---------------- CLIENT PEEK PANEL ----------------
function ClientPeekPanel({ client, onClose, onOpen }) {
  const borderB = "1px solid var(--n-color-border-weaker, #ECECEC)";
  const [width, onResize] = useDragResizeCl({ initial: 320, min: 240, max: 560, side: "left", storageKey: "provet.clientPeek.width" });

  const infoRow = (icon, value) => value ? (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0" }}>
      <IconCl name={icon} size={13} style={{ color: "var(--n-color-text-weaker)", flex: "none", marginTop: 1 }} />
      <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text)", lineHeight: 1.4 }}>{value}</span>
    </div>
  ) : null;

  return (
    <div style={{
      width, flexShrink: 0,
      border: borderB,
      borderRadius: 8,
      display: "flex", flexDirection: "column",
      background: "#fff", height: "100%", overflow: "hidden",
      position: "relative",
    }}>
      <ResizeHandleCl side="left" onMouseDown={onResize} />
      {/* Panel header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 12px", borderBottom: borderB, flexShrink: 0,
      }}>
        <AvatarCl initials={client.initials || client.name[0]} color={client.color || "info"} size="s" />
        <span style={{ fontWeight: 600, fontSize: 'var(--n-font-size-body)', flex: 1, minWidth: 0 }} className="truncate">{client.name}</span>
        <button
          onClick={onOpen}
          className="n-button n-button--s"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500, flexShrink: 0 }}
        >
          <IconCl name="interface-external-link" size={11} />
          Open
        </button>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--n-color-text-weaker)", display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <IconCl name="interface-close" size={13} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ overflow: "auto", flex: 1, padding: "12px" }}>
        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
            {client.tags.map((t, i) => (
              <span key={i} style={{
                background: "var(--n-color-surface-hover, #F1F1EF)",
                border: "1px solid var(--n-color-border-weaker, #ECECEC)",
                padding: "2px 7px", borderRadius: 4, fontSize: 'var(--n-font-size-body)', fontWeight: 500,
                color: "var(--n-color-text-weaker)",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* Contact info */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>Contact</div>
          {infoRow("interface-email", client.email)}
          {infoRow("interface-phone", client.phone)}
          {infoRow("navigation-location", client.address)}
        </div>

        {/* Account info */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>Account</div>
          {client.member && infoRow("interface-time", client.member)}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
            <IconCl name="generic-cash" size={13} style={{ color: "var(--n-color-text-weaker)", flex: "none" }} />
            <span style={{ fontSize: 'var(--n-font-size-body)' }}>
              Balance:{" "}
              {client.unpaid > 0
                ? <span style={{ color: "#C0392B", fontWeight: 600 }}>£{client.balance}</span>
                : <span style={{ color: "var(--n-color-text-weaker)" }}>£0.00</span>}
            </span>
          </div>
        </div>

        {/* Pets */}
        {client.pets && client.pets.length > 0 && (
          <div>
            <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>
              Pets ({client.pets.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {client.pets.map((p, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 8px",
                  background: "var(--n-color-surface-hover, #FAFAF9)",
                  borderRadius: 6,
                  border: "1px solid var(--n-color-border-weaker, #ECECEC)",
                }}>
                  <AvatarCl initials={p.name[0]} color={p.color || "info"} size="s" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>
                      {p.species}{p.breed ? ` · ${p.breed}` : ""}{p.age ? ` · ${p.age}` : ""}
                    </div>
                  </div>
                  {p.crit && (
                    <span style={{ fontSize: 'var(--n-font-size-body)', background: "#FEE2E2", color: "#C0392B", padding: "1px 5px", borderRadius: 3, fontWeight: 600 }}>CRIT</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- LIST (Notion-style table) ----------------
function ClientsPage({ openClient }) {
  const [view, setView] = React.useState("all");
  const [hoveredId, setHoveredId] = React.useState(null);
  const [peekedClient, setPeekedClient] = React.useState(null);
  const list = CLIENTS;

  const headerIcon = { color: "var(--n-color-text-weaker)", flex: "none" };
  const cellPad = "8px 12px";
  const borderB = "1px solid var(--n-color-border-weaker, #ECECEC)";

  const COLUMN_DEFS = React.useMemo(() => [
    { key: "name",    label: "Name",         icon: <span style={{ fontFamily: 'var(--n-font-family)', fontSize: 'var(--n-font-size-body)', fontWeight: 600, ...headerIcon }}>Aa</span>, getSort: (c, i) => (c.name || "").toLowerCase() },
    { key: "pets",    label: "Pets",         icon: <IconCl name="generic-pet-paw" size={12} style={headerIcon} />,         getSort: (c) => ((c.pets && c.pets[0] && c.pets[0].name) || "").toLowerCase() },
    { key: "email",   label: "Email",        icon: <IconCl name="interface-email" size={12} style={headerIcon} />,         getSort: (c) => (c.email || "").toLowerCase() },
    { key: "phone",   label: "Phone",        icon: <IconCl name="interface-phone" size={12} style={headerIcon} />,         getSort: (c) => c.phone || "" },
    { key: "balance", label: "Balance",      icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>, getSort: (c) => Number(c.balance) || 0 },
    { key: "created", label: "Created time", icon: <IconCl name="interface-time" size={12} style={headerIcon} />,          getSort: (c, i) => i },
  ], []);

  const DEFAULT_WIDTHS = [280, 180, 220, 160, 130, 160];
  const MIN_WIDTH = 80;
  const [widths, setWidths] = React.useState(DEFAULT_WIDTHS);
  const [sort, setSort] = React.useState({ key: null, dir: "asc" });

  const COLS = widths.map(w => `${w}px`).join(" ") + " 60px";

  const onResizeStart = (idx, e) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX;
    const startW = widths[idx];
    const onMove = (ev) => {
      const next = Math.max(MIN_WIDTH, startW + (ev.clientX - startX));
      setWidths(ws => { const copy = ws.slice(); copy[idx] = next; return copy; });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const toggleSort = (key) => {
    setSort(s => s.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : { key: null, dir: "asc" }) : { key, dir: "asc" });
  };

  const indexed = list.map((c, i) => [c, i]);
  if (sort.key) {
    const def = COLUMN_DEFS.find(d => d.key === sort.key);
    if (def) {
      indexed.sort((a, b) => {
        const va = def.getSort(a[0], a[1]);
        const vb = def.getSort(b[0], b[1]);
        if (va < vb) return sort.dir === "asc" ? -1 : 1;
        if (va > vb) return sort.dir === "asc" ? 1 : -1;
        return 0;
      });
    }
  }
  const sortedList = indexed;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "row", fontSize: 'var(--n-font-size-body)', gap: 8 }}>
      {/* Main table area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#fff", borderRadius: 8, overflow: "hidden", border: borderB }}>
      {/* Top bar: title + right-side controls */}
      <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: borderB, gap: 4 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>Clients</h1>
        <span style={{ flex: 1 }} />
        <button
          onClick={() => setView("all")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: view === "all" ? "var(--n-color-surface-hover, #F5F5F4)" : "transparent",
            border: "none", padding: "5px 10px", borderRadius: 4,
            fontSize: 'var(--n-font-size-body)', fontWeight: 500, cursor: "pointer", color: "var(--n-color-text)"
          }}>
          <IconCl name="interface-grid" size={13} style={{ color: "#1F6FEB" }} />
          All
        </button>
        <button
          onClick={() => setView("list")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: view === "list" ? "var(--n-color-surface-hover, #F5F5F4)" : "transparent",
            border: "none", padding: "5px 10px", borderRadius: 4,
            fontSize: 'var(--n-font-size-body)', fontWeight: 400, cursor: "pointer", color: "var(--n-color-text-weaker)"
          }}>
          <IconCl name="interface-grid" size={13} />
          List
        </button>
        <button className="linear-toolbar__btn" title="Filter" style={{ padding: 6 }}><IconCl name="interface-filter" size={14} /></button>
        <button className="linear-toolbar__btn" title="Sort" style={{ padding: 6 }}><IconCl name="interface-sort-small" size={14} /></button>
        <button className="linear-toolbar__btn" title="Search" style={{ padding: 6 }}><IconCl name="navigation-search" size={14} /></button>
        <button className="linear-toolbar__btn" title="Display" style={{ padding: 6 }}><IconCl name="navigation-settings" size={14} /></button>
        <button
          className="n-button n-button--primary"
          style={{ marginInlineStart: 8, display: "inline-flex", alignItems: "center", gap: 4, paddingInlineEnd: 6 }}>
          New
          <IconCl name="interface-dropdown-small" size={10} style={{ color: "#fff" }} />
        </button>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: COLS,
        borderBottom: borderB,
        fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)", fontWeight: 400,
        background: "#fff",
      }}>
        {COLUMN_DEFS.map((col, i) => {
          const isSorted = sort.key === col.key;
          return (
            <div
              key={col.key}
              onClick={() => toggleSort(col.key)}
              style={{
                position: "relative",
                padding: cellPad, display: "flex", alignItems: "center", gap: 6,
                borderInlineStart: i === 0 ? "none" : borderB,
                cursor: "pointer", userSelect: "none",
                background: isSorted ? "var(--n-color-surface-hover, #F5F5F4)" : "transparent",
              }}
              title={`Sort by ${col.label}`}
            >
              {col.icon}
              <span className="truncate" style={{ minWidth: 0, flex: 1 }}>{col.label}</span>
              {isSorted && (
                <IconCl
                  name={sort.dir === "asc" ? "interface-arrow-up" : "interface-arrow-down"}
                  size={11}
                  style={{ color: "var(--n-color-text-weaker)", flex: "none" }}
                />
              )}
              <div
                onMouseDown={(e) => onResizeStart(i, e)}
                onClick={(e) => e.stopPropagation()}
                title="Drag to resize"
                style={{
                  position: "absolute", top: 0, bottom: 0, right: -3,
                  width: 6, cursor: "col-resize", zIndex: 2,
                }}
              />
            </div>
          );
        })}
        <div style={{ padding: cellPad, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderInlineStart: borderB, color: "var(--n-color-text-weaker)" }}>
          <IconCl name="interface-add" size={12} />
        </div>
      </div>

      {/* Rows */}
      <div style={{ overflow: "auto", flex: 1 }}>
        {sortedList.map(([c, idx]) => {
          const created = `Apr ${(idx % 28) + 1}, 2026`;
          const isHovered = hoveredId === c.id;
          const isPeeked = peekedClient && peekedClient.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setPeekedClient(c)}
              style={{
                display: "grid", gridTemplateColumns: COLS,
                borderBottom: borderB,
                cursor: "pointer", color: "var(--n-color-text)",
                fontSize: 'var(--n-font-size-body)',
                background: isPeeked
                  ? "var(--n-color-accent-weakest, #EEF4FF)"
                  : isHovered
                  ? "var(--n-color-surface-hover, #F5F5F4)"
                  : "transparent",
                position: "relative",
              }}
              onMouseEnter={() => setHoveredId(c.id)}
              onMouseLeave={() => setHoveredId(null)}>
              <div style={{ padding: cellPad, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                <IconCl name="user-single" size={14} style={{ color: "var(--n-color-text-weaker)", flex: "none" }} />
                <span className="truncate" style={{ minWidth: 0, flex: 1 }}>{c.name}</span>
                {isHovered && (
                  <button
                    onClick={e => { e.stopPropagation(); setPeekedClient(c); }}
                    title="Open in side peek"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "#fff",
                      border: "1px solid rgba(15, 15, 15, 0.1)",
                      borderRadius: 6, padding: "3px 9px 3px 7px",
                      fontSize: 'var(--n-font-size-body)', fontWeight: 500, cursor: "pointer",
                      color: "rgba(55, 53, 47, 0.65)", whiteSpace: "nowrap",
                      letterSpacing: "0.02em",
                      boxShadow: "0 1px 2px rgba(15, 15, 15, 0.04)",
                      flex: "none",
                      lineHeight: 1.2,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flex: "none" }}>
                      <rect x="2.25" y="3.25" width="11.5" height="9.5" rx="1.75" stroke="currentColor" strokeWidth="1.3" fill="none" opacity="0.7" />
                      <line x1="10" y1="3.5" x2="10" y2="12.5" stroke="currentColor" strokeWidth="1.3" opacity="0.7" />
                    </svg>
                    OPEN
                  </button>
                )}
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
                {(c.pets || []).map((p, i) => (
                  <span key={i} style={{
                    background: "var(--n-color-surface-hover, #F1F1EF)",
                    padding: "1px 6px", borderRadius: 3, fontSize: 'var(--n-font-size-body)',
                  }}>{p.name}</span>
                ))}
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", minWidth: 0 }}>
                <span className="truncate" style={{ minWidth: 0, color: "var(--n-color-text)" }}>{c.email}</span>
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", minWidth: 0 }}>
                <span className="truncate" style={{ minWidth: 0 }}>{c.phone || "—"}</span>
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center" }}>
                {c.unpaid > 0
                  ? <span style={{ color: "#C0392B" }}>£{c.balance}</span>
                  : <span style={{ color: "var(--n-color-text-weaker)" }}>£0.00</span>}
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", color: "var(--n-color-text-weaker)" }}>
                {created}
              </div>
              <div style={{ padding: cellPad, borderInlineStart: borderB }} />
            </div>
          );
        })}
        {/* Empty add-row */}
        <div style={{
          display: "grid", gridTemplateColumns: COLS,
          borderBottom: borderB, color: "var(--n-color-text-weaker)",
        }}>
          <div style={{ padding: cellPad, display: "flex", alignItems: "center", gap: 6 }}>
            <IconCl name="interface-add" size={12} />
            <span>New</span>
          </div>
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: COLS,
          fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)",
        }}>
          <div style={{ padding: cellPad }}>COUNT {list.length}</div>
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
          <div style={{ borderInlineStart: borderB }} />
        </div>
      </div>
      </div>{/* end main table area */}

      {/* Side peek panel */}
      {peekedClient && (
        <ClientPeekPanel
          client={peekedClient}
          onClose={() => setPeekedClient(null)}
          onOpen={() => { setPeekedClient(null); openClient(peekedClient); }}
        />
      )}
    </div>
  );
}

// ---------------- DETAIL ----------------
const PET_VITALS = [
  { label: "Weight",      value: "32",   unit: "lbs" },
  { label: "Temperature", value: "38.5", unit: "°C" },
  { label: "Heart rate",  value: "90",   unit: "bpm" },
  { label: "Resp. rate",  value: "19",   unit: "rpm" },
];

const PET_TABS = [
  { id: "chart",         label: "Chart" },
  { id: "medications",   label: "Medications", count: 3 },
  { id: "immunizations", label: "Immunizations", count: 6 },
  { id: "vitals",        label: "Vitals", count: 6 },
  { id: "imaging",       label: "Imaging", count: 5 },
  { id: "labs",          label: "Labs", count: 2 },
  { id: "notes",         label: "Notes" },
  { id: "messages",      label: "Messages", count: 4 },
  { id: "tasks",         label: "Tasks" },
  { id: "forms",         label: "Forms" },
  { id: "billing",       label: "Billing" },
];

const PAST_CONSULTATIONS = [
  {
    id: 2451,
    date: "14 Mar 2026",
    type: "Annual wellness exam",
    vet: "Dr. Lindqvist",
    status: "signed",
    notes: "S: Owner reports normal appetite and activity. Drinking & urination normal. No GI signs in last 6 months.\n\nO: BCS 5/9. Wt 32.4 kg (+0.4 kg). T 38.4°C. HR 94 bpm. RR 22. MM pink, CRT <2s. Auscultation normal. Mild tartar grade 1.\n\nA: Healthy 5 yr MN Golden. Mild dental tartar — recommend prophylaxis Q3.\n\nP: Continue current diet. DHPP boosted today. Recommend dental clean Q3 2026. Recheck if signs.",
    vitals: [
      { label: "Weight", value: "32.4", unit: "kg" },
      { label: "Temp",   value: "38.4", unit: "°C" },
      { label: "HR",     value: "94",   unit: "bpm" },
      { label: "RR",     value: "22",   unit: "rpm" },
    ],
    diagnoses: [{ label: "Healthy adult", code: "Z00" }, { label: "Dental tartar grade 1", code: "K03.6" }],
    orders: [
      { label: "Wellness exam — comprehensive", qty: 1, price: 65.00 },
      { label: "DHPP vaccine — Nobivac",        qty: 1, price: 14.20 },
    ],
  },
  {
    id: 5022,
    date: "12 Apr 2026",
    type: "Skin recheck — dermatitis",
    vet: "Dr. Lindqvist",
    status: "signed",
    notes: "S: Owner reports itching returned on left flank after finishing Apoquel. Mostly evenings. No change in diet or environment.\n\nO: Wt 32.6 kg. T 38.6°C. Erythematous patch ~6 cm left flank, self-trauma visible, no pustules, no fleas.\n\nA: Recurrent atopic dermatitis, localised. Rule out food component.\n\nP: Resume Apoquel 16 mg BID × 7 d then SID. Refer to dermatology if no improvement in 4 wks. Discuss elimination diet trial.",
    vitals: [
      { label: "Weight", value: "32.6", unit: "kg" },
      { label: "Temp",   value: "38.6", unit: "°C" },
      { label: "Pruritus", value: "6", unit: "/10" },
    ],
    diagnoses: [{ label: "Atopic dermatitis — localised", code: "L20" }],
    orders: [
      { label: "Apoquel 16 mg × 30",           qty: 1, price: 42.80 },
      { label: "Consultation — recheck",        qty: 1, price: 48.00 },
    ],
  },
  {
    id: 5104,
    date: "22 Apr 2026",
    type: "Bloodwork — CBC / Chem-17",
    vet: "Dr. Lindqvist",
    status: "signed",
    notes: "S: Routine recheck bloods requested at last wellness. No new concerns.\n\nO: All values within reference ranges. ALT 68 U/L (ref 10–58) — mildly elevated. Recheck in 6 months.\n\nA: Subclinical hepatic elevation, likely dietary. Monitor.\n\nP: Recheck ALT in 6 months. Continue current diet. No medication changes.",
    vitals: [
      { label: "ALT",  value: "68",   unit: "U/L" },
      { label: "BUN",  value: "14",   unit: "mg/dL" },
      { label: "CREA", value: "1.1",  unit: "mg/dL" },
    ],
    diagnoses: [{ label: "Elevated ALT — subclinical", code: "R74.0" }],
    orders: [
      { label: "Lab — CBC + Chem-17", qty: 1, price: 78.00 },
    ],
  },
];

// ----- Mock billing data, scoped to the current pet/client -----
const BILLING_UNPAID = [
  { id: "L-9341", date: "12 Apr 2026", desc: "Apoquel 16 mg",          sku: "SKU-1042", qty: 30, unit: 2.85,  amount: 85.50,  vet: "Dr. Lindqvist" },
  { id: "L-9342", date: "12 Apr 2026", desc: "Consultation — recheck", sku: "—",        qty: 1,  unit: 48.00, amount: 48.00,  vet: "Dr. Lindqvist" },
  { id: "L-9343", date: "08 Apr 2026", desc: "Bravecto Chew (10–20kg)",sku: "SKU-3022", qty: 1,  unit: 38.90, amount: 38.90,  vet: "Dr. Patel"     },
  { id: "L-9344", date: "08 Apr 2026", desc: "Nail clip — full",       sku: "—",        qty: 1,  unit: 18.00, amount: 18.00,  vet: "Nurse Owen"    },
  { id: "L-9345", date: "01 Apr 2026", desc: "Hill's z/d Canine 3 kg", sku: "SKU-5021", qty: 1,  unit: 32.50, amount: 32.50,  vet: "Reception"     },
];

const BILLING_REFUNDABLE = [
  { id: "P-7715", date: "14 Mar 2026", desc: "Annual wellness exam",   sku: "—",        qty: 1,  unit: 65.00, amount: 65.00,  paidVia: "Card · Visa •6411", invoice: "INV-008188", restock: false },
  { id: "P-7716", date: "14 Mar 2026", desc: "DHPP vaccine — Nobivac", sku: "SKU-6101", qty: 1,  unit: 14.20, amount: 14.20,  paidVia: "Card · Visa •6411", invoice: "INV-008188", restock: true  },
  { id: "P-7702", date: "02 Feb 2026", desc: "Frontline Plus 20–40 kg",sku: "SKU-3010", qty: 3,  unit: 12.50, amount: 37.50,  paidVia: "Insurance · Petplan",         invoice: "INV-008141", restock: true  },
  { id: "P-7688", date: "11 Dec 2025", desc: "CBC + Chem-17 panel",    sku: "—",        qty: 1,  unit: 92.00, amount: 92.00,  paidVia: "Cash",                        invoice: "INV-008090", restock: false },
];

const BILLING_INVOICES = [
  { id: "INV-008214", date: "12 Apr 2026", due: "26 Apr 2026", items: 5, amount: 222.90, status: "pending" },
  { id: "INV-008188", date: "14 Mar 2026", due: "28 Mar 2026", items: 4, amount: 248.00, status: "paid"    },
  { id: "INV-008141", date: "02 Feb 2026", due: "16 Feb 2026", items: 3, amount: 102.50, status: "paid"    },
  { id: "INV-008090", date: "11 Dec 2025", due: "25 Dec 2025", items: 6, amount: 312.40, status: "paid"    },
  { id: "INV-008041", date: "19 Sep 2025", due: "03 Oct 2025", items: 2, amount: 84.30,  status: "overdue" },
  { id: "INV-008010", date: "08 Aug 2025", due: "—",            items: 1, amount: 28.00,  status: "draft"   },
];

function ClientDetailPage({ client, onBack }) {
  const [activePetId, setActivePetId] = React.useState((client.pets && client.pets[0] && client.pets[0].id) || null);
  const [tab, setTab] = React.useState("chart");
  const [petMenuOpen, setPetMenuOpen] = React.useState(false);
  const pets = client.pets || [];
  const pet = pets.find(p => p.id === activePetId) || pets[0];

  React.useEffect(() => {
    if (!petMenuOpen) return;
    const close = (e) => { if (!e.target.closest(".cl-petmenu") && !e.target.closest(".cl-pets-trigger")) setPetMenuOpen(false); };
    setTimeout(() => document.addEventListener("click", close), 0);
    return () => document.removeEventListener("click", close);
  }, [petMenuOpen]);

  return (
    <div className="cl-page">
      {/* Compact header strip */}
      <div className="cl-strip">
        <div className="cl-strip__row">
          {pet && <AvatarCl initials={pet.name[0]} color={pet.color || "info"} size="s" />}
          <div className="cl-strip__title" onClick={() => setPetMenuOpen(o => !o)}>
            <span className="cl-strip__client-name" onClick={(e) => { e.stopPropagation(); onBack(); }}>{client.name}</span>
            {pet && (
              <>
                <span className="cl-strip__chev">»</span>
                <span className="cl-strip__pet-name">{pet.name}</span>
                {pets.length > 1 && <IconCl name="interface-dropdown-small" size={9} />}
              </>
            )}
            {petMenuOpen && pets.length > 1 && (
              <div className="cl-petmenu">
                {pets.map(p => (
                  <button key={p.id} className={"cl-petmenu__item" + (p.id === pet.id ? " cl-petmenu__item--active" : "")}
                          onClick={(e) => { e.stopPropagation(); setActivePetId(p.id); setPetMenuOpen(false); }}>
                    <AvatarCl initials={p.name[0]} color={p.color || "info"} size="s" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>{p.species} · {p.breed || ""}</div>
                    </div>
                    {p.id === pet.id && <IconCl name="interface-checked-small" size={11} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          {pet && (
            <div className="cl-strip__facts">
              <span><IconCl name={pet.species && pet.species.toLowerCase().startsWith("can") ? "generic-canine" : (pet.species && pet.species.toLowerCase().startsWith("fel") ? "generic-feline" : "generic-pet-paw")} size={12} /> {pet.species}{pet.breed ? " · " + pet.breed : ""}</span>
              <span><IconCl name={pet.sex === "F" ? "generic-female" : "generic-male"} size={12} /> {pet.sex === "F" ? "Female" : "Male"}{pet.neutered ? ", neutered" : ""}</span>
              <span><IconCl name="generic-baby-bottle" size={12} /> {pet.age}</span>
              <span><IconCl name="medical-weight" size={12} /> {pet.weightShort || pet.weight}</span>
              <span><IconCl name="interface-time" size={12} /> Last seen {pet.lastVisit || "—"}</span>
              <a className="cl-strip__contact" href={"tel:" + (client.phone || "+44 7700 900603").replace(/\s/g, "")} title={client.phone || "+44 7700 900603"} aria-label={"Call " + (client.phone || "+44 7700 900603")}>
                <IconCl name="interface-phone" size={12} />
              </a>
              <a className="cl-strip__contact" href={"mailto:" + (client.email || (client.name || "owner").toLowerCase().replace(/\s+/g, ".") + "@example.com")} title={client.email || (client.name || "owner").toLowerCase().replace(/\s+/g, ".") + "@example.com"} aria-label={"Email " + (client.email || client.name)}>
                <IconCl name="interface-email" size={12} />
              </a>
              <span className="cl-strip__facts-sep" />
              <span className="cl-strip__inline">
                <span className="cl-strip__inline-label">Vet</span>
                <span className="cl-strip__inline-value">{pet.vet || "Dr. Sara Lindqvist"}</span>
                <span className="cl-strip__inline-sub">· {pet.clinic || "Bath Veterinary Clinic"}</span>
              </span>
              <span className="cl-strip__inline">
                <span className="cl-strip__inline-label">Next appt</span>
                <span className="cl-strip__inline-value tnum">{pet.nextAppt || "Apr 30 · 10:30"}</span>
              </span>
              <span className="cl-strip__inline">
                <span className="cl-strip__inline-label">Microchip</span>
                <span className="cl-strip__inline-value tnum">{pet.microchip || "956 000 010 234 567"}</span>
              </span>
              <span className="cl-strip__inline">
                <span className="cl-strip__inline-label">Balance</span>
                <span className="cl-strip__inline-value cl-strip__inline-value--money">{client.balance || "£0.00"}</span>
              </span>
            </div>
          )}
          <span style={{ flex: 1 }} />
        </div>

        {pet && (
          <div className="cl-strip__pills">
            <span className="cl-pill cl-pill--active"><span className="cl-pill__dot" /> Active</span>
            <span className="cl-pill cl-pill--info">Insurance · {pet.insurance || "Petplan"} · {pet.insuranceTier || "Gold"}</span>
            {pet.allergies && <span className="cl-pill cl-pill--allergy">Allergy · {pet.allergies}</span>}
            {pet.vaccineDue && <span className="cl-pill cl-pill--warn"><span className="cl-pill__dot cl-pill__dot--warn" /> Vaccine due in {pet.vaccineDue}</span>}
            {pet.crit && <span className="cl-pill cl-pill--critical">Critical</span>}
          </div>
        )}

        <div className="cl-tabs">
          {PET_TABS.map(t => (
            <button key={t.id}
                    className={"cl-tab" + (tab === t.id ? " cl-tab--active" : "")}
                    onClick={() => setTab(t.id)}>
              {t.label}
              {t.count != null && <span className="cl-tab__count">{t.count}</span>}
            </button>
          ))}
          <span className="cl-tab__sep" />
          {PAST_CONSULTATIONS.filter(c => c.status === "active").map(c => (
            <button key={"cons-" + c.id}
                    className={"cl-tab cl-tab--consult" + (tab === "cons-" + c.id ? " cl-tab--active" : "")}
                    onClick={() => setTab("cons-" + c.id)}
                    title={c.date + " · " + c.type}>
              {c.id}
            </button>
          ))}
          <button className={"cl-tab cl-tab--new-consult" + (tab === "consultations" ? " cl-tab--active" : "")}
                  onClick={() => setTab("consultations")}>
            <IconCl name="interface-add" size={10} /> New
          </button>
        </div>
      </div>

      {/* Body: rail + content */}
      <div className="cl-body cl-body--no-rail">
        <main className="cl-main">
          {tab === "chart" && pet && <ChartTab pet={pet} />}
          {tab === "medications" && pet && <MedicationsTab pet={pet} />}
          {tab === "immunizations" && pet && <ImmunizationsTab pet={pet} />}
          {tab === "vitals" && pet && <VitalsTab pet={pet} />}
          {tab === "imaging" && pet && <ImagingTab pet={pet} />}
          {tab === "consultations" && pet && <ConsultationsTab pet={pet} client={client} />}
          {tab === "billing" && <BillingTab client={client} pet={pet} />}
          {tab.startsWith("cons-") && (() => {
            const c = PAST_CONSULTATIONS.find(x => "cons-" + x.id === tab);
            return c ? <PastConsultTab consultation={c} /> : null;
          })()}
          {!["chart","medications","immunizations","vitals","imaging","consultations","billing"].includes(tab) && !tab.startsWith("cons-") && (
            <div className="cl-empty">
              <IconCl name="file-patient-records" size={28} />
              <div className="cl-empty__title">{PET_TABS.find(t=>t.id===tab)?.label}</div>
              <div className="cl-empty__sub">{pet?.name}'s {PET_TABS.find(t=>t.id===tab)?.label?.toLowerCase()} appear here.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// =====================================================================
// CHART TAB
// =====================================================================

// Rich timeline: visits w/ SOAP + orders + diagnoses, plus communications
// and future appointments. Order is reverse-chronological.
const CHART_ENTRIES = [
  // ---- Future
  { kind: "appointment", date: "08 May 2026", time: "10:30", title: "Annual wellness exam", vet: "Dr. Lindqvist", location: "Bath Veterinary Clinic", duration: "30 min", reason: "Yearly check, weight + dental review." },
  { kind: "sms",        date: "01 May 2026",  time: "09:02", title: "Appointment reminder sent", with: "+44 7700 900142", direction: "out", summary: "Hi Amy, reminder for Milo's wellness exam on 8 May at 10:30." },

  // ---- Recent visit (most clinical detail)
  { kind: "visit", date: "14 Mar 2026", time: "09:14", title: "Annual wellness exam", vet: "Dr. Lindqvist", tone: "success", icon: "medical-stethoscope",
    diagnosis: ["Healthy adult", "Weight stable"],
    soap: {
      S: "Owner reports normal appetite and activity. Drinking & urination normal. No GI signs in last 6 months.",
      O: "BCS 5/9. Wt 32.4 kg (+0.4 kg). T 38.4°C. HR 94 bpm. RR 22. MM pink, CRT <2s. Auscultation normal. Mild tartar grade 1.",
      A: "Healthy 5 yr MN Golden. Mild dental tartar — recommend prophylaxis Q3.",
      P: "Continue current diet. DHPP boosted today. Recommend dental clean Q3 2026. Recheck if signs."
    },
    orders: [
      { type: "service",    name: "Wellness exam — comprehensive",  qty: 1,  price: 65.00 },
      { type: "medication", name: "DHPP vaccine — Nobivac",          qty: 1,  price: 14.20, instructions: "Booster, given SC right shoulder" },
      { type: "item",       name: "Microchip scan & verify",         qty: 1,  price: 0.00 },
    ],
  },
  { kind: "phone", date: "10 Mar 2026", time: "14:22", title: "Owner called — booking", with: "Amy Collins", direction: "in", summary: "Amy called to book annual exam. Slotted 14 Mar 09:00." },

  { kind: "visit", date: "02 Feb 2026", time: "11:30", title: "Booster — DHPP", vet: "Dr. Patel", tone: "info", icon: "medical-vaccine-syringe",
    diagnosis: ["Vaccination — routine"],
    soap: {
      S: "Healthy at presentation. No recent illness.",
      O: "T 38.5°C. Alert. No abnormalities on exam.",
      A: "Routine vaccine visit.",
      P: "DHPP given. 15-min observation — no reaction. Next due 02 Feb 2027."
    },
    orders: [
      { type: "medication", name: "DHPP vaccine — Nobivac", qty: 1, price: 14.20, instructions: "SC, left shoulder" },
      { type: "service",    name: "Vaccine consultation",   qty: 1, price: 22.00 },
    ],
  },
  { kind: "email", date: "15 Jan 2026", time: "08:40", title: "Vaccination reminder", with: "amy.collins@hotmail.co.uk", direction: "out", summary: "Automated reminder: DHPP booster due in 2 weeks." },

  { kind: "visit", date: "11 Dec 2025", time: "10:05", title: "Blood panel — CBC + Chem-17", vet: "Dr. Lindqvist", tone: "warning", icon: "medical-flask",
    diagnosis: ["Mildly elevated ALT — recheck pending"],
    soap: {
      S: "Annual senior bloods (preventive).",
      O: "All CBC values WNL. Chem panel: ALT 112 U/L (ref 10–100). All else WNL.",
      A: "Subclinical mild ALT elevation. No clinical signs. Likely incidental but warrants recheck.",
      P: "Recheck ALT in 6 months (Jun 2026). Owner advised, no current treatment."
    },
    orders: [
      { type: "service",    name: "CBC + Chem-17 panel",        qty: 1, price: 92.00 },
      { type: "service",    name: "Sample collection — venous", qty: 1, price: 12.00 },
    ],
  },
  { kind: "whatsapp", date: "12 Dec 2025", time: "16:11", title: "Lab results explained", with: "Amy Collins", direction: "out", summary: "Sent results PDF and brief explanation. Owner acknowledged." },

  { kind: "visit", date: "19 Sep 2025", time: "15:40", title: "Skin irritation — left flank", vet: "Dr. Lindqvist", tone: "danger", icon: "medical-bandage",
    diagnosis: ["Atopic dermatitis (suspected)"],
    soap: {
      S: "Owner notes 1 wk of pruritus over left flank. Worse evenings. No new foods/products.",
      O: "Erythematous patch ~6 cm, mild self-trauma, no pustules. No fleas seen. Skin scrape: negative.",
      A: "Atopic flare — environmental allergen suspected. R/o secondary infection.",
      P: "Apoquel 16 mg PO q24h × 14d. Recheck 14d. Cool compress prn."
    },
    orders: [
      { type: "service",    name: "Skin consultation",          qty: 1,  price: 48.00 },
      { type: "service",    name: "Skin scrape cytology",       qty: 1,  price: 24.00 },
      { type: "medication", name: "Apoquel 16 mg",              qty: 14, price: 39.90, instructions: "1 tab PO q24h × 14d" },
      { type: "item",       name: "E-collar (M)",               qty: 1,  price: 14.50 },
    ],
  },

  { kind: "visit", date: "08 Aug 2025", time: "08:50", title: "Post-dental recheck", vet: "Dr. Patel", tone: "success", icon: "medical-tooth",
    diagnosis: ["Resolved — post-op normal"],
    soap: {
      S: "Owner: eating normally, no oral discomfort.",
      O: "Gingiva healed. No swelling. Sutures (if any) absorbed.",
      A: "Uneventful post-op.",
      P: "Resume normal kibble. No further intervention needed."
    },
    orders: [
      { type: "service", name: "Recheck — short", qty: 1, price: 28.00 },
    ],
  },

  { kind: "visit", date: "12 Jul 2025", time: "13:20", title: "Dental cleaning + scale", vet: "Dr. Lindqvist", tone: "highlight", icon: "medical-tooth",
    diagnosis: ["Periodontal disease grade 2"],
    soap: {
      S: "Owner reports halitosis, no eating issues.",
      O: "Tartar grade 2. No fractures. Oral exam under GA: probing depths normal.",
      A: "Grade 2 periodontal disease.",
      P: "Full mouth scale + polish under GA. Recovery uneventful. Recheck in 12 mo."
    },
    orders: [
      { type: "service",    name: "Dental scale & polish (GA)", qty: 1, price: 285.00 },
      { type: "service",    name: "GA — short procedure",       qty: 1, price: 95.00 },
      { type: "medication", name: "Metacam 1.5 mg/ml — 5 ml",   qty: 1, price: 9.20,  instructions: "0.5 ml PO q24h × 3d post-op" },
    ],
  },
];

const CHART_FILTERS = [
  { id: "visit",        label: "Visits",         icon: "medical-stethoscope" },
  { id: "medication",   label: "Medications",    icon: "medical-pill" },
  { id: "immunization", label: "Immunizations",  icon: "medical-vaccine-syringe" },
  { id: "appointment",  label: "Future appts",   icon: "interface-time" },
  { id: "phone",        label: "Phone calls",    icon: "interface-phone" },
  { id: "email",        label: "Emails",         icon: "interface-email" },
  { id: "sms",          label: "SMS",            icon: "interface-message" },
  { id: "whatsapp",     label: "WhatsApp",       icon: "interface-message" },
];

const ALL_FILTER_IDS = CHART_FILTERS.map(f => f.id);

// Predefined views are available to every pet/client. User-saved views live in
// component state for now (would persist to backend in production).
const DEFAULT_VIEWS = [
  { id: "all",       name: "All",             enabled: ALL_FILTER_IDS, builtin: true },
  { id: "clinical",  name: "Clinical only",   enabled: ["visit", "medication", "immunization", "appointment"], builtin: true },
  { id: "rx",        name: "Rx & vaccines",   enabled: ["medication", "immunization"], builtin: true },
  { id: "comms",     label: "Communications", name: "Communications",   enabled: ["phone", "email", "sms", "whatsapp"], builtin: true },
];

// Parse "DD MMM YYYY" → comparable timestamp for sort.
function parseDate(s) {
  if (!s || s === "—") return 0;
  const m = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const [d, mon, y] = s.split(" ");
  return new Date(+y, m[mon] ?? 0, +d).getTime();
}

// Build the unified, time-sorted entry list. Medications and immunizations
// from their respective datasets join the timeline as first-class entries.
// Declared lazy because MEDICATIONS/IMMUNIZATIONS are defined later in the file.
let _timeline = null;
function buildTimeline() {
  if (_timeline) return _timeline;
  const entries = [...CHART_ENTRIES];
  MEDICATIONS.forEach(m => {
    if (m.prescribed && m.prescribed !== "—") {
      entries.push({ kind: "medication", date: m.prescribed, time: "", title: m.name, vet: m.by, med: m });
    }
  });
  IMMUNIZATIONS.forEach(v => {
    if (v.given && v.given !== "—") {
      entries.push({ kind: "immunization", date: v.given, time: "", title: v.vaccine, vet: v.by, imm: v });
    }
  });
  _timeline = entries.sort((a, b) => parseDate(b.date) - parseDate(a.date));
  return _timeline;
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

function ChartTab({ pet }) {
  const [views, setViews]               = React.useState(DEFAULT_VIEWS);
  const [activeViewId, setActiveViewId] = React.useState("all");
  const [enabled, setEnabled]           = React.useState(() => new Set(ALL_FILTER_IDS));
  const [collapsed, setCollapsed]       = React.useState(() => new Set());
  const [allCollapsed, setAllCollapsed] = React.useState(false);
  const [savingView, setSavingView]     = React.useState(false);
  const [newViewName, setNewViewName]   = React.useState("");
  const [filterMin, setFilterMin]       = React.useState(() => {
    try { return localStorage.getItem("provet.chartFilter.minimized") === "1"; } catch (e) { return false; }
  });
  const setMinPersist = (v) => {
    setFilterMin(v);
    try { localStorage.setItem("provet.chartFilter.minimized", v ? "1" : "0"); } catch (e) {}
  };

  // Detect when current selection drifts away from any saved view.
  const matchedView = views.find(v => setsEqual(new Set(v.enabled), enabled));
  React.useEffect(() => {
    if (matchedView) {
      if (matchedView.id !== activeViewId) setActiveViewId(matchedView.id);
    } else if (activeViewId !== "custom") {
      setActiveViewId("custom");
    }
  }, [enabled, matchedView]);

  const TIMELINE   = buildTimeline();
  const visible    = TIMELINE.filter(e => enabled.has(e.kind));
  const visitCount = TIMELINE.filter(e => e.kind === "visit").length;
  const future     = visible.filter(e => e.kind === "appointment");
  const past       = visible.filter(e => e.kind !== "appointment");

  const toggleFilter = (id) => {
    const n = new Set(enabled);
    if (n.has(id)) n.delete(id); else n.add(id);
    setEnabled(n);
  };
  const applyView = (v) => { setEnabled(new Set(v.enabled)); setActiveViewId(v.id); };
  const saveView = () => {
    const name = newViewName.trim();
    if (!name) return;
    const id = "u-" + Date.now();
    const v = { id, name, enabled: [...enabled], builtin: false };
    setViews([...views, v]);
    setActiveViewId(id);
    setSavingView(false);
    setNewViewName("");
  };
  const deleteView = (id) => {
    setViews(views.filter(v => v.id !== id));
    if (activeViewId === id) setActiveViewId("custom");
  };

  const toggleCollapse = (key) => {
    const n = new Set(collapsed);
    if (n.has(key)) n.delete(key); else n.add(key);
    setCollapsed(n);
    setAllCollapsed(false);
  };
  const toggleAll = () => {
    if (allCollapsed) { setCollapsed(new Set()); setAllCollapsed(false); }
    else {
      const all = new Set(TIMELINE.map((e, i) => e.kind === "visit" ? `v-${i}` : null).filter(Boolean));
      setCollapsed(all); setAllCollapsed(true);
    }
  };
  const counts = CHART_FILTERS.reduce((acc, f) => {
    acc[f.id] = TIMELINE.filter(e => e.kind === f.id).length;
    return acc;
  }, {});

  return (
    <div className="cl-chart-wrap">
      {/* Filter rail (minimized) */}
      {filterMin && (
        <aside className="cl-chart-filter cl-chart-filter--min">
          <button className="cl-chart-filter__toggle" onClick={() => setMinPersist(false)} title="Show filters">
            <IconCl name="interface-filter" size={13} />
          </button>
          {activeViewId !== "all" && activeViewId !== "custom" && (
            <div className="cl-chart-filter__minlabel" title={"Active view: " + (views.find(v=>v.id===activeViewId)?.name || "")}>
              {(views.find(v=>v.id===activeViewId)?.name || "").slice(0, 3)}
            </div>
          )}
        </aside>
      )}

      {/* Filter rail (expanded) */}
      {!filterMin && (
      <aside className="cl-chart-filter">
        <div className="cl-chart-filter__head cl-chart-filter__head--row">
          <span style={{ flex: 1 }}>Views</span>
          <button className="cl-chart-filter__toggle" onClick={() => setMinPersist(true)} title="Minimize filters">
            <IconCl name="arrow-left-small" size={11} />
          </button>
        </div>
        <div className="cl-chart-filter__views">
          {views.map(v => (
            <div key={v.id} className={"cl-view" + (activeViewId === v.id ? " cl-view--active" : "")}>
              <button className="cl-view__btn" onClick={() => applyView(v)}>
                <IconCl name={activeViewId === v.id ? "interface-checked-small" : "interface-filter"} size={11} />
                <span>{v.name}</span>
                <span className="cl-view__count">{v.enabled.length}</span>
              </button>
              {!v.builtin && (
                <button className="cl-view__del" title="Delete view" onClick={(e) => { e.stopPropagation(); deleteView(v.id); }}>
                  <IconCl name="interface-close" size={10} />
                </button>
              )}
            </div>
          ))}
          {activeViewId === "custom" && (
            <div className="cl-view cl-view--active">
              <span className="cl-view__btn" style={{ cursor: "default" }}>
                <IconCl name="interface-edit" size={11} />
                <span>Custom</span>
              </span>
            </div>
          )}
          {savingView ? (
            <div className="cl-view-save">
              <input
                autoFocus
                placeholder="View name"
                value={newViewName}
                onChange={(e) => setNewViewName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") saveView(); if (e.key === "Escape") { setSavingView(false); setNewViewName(""); } }}
                className="cl-view-save__input"
              />
              <button className="cl-view-save__ok" onClick={saveView} disabled={!newViewName.trim()}>Save</button>
              <button className="cl-view-save__cancel" onClick={() => { setSavingView(false); setNewViewName(""); }}>×</button>
            </div>
          ) : (
            <button className="cl-chart-filter__btn cl-view-add" onClick={() => setSavingView(true)}>
              <IconCl name="interface-add" size={11} /> Save current as view
            </button>
          )}
        </div>

        <div className="cl-chart-filter__sep" />
        <div className="cl-chart-filter__head">Show on chart</div>
        <div className="cl-chart-filter__list">
          {CHART_FILTERS.map(f => {
            const on = enabled.has(f.id);
            return (
              <label key={f.id} className={"cl-chart-filter__row" + (on ? "" : " cl-chart-filter__row--off")}>
                <input type="checkbox" checked={on} onChange={() => toggleFilter(f.id)} className="bl-check" />
                <IconCl name={f.icon} size={12} />
                <span className="cl-chart-filter__label">{f.label}</span>
                <span className="cl-chart-filter__count">{counts[f.id] || 0}</span>
              </label>
            );
          })}
        </div>
        <div className="cl-chart-filter__sep" />
        <div className="cl-chart-filter__list">
          <button className="cl-chart-filter__btn" onClick={() => setEnabled(new Set(ALL_FILTER_IDS))}>Select all</button>
          <button className="cl-chart-filter__btn" onClick={() => setEnabled(new Set())}>Clear all</button>
          <button className="cl-chart-filter__btn" onClick={toggleAll}>{allCollapsed ? "Expand visits" : "Collapse visits"}</button>
        </div>
      </aside>
      )}

      {/* Timeline */}
      <div className="cl-chart">
        <div className="cl-chart__head">
          <div className="row gap-xs">
            <button className="n-button n-button--s"><IconCl name="interface-add" size={11} /> Add entry</button>
            <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
          </div>
        </div>

        {future.length > 0 && (
          <div className="cl-chart__group">
            <div className="cl-chart__group-head">Upcoming</div>
            <div className="cl-timeline">
              {future.map((e, i) => <ChartEntry key={"f-"+i} e={e} idx={"f-"+i} collapsed={false} onToggle={() => {}} />)}
            </div>
          </div>
        )}

        <div className="cl-chart__group">
          {future.length > 0 && <div className="cl-chart__group-head">History</div>}
          <div className="cl-timeline">
            {past.map((e, i) => {
              const idx = e.kind === "visit" ? `v-${TIMELINE.indexOf(e)}` : `c-${i}`;
              return <ChartEntry key={idx} e={e} idx={idx} collapsed={collapsed.has(idx)} onToggle={() => toggleCollapse(idx)} />;
            })}
            {past.length === 0 && (
              <div className="cl-empty" style={{ margin: 0 }}>
                <div className="cl-empty__title">No entries match your filter</div>
                <div className="cl-empty__sub">Enable categories on the left to see chart entries.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChartEntry({ e, idx, collapsed, onToggle }) {
  if (e.kind === "appointment")  return <FutureApptEntry e={e} />;
  if (e.kind === "visit")        return <VisitEntry e={e} collapsed={collapsed} onToggle={onToggle} />;
  if (e.kind === "medication")   return <MedEntry e={e} />;
  if (e.kind === "immunization") return <ImmEntry e={e} />;
  return <CommEntry e={e} />;
}

function MedEntry({ e }) {
  const m = e.med;
  const tone = { active: "info", completed: "success", discontinued: "danger" }[m.status] || "info";
  const statusLabel = m.status[0].toUpperCase() + m.status.slice(1);
  return (
    <div className={"cl-event cl-event--" + tone + " cl-event--rx"}>
      <div className="cl-event__date">
        <div className="cl-event__day">{e.date.split(" ")[0]}</div>
        <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
        <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
      </div>
      <div className="cl-event__bar" />
      <div className="cl-event__card cl-event__card--slim">
        <div className="cl-event__row">
          <div className="cl-event__icon"><IconCl name="medical-pill" size={13} /></div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="cl-event__title">
              <span className="cl-order-type cl-order-type--medication" style={{ marginRight: 8 }}>Rx</span>
              {m.name}
              <span className="cl-pill" style={{ marginLeft: 8, fontSize: 'var(--n-font-size-body)', padding: "1px 7px", background: "var(--n-color-nav-hover)", color: "var(--n-color-text-weaker)" }}>{statusLabel}</span>
            </div>
            <div className="cl-event__meta">
              <span><IconCl name="user" size={11} /> {m.by}</span>
              <span>{m.form} · {m.dose}</span>
              <span>Refills: {m.refills}</span>
              <span>{m.duration}</span>
            </div>
            {m.reason && <div className="cl-event__note" style={{ marginTop: 4 }}>{m.reason}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ImmEntry({ e }) {
  const v = e.imm;
  return (
    <div className="cl-event cl-event--success cl-event--imm">
      <div className="cl-event__date">
        <div className="cl-event__day">{e.date.split(" ")[0]}</div>
        <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
        <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
      </div>
      <div className="cl-event__bar" />
      <div className="cl-event__card cl-event__card--slim">
        <div className="cl-event__row">
          <div className="cl-event__icon"><IconCl name="medical-vaccine-syringe" size={13} /></div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="cl-event__title">
              <span className="cl-order-type" style={{ marginRight: 8, background: "color-mix(in oklab, #10B981 14%, transparent)", color: "#047857" }}>Vaccine</span>
              {v.vaccine}
              <span className="cl-pill" style={{ marginLeft: 8, fontSize: 'var(--n-font-size-body)', padding: "1px 7px", background: "var(--n-color-nav-hover)", color: "var(--n-color-text-weaker)" }}>{v.type}</span>
            </div>
            <div className="cl-event__meta">
              <span><IconCl name="user" size={11} /> {v.by}</span>
              <span>Site: {v.site}</span>
              <span>Lot: {v.lot}</span>
              <span>Next due {v.next}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FutureApptEntry({ e }) {
  return (
    <div className="cl-event cl-event--info cl-event--future">
      <div className="cl-event__date">
        <div className="cl-event__day">{e.date.split(" ")[0]}</div>
        <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
        <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
      </div>
      <div className="cl-event__bar" />
      <div className="cl-event__card">
        <div className="cl-event__row">
          <div className="cl-event__icon"><IconCl name="interface-time" size={14} /></div>
          <div className="flex-1">
            <div className="cl-event__title">
              {e.title}
              <span className="cl-pill cl-pill--info" style={{ marginLeft: 8, fontSize: 'var(--n-font-size-body)', padding: "1px 7px" }}>Scheduled</span>
            </div>
            <div className="cl-event__meta">
              <span><IconCl name="interface-time" size={11} /> {e.time} · {e.duration}</span>
              <span><IconCl name="user" size={11} /> {e.vet}</span>
              <span><IconCl name="navigation-location" size={11} /> {e.location}</span>
            </div>
          </div>
          <button className="cl-event__more" title="Reschedule"><IconCl name="interface-edit" size={11} /></button>
        </div>
        <div className="cl-event__note">{e.reason}</div>
      </div>
    </div>
  );
}

function CommEntry({ e }) {
  const channel = {
    phone:    { icon: "interface-phone",   label: "Phone call",  color: "var(--n-color-text-info)" },
    email:    { icon: "interface-email",   label: "Email",       color: "var(--n-color-text-weak)" },
    sms:      { icon: "interface-message", label: "SMS",         color: "var(--n-color-text-progress)" },
    whatsapp: { icon: "interface-message", label: "WhatsApp",    color: "#25D366" },
  }[e.kind] || { icon: "interface-message", label: e.kind };
  const dirArrow = e.direction === "in" ? "← In" : "→ Out";
  return (
    <div className="cl-event cl-event--comm">
      <div className="cl-event__date">
        <div className="cl-event__day">{e.date.split(" ")[0]}</div>
        <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
        <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
      </div>
      <div className="cl-event__bar" style={{ background: channel.color }} />
      <div className="cl-event__card cl-event__card--slim">
        <div className="cl-event__row">
          <div className="cl-event__icon" style={{ color: channel.color, background: "color-mix(in oklab, " + channel.color + " 14%, transparent)" }}>
            <IconCl name={channel.icon} size={13} />
          </div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="cl-event__title">
              <span style={{ color: channel.color, fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginRight: 8 }}>{channel.label}</span>
              {e.title}
            </div>
            <div className="cl-event__meta">
              <span>{dirArrow}</span>
              <span><IconCl name="interface-time" size={11} /> {e.time}</span>
              <span><IconCl name="user" size={11} /> {e.with}</span>
            </div>
            <div className="cl-event__note" style={{ marginTop: 4 }}>{e.summary}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VisitEntry({ e, collapsed, onToggle }) {
  const total = (e.orders || []).reduce((s, o) => s + o.price * o.qty, 0);
  return (
    <div className={"cl-event cl-event--" + e.tone}>
      <div className="cl-event__date">
        <div className="cl-event__day">{e.date.split(" ")[0]}</div>
        <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
        <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
      </div>
      <div className="cl-event__bar" />
      <div className="cl-event__card">
        <div className="cl-event__row">
          <div className="cl-event__icon"><IconCl name={e.icon} size={14} /></div>
          <div className="flex-1" style={{ minWidth: 0 }}>
            <div className="cl-event__title">{e.title}</div>
            {e.diagnosis && e.diagnosis.length > 0 && (
              <div className="cl-dx-row">
                <span className="cl-dx-label">Dx</span>
                {e.diagnosis.map((d, i) => <span key={i} className="cl-dx-pill">{d}</span>)}
              </div>
            )}
            <div className="cl-event__meta">
              <span><IconCl name="interface-time" size={11} /> {e.time}</span>
              <span><IconCl name="user" size={11} /> {e.vet}</span>
              {e.orders && <span><IconCl name="generic-cash" size={11} /> {e.orders.length} order{e.orders.length !== 1 ? "s" : ""} · {fmtMoney(total)}</span>}
            </div>
          </div>
          <button className="cl-event__more" onClick={onToggle} title={collapsed ? "Expand" : "Collapse"}>
            <IconCl name={collapsed ? "interface-dropdown-small" : "arrow-up-small"} size={12} />
          </button>
        </div>

        {!collapsed && (
          <div className="cl-visit-body">
            {e.soap && (
              <div className="cl-soap">
                <div className="cl-soap__head">Clinical notes (SOAP)</div>
                <div className="cl-soap__grid">
                  {[["S","Subjective"],["O","Objective"],["A","Assessment"],["P","Plan"]].map(([k, label]) => (
                    <div key={k} className="cl-soap__cell">
                      <span className="cl-soap__key">{k}</span>
                      <div>
                        <div className="cl-soap__label">{label}</div>
                        <div className="cl-soap__text">{e.soap[k]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {e.orders && e.orders.length > 0 && (
              <div className="cl-orders">
                <div className="cl-orders__head">
                  <span>Orders ({e.orders.length})</span>
                  <span className="cl-orders__total">Total {fmtMoney(total)}</span>
                </div>
                <table className="cl-orders__table">
                  <thead>
                    <tr>
                      <th style={{ width: 80 }}>Type</th>
                      <th>Item</th>
                      <th style={{ width: 60, textAlign: "right" }}>Qty</th>
                      <th style={{ width: 90, textAlign: "right" }}>Price</th>
                      <th style={{ width: 90, textAlign: "right" }}>Line</th>
                    </tr>
                  </thead>
                  <tbody>
                    {e.orders.map((o, i) => (
                      <tr key={i}>
                        <td><span className={"cl-order-type cl-order-type--" + o.type}>{o.type}</span></td>
                        <td>
                          <div className="cl-order-name">{o.name}</div>
                          {o.instructions && <div className="cl-order-sub">{o.instructions}</div>}
                        </td>
                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{o.qty}</td>
                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{fmtMoney(o.price)}</td>
                        <td style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>{fmtMoney(o.price * o.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================================
// MEDICATIONS TAB
// =====================================================================
const MEDICATIONS = [
  { name: "Apoquel 16 mg",            sku: "SKU-1042", form: "Tablet",     dose: "1 tab PO q24h",         duration: "Long-term", refills: 2, status: "active",     prescribed: "19 Sep 2025", by: "Dr. Lindqvist", reason: "Atopic dermatitis" },
  { name: "Frontline Plus (20–40 kg)",sku: "SKU-3010", form: "Pipette",    dose: "1 pipette monthly",     duration: "Ongoing",   refills: 5, status: "active",     prescribed: "02 Feb 2026", by: "Dr. Patel",     reason: "Parasite prevention" },
  { name: "Metacam 1.5 mg/ml",        sku: "SKU-2415", form: "Oral susp.", dose: "0.5 ml PO q24h × 3d",   duration: "3 days",    refills: 0, status: "completed",  prescribed: "12 Jul 2025", by: "Dr. Lindqvist", reason: "Post-op pain (dental)" },
  { name: "Amoxicillin 250 mg",       sku: "SKU-2502", form: "Tablet",     dose: "1 tab PO q12h × 7d",    duration: "7 days",    refills: 0, status: "completed",  prescribed: "08 Aug 2025", by: "Dr. Patel",     reason: "Prophylactic post-dental" },
  { name: "Cerenia 16 mg",            sku: "SKU-2210", form: "Tablet",     dose: "1 tab PO q24h prn",     duration: "PRN",       refills: 1, status: "discontinued", prescribed: "11 Dec 2025", by: "Dr. Lindqvist", reason: "Travel-related nausea" },
];

function MedicationsTab({ pet }) {
  const groups = { active: [], completed: [], discontinued: [] };
  MEDICATIONS.forEach(m => groups[m.status].push(m));
  const labels = { active: "Active", completed: "Completed", discontinued: "Discontinued" };
  const tones  = { active: "bl-stat--paid", completed: "bl-stat--draft", discontinued: "bl-stat--overdue" };

  return (
    <div className="bl-tab">
      <div className="cl-chart__head">
        <div className="row gap-xs">
          <button className="n-button n-button--s"><IconCl name="interface-add" size={11} /> Prescribe</button>
          <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
        </div>
      </div>
      {["active","completed","discontinued"].filter(k => groups[k].length > 0).map(k => (
        <section key={k} className="bl-section">
          <header className="bl-section__head">
            <div>
              <div className="bl-section__title">{labels[k]}</div>
              <div className="bl-section__sub">{groups[k].length} medication{groups[k].length !== 1 ? "s" : ""}</div>
            </div>
          </header>
          <div className="bl-table">
            <div className="bl-row bl-row--head">
              <div style={{ flex: 1, minWidth: 180 }}>Medication</div>
              <div style={{ width: 90 }}>Form</div>
              <div style={{ width: 200 }}>Dose / Sig</div>
              <div style={{ width: 110 }}>Duration</div>
              <div style={{ width: 70, textAlign: "right" }}>Refills</div>
              <div style={{ width: 110 }}>Prescribed</div>
              <div style={{ width: 130 }}>By</div>
              <div style={{ width: 90 }}>Status</div>
            </div>
            {groups[k].map(m => (
              <div key={m.name} className="bl-row" style={{ cursor: "default" }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <div className="cl-order-name">{m.name}</div>
                  <div className="cl-order-sub">{m.reason} · {m.sku}</div>
                </div>
                <div style={{ width: 90, color: "var(--n-color-text-weak)" }}>{m.form}</div>
                <div style={{ width: 200, color: "var(--n-color-text-weak)" }}>{m.dose}</div>
                <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{m.duration}</div>
                <div style={{ width: 70, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{m.refills}</div>
                <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{m.prescribed}</div>
                <div style={{ width: 130, color: "var(--n-color-text-weak)" }}>{m.by}</div>
                <div style={{ width: 90 }}>
                  <span className={"bl-stat " + tones[k]}><span className="bl-stat__dot" />{labels[k]}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// =====================================================================
// IMMUNIZATIONS TAB
// =====================================================================
const IMMUNIZATIONS = [
  { vaccine: "DHPP — Nobivac",        type: "Core",     given: "14 Mar 2026", by: "Dr. Lindqvist", lot: "L824-A",  site: "SC right shoulder", interval: "1 yr",  next: "14 Mar 2027", status: "current" },
  { vaccine: "DHPP — Nobivac",        type: "Core",     given: "02 Feb 2026", by: "Dr. Patel",     lot: "L811-C",  site: "SC left shoulder",  interval: "1 yr",  next: "02 Feb 2027", status: "superseded" },
  { vaccine: "Rabies (3-yr)",         type: "Core",     given: "14 Mar 2026", by: "Dr. Lindqvist", lot: "R903-D",  site: "SC right hip",      interval: "3 yr",  next: "14 Mar 2029", status: "current" },
  { vaccine: "Leptospirosis 4-way",   type: "Core",     given: "14 Mar 2026", by: "Dr. Lindqvist", lot: "L777-K",  site: "SC right shoulder", interval: "1 yr",  next: "14 Mar 2027", status: "current" },
  { vaccine: "Bordetella (intranasal)", type: "Lifestyle", given: "12 Jul 2025", by: "Dr. Patel",   lot: "BN-204",  site: "Intranasal",         interval: "6 mo",  next: "12 Jan 2026", status: "due"      },
  { vaccine: "Canine Influenza H3N8", type: "Lifestyle",given: "—",            by: "—",             lot: "—",       site: "—",                  interval: "1 yr",  next: "—",            status: "missing"  },
  { vaccine: "Lyme (OspA)",           type: "Lifestyle",given: "11 Dec 2025", by: "Dr. Lindqvist", lot: "LY-118",  site: "SC right shoulder", interval: "1 yr",  next: "11 Dec 2026", status: "current"  },
];

function ImmunizationsTab({ pet }) {
  const tones = {
    current:    { cls: "bl-stat--paid",    label: "Current"    },
    due:        { cls: "bl-stat--pending", label: "Due / Overdue" },
    superseded: { cls: "bl-stat--draft",   label: "Superseded" },
    missing:    { cls: "bl-stat--overdue", label: "Not given"  },
  };
  const due  = IMMUNIZATIONS.filter(v => v.status === "due" || v.status === "missing");
  const cur  = IMMUNIZATIONS.filter(v => v.status === "current");
  const old  = IMMUNIZATIONS.filter(v => v.status === "superseded");

  return (
    <div className="bl-tab">
      <div className="cl-chart__head">
        <div className="row gap-xs">
          <button className="n-button n-button--s"><IconCl name="interface-add" size={11} /> Record</button>
          <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
        </div>
      </div>

      {[["Due or missing", due], ["Current", cur], ["Historical", old]].filter(([_, items]) => items.length > 0).map(([title, items]) => (
        <section key={title} className="bl-section">
          <header className="bl-section__head">
            <div>
              <div className="bl-section__title">{title}</div>
              <div className="bl-section__sub">{items.length} record{items.length !== 1 ? "s" : ""}</div>
            </div>
          </header>
          <div className="bl-table">
            <div className="bl-row bl-row--head">
              <div style={{ flex: 1, minWidth: 200 }}>Vaccine</div>
              <div style={{ width: 90 }}>Type</div>
              <div style={{ width: 110 }}>Given</div>
              <div style={{ width: 130 }}>By</div>
              <div style={{ width: 100 }}>Lot</div>
              <div style={{ width: 130 }}>Site</div>
              <div style={{ width: 80 }}>Interval</div>
              <div style={{ width: 110 }}>Next due</div>
              <div style={{ width: 130 }}>Status</div>
            </div>
            {items.map((v, i) => {
              const t = tones[v.status];
              return (
                <div key={v.vaccine + i} className="bl-row" style={{ cursor: "default" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div className="cl-order-name">{v.vaccine}</div>
                  </div>
                  <div style={{ width: 90, color: "var(--n-color-text-weak)" }}>{v.type}</div>
                  <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{v.given}</div>
                  <div style={{ width: 130, color: "var(--n-color-text-weak)" }}>{v.by}</div>
                  <div style={{ width: 100, color: "var(--n-color-text-weak)", fontVariantNumeric: "tabular-nums" }}>{v.lot}</div>
                  <div style={{ width: 130, color: "var(--n-color-text-weak)" }}>{v.site}</div>
                  <div style={{ width: 80, color: "var(--n-color-text-weak)" }}>{v.interval}</div>
                  <div style={{ width: 110, color: v.status === "due" || v.status === "missing" ? "#B45309" : "var(--n-color-text-weak)", fontWeight: v.status === "due" || v.status === "missing" ? 500 : 400 }}>{v.next}</div>
                  <div style={{ width: 130 }}>
                    <span className={"bl-stat " + t.cls}><span className="bl-stat__dot" />{t.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// =====================================================================
// VITALS TAB
// =====================================================================
// Reference ranges (canine adult). Used to flag in/out of range readings.
const VITAL_DEFS = [
  { key: "temp",   label: "Temperature",     unit: "°C",  icon: "medical-temperature",     min: 38.3, max: 39.2, decimals: 1 },
  { key: "hr",     label: "Heart rate",      unit: "bpm", icon: "medical-heart-rate",      min: 60,   max: 140,  decimals: 0 },
  { key: "rr",     label: "Resp. rate",      unit: "rpm", icon: "medical-instrument-stethoscope", min: 10, max: 30, decimals: 0 },
  { key: "weight", label: "Weight",          unit: "kg",  icon: "medical-ribbon",          min: 28,   max: 36,   decimals: 1 },
  { key: "bcs",    label: "Body cond. (BCS)",unit: "/9",  icon: "medical-blood",           min: 4,    max: 6,    decimals: 0 },
  { key: "bp",     label: "Blood pressure",  unit: "mmHg",icon: "medical-drip",            min: null, max: null, decimals: 0, text: true },
  { key: "crt",    label: "Cap. refill time",unit: "",    icon: "medical-blood",           min: null, max: null, decimals: 0, text: true },
  { key: "glucose",label: "Blood glucose",   unit: "mg/dL",icon: "medical-test-tube",      min: 70,   max: 140,  decimals: 0 },
];

const VITALS_HISTORY = [
  { date: "14 Mar 2026", time: "09:14", visit: "Annual wellness", recordedBy: "Dr. Lindqvist", temp: 38.4, hr: 94,  rr: 22, weight: 32.4, bcs: 5, bp: "128/85",  crt: "<2s", glucose: 96  },
  { date: "02 Feb 2026", time: "11:30", visit: "DHPP booster",    recordedBy: "Dr. Patel",     temp: 38.5, hr: 92,  rr: 20, weight: 32.0, bcs: 5, bp: null,      crt: "<2s", glucose: null },
  { date: "11 Dec 2025", time: "10:05", visit: "Blood panel",     recordedBy: "Dr. Lindqvist", temp: 38.6, hr: 96,  rr: 24, weight: 31.8, bcs: 5, bp: "132/88",  crt: "<2s", glucose: 102 },
  { date: "19 Sep 2025", time: "15:40", visit: "Skin consult",    recordedBy: "Dr. Lindqvist", temp: 38.8, hr: 102, rr: 26, weight: 32.2, bcs: 5, bp: null,      crt: "<2s", glucose: null },
  { date: "08 Aug 2025", time: "08:50", visit: "Post-dental rec.",recordedBy: "Dr. Patel",     temp: 38.5, hr: 90,  rr: 22, weight: 31.6, bcs: 5, bp: null,      crt: "<2s", glucose: null },
  { date: "12 Jul 2025", time: "13:20", visit: "Dental clean",    recordedBy: "Dr. Lindqvist", temp: 38.7, hr: 98,  rr: 22, weight: 31.4, bcs: 5, bp: "130/86",  crt: "<2s", glucose: 99  },
];

function vitalStatus(def, v) {
  if (v == null || v === "" || def.text) return null;
  if (def.min != null && v < def.min) return "low";
  if (def.max != null && v > def.max) return "high";
  return "ok";
}

function Sparkline({ values, min, max, w = 120, h = 28 }) {
  const nums = values.filter(v => typeof v === "number");
  if (nums.length < 2) return <div style={{ width: w, height: h }} />;
  const lo = Math.min(...nums), hi = Math.max(...nums);
  const span = hi - lo || 1;
  const step = w / (nums.length - 1);
  const pts = nums.map((v, i) => `${i * step},${h - ((v - lo) / span) * (h - 4) - 2}`).join(" ");
  const last = nums[nums.length - 1];
  let stroke = "var(--n-color-text-weaker)";
  if (min != null && max != null) {
    if (last < min || last > max) stroke = "#B45309";
    else stroke = "#047857";
  }
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      {nums.map((v, i) => (
        <circle key={i} cx={i * step} cy={h - ((v - lo) / span) * (h - 4) - 2} r={i === nums.length - 1 ? 2.2 : 1} fill={stroke} />
      ))}
    </svg>
  );
}

function VitalsTab({ pet }) {
  const [selectedVital, setSelectedVital] = React.useState("weight");
  const latest = VITALS_HISTORY[0];
  // chronological for sparkline
  const seriesByKey = {};
  VITAL_DEFS.forEach(def => {
    seriesByKey[def.key] = [...VITALS_HISTORY].reverse().map(r => r[def.key]);
  });
  const def = VITAL_DEFS.find(d => d.key === selectedVital);

  const fmt = (def, v) => {
    if (v == null || v === "") return "—";
    if (def.text) return String(v);
    return Number(v).toFixed(def.decimals);
  };
  const trend = (vals) => {
    const nums = vals.filter(v => typeof v === "number");
    if (nums.length < 2) return null;
    const d = nums[nums.length - 1] - nums[nums.length - 2];
    if (Math.abs(d) < 0.05) return { dir: "flat", icon: "graph-line" };
    return { dir: d > 0 ? "up" : "down", icon: d > 0 ? "graph-trend-up" : "graph-trend-down", delta: d };
  };

  return (
    <div className="bl-tab">
      <div className="cl-chart__head">
        <div className="row gap-xs">
          <button className="n-button n-button--primary n-button--s"><IconCl name="interface-add" size={11} style={{ color: "#fff" }} /> Record vitals</button>
          <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
        </div>
      </div>

      {/* Latest reading cards */}
      <div className="vt-grid">
        {VITAL_DEFS.map(d => {
          const v = latest[d.key];
          const status = vitalStatus(d, v);
          const t = trend(seriesByKey[d.key]);
          const isSel = selectedVital === d.key;
          return (
            <button key={d.key}
                    className={"vt-card" + (isSel ? " vt-card--sel" : "") + (status ? " vt-card--" + status : "")}
                    onClick={() => setSelectedVital(d.key)}>
              <div className="vt-card__head">
                <span className="vt-card__icon"><IconCl name={d.icon} size={12} /></span>
                <span className="vt-card__label">{d.label}</span>
                {status === "high" && <span className="vt-flag vt-flag--high">High</span>}
                {status === "low"  && <span className="vt-flag vt-flag--low">Low</span>}
              </div>
              <div className="vt-card__value">
                {fmt(d, v)} <span className="vt-card__unit">{d.unit}</span>
              </div>
              <div className="vt-card__foot">
                <span className="vt-card__range">
                  {d.text ? "—" : (d.min != null ? `${d.min}–${d.max} ${d.unit}` : "no range")}
                </span>
                {!d.text && t && (
                  <span className={"vt-trend vt-trend--" + t.dir}>
                    <IconCl name={t.icon} size={10} />
                    {t.delta != null && <span>{t.delta > 0 ? "+" : ""}{t.delta.toFixed(d.decimals)}</span>}
                  </span>
                )}
              </div>
              {!d.text && <Sparkline values={seriesByKey[d.key]} min={d.min} max={d.max} w={180} h={28} />}
            </button>
          );
        })}
      </div>

      {/* Trend detail for selected vital */}
      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">{def.label} trend</div>
            <div className="bl-section__sub">
              {VITALS_HISTORY.length} readings
              {def.min != null && ` · reference ${def.min}–${def.max} ${def.unit}`}
            </div>
          </div>
          <div className="row gap-xs">
            <button className="n-button n-button--s">3 mo</button>
            <button className="n-button n-button--s">6 mo</button>
            <button className="n-button n-button--s">All</button>
          </div>
        </header>
        <div className="vt-trend-card">
          <VitalChart values={seriesByKey[def.key]} dates={[...VITALS_HISTORY].reverse().map(r => r.date)} def={def} />
        </div>
      </section>

      {/* Full history table */}
      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">All readings</div>
            <div className="bl-section__sub">{VITALS_HISTORY.length} entries</div>
          </div>
        </header>
        <div className="bl-table">
          <div className="bl-row bl-row--head">
            <div style={{ width: 110 }}>Date</div>
            <div style={{ flex: 1, minWidth: 140 }}>Visit</div>
            <div style={{ width: 130 }}>Recorded by</div>
            {VITAL_DEFS.map(d => (
              <div key={d.key} style={{ width: 70, textAlign: "right" }}>{d.label.split(" ")[0]}</div>
            ))}
          </div>
          {VITALS_HISTORY.map((r, i) => (
            <div key={i} className="bl-row" style={{ cursor: "default" }}>
              <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{r.date}</div>
              <div style={{ flex: 1, minWidth: 140 }}>{r.visit}</div>
              <div style={{ width: 130, color: "var(--n-color-text-weak)" }}>{r.recordedBy}</div>
              {VITAL_DEFS.map(d => {
                const v = r[d.key];
                const s = vitalStatus(d, v);
                return (
                  <div key={d.key}
                       style={{
                         width: 70, textAlign: "right",
                         fontVariantNumeric: "tabular-nums",
                         color: s === "high" ? "#B45309" : s === "low" ? "#1D4ED8" : "var(--n-color-text-weak)",
                         fontWeight: s && s !== "ok" ? 500 : 400,
                       }}>
                    {fmt(d, v)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function VitalChart({ values, dates, def, w = 720, h = 180 }) {
  const nums = values.map(v => typeof v === "number" ? v : null);
  const valid = nums.filter(v => v != null);
  if (valid.length < 2) return <div style={{ padding: 24, color: "var(--n-color-text-weaker)", fontSize: 'var(--n-font-size-body)' }}>Not enough data points to chart.</div>;
  const padL = 36, padR = 12, padT = 12, padB = 28;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  let lo = Math.min(...valid), hi = Math.max(...valid);
  if (def.min != null) { lo = Math.min(lo, def.min); hi = Math.max(hi, def.max); }
  const span = hi - lo || 1;
  const pad = span * 0.08;
  lo -= pad; hi += pad;
  const xStep = innerW / (nums.length - 1);
  const yOf = (v) => padT + innerH - ((v - lo) / (hi - lo)) * innerH;
  const xOf = (i) => padL + i * xStep;
  const pathPts = nums.map((v, i) => v == null ? null : `${i === 0 ? "M" : "L"}${xOf(i)},${yOf(v)}`).filter(Boolean).join(" ");
  // ref band
  const showBand = def.min != null && def.max != null;
  const yMin = showBand ? yOf(def.min) : null;
  const yMax = showBand ? yOf(def.max) : null;
  // y-axis ticks (5)
  const ticks = Array.from({ length: 5 }, (_, i) => lo + (i / 4) * (hi - lo));
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: "block", maxWidth: "100%" }}>
      {/* y-axis */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke="var(--n-color-border)" />
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL - 3} y1={yOf(t)} x2={padL} y2={yOf(t)} stroke="var(--n-color-border)" />
          <text x={padL - 6} y={yOf(t)} dy="0.32em" textAnchor="end" fontSize="14" fill="var(--n-color-text-weaker)">{t.toFixed(def.decimals)}</text>
          <line x1={padL} y1={yOf(t)} x2={padL + innerW} y2={yOf(t)} stroke="var(--n-color-border-weaker, #ECECEC)" />
        </g>
      ))}
      {/* reference band */}
      {showBand && (
        <rect x={padL} y={yMax} width={innerW} height={yMin - yMax}
              fill="color-mix(in oklab, #10B981 10%, transparent)" />
      )}
      {/* line */}
      <path d={pathPts} stroke="var(--n-color-accent)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      {/* points + x labels */}
      {nums.map((v, i) => v == null ? null : (
        <g key={i}>
          <circle cx={xOf(i)} cy={yOf(v)} r="3.5" fill="#fff" stroke="var(--n-color-accent)" strokeWidth="1.5" />
          <text x={xOf(i)} y={padT + innerH + 14} textAnchor="middle" fontSize="14" fill="var(--n-color-text-weaker)">
            {dates[i].split(" ").slice(0, 2).join(" ")}
          </text>
        </g>
      ))}
    </svg>
  );
}

// =====================================================================
// IMAGING TAB
// =====================================================================
const IMAGING_STUDIES = [
  { id: "IMG-2026-0151", date: "21 Apr 2026", modality: "CT",          region: "Cranium",                       views: 24, indication: "R/O nasal mass — chronic discharge", orderedBy: "Dr. Lindqvist", readBy: null,            status: "pending", impression: "",                                                                                            priority: "stat",    fileSize: "412 MB" },
  { id: "IMG-2026-0142", date: "14 Mar 2026", modality: "X-ray",       region: "Thorax (R lat, VD)",            views: 2,  indication: "Annual screening",                  orderedBy: "Dr. Lindqvist", readBy: "Dr. Lindqvist", status: "read",    impression: "No abnormalities detected. Cardiac silhouette WNL. Pulmonary fields clear.",                  priority: "routine", fileSize: "28 MB"  },
  { id: "IMG-2025-1188", date: "11 Dec 2025", modality: "Ultrasound",  region: "Abdomen — full",                views: 8,  indication: "Mild ALT elevation — screening",    orderedBy: "Dr. Lindqvist", readBy: "Dr. Patel",     status: "read",    impression: "Liver mildly hyperechoic, gallbladder normal. Kidneys WNL. Recheck in 3 months.",             priority: "routine", fileSize: "84 MB"  },
  { id: "IMG-2025-0921", date: "19 Sep 2025", modality: "X-ray",       region: "L flank — soft tissue",         views: 1,  indication: "Skin lesion R/O foreign body",      orderedBy: "Dr. Lindqvist", readBy: "Dr. Lindqvist", status: "read",    impression: "No radiopaque foreign body. Soft-tissue swelling consistent with dermatitis.",                priority: "routine", fileSize: "12 MB"  },
  { id: "IMG-2025-0712", date: "12 Jul 2025", modality: "Dental X-ray",region: "Full mouth (8 views)",          views: 8,  indication: "Pre-dental cleaning",               orderedBy: "Dr. Lindqvist", readBy: "Dr. Patel",     status: "read",    impression: "Periodontal disease grade 2. No fractures or root resorption.",                                priority: "routine", fileSize: "48 MB"  },
];

const MODALITY_META = {
  "X-ray":        { color: "#3B82F6", icon: "medical-radiology-scan" },
  "Ultrasound":   { color: "#10B981", icon: "medical-radiology-scan" },
  "CT":           { color: "#7C3AED", icon: "medical-radiology-scan" },
  "MRI":          { color: "#EC4899", icon: "medical-radiology-scan" },
  "Dental X-ray": { color: "#F59E0B", icon: "medical-radiology-scan" },
};

function ImagingTab({ pet }) {
  const [filter, setFilter] = React.useState("all");
  const [openId, setOpenId] = React.useState(null);

  const modalities = Array.from(new Set(IMAGING_STUDIES.map(s => s.modality)));
  const filtered = IMAGING_STUDIES.filter(s => filter === "all" || s.modality === filter);
  const pending  = filtered.filter(s => s.status === "pending");
  const read     = filtered.filter(s => s.status === "read");

  return (
    <div className="bl-tab">
      <div className="cl-chart__head">
        <div className="row gap-xs">
          <button className="n-button n-button--primary n-button--s"><IconCl name="interface-add" size={11} style={{ color: "#fff" }} /> Order study</button>
          <button className="n-button n-button--s"><IconCl name="interface-upload" size={11} /> Upload</button>
          <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
        </div>
      </div>

      <div className="im-filterbar">
        <button className={"im-chip" + (filter === "all" ? " im-chip--sel" : "")} onClick={() => setFilter("all")}>
          All <span className="im-chip__count">{IMAGING_STUDIES.length}</span>
        </button>
        {modalities.map(m => {
          const meta = MODALITY_META[m] || { color: "var(--n-color-text-weaker)" };
          const c = IMAGING_STUDIES.filter(s => s.modality === m).length;
          return (
            <button key={m}
                    className={"im-chip" + (filter === m ? " im-chip--sel" : "")}
                    onClick={() => setFilter(m)}
                    style={filter === m ? { borderColor: meta.color, color: meta.color, background: "color-mix(in oklab, " + meta.color + " 8%, transparent)" } : {}}>
              <span className="im-chip__dot" style={{ background: meta.color }} />
              {m} <span className="im-chip__count">{c}</span>
            </button>
          );
        })}
      </div>

      {pending.length > 0 && (
        <section className="bl-section">
          <header className="bl-section__head">
            <div>
              <div className="bl-section__title">Awaiting review</div>
              <div className="bl-section__sub">{pending.length} stud{pending.length === 1 ? "y" : "ies"} pending radiologist read</div>
            </div>
          </header>
          <div className="im-grid">
            {pending.map(s => <StudyCard key={s.id} study={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)} />)}
          </div>
        </section>
      )}

      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">Studies on file</div>
            <div className="bl-section__sub">{read.length} read · click any card to view findings</div>
          </div>
        </header>
        <div className="im-grid">
          {read.map(s => <StudyCard key={s.id} study={s} open={openId === s.id} onToggle={() => setOpenId(openId === s.id ? null : s.id)} />)}
          {read.length === 0 && (
            <div className="cl-empty" style={{ margin: 0 }}>
              <div className="cl-empty__title">No studies match this filter</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StudyCard({ study, open, onToggle }) {
  const meta = MODALITY_META[study.modality] || { color: "var(--n-color-text-weaker)", icon: "medical-radiology-scan" };
  return (
    <div className={"im-card" + (open ? " im-card--open" : "") + (study.status === "pending" ? " im-card--pending" : "")}>
      <div className="im-card__thumb" style={{ background: "color-mix(in oklab, " + meta.color + " 12%, #0c1a3d)" }}>
        <IconCl name={meta.icon} size={32} />
        <div className="im-card__views">{study.views} {study.views === 1 ? "view" : "views"}</div>
        {study.priority === "stat" && <div className="im-card__stat">STAT</div>}
      </div>
      <div className="im-card__body">
        <div className="im-card__headrow">
          <span className="im-card__mod" style={{ background: "color-mix(in oklab, " + meta.color + " 14%, transparent)", color: meta.color }}>
            {study.modality}
          </span>
          <span className="im-card__id">{study.id}</span>
          {study.status === "pending"
            ? <span className="bl-stat bl-stat--pending"><span className="bl-stat__dot" />Pending</span>
            : <span className="bl-stat bl-stat--paid"><span className="bl-stat__dot" />Read</span>}
        </div>
        <div className="im-card__region">{study.region}</div>
        <div className="im-card__meta">
          <span><IconCl name="interface-time" size={11} /> {study.date}</span>
          <span><IconCl name="user" size={11} /> Ordered: {study.orderedBy}</span>
          {study.readBy && <span><IconCl name="user" size={11} /> Read: {study.readBy}</span>}
          <span><IconCl name="file-document" size={11} /> {study.fileSize}</span>
        </div>
        <div className="im-card__indication"><strong>Indication:</strong> {study.indication}</div>
        {open && (
          <div className="im-card__expanded">
            {study.impression ? (
              <>
                <div className="cl-soap__head" style={{ marginBottom: 4 }}>Impression</div>
                <div className="cl-soap__text">{study.impression}</div>
              </>
            ) : (
              <div className="im-card__pending-msg">
                <IconCl name="interface-time" size={12} />
                Awaiting radiologist read · ordered {study.date}
              </div>
            )}
            <div className="im-card__actions">
              <button className="n-button n-button--s"><IconCl name="interface-external-link" size={11} /> Open viewer</button>
              <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Download DICOM</button>
              <button className="n-button n-button--s"><IconCl name="interface-share" size={11} /> Share with referrer</button>
            </div>
          </div>
        )}
        <button className="im-card__expand" onClick={onToggle}>
          <IconCl name={open ? "arrow-up-small" : "interface-dropdown-small"} size={11} />
          {open ? "Less" : "Details"}
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// PAST CONSULTATION VIEWER
// =====================================================================
function PastConsultTab({ consultation: c }) {
  const total = c.orders.reduce((s, o) => s + o.price * o.qty, 0);
  return (
    <div className="cons-tab">
      <div className="past-cons">
        <div className="past-cons__header">
          <div className="past-cons__meta">
            <span className="past-cons__type">{c.type}</span>
            <span className="past-cons__date">{c.date} · {c.vet}</span>
          </div>
          <span className="past-cons__badge">Signed</span>
        </div>

        <div className="uc-card">
          <div className="uc-block">
            <div className="uc-block__head"><span className="uc-block__title">Clinical notes</span></div>
            <pre className="past-cons__notes">{c.notes}</pre>
          </div>

          <div className="uc-block">
            <div className="uc-block__head"><span className="uc-block__title">Vitals</span></div>
            <div className="uc-vitals">
              {c.vitals.map((v, i) => (
                <div key={i} className="uc-vital">
                  <div className="uc-vital__head"><span className="uc-vital__label">{v.label}</span></div>
                  <div className="uc-vital__row">
                    <span className="uc-vital__input" style={{background:"none",border:"none",padding:0,fontWeight:500}}>{v.value}</span>
                    {v.unit && <span className="uc-vital__unit">{v.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="uc-block">
            <div className="uc-block__head"><span className="uc-block__title">Diagnoses</span></div>
            <div className="uc-list">
              {c.diagnoses.map((d, i) => (
                <div key={i} className="uc-row">
                  <IconCl name="medical-stethoscope" size={12} />
                  <span className="uc-row__label">{d.label}</span>
                  {d.code && <span className="scribe-dx__code">{d.code}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="uc-block">
            <div className="uc-block__head">
              <span className="uc-block__title">Orders</span>
              <span className="uc-block__meta">{c.orders.length} items · Total <strong>£{total.toFixed(2)}</strong></span>
            </div>
            <div className="uc-list">
              {c.orders.map((o, i) => (
                <div key={i} className="uc-row">
                  <span className="uc-row__label">{o.label}</span>
                  <span style={{marginLeft:"auto",fontVariantNumeric:"tabular-nums",fontSize:12}}>× {o.qty} · £{(o.price * o.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// CONSULTATIONS TAB — AI scribe-first
// =====================================================================
const SCRIBE_TEMPLATES = [
  { id: "general",     label: "General consult",     icon: "medical-stethoscope" },
  { id: "vaccination", label: "Vaccination",         icon: "medical-vaccine-syringe" },
  { id: "dental",      label: "Dental",              icon: "medical-tooth" },
  { id: "dermatology", label: "Skin / derm",         icon: "medical-bandage" },
  { id: "surgery",     label: "Surgery / pre-op",    icon: "medical-stethoscope" },
  { id: "wellness",    label: "Wellness / annual",   icon: "medical-heart" },
];

const TEMPLATE_PRESETS = {
  general: {
    notesPlaceholder: "History, exam findings, assessment, plan…",
    notes: "S (Subjective):\n\nO (Objective):\n\nA (Assessment):\n\nP (Plan):\n",
    vitals: [
      { label: "Weight", value: "", unit: "kg" },
      { label: "Temp",   value: "", unit: "°C" },
      { label: "HR",     value: "", unit: "bpm" },
      { label: "RR",     value: "", unit: "rpm" },
    ],
    diagnoses: [],
    orders: [
      { subtype: "service", label: "Consultation — General", qty: 1, price: 55, instructions: "" },
    ],
  },
  vaccination: {
    notesPlaceholder: "Pre-vaccine exam, vaccines administered, observation…",
    notes: "Pre-vaccine exam: BAR, no contraindications.\n\nVaccines administered:\n  • \n\nSite / route: \n\nPost-vaccine observation (15 min): No reaction.\n",
    vitals: [
      { label: "Weight", value: "", unit: "kg" },
      { label: "Temp",   value: "", unit: "°C" },
    ],
    diagnoses: [{ label: "Healthy for vaccination", code: "Z23" }],
    orders: [
      { subtype: "medication", label: "DHPP vaccine — Nobivac",     qty: 1, price: 14.20, instructions: "SC right shoulder" },
      { subtype: "medication", label: "Leptospirosis — Nobivac L4", qty: 1, price: 16.50, instructions: "SC left shoulder" },
      { subtype: "service",    label: "Vaccination consultation",   qty: 1, price: 35.00, instructions: "" },
    ],
  },
  dental: {
    notesPlaceholder: "Oral exam findings, dental chart, plan…",
    notes: "Oral exam:\n  • Tartar grade: \n  • Gingivitis grade: \n  • Mobile teeth: \n  • Fractured teeth: \n\nDental chart attached.\n\nPlan: Scale & polish under GA. Extractions if indicated.\n",
    vitals: [
      { label: "Weight",       value: "", unit: "kg" },
      { label: "Tartar grade", value: "", unit: "/4" },
      { label: "Gingivitis",   value: "", unit: "/3" },
    ],
    diagnoses: [{ label: "Periodontal disease", code: "K05" }],
    orders: [
      { subtype: "service",    label: "Dental scale & polish",    qty: 1, price: 195.00, instructions: "Under general anaesthesia" },
      { subtype: "service",    label: "Dental radiographs (full mouth)", qty: 1, price: 85.00, instructions: "" },
      { subtype: "medication", label: "Meloxicam 1.5 mg/ml",      qty: 1, price: 18.40, instructions: "0.1 mg/kg PO SID × 5 d" },
    ],
  },
  dermatology: {
    notesPlaceholder: "Skin distribution, lesions, pruritus, plan…",
    notes: "Distribution: \n\nLesions:\n  • \n\nPruritus score (0–10): \n\nDifferentials: atopy, food allergy, parasitic, infection.\n\nPlan: \n",
    vitals: [
      { label: "Weight",         value: "", unit: "kg" },
      { label: "Pruritus score", value: "", unit: "/10" },
    ],
    diagnoses: [{ label: "Allergic dermatitis (susp.)", code: "L23" }],
    orders: [
      { subtype: "medication", label: "Apoquel 16 mg",        qty: 14, price: 1.45, instructions: "1 tab PO BID × 7 d, then SID" },
      { subtype: "service",    label: "Skin scrape + cytology", qty: 1,  price: 42.00, instructions: "" },
    ],
  },
  surgery: {
    notesPlaceholder: "Pre-op assessment, ASA status, anaesthetic plan…",
    notes: "Procedure: \n\nPre-op assessment:\n  • ASA status: \n  • Fasting confirmed: \n  • Owner consent signed: \n\nAnaesthetic plan:\n  • Premed: \n  • Induction: \n  • Maintenance: \n\nMonitoring: ECG, SpO₂, NIBP, ETCO₂, temp.\n",
    vitals: [
      { label: "Weight", value: "", unit: "kg" },
      { label: "Temp",   value: "", unit: "°C" },
      { label: "HR",     value: "", unit: "bpm" },
      { label: "BP",     value: "", unit: "mmHg" },
    ],
    diagnoses: [],
    orders: [
      { subtype: "service",    label: "Pre-anaesthetic bloods",  qty: 1, price: 78.00, instructions: "" },
      { subtype: "medication", label: "Methadone 10 mg/ml",       qty: 1, price: 9.50, instructions: "0.3 mg/kg IM premed" },
      { subtype: "service",    label: "GA — first 30 min",        qty: 1, price: 95.00, instructions: "" },
    ],
  },
  wellness: {
    notesPlaceholder: "Annual wellness check — full systems review…",
    notes: "Diet & exercise: \n\nBehaviour: \n\nFull systems review:\n  • Eyes / ears: \n  • Mouth / teeth: \n  • Heart / lungs: \n  • Abdomen: \n  • Skin / coat: \n  • MSK: \n\nParasite prevention: \n\nVaccinations due: \n",
    vitals: [
      { label: "Weight", value: "", unit: "kg" },
      { label: "BCS",    value: "", unit: "/9" },
      { label: "Temp",   value: "", unit: "°C" },
      { label: "HR",     value: "", unit: "bpm" },
      { label: "RR",     value: "", unit: "rpm" },
    ],
    diagnoses: [{ label: "Healthy adult", code: "Z00" }],
    orders: [
      { subtype: "service",    label: "Wellness exam — comprehensive", qty: 1, price: 65.00, instructions: "" },
      { subtype: "medication", label: "Bravecto chew",                 qty: 1, price: 32.00, instructions: "12-week flea/tick" },
    ],
  },
};

const SCRIBE_LANGUAGES = [
  { id: "en-GB", label: "English (UK)" },
  { id: "en-US", label: "English (US)" },
  { id: "sv-SE", label: "Svenska" },
  { id: "fi-FI", label: "Suomi" },
  { id: "de-DE", label: "Deutsch" },
  { id: "fr-FR", label: "Français" },
];

const DEMO_TRANSCRIPT = [
  { t: 0,    who: "Vet",   text: "Right, so today we've got Milo in for what looks like an itchy left flank again. Hi Amy, how's he been since the last visit?" },
  { t: 4,    who: "Owner", text: "Hi Doctor. He's been okay overall, but the scratching has come back over the last week. Mostly in the evenings." },
  { t: 12,   who: "Vet",   text: "Any change in food, washing powder, new walks?" },
  { t: 16,   who: "Owner", text: "Nothing different. He's still on the same kibble, and we walk the usual park." },
  { t: 22,   who: "Vet",   text: "Okay. Let's get him up on the table. I'll have a look at the skin. I can see the patch on the left flank, about six centimetres, quite red, a bit of self-trauma. No pustules though, no fleas visible." },
  { t: 38,   who: "Vet",   text: "Body condition is good — five out of nine. Weight today is thirty-two point six kilos, so basically stable. Temperature thirty-eight point four. Heart rate ninety-six, respiration twenty. Mucous membranes are pink, capillary refill under two seconds." },
  { t: 56,   who: "Vet",   text: "Right Amy, this looks like a recurrence of the atopic flare we treated in September. I'd like to put him back on Apoquel sixteen milligrams, one tablet by mouth once a day for fourteen days, and recheck in two weeks." },
  { t: 70,   who: "Owner", text: "That's the same as last time, right?" },
  { t: 73,   who: "Vet",   text: "Exactly. Same protocol. I'll also dispense an Elizabethan collar, medium, just in case he overdoes the licking. And let's add a skin scrape cytology today to rule out a secondary bacterial component." },
  { t: 86,   who: "Owner", text: "Sounds good." },
  { t: 88,   who: "Vet",   text: "Plan is: Apoquel fourteen days, recheck two weeks, cool compress as needed, call us if it gets worse before then." },
];

const DEMO_GENERATED = {
  title: "Skin recheck — recurrent atopic flare",
  vitals: [
    { label: "Weight",      value: "32.6", unit: "kg",  delta: "+0.2 kg" },
    { label: "Temperature", value: "38.4", unit: "°C",  delta: "" },
    { label: "Heart rate",  value: "96",   unit: "bpm", delta: "" },
    { label: "Resp. rate",  value: "20",   unit: "rpm", delta: "" },
    { label: "BCS",         value: "5",    unit: "/9",  delta: "stable" },
    { label: "MM / CRT",    value: "Pink",  unit: "<2s", delta: "" },
  ],
  diagnoses: [
    { name: "Atopic dermatitis — recurrent flare", code: "ICD-D-ATD-01", confidence: 0.92 },
    { name: "Rule out secondary pyoderma",         code: "ICD-D-PYO-02", confidence: 0.41 },
  ],
  soap: {
    S: "Owner reports recurrence of pruritus over the left flank for the past week, worse in the evenings. No change in diet, washing products, or walking environment. Otherwise eating, drinking and toileting normally.",
    O: "BCS 5/9. Wt 32.6 kg (+0.2). T 38.4°C. HR 96 bpm. RR 20. MM pink, CRT <2s. Erythematous patch ~6 cm on left flank with mild self-trauma; no pustules, no fleas observed.",
    A: "Recurrent atopic dermatitis flare, consistent with September presentation. Secondary bacterial involvement to be ruled out via cytology.",
    P: "Apoquel 16 mg PO q24h × 14 days. Skin scrape cytology today. Dispense E-collar (M). Cool compress prn. Recheck in 2 weeks. Owner advised to call sooner if worsening.",
  },
  orders: [
    { type: "service",    name: "Skin recheck consultation",    qty: 1,  price: 48.00 },
    { type: "service",    name: "Skin scrape cytology",         qty: 1,  price: 24.00 },
    { type: "medication", name: "Apoquel 16 mg",                qty: 14, price: 39.90, instructions: "1 tab PO q24h × 14d" },
    { type: "item",       name: "E-collar (M)",                 qty: 1,  price: 14.50 },
  ],
  followups: [
    { kind: "task",       label: "Schedule recheck appointment in 2 weeks" },
    { kind: "message",    label: "Send owner an SMS reminder 1 day before recheck" },
    { kind: "handout",    label: "Email atopic dermatitis care handout" },
  ],
};

const PAST_CONSULTS = [
  { id: "C-2421", date: "14 Mar 2026", time: "09:14", title: "Annual wellness exam",        vet: "Dr. Lindqvist", duration: "12:18", method: "AI scribe", template: "Wellness" },
  { id: "C-2380", date: "02 Feb 2026", time: "11:30", title: "Booster — DHPP",               vet: "Dr. Patel",     duration: "06:42", method: "AI scribe", template: "Vaccination" },
  { id: "C-2298", date: "11 Dec 2025", time: "10:05", title: "Blood panel — CBC + Chem-17",  vet: "Dr. Lindqvist", duration: "18:04", method: "AI scribe", template: "General" },
  { id: "C-2104", date: "19 Sep 2025", time: "15:40", title: "Skin irritation — left flank", vet: "Dr. Lindqvist", duration: "14:51", method: "AI scribe", template: "Dermatology" },
  { id: "C-1933", date: "08 Aug 2025", time: "08:50", title: "Post-dental recheck",          vet: "Dr. Patel",     duration: "07:22", method: "Manual",    template: "—" },
];

const AIStarCl = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z"/>
  </svg>
);

function fmtTimer(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// Catalog used by the omnibox to suggest orders / diagnoses / vitals
const CONSULT_CATALOG = [
  { kind: "order", subtype: "service",    label: "Consultation — recheck",        price: 48.00 },
  { kind: "order", subtype: "service",    label: "Skin scrape cytology",          price: 24.00 },
  { kind: "order", subtype: "service",    label: "DHPP booster vaccination",      price: 38.00 },
  { kind: "order", subtype: "service",    label: "Dental scale & polish",         price: 215.00 },
  { kind: "order", subtype: "service",    label: "CBC + Chem-17 blood panel",     price: 92.00 },
  { kind: "order", subtype: "medication", label: "Apoquel 16 mg",                 price: 39.90, instructions: "1 tab PO q24h × 14d" },
  { kind: "order", subtype: "medication", label: "Metacam 1.5 mg/ml oral susp.",  price: 22.50, instructions: "0.1 mg/kg PO q24h" },
  { kind: "order", subtype: "medication", label: "Synulox 250 mg",                price: 28.40, instructions: "1 tab PO q12h × 7d" },
  { kind: "order", subtype: "item",       label: "E-collar (M)",                  price: 14.50 },
  { kind: "order", subtype: "item",       label: "Hill's i/d 2 kg",               price: 19.80 },
  { kind: "diagnosis", code: "ICD-D-ATD-01", label: "Atopic dermatitis — recurrent flare" },
  { kind: "diagnosis", code: "ICD-D-PYO-02", label: "Secondary pyoderma" },
  { kind: "diagnosis", code: "ICD-D-OTI-03", label: "Otitis externa" },
  { kind: "diagnosis", code: "ICD-D-GAS-01", label: "Acute gastroenteritis" },
  { kind: "diagnosis", code: "ICD-D-DEN-04", label: "Periodontal disease — stage 2" },
  { kind: "vital", label: "Weight",      unit: "kg" },
  { kind: "vital", label: "Temperature", unit: "°C" },
  { kind: "vital", label: "Heart rate",  unit: "bpm" },
  { kind: "vital", label: "Resp. rate",  unit: "rpm" },
  { kind: "vital", label: "BCS",         unit: "/9" },
  { kind: "vital", label: "MM / CRT",    unit: "" },
];

const KIND_ICON = {
  order:     "generic-cash",
  diagnosis: "medical-stethoscope",
  vital:     "medical-heart",
};
const KIND_LABEL = { order: "Order", diagnosis: "Diagnosis", vital: "Vital" };

function joinSoap(soap) {
  if (!soap) return "";
  return [
    "S — Subjective\n" + soap.S,
    "O — Objective\n"  + soap.O,
    "A — Assessment\n" + soap.A,
    "P — Plan\n"       + soap.P,
  ].join("\n\n");
}

function ConsultationsTab({ pet, client }) {
  const [status, setStatus]       = React.useState("idle"); // idle | recording | paused | generating | filled
  const [elapsed, setElapsed]     = React.useState(0);
  const [transcript, setTranscript] = React.useState([]);
  const [template, setTemplate]   = React.useState("general");
  const [language, setLanguage]   = React.useState("en-GB");
  const [showLangMenu, setShowLangMenu] = React.useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = React.useState(false);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const transcriptRef = React.useRef(null);

  // Unified, always-editable form
  const [notes, setNotes]         = React.useState("");
  const [vitals, setVitals]       = React.useState([]);  // {label, value, unit}
  const [diagnoses, setDiagnoses] = React.useState([]);  // {label, code}
  const [orders, setOrders]       = React.useState([]);  // {subtype, label, qty, price, instructions}
  const [aiFilled, setAiFilled]   = React.useState(false);

  // Omnibox
  const [query, setQuery]         = React.useState("");
  const [omniFocus, setOmniFocus] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const omniRef = React.useRef(null);

  React.useEffect(() => {
    if (status !== "recording") return;
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  React.useEffect(() => {
    if (status !== "recording") return;
    const next = DEMO_TRANSCRIPT.find(c => c.t <= elapsed && !transcript.find(t => t.t === c.t));
    if (next) setTranscript(prev => [...prev, next]);
  }, [elapsed, status, transcript]);

  React.useEffect(() => {
    if (transcriptRef.current) transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
  }, [transcript.length]);

  React.useEffect(() => {
    if (!showLangMenu && !showTemplateMenu) return;
    const close = (e) => {
      if (!e.target.closest(".scribe-menu") && !e.target.closest(".scribe-menu-trigger")) {
        setShowLangMenu(false);
        setShowTemplateMenu(false);
      }
    };
    setTimeout(() => document.addEventListener("click", close), 0);
    return () => document.removeEventListener("click", close);
  }, [showLangMenu, showTemplateMenu]);

  const start  = () => { setStatus("recording"); setShowTranscript(true); };
  const pause  = () => setStatus("paused");
  const resume = () => setStatus("recording");
  const stop   = () => {
    setStatus("generating");
    setTimeout(() => {
      const g = DEMO_GENERATED;
      setNotes(joinSoap(g.soap));
      setVitals(g.vitals.map(v => ({ label: v.label, value: v.value, unit: v.unit })));
      setDiagnoses(g.diagnoses.map(d => ({ label: d.name, code: d.code })));
      setOrders(g.orders.map(o => ({ subtype: o.type, label: o.name, qty: o.qty, price: o.price, instructions: o.instructions })));
      setAiFilled(true);
      setStatus("filled");
    }, 1800);
  };
  const discardRecording = () => {
    setStatus("idle"); setElapsed(0); setTranscript([]); setShowTranscript(false);
  };

  const currentTemplate = SCRIBE_TEMPLATES.find(t => t.id === template);
  const currentLang     = SCRIBE_LANGUAGES.find(l => l.id === language);
  const currentPreset   = TEMPLATE_PRESETS[template] || TEMPLATE_PRESETS.general;

  const applyTemplate = (id) => {
    const preset = TEMPLATE_PRESETS[id] || TEMPLATE_PRESETS.general;
    setTemplate(id);
    setShowTemplateMenu(false);
    setNotes(preset.notes);
    setVitals(preset.vitals.map(v => ({ ...v })));
    setDiagnoses(preset.diagnoses.map(d => ({ ...d })));
    setOrders(preset.orders.map(o => ({ ...o })));
    setAiFilled(false);
  };

  const isRecording = status === "recording" || status === "paused";

  // Omnibox suggestions
  const suggestions = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONSULT_CATALOG.slice(0, 6);
    return CONSULT_CATALOG
      .filter(s => s.label.toLowerCase().includes(q) || (s.code || "").toLowerCase().includes(q))
      .slice(0, 8);
  }, [query]);

  const addItem = (s) => {
    if (s.kind === "order") {
      setOrders(o => [...o, { subtype: s.subtype, label: s.label, qty: 1, price: s.price, instructions: s.instructions }]);
    } else if (s.kind === "diagnosis") {
      setDiagnoses(d => [...d, { label: s.label, code: s.code }]);
    } else if (s.kind === "vital") {
      setVitals(v => [...v, { label: s.label, value: "", unit: s.unit }]);
    }
    setQuery(""); setOmniFocus(false);
    if (omniRef.current) omniRef.current.blur();
  };

  const startVoice = () => {
    if (listening) { setListening(false); return; }
    setListening(true);
    setTimeout(() => {
      const match = CONSULT_CATALOG.find(s => s.label === "Apoquel 16 mg");
      if (match) addItem(match);
      setListening(false);
    }, 1600);
  };

  const removeOrder = (i) => setOrders(o => o.filter((_, idx) => idx !== i));
  const removeDx    = (i) => setDiagnoses(d => d.filter((_, idx) => idx !== i));
  const removeVital = (i) => setVitals(v => v.filter((_, idx) => idx !== i));
  const updateOrderQty = (i, qty) => setOrders(o => o.map((x, idx) => idx === i ? { ...x, qty: Math.max(1, qty | 0) } : x));
  const updateVitalValue = (i, value) => setVitals(v => v.map((x, idx) => idx === i ? { ...x, value } : x));

  const ordersTotal = orders.reduce((s, o) => s + o.price * o.qty, 0);
  const filled = notes.trim().length > 0 || vitals.length > 0 || diagnoses.length > 0 || orders.length > 0;

  return (
    <div className="cons-tab">
      {/* ---------- AI Scribe header strip ---------- */}
      <section className={"scribe-bar scribe-bar--" + status}>
        <div className="scribe-bar__bg" />
        <div className="scribe-bar__inner">
          <div className="scribe-bar__brand">
            <span className="scribe-hero__star"><AIStarCl size={12} /></span>
            <span className="scribe-hero__brand-text">AI Scribe</span>
            <span className="scribe-hero__beta">Beta</span>
          </div>

          {status === "idle" && (
            <>
              <button className="scribe-record scribe-record--sm" onClick={start} title="Start recording">
                <span className="scribe-record__pulse" />
                <span className="scribe-record__dot" />
                <span className="scribe-record__label">Start recording</span>
              </button>
              <button className="scribe-bar__alt">
                <IconCl name="interface-upload" size={12} /> Upload audio
              </button>
            </>
          )}

          {isRecording && (
            <div className="scribe-bar__rec">
              <span className={"scribe-rec__live" + (status === "paused" ? " scribe-rec__live--paused" : "")}>
                <span className="scribe-rec__live-dot" />
                {status === "recording" ? "Recording" : "Paused"}
              </span>
              <span className="scribe-rec__timer">{fmtTimer(elapsed)}</span>
              <div className={"scribe-bar__wave" + (status === "paused" ? " scribe-rec__wave--paused" : "")}>
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className="scribe-rec__bar" style={{ animationDelay: (i * 0.07) + "s" }} />
                ))}
              </div>
              {status === "recording" ? (
                <button className="scribe-ctrl scribe-ctrl--pause" onClick={pause} title="Pause">
                  <IconCl name="interface-pause" size={14} /> Pause
                </button>
              ) : (
                <button className="scribe-ctrl scribe-ctrl--resume" onClick={resume} title="Resume">
                  <IconCl name="interface-play" size={14} /> Resume
                </button>
              )}
              <button className="scribe-ctrl scribe-ctrl--stop" onClick={stop} title="Finish & generate">
                <span className="scribe-ctrl__stop-square" /> Finish &amp; fill notes
              </button>
              <button className="scribe-ctrl scribe-ctrl--ghost" onClick={discardRecording} title="Discard recording">
                <IconCl name="interface-close" size={12} />
              </button>
            </div>
          )}

          {status === "generating" && (
            <div className="scribe-bar__gen">
              <span className="scribe-gen__spin" />
              <span className="scribe-bar__gen-text">Generating notes from {fmtTimer(elapsed)} of audio…</span>
            </div>
          )}

          {status === "filled" && (
            <div className="scribe-bar__filled">
              <span className="scribe-review__check"><IconCl name="interface-checked-small" size={12} /></span>
              <span className="scribe-bar__filled-text">Filled by AI Scribe — review and edit below.</span>
              <button className="scribe-bar__alt" onClick={() => setShowTranscript(s => !s)}>
                <IconCl name="interface-message" size={12} /> {showTranscript ? "Hide" : "View"} transcript
              </button>
            </div>
          )}

          {/* Right-side controls — template / language / patient */}
          <div className="scribe-bar__right">
            <div className="scribe-setup-item">
              <button className="scribe-setup-item__btn scribe-menu-trigger"
                      onClick={(e) => { e.stopPropagation(); setShowTemplateMenu(o => !o); setShowLangMenu(false); }}>
                <IconCl name={currentTemplate.icon} size={12} />
                {currentTemplate.label}
                <IconCl name="interface-dropdown-small" size={9} />
              </button>
              {showTemplateMenu && (
                <div className="scribe-menu">
                  {SCRIBE_TEMPLATES.map(t => (
                    <button key={t.id} className={"scribe-menu__item" + (t.id === template ? " scribe-menu__item--active" : "")}
                            onClick={() => applyTemplate(t.id)}>
                      <IconCl name={t.icon} size={12} />
                      {t.label}
                      {t.id === template && <IconCl name="interface-checked-small" size={11} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="scribe-setup-item">
              <button className="scribe-setup-item__btn scribe-menu-trigger"
                      onClick={(e) => { e.stopPropagation(); setShowLangMenu(o => !o); setShowTemplateMenu(false); }}>
                <IconCl name="interface-globe" size={12} />
                {currentLang.label}
                <IconCl name="interface-dropdown-small" size={9} />
              </button>
              {showLangMenu && (
                <div className="scribe-menu scribe-menu--right">
                  {SCRIBE_LANGUAGES.map(l => (
                    <button key={l.id} className={"scribe-menu__item" + (l.id === language ? " scribe-menu__item--active" : "")}
                            onClick={() => { setLanguage(l.id); setShowLangMenu(false); }}>
                      {l.label}
                      {l.id === language && <IconCl name="interface-checked-small" size={11} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="scribe-bar__patient">
              For <strong>{pet.name}</strong> · {pet.species}{pet.breed ? " · " + pet.breed : ""} · {pet.age}
            </span>
          </div>
        </div>

        {/* Live transcript drawer */}
        {(isRecording || (status === "filled" && showTranscript)) && transcript.length > 0 && (
          <div className="scribe-rec__transcript scribe-rec__transcript--inline" ref={transcriptRef}>
            <div className="scribe-rec__transcript-head">
              <IconCl name="interface-message" size={11} /> {isRecording ? "Live transcript" : "Transcript"}
              <span className="scribe-rec__transcript-meta">{transcript.length} segment{transcript.length !== 1 ? "s" : ""}</span>
            </div>
            {transcript.map((seg, i) => (
              <div key={i} className={"scribe-tx " + (seg.who === "Vet" ? "scribe-tx--vet" : "scribe-tx--owner")}>
                <span className="scribe-tx__who">{seg.who}</span>
                <span className="scribe-tx__text">{seg.text}</span>
              </div>
            ))}
            {status === "recording" && (
              <div className="scribe-tx scribe-tx--typing">
                <span className="scribe-tx__dots"><i /><i /><i /></span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ---------- Unified consultation form ---------- */}
      <section className="uc-card">
        <div className="uc-block">
          <div className="uc-block__head">
            <span className="uc-block__title">Clinical notes</span>
            <span className="uc-block__meta">
              {aiFilled
                ? <><span className="uc-ai-pill"><AIStarCl size={9} /> AI</span> Edit before signing off</>
                : "Type freely or let AI Scribe fill from audio"}
            </span>
          </div>
          <textarea
            className="uc-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={currentPreset.notesPlaceholder}
            rows={notes ? Math.max(8, notes.split("\n").length + 2) : 8}
          />
        </div>

        {/* Omnibox — add an order, diagnosis, or vital */}
        <div className="uc-block">
          <div className={"uc-omni" + (omniFocus ? " uc-omni--open" : "") + (listening ? " uc-omni--listening" : "")}>
            <IconCl name="interface-search" size={13} />
            <input
              ref={omniRef}
              className="uc-omni__input"
              placeholder="Add an order, diagnosis, or vital…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setOmniFocus(true)}
              onBlur={() => setTimeout(() => setOmniFocus(false), 150)}
            />
            <button
              className={"uc-omni__voice" + (listening ? " uc-omni__voice--on" : "")}
              onClick={startVoice}
              title={listening ? "Stop voice input" : "Add by voice"}
            >
              <IconCl name="interface-microphone" size={13} />
              {listening ? <span className="uc-omni__voice-dot" /> : null}
            </button>

            {omniFocus && (
              <div className="uc-omni__menu">
                <div className="uc-omni__menu-head">
                  {query.trim() ? "Matches" : "Suggested"}
                  <span className="uc-omni__menu-hint">Click to add · Voice or type</span>
                </div>
                {suggestions.length === 0 && (
                  <div className="uc-omni__empty">No matches. Press Enter to create a custom item.</div>
                )}
                {suggestions.map((s, i) => (
                  <button key={i} className="uc-omni__row" onMouseDown={(e) => { e.preventDefault(); addItem(s); }}>
                    <span className={"uc-omni__kind uc-omni__kind--" + s.kind}>
                      <IconCl name={KIND_ICON[s.kind]} size={11} />
                      {KIND_LABEL[s.kind]}
                    </span>
                    <span className="uc-omni__label">{s.label}</span>
                    {s.kind === "diagnosis" && <span className="scribe-dx__code">{s.code}</span>}
                    {s.kind === "order" && <span className="scribe-order__price">{fmtMoney(s.price)}</span>}
                    {s.kind === "vital" && s.unit && <span className="uc-omni__unit">{s.unit}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          {listening && (
            <div className="uc-listening">
              <span className="uc-listening__dot" /> Listening… speak an order, diagnosis, or vital.
            </div>
          )}
        </div>

        {/* Vitals */}
        <div className="uc-block">
          <div className="uc-block__head">
            <span className="uc-block__title">Vitals</span>
            <span className="uc-block__meta">{vitals.length} recorded</span>
          </div>
          {vitals.length === 0 ? (
            <div className="uc-empty">No vitals yet. Add one above or start a recording.</div>
          ) : (
            <div className="uc-vitals">
              {vitals.map((v, i) => (
                <div key={i} className="uc-vital">
                  <div className="uc-vital__head">
                    <span className="uc-vital__label">{v.label}</span>
                    <button className="uc-x" onClick={() => removeVital(i)} title="Remove"><IconCl name="interface-close-small" size={10} /></button>
                  </div>
                  <div className="uc-vital__row">
                    <input
                      className="uc-vital__input"
                      value={v.value}
                      onChange={(e) => updateVitalValue(i, e.target.value)}
                      placeholder="—"
                    />
                    {v.unit && <span className="uc-vital__unit">{v.unit}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diagnoses */}
        <div className="uc-block">
          <div className="uc-block__head">
            <span className="uc-block__title">Diagnoses</span>
            <span className="uc-block__meta">{diagnoses.length} added</span>
          </div>
          {diagnoses.length === 0 ? (
            <div className="uc-empty">No diagnoses yet.</div>
          ) : (
            <div className="uc-list">
              {diagnoses.map((d, i) => (
                <div key={i} className="uc-row">
                  <IconCl name="medical-stethoscope" size={12} />
                  <span className="uc-row__label">{d.label}</span>
                  {d.code && <span className="scribe-dx__code">{d.code}</span>}
                  <button className="uc-x" onClick={() => removeDx(i)} title="Remove"><IconCl name="interface-close-small" size={10} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div className="uc-block">
          <div className="uc-block__head">
            <span className="uc-block__title">Orders</span>
            <span className="uc-block__meta">
              {orders.length} {orders.length === 1 ? "item" : "items"}{orders.length > 0 && <> · Total <strong>{fmtMoney(ordersTotal)}</strong></>}
            </span>
          </div>
          {orders.length === 0 ? (
            <div className="uc-empty">No orders yet.</div>
          ) : (
            <div className="uc-list">
              {orders.map((o, i) => (
                <div key={i} className="uc-row uc-row--order">
                  <span className={"cl-order-type cl-order-type--" + o.subtype}>{o.subtype}</span>
                  <div className="uc-row__body">
                    <div className="cl-order-name">{o.label}</div>
                    {o.instructions && <div className="cl-order-sub">{o.instructions}</div>}
                  </div>
                  <input
                    className="uc-qty"
                    type="number"
                    min={1}
                    value={o.qty}
                    onChange={(e) => updateOrderQty(i, parseInt(e.target.value, 10))}
                    title="Quantity"
                  />
                  <span className="scribe-order__price">{fmtMoney(o.price * o.qty)}</span>
                  <button className="uc-x" onClick={() => removeOrder(i)} title="Remove"><IconCl name="interface-close-small" size={10} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Sticky footer ---------- */}
      <div className="scribe-review-footer">
        {filled && (
          <button className="n-button n-button--s" onClick={() => { setNotes(""); setVitals([]); setDiagnoses([]); setOrders([]); setAiFilled(false); }}>
            <IconCl name="interface-delete" size={11} /> Clear
          </button>
        )}
        <span style={{ flex: 1 }} />
        <span className="scribe-review-footer__summary">
          <strong>{orders.length}</strong> order{orders.length !== 1 ? "s" : ""} · <strong>{diagnoses.length}</strong> diagnos{diagnoses.length !== 1 ? "es" : "is"} · <strong>{vitals.length}</strong> vital{vitals.length !== 1 ? "s" : ""}
        </span>
        <button className="n-button n-button--s" disabled={!filled}><IconCl name="interface-download" size={11} /> Save draft</button>
        <button className="n-button n-button--primary n-button--s" disabled={!filled}>
          <IconCl name="interface-checked-small" size={11} style={{ color: "#fff" }} />
          Sign off &amp; add to chart
        </button>
      </div>

    </div>
  );
}

// =====================================================================
// BILLING TAB
// =====================================================================
function fmtMoney(n) {
  return "£" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function BillingTab({ client, pet }) {
  const [unpaidSel, setUnpaidSel]         = React.useState(() => new Set());
  const [refundSel, setRefundSel]         = React.useState(() => new Set());
  const [billOpen, setBillOpen]           = React.useState(false);
  const [refundOpen, setRefundOpen]       = React.useState(false);
  const [toast, setToast]                 = React.useState(null);

  const unpaidItems     = BILLING_UNPAID;
  const refundItems     = BILLING_REFUNDABLE;
  const invoices        = BILLING_INVOICES;

  const selectedUnpaid  = unpaidItems.filter(i => unpaidSel.has(i.id));
  const selectedRefund  = refundItems.filter(i => refundSel.has(i.id));
  const unpaidTotal     = selectedUnpaid.reduce((s, i) => s + i.amount, 0);
  const refundTotal     = selectedRefund.reduce((s, i) => s + i.amount, 0);

  const toggle = (set, setter) => (id) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id); else next.add(id);
    setter(next);
  };
  const toggleAll = (items, set, setter) => () => {
    if (items.every(i => set.has(i.id))) setter(new Set());
    else setter(new Set(items.map(i => i.id)));
  };

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2800); };

  return (
    <div className="bl-tab">
      {/* ----- Unpaid items ----- */}
      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">Unpaid items</div>
            <div className="bl-section__sub">Items added during recent visits awaiting payment.</div>
          </div>
          <div className="bl-section__actions">
            {unpaidSel.size > 0 && (
              <span className="bl-sel-summary">
                {unpaidSel.size} selected · <strong>{fmtMoney(unpaidTotal)}</strong>
              </span>
            )}
            <button
              className="n-button n-button--primary n-button--s"
              disabled={unpaidSel.size === 0}
              onClick={() => setBillOpen(true)}
            >
              <IconCl name="generic-cash" size={11} style={{ color: "#fff" }} />
              Bill {unpaidSel.size > 0 ? `(${unpaidSel.size})` : ""}
            </button>
          </div>
        </header>
        <BillingTable
          columns={[
            { key: "_sel",    label: "",          w: 32 },
            { key: "date",    label: "Date",      w: 90 },
            { key: "desc",    label: "Description", min: 180 },
            { key: "sku",     label: "SKU",       w: 84 },
            { key: "vet",     label: "Added by",  w: 110 },
            { key: "qty",     label: "Qty",       w: 44,  align: "right" },
            { key: "unit",    label: "Unit",      w: 70,  align: "right", money: true },
            { key: "amount",  label: "Amount",    w: 88, align: "right", money: true, strong: true },
          ]}
          items={unpaidItems}
          selected={unpaidSel}
          onToggle={toggle(unpaidSel, setUnpaidSel)}
          onToggleAll={toggleAll(unpaidItems, unpaidSel, setUnpaidSel)}
          empty="No unpaid items."
        />
      </section>

      {/* ----- Refundable paid items ----- */}
      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">Refundable items</div>
            <div className="bl-section__sub">Paid items eligible for refund. Stock items can be returned to inventory.</div>
          </div>
          <div className="bl-section__actions">
            {refundSel.size > 0 && (
              <span className="bl-sel-summary">
                {refundSel.size} selected · <strong>{fmtMoney(refundTotal)}</strong>
              </span>
            )}
            <button
              className="n-button n-button--s"
              disabled={refundSel.size === 0}
              onClick={() => setRefundOpen(true)}
            >
              <IconCl name="interface-undo" size={11} />
              Refund {refundSel.size > 0 ? `(${refundSel.size})` : ""}
            </button>
          </div>
        </header>
        <BillingTable
          columns={[
            { key: "_sel",     label: "",          w: 32 },
            { key: "date",     label: "Paid",      w: 90 },
            { key: "desc",     label: "Description", min: 160 },
            { key: "sku",      label: "SKU",       w: 84 },
            { key: "paidVia",  label: "Method",    w: 150 },
            { key: "invoice",  label: "Invoice",   w: 95 },
            { key: "qty",      label: "Qty",       w: 44,  align: "right" },
            { key: "amount",   label: "Amount",    w: 88, align: "right", money: true, strong: true },
          ]}
          items={refundItems}
          selected={refundSel}
          onToggle={toggle(refundSel, setRefundSel)}
          onToggleAll={toggleAll(refundItems, refundSel, setRefundSel)}
          empty="No refundable items."
        />
      </section>

      {/* ----- Invoices ----- */}
      <section className="bl-section">
        <header className="bl-section__head">
          <div>
            <div className="bl-section__title">Invoices</div>
            <div className="bl-section__sub">All invoices for {client.name}{pet ? ` · ${pet.name}` : ""}.</div>
          </div>
        </header>
        <div className="bl-table">
          <div className="bl-row bl-row--head">
            <div style={{ width: 130 }}>Invoice</div>
            <div style={{ width: 110 }}>Issued</div>
            <div style={{ width: 110 }}>Due</div>
            <div style={{ width: 60, textAlign: "right" }}>Items</div>
            <div style={{ flex: 1, textAlign: "right" }}>Amount</div>
            <div style={{ width: 110 }}>Status</div>
            <div style={{ width: 64 }} />
          </div>
          {invoices.map(inv => (
            <div key={inv.id} className="bl-row">
              <div style={{ width: 130, fontWeight: 500 }}>{inv.id}</div>
              <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{inv.date}</div>
              <div style={{ width: 110, color: "var(--n-color-text-weak)" }}>{inv.due}</div>
              <div style={{ width: 60, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{inv.items}</div>
              <div style={{ flex: 1, textAlign: "right", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{fmtMoney(inv.amount)}</div>
              <div style={{ width: 110 }}><InvoiceStatusPill status={inv.status} /></div>
              <div style={{ width: 64, display: "flex", justifyContent: "flex-end", gap: 4 }}>
                <button className="bl-icon-btn" title="View"><IconCl name="interface-external-link" size={12} /></button>
                <button className="bl-icon-btn" title="Download"><IconCl name="interface-download" size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {billOpen && (
        <BillModal
          items={selectedUnpaid}
          total={unpaidTotal}
          client={client}
          onClose={() => setBillOpen(false)}
          onConfirm={(method) => {
            setBillOpen(false);
            setUnpaidSel(new Set());
            flash(`Charged ${fmtMoney(unpaidTotal)} via ${method}.`);
          }}
        />
      )}
      {refundOpen && (
        <RefundModal
          items={selectedRefund}
          total={refundTotal}
          onClose={() => setRefundOpen(false)}
          onConfirm={({ method, restockCount }) => {
            setRefundOpen(false);
            setRefundSel(new Set());
            flash(`Refunded ${fmtMoney(refundTotal)} to ${method}${restockCount ? ` · ${restockCount} item${restockCount > 1 ? "s" : ""} returned to stock` : ""}.`);
          }}
        />
      )}
      {toast && <div className="bl-toast">{toast}</div>}
    </div>
  );
}

function BillingTable({ columns, items, selected, onToggle, onToggleAll, empty }) {
  const allSelected = items.length > 0 && items.every(i => selected.has(i.id));
  const someSelected = items.some(i => selected.has(i.id)) && !allSelected;
  const headRef = React.useRef(null);
  React.useEffect(() => { if (headRef.current) headRef.current.indeterminate = someSelected; }, [someSelected]);

  return (
    <div className="bl-table">
      <div className="bl-row bl-row--head">
        {columns.map(c => (
          <div key={c.key}
               style={{
                 width: c.key === "_sel" ? c.w : (c.w || undefined),
                 minWidth: c.min || undefined,
                 flex: c.w ? "none" : 1,
                 textAlign: c.align || "left",
                 display: "flex", justifyContent: c.key === "_sel" ? "center" : (c.align === "right" ? "flex-end" : "flex-start"),
               }}>
            {c.key === "_sel" ? (
              <input ref={headRef} type="checkbox" checked={allSelected} onChange={onToggleAll} className="bl-check" />
            ) : c.label}
          </div>
        ))}
      </div>
      {items.length === 0 && <div className="bl-row bl-row--empty">{empty}</div>}
      {items.map(it => {
        const isSel = selected.has(it.id);
        return (
          <div key={it.id} className={"bl-row" + (isSel ? " bl-row--sel" : "")} onClick={() => onToggle(it.id)}>
            {columns.map(c => {
              if (c.key === "_sel") {
                return (
                  <div key={c.key} style={{ width: c.w, display: "flex", justifyContent: "center" }} onClick={e => e.stopPropagation()}>
                    <input type="checkbox" checked={isSel} onChange={() => onToggle(it.id)} className="bl-check" />
                  </div>
                );
              }
              const v = it[c.key];
              const text = c.money ? fmtMoney(v) : v;
              return (
                <div key={c.key}
                     title={typeof v === "string" ? v : undefined}
                     style={{
                       width: c.w || undefined,
                       minWidth: c.min || undefined,
                       flex: c.w ? "none" : 1,
                       textAlign: c.align || "left",
                       fontVariantNumeric: c.money || c.align === "right" ? "tabular-nums" : undefined,
                       fontWeight: c.strong ? 500 : undefined,
                       color: c.strong ? "var(--n-color-text)" : "var(--n-color-text-weak)",
                       overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                     }}>{text}</div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function InvoiceStatusPill({ status }) {
  const map = {
    paid:    { label: "Paid",    cls: "bl-stat--paid"    },
    pending: { label: "Pending", cls: "bl-stat--pending" },
    overdue: { label: "Overdue", cls: "bl-stat--overdue" },
    draft:   { label: "Draft",   cls: "bl-stat--draft"   },
  };
  const s = map[status] || map.draft;
  return <span className={"bl-stat " + s.cls}><span className="bl-stat__dot" />{s.label}</span>;
}

// ---------- Modals ----------
function ModalShell({ title, sub, onClose, children, footer, width = 520 }) {
  React.useEffect(() => {
    const k = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="bl-modal-backdrop" onClick={onClose}>
      <div className="bl-modal" style={{ width }} onClick={e => e.stopPropagation()}>
        <header className="bl-modal__head">
          <div>
            <div className="bl-modal__title">{title}</div>
            {sub && <div className="bl-modal__sub">{sub}</div>}
          </div>
          <button className="bl-icon-btn" onClick={onClose} aria-label="Close"><IconCl name="interface-close" size={13} /></button>
        </header>
        <div className="bl-modal__body">{children}</div>
        {footer && <div className="bl-modal__footer">{footer}</div>}
      </div>
    </div>
  );
}

function BillModal({ items, total, client, onClose, onConfirm }) {
  const [step, setStep]     = React.useState(1);
  const [method, setMethod] = React.useState(null);
  const methods = [
    { id: "card",      label: "Card",      sub: "Tap, chip, or saved card",            icon: "generic-credit-card" },
    { id: "insurance", label: "Insurance", sub: "Direct claim · Petplan on file",      icon: "interface-shield" },
    { id: "cash",      label: "Cash",      sub: "Open drawer and record payment",      icon: "generic-cash" },
  ];

  return (
    <ModalShell
      title={step === 1 ? "Choose payment method" : "Confirm payment"}
      sub={`${items.length} item${items.length > 1 ? "s" : ""} · ${fmtMoney(total)} · ${client.name}`}
      onClose={onClose}
      footer={
        step === 1 ? (
          <>
            <button className="n-button n-button--s" onClick={onClose}>Cancel</button>
            <button className="n-button n-button--primary n-button--s"
                    disabled={!method}
                    onClick={() => setStep(2)}>Continue</button>
          </>
        ) : (
          <>
            <button className="n-button n-button--s" onClick={() => setStep(1)}>Back</button>
            <button className="n-button n-button--primary n-button--s"
                    onClick={() => onConfirm(methods.find(m => m.id === method).label)}>
              Charge {fmtMoney(total)}
            </button>
          </>
        )
      }
    >
      {step === 1 && (
        <div className="bl-method-list">
          {methods.map(m => (
            <button key={m.id}
                    className={"bl-method" + (method === m.id ? " bl-method--sel" : "")}
                    onClick={() => setMethod(m.id)}>
              <span className="bl-method__icon"><IconCl name={m.icon} size={16} /></span>
              <span className="bl-method__body">
                <span className="bl-method__label">{m.label}</span>
                <span className="bl-method__sub">{m.sub}</span>
              </span>
              {method === m.id && <IconCl name="interface-checked-small" size={13} />}
            </button>
          ))}
        </div>
      )}
      {step === 2 && (
        <>
          <div className="bl-summary">
            {items.map(i => (
              <div key={i.id} className="bl-summary__row">
                <span className="bl-summary__desc">{i.desc} <span className="bl-summary__qty">× {i.qty}</span></span>
                <span className="bl-summary__amt">{fmtMoney(i.amount)}</span>
              </div>
            ))}
            <div className="bl-summary__total">
              <span>Total</span><span>{fmtMoney(total)}</span>
            </div>
          </div>
          <div className="bl-confirm-method">
            <IconCl name={methods.find(m => m.id === method).icon} size={14} />
            <span>{methods.find(m => m.id === method).label} · {methods.find(m => m.id === method).sub}</span>
          </div>
        </>
      )}
    </ModalShell>
  );
}

function RefundModal({ items, total, onClose, onConfirm }) {
  const [method, setMethod]   = React.useState("original");
  const [restock, setRestock] = React.useState(() => new Set(items.filter(i => i.restock).map(i => i.id)));
  const [reason, setReason]   = React.useState("");

  const restockable = items.filter(i => i.sku && i.sku !== "—");
  const toggleRestock = (id) => {
    const n = new Set(restock);
    if (n.has(id)) n.delete(id); else n.add(id);
    setRestock(n);
  };
  const methodLabel = method === "original" ? "original payment method" : method === "store" ? "store credit" : "cash";

  return (
    <ModalShell
      title="Issue refund"
      sub={`${items.length} item${items.length > 1 ? "s" : ""} · ${fmtMoney(total)}`}
      onClose={onClose}
      width={560}
      footer={
        <>
          <button className="n-button n-button--s" onClick={onClose}>Cancel</button>
          <button className="n-button n-button--primary n-button--s"
                  onClick={() => onConfirm({ method: methodLabel, restockCount: restock.size })}>
            Refund {fmtMoney(total)}
          </button>
        </>
      }
    >
      <div className="bl-modal__group">
        <div className="bl-modal__label">Refund to</div>
        <div className="bl-radio-row">
          {[
            { id: "original", label: "Original payment" },
            { id: "store",    label: "Store credit"     },
            { id: "cash",     label: "Cash"             },
          ].map(opt => (
            <label key={opt.id} className={"bl-radio" + (method === opt.id ? " bl-radio--sel" : "")}>
              <input type="radio" name="refund-method" value={opt.id}
                     checked={method === opt.id} onChange={() => setMethod(opt.id)} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {restockable.length > 0 && (
        <div className="bl-modal__group">
          <div className="bl-modal__label">Return to stock</div>
          <div className="bl-restock">
            {restockable.map(i => (
              <label key={i.id} className="bl-restock__row">
                <input type="checkbox" checked={restock.has(i.id)} onChange={() => toggleRestock(i.id)} className="bl-check" />
                <span className="bl-restock__desc">{i.desc}</span>
                <span className="bl-restock__sku">{i.sku} · qty {i.qty}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="bl-modal__group">
        <div className="bl-modal__label">Reason (optional)</div>
        <textarea
          className="bl-textarea"
          rows={2}
          placeholder="Why is this refund being issued?"
          value={reason}
          onChange={e => setReason(e.target.value)}
        />
      </div>
    </ModalShell>
  );
}

window.ClientsPage = ClientsPage;
window.ClientDetailPage = ClientDetailPage;
