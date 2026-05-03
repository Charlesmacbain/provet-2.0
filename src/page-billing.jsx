/* global React */
const { Icon: IconB, Avatar: AvatarB, Badge: BadgeB } = window.PROVET_PRIM;

// ---------------- BILLING PEEK PANEL ----------------
function BillingPeekPanel({ row, isInvoice, onClose, onPay }) {
  const borderB = "1px solid var(--n-color-border-weaker, #ECECEC)";

  const infoRow = (icon, label, value) => value != null ? (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "4px 0" }}>
      <IconB name={icon} size={13} style={{ color: "var(--n-color-text-weaker)", flex: "none", marginTop: 1 }} />
      <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)", minWidth: 70 }}>{label}</span>
      <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text)", lineHeight: 1.4, flex: 1, textAlign: "right" }}>{value}</span>
    </div>
  ) : null;

  const title = isInvoice ? row.id : row.desc;
  const subtitle = isInvoice ? row.patientName : row.patientName;
  const initials = (subtitle || "?")[0];

  const total = isInvoice ? row.total : row.qty * row.price;
  const fmt = (n) => "£" + n.toFixed(2);

  return (
    <div style={{
      width: 320, flexShrink: 0,
      border: borderB,
      borderRadius: 8,
      display: "flex", flexDirection: "column",
      background: "#fff", height: "100%", overflow: "hidden",
    }}>
      {/* Panel header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 12px", borderBottom: borderB, flexShrink: 0,
      }}>
        <AvatarB initials={initials} color="info" size="s" />
        <span style={{ fontWeight: 600, fontSize: 'var(--n-font-size-body)', flex: 1, minWidth: 0 }} className="truncate">{title}</span>
        {!isInvoice && !row.paid && (
          <button
            onClick={onPay}
            className="n-button n-button--s n-button--primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontWeight: 500, flexShrink: 0 }}
          >
            <IconB name="generic-cash" size={11} style={{ color: "#fff" }} />
            Pay
          </button>
        )}
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--n-color-text-weaker)", display: "flex", alignItems: "center", flexShrink: 0 }}
        >
          <IconB name="interface-close" size={13} />
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ overflow: "auto", flex: 1, padding: "12px" }}>
        {/* Status pill */}
        <div style={{ marginBottom: 12 }}>
          {isInvoice ? (
            <span style={{
              background: "var(--n-color-status-info-weak, #E0EBFF)",
              color: "var(--n-color-text-info, #1F6FEB)",
              padding: "2px 7px", borderRadius: 4, fontSize: 'var(--n-font-size-body)', fontWeight: 500,
            }}>{row.method}</span>
          ) : row.paid ? (
            <span style={{
              background: "var(--n-color-status-success-weak, #DEF7E5)",
              color: "var(--n-color-text-success, #207843)",
              padding: "2px 7px", borderRadius: 4, fontSize: 'var(--n-font-size-body)', fontWeight: 500,
            }}>Paid · {row.invoice}</span>
          ) : (
            <span style={{
              background: "var(--n-color-status-warning-weak, #FEF3C7)",
              color: "var(--n-color-text-warning, #B45309)",
              padding: "2px 7px", borderRadius: 4, fontSize: 'var(--n-font-size-body)', fontWeight: 500,
            }}>Unpaid</span>
          )}
        </div>

        {isInvoice ? (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>Invoice</div>
              {infoRow("user-single", "Patient", row.patientName)}
              {infoRow("interface-time", "Date", row.date)}
              {infoRow("navigation-catalog", "Items", row.items)}
              {infoRow("interface-tag", "Method", row.method)}
            </div>
            <div style={{
              padding: "10px 12px",
              background: "var(--n-color-surface-hover, #FAFAF9)",
              borderRadius: 6,
              border: "1px solid var(--n-color-border-weaker, #ECECEC)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>Charge</div>
              {infoRow("user-single", "Patient", row.patientName)}
              {infoRow("interface-time", "Date", row.date)}
              {infoRow("navigation-catalog", "Item", row.desc)}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--n-color-text-weaker)", marginBottom: 6 }}>Amount</div>
              {infoRow("interface-add", "Qty", row.qty)}
              {infoRow("generic-cash", "Unit price", fmt(row.price))}
            </div>
            <div style={{
              padding: "10px 12px",
              background: "var(--n-color-surface-hover, #FAFAF9)",
              borderRadius: 6,
              border: "1px solid var(--n-color-border-weaker, #ECECEC)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500 }}>Total</span>
              <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(total)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ---------------- BILLING PAGE (Notion-style table, mirrors Clients) ----------------
function BillingPage() {
  const billing = window.PROVET_BILLING.useBilling();
  const [view, setView] = React.useState("unpaid"); // unpaid | all | invoices
  const [hoveredId, setHoveredId] = React.useState(null);
  const [peeked, setPeeked] = React.useState(null);
  const [payOpen, setPayOpen] = React.useState(false);
  const [payTarget, setPayTarget] = React.useState(null);
  const [paid, setPaid] = React.useState(null);

  const charges = billing.charges;
  const unpaid = charges.filter(c => !c.paid);
  const invoices = billing.invoices;

  const isInvoiceView = view === "invoices";
  const list = isInvoiceView
    ? [...invoices].reverse()
    : view === "all" ? charges : unpaid;

  const headerIcon = { color: "var(--n-color-text-weaker)", flex: "none" };
  const cellPad = "8px 12px";
  const borderB = "1px solid var(--n-color-border-weaker, #ECECEC)";

  const COLUMN_DEFS = React.useMemo(() => isInvoiceView ? [
    { key: "id",      label: "Invoice", icon: <span style={{ fontFamily: 'var(--n-font-family)', fontSize: 'var(--n-font-size-body)', fontWeight: 600, ...headerIcon }}>Aa</span>, getSort: r => r.id },
    { key: "patient", label: "Patient", icon: <IconB name="user-single" size={12} style={headerIcon} />,                    getSort: r => (r.patientName || "").toLowerCase() },
    { key: "date",    label: "Date",    icon: <IconB name="interface-time" size={12} style={headerIcon} />,                 getSort: r => r.date },
    { key: "items",   label: "Items",   icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>,      getSort: r => r.items },
    { key: "method",  label: "Method",  icon: <IconB name="interface-tag" size={12} style={headerIcon} />,                  getSort: r => r.method },
    { key: "total",   label: "Total",   icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>,      getSort: r => r.total },
  ] : [
    { key: "patient", label: "Patient", icon: <IconB name="user-single" size={12} style={headerIcon} />,                    getSort: r => (r.patientName || "").toLowerCase() },
    { key: "item",    label: "Item",    icon: <span style={{ fontFamily: 'var(--n-font-family)', fontSize: 'var(--n-font-size-body)', fontWeight: 600, ...headerIcon }}>Aa</span>, getSort: r => (r.desc || "").toLowerCase() },
    { key: "date",    label: "Date",    icon: <IconB name="interface-time" size={12} style={headerIcon} />,                 getSort: r => r.date },
    { key: "qty",     label: "Qty",     icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>,      getSort: r => r.qty },
    { key: "price",   label: "Price",   icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>,      getSort: r => r.price },
    { key: "total",   label: "Total",   icon: <span style={{ ...headerIcon, fontWeight: 600, fontSize: 'var(--n-font-size-body)' }}>#</span>,      getSort: r => r.qty * r.price },
    { key: "status",  label: "Status",  icon: <IconB name="interface-tag" size={12} style={headerIcon} />,                  getSort: r => r.paid ? "paid" : "unpaid" },
  ], [isInvoiceView]);

  const DEFAULT_WIDTHS = isInvoiceView
    ? [140, 220, 130, 80, 140, 130]
    : [200, 280, 120, 70, 100, 110, 120];
  const MIN_WIDTH = 60;
  const [widths, setWidths] = React.useState(DEFAULT_WIDTHS);

  React.useEffect(() => { setWidths(DEFAULT_WIDTHS); }, [view]);

  const [sort, setSort] = React.useState({ key: null, dir: "asc" });
  React.useEffect(() => { setSort({ key: null, dir: "asc" }); }, [view]);

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

  const sortedList = React.useMemo(() => {
    if (!sort.key) return list;
    const def = COLUMN_DEFS.find(d => d.key === sort.key);
    if (!def) return list;
    const copy = [...list];
    copy.sort((a, b) => {
      const va = def.getSort(a);
      const vb = def.getSort(b);
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [list, sort, COLUMN_DEFS]);

  const fmt = (n) => "£" + Number(n).toFixed(2);

  const confirmPay = (method) => {
    const ids = payTarget ? [payTarget.id] : unpaid.map(c => c.id);
    const total = ids.reduce((s, id) => {
      const c = charges.find(x => x.id === id);
      return c ? s + c.qty * c.price : s;
    }, 0);
    const invs = window.PROVET_BILLING.settle(ids, method);
    setPayOpen(false);
    setPayTarget(null);
    setPeeked(null);
    if (invs) setPaid({ count: invs.length, total, method, invoices: invs });
  };

  const peekRow = peeked
    ? (isInvoiceView ? invoices.find(r => r.id === peeked) : charges.find(r => r.id === peeked))
    : null;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "row", fontSize: 'var(--n-font-size-body)', gap: 8 }}>
      {/* Main table area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "#fff", borderRadius: 8, overflow: "hidden", border: borderB }}>
        {/* Top bar: title + right-side controls */}
        <div style={{ display: "flex", alignItems: "center", padding: "10px 16px", borderBottom: borderB, gap: 4 }}>
          <h1 style={{ margin: 0, fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>Billing</h1>
          <span style={{ flex: 1 }} />
          {[
            { id: "unpaid",   label: "Unpaid",   count: unpaid.length },
            { id: "all",      label: "All",      count: charges.length },
            { id: "invoices", label: "Invoices", count: invoices.length },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => { setView(t.id); setPeeked(null); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: view === t.id ? "var(--n-color-surface-hover, #F5F5F4)" : "transparent",
                border: "none", padding: "5px 10px", borderRadius: 4,
                fontSize: 'var(--n-font-size-body)', fontWeight: view === t.id ? 500 : 400, cursor: "pointer",
                color: view === t.id ? "var(--n-color-text)" : "var(--n-color-text-weaker)",
              }}>
              <IconB
                name={t.id === "invoices" ? "navigation-finances" : "interface-grid"}
                size={13}
                style={{ color: view === t.id ? "#1F6FEB" : "var(--n-color-text-weaker)" }}
              />
              {t.label}
            </button>
          ))}
          <button className="linear-toolbar__btn" title="Filter" style={{ padding: 6 }}><IconB name="interface-filter" size={14} /></button>
          <button className="linear-toolbar__btn" title="Sort" style={{ padding: 6 }}><IconB name="interface-sort-small" size={14} /></button>
          <button className="linear-toolbar__btn" title="Search" style={{ padding: 6 }}><IconB name="navigation-search" size={14} /></button>
          <button className="linear-toolbar__btn" title="Display" style={{ padding: 6 }}><IconB name="navigation-settings" size={14} /></button>
          <button
            className="n-button n-button--primary"
            disabled={unpaid.length === 0}
            onClick={() => { setPayTarget(null); setPayOpen(true); }}
            style={{ marginInlineStart: 8, display: "inline-flex", alignItems: "center", gap: 4, paddingInlineEnd: 6 }}>
            Pay
            <IconB name="interface-dropdown-small" size={10} style={{ color: "#fff" }} />
          </button>
        </div>

        {/* Success banner */}
        {paid && (
          <div style={{
            padding: "8px 16px",
            background: "var(--n-color-status-success-weak, #DEF7E5)",
            color: "var(--n-color-text-success, #207843)",
            fontSize: 'var(--n-font-size-body)', borderBottom: borderB,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <IconB name="interface-checked-small" size={12} />
            <span><strong>{paid.count}</strong> invoice{paid.count === 1 ? "" : "s"} created · {fmt(paid.total)} paid by {paid.method}.</span>
            <span style={{ flex: 1 }} />
            <a style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { setView("invoices"); setPaid(null); }}>View invoices</a>
            <button onClick={() => setPaid(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "inherit", display: "flex" }}>
              <IconB name="interface-close" size={11} />
            </button>
          </div>
        )}

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
                  <IconB
                    name={sort.dir === "asc" ? "interface-arrow-up" : "interface-arrow-down"}
                    size={11}
                    style={{ color: "var(--n-color-text-weaker)", flex: "none" }}
                  />
                )}
                <div
                  onMouseDown={(e) => onResizeStart(i, e)}
                  onClick={(e) => e.stopPropagation()}
                  title="Drag to resize"
                  style={{ position: "absolute", top: 0, bottom: 0, right: -3, width: 6, cursor: "col-resize", zIndex: 2 }}
                />
              </div>
            );
          })}
          <div style={{ padding: cellPad, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, borderInlineStart: borderB, color: "var(--n-color-text-weaker)" }}>
            <IconB name="interface-add" size={12} />
          </div>
        </div>

        {/* Rows */}
        <div style={{ overflow: "auto", flex: 1 }}>
          {sortedList.length === 0 ? (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "var(--n-color-text-weaker)" }}>
              <IconB name="navigation-finances" size={32} style={{ color: "var(--n-color-text-weakest)", marginBottom: 8 }} />
              <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>
                {isInvoiceView ? "No invoices yet" : view === "unpaid" ? "No unpaid items" : "No charges yet"}
              </div>
              <div style={{ fontSize: 'var(--n-font-size-body)', marginTop: 4 }}>
                {isInvoiceView ? "Settle items to generate invoices." : "Items added in a consultation appear here."}
              </div>
            </div>
          ) : sortedList.map((r) => {
            const id = r.id;
            const isHovered = hoveredId === id;
            const isPeeked = peeked === id;
            return (
              <div
                key={id}
                onClick={() => setPeeked(id)}
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
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
                }}>
                {isInvoiceView ? (
                  <>
                    <div style={{ padding: cellPad, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <IconB name="navigation-finances" size={14} style={{ color: "var(--n-color-text-weaker)", flex: "none" }} />
                      <span className="truncate tnum" style={{ minWidth: 0, flex: 1 }}>{r.id}</span>
                      {isHovered && <OpenChip onClick={() => setPeeked(id)} />}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", minWidth: 0 }}>
                      <span className="truncate" style={{ minWidth: 0 }}>{r.patientName}</span>
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", color: "var(--n-color-text-weaker)" }}>
                      {r.date}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center" }}>
                      {r.items}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center" }}>
                      <span style={{
                        background: "var(--n-color-status-info-weak, #E0EBFF)",
                        color: "var(--n-color-text-info, #1F6FEB)",
                        padding: "1px 6px", borderRadius: 3, fontSize: 'var(--n-font-size-body)',
                      }}>{r.method}</span>
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                      {fmt(r.total)}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB }} />
                  </>
                ) : (
                  <>
                    <div style={{ padding: cellPad, display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <IconB name="user-single" size={14} style={{ color: "var(--n-color-text-weaker)", flex: "none" }} />
                      <span className="truncate" style={{ minWidth: 0, flex: 1 }}>{r.patientName}</span>
                      {isHovered && <OpenChip onClick={() => setPeeked(id)} />}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", minWidth: 0 }}>
                      <span className="truncate" style={{ minWidth: 0 }}>{r.desc}</span>
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", color: "var(--n-color-text-weaker)" }}>
                      {r.date}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums" }}>
                      {r.qty}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums" }}>
                      {fmt(r.price)}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center", fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
                      {fmt(r.qty * r.price)}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB, display: "flex", alignItems: "center" }}>
                      {r.paid ? (
                        <span style={{
                          background: "var(--n-color-status-success-weak, #DEF7E5)",
                          color: "var(--n-color-text-success, #207843)",
                          padding: "1px 6px", borderRadius: 3, fontSize: 'var(--n-font-size-body)',
                        }}>Paid</span>
                      ) : (
                        <span style={{
                          background: "var(--n-color-status-warning-weak, #FEF3C7)",
                          color: "var(--n-color-text-warning, #B45309)",
                          padding: "1px 6px", borderRadius: 3, fontSize: 'var(--n-font-size-body)',
                        }}>Unpaid</span>
                      )}
                    </div>
                    <div style={{ padding: cellPad, borderInlineStart: borderB }} />
                  </>
                )}
              </div>
            );
          })}
          {/* Empty add-row */}
          <div style={{
            display: "grid", gridTemplateColumns: COLS,
            borderBottom: borderB, color: "var(--n-color-text-weaker)",
          }}>
            <div style={{ padding: cellPad, display: "flex", alignItems: "center", gap: 6 }}>
              <IconB name="interface-add" size={12} />
              <span>New</span>
            </div>
            {COLUMN_DEFS.slice(1).map((c) => (
              <div key={c.key} style={{ borderInlineStart: borderB }} />
            ))}
            <div style={{ borderInlineStart: borderB }} />
          </div>
          {/* COUNT row */}
          <div style={{
            display: "grid", gridTemplateColumns: COLS,
            fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)",
          }}>
            <div style={{ padding: cellPad }}>COUNT {sortedList.length}</div>
            {COLUMN_DEFS.slice(1).map((c) => (
              <div key={c.key} style={{ borderInlineStart: borderB }} />
            ))}
            <div style={{ borderInlineStart: borderB }} />
          </div>
        </div>
      </div>{/* end main table area */}

      {/* Side peek panel */}
      {peekRow && (
        <BillingPeekPanel
          row={peekRow}
          isInvoice={isInvoiceView}
          onClose={() => setPeeked(null)}
          onPay={() => { setPayTarget(peekRow); setPayOpen(true); }}
        />
      )}

      {payOpen && (
        <window.PaymentModal
          items={payTarget ? [payTarget] : unpaid}
          total={(payTarget ? [payTarget] : unpaid).reduce((s, c) => s + c.qty * c.price, 0)}
          onClose={() => { setPayOpen(false); setPayTarget(null); }}
          onPay={confirmPay}
        />
      )}
    </div>
  );
}

function OpenChip({ onClick }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onClick(); }}
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
  );
}

window.BillingPage = BillingPage;
