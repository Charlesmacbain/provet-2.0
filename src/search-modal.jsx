// Search modal — two modes:
//   • People    → clients & patients (with quick nav + actions)
//   • Items     → inventory price check & stock lookup
function SearchModal({ onClose, onNavigate }) {
  const D = window.PROVET_DATA;
  const I = window.Icon || (() => null);
  const [mode, setMode] = React.useState("people"); // "people" | "items"
  const [q, setQ] = React.useState("");
  const [hover, setHover] = React.useState(0);
  const [selected, setSelected] = React.useState(null); // for items detail panel
  const inputRef = React.useRef(null);

  React.useEffect(() => { inputRef.current?.focus(); }, [mode]);
  React.useEffect(() => { setHover(0); setSelected(null); }, [q, mode]);

  const ql = q.trim().toLowerCase();
  const matches = (s) => !ql || (s || "").toString().toLowerCase().includes(ql);

  // ---------- PEOPLE MODE ----------
  const navItems = [
    { id: "appointments", label: "Appointments", icon: "navigation-calendar", page: "appointments" },
    { id: "patients",     label: "Patients",     icon: "navigation-patients", page: "patients" },
    { id: "clients",      label: "Clients",      icon: "navigation-clients",  page: "clients" },
    { id: "invoices",     label: "Invoices",     icon: "navigation-billing",  page: "invoices" },
    { id: "inbox",        label: "Inbox",        icon: "navigation-inbox", page: "inbox" },
  ];

  // Recent clients & patients — curated mix in "viewed today" order
  const recents = (() => {
    const out = [];
    const clients = D.CLIENTS || [];
    const patients = D.PATIENTS || [];
    // Interleave 2 clients, 4 patients, 2 clients in chronological-ish order
    if (clients[0]) out.push({ ...clients[0], kind: "client",  label: clients[0].name,  sub: "Viewed 4 min ago" });
    if (patients[0]) out.push({ ...patients[0], kind: "patient", label: patients[0].name, sub: `${patients[0].species} · ${patients[0].breed} · ${patients[0].owner} · 12 min ago` });
    if (patients[3]) out.push({ ...patients[3], kind: "patient", label: patients[3].name, sub: `${patients[3].species} · ${patients[3].breed} · ${patients[3].owner} · 38 min ago` });
    if (clients[2]) out.push({ ...clients[2], kind: "client",  label: clients[2].name,  sub: "Viewed 1 hr ago" });
    if (patients[5]) out.push({ ...patients[5], kind: "patient", label: patients[5].name, sub: `${patients[5].species} · ${patients[5].breed} · ${patients[5].owner} · 2 hr ago` });
    if (patients[1]) out.push({ ...patients[1], kind: "patient", label: patients[1].name, sub: `${patients[1].species} · ${patients[1].breed} · ${patients[1].owner} · Yesterday` });
    if (clients[3]) out.push({ ...clients[3], kind: "client",  label: clients[3].name,  sub: "Viewed yesterday" });
    if (patients[7]) out.push({ ...patients[7], kind: "patient", label: patients[7].name, sub: `${patients[7].species} · ${patients[7].breed} · ${patients[7].owner} · Yesterday` });
    return out;
  })();

  const peopleGroups = (() => {
    const g = [];
    if (!ql) {
      g.push({ title: "Recent", items: recents });
      g.push({ title: "Jump to", items: navItems.map(n => ({ ...n, kind: "nav" })) });
      return g;
    }
    const cli = (D.CLIENTS || [])
      .filter(c => matches(c.name) || matches(c.email) || matches(c.id))
      .slice(0, 6)
      .map(c => ({ ...c, kind: "client", label: c.name, sub: `${(c.pets || []).length} pets · ${c.email || ""}` }));
    const pat = (D.PATIENTS || [])
      .filter(p => matches(p.name) || matches(p.owner) || matches(p.id) || matches(p.breed))
      .slice(0, 8)
      .map(p => ({ ...p, kind: "patient", label: p.name, sub: `${p.species} · ${p.breed} · ${p.owner}` }));
    const navHits = navItems.filter(n => matches(n.label)).map(n => ({ ...n, kind: "nav" }));
    if (cli.length) g.push({ title: "Clients", items: cli });
    if (pat.length) g.push({ title: "Patients", items: pat });
    if (navHits.length) g.push({ title: "Navigation", items: navHits });
    return g;
  })();

  // ---------- ITEMS MODE ----------
  const itemHits = (D.INVENTORY || []).filter(it =>
    matches(it.name) || matches(it.sku) || matches(it.category) || matches(it.supplier)
  );
  const itemsByCat = {};
  itemHits.forEach(it => {
    (itemsByCat[it.category] = itemsByCat[it.category] || []).push(it);
  });
  const itemCats = Object.keys(itemsByCat).sort();

  const stockTone = (it) => {
    if (it.stock === 0) return { label: "Out of stock", tone: "danger" };
    if (it.stock < it.reorder) return { label: "Low", tone: "warning" };
    return { label: "In stock", tone: "success" };
  };

  // flat list for keyboard nav
  const flat = [];
  if (mode === "people") {
    peopleGroups.forEach(g => g.items.forEach(it => flat.push(it)));
  } else {
    itemHits.forEach(it => flat.push({ ...it, kind: "item" }));
  }

  const trigger = (it) => {
    if (!it) return;
    if (it.kind === "patient") { onNavigate("patient-detail", it); }
    else if (it.kind === "client") { onNavigate("client-detail", it); }
    else if (it.kind === "item") { setSelected(it); }
    else if (it.page) { onNavigate(it.page, null); }
  };

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHover(h => Math.min(h + 1, Math.max(flat.length - 1, 0))); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHover(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); trigger(flat[hover]); }
    else if (e.key === "Tab") { e.preventDefault(); setMode(m => m === "people" ? "items" : "people"); }
  };

  let runIdx = -1;

  // ---------- RENDER ----------
  return (
    <div className="sm-overlay" onClick={onClose}>
      <div className="sm-modal" onClick={e => e.stopPropagation()}>
        {/* Tabs */}
        <div className="sm-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={mode === "people"}
            className={"sm-tab" + (mode === "people" ? " sm-tab--active" : "")}
            onClick={() => setMode("people")}
          >
            <I name="navigation-clients" size={13} />
            Clients & patients
          </button>
          <button
            role="tab"
            aria-selected={mode === "items"}
            className={"sm-tab" + (mode === "items" ? " sm-tab--active" : "")}
            onClick={() => setMode("items")}
          >
            <I name="medical-pills" size={13} />
            Items
            <span className="sm-tab__count">{(D.INVENTORY || []).length}</span>
          </button>
          <div className="sm-tabs__hint"><kbd>Tab</kbd> to switch</div>
        </div>

        {/* Search input */}
        <div className="sm-input-row">
          <I name="navigation-search" size={15} style={{ color: "var(--n-color-icon)", flex: "none" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder={mode === "people"
              ? "Search clients, patients, or pages…"
              : "Search items by name, SKU, category, or supplier…"}
            className="sm-input"
          />
          {q && (
            <button className="sm-clear" onClick={() => setQ("")} aria-label="Clear">
              <I name="interface-cross-small" size={11} />
            </button>
          )}
          <span className="sm-esc">esc</span>
        </div>

        {/* Body */}
        <div className="sm-body">
          {/* PEOPLE MODE */}
          {mode === "people" && (
            <div className="sm-results">
              {peopleGroups.length === 0 && (
                <div className="sm-empty">
                  <I name="navigation-search" size={20} style={{ opacity: 0.4 }} />
                  <div className="sm-empty__title">No results for “{q}”</div>
                  <div className="sm-empty__sub">Try a different name, ID, or email.</div>
                </div>
              )}
              {peopleGroups.map(g => (
                <div key={g.title} className="sm-group">
                  <div className="sm-grouphead">{g.title}</div>
                  {g.items.map((it) => {
                    runIdx++;
                    const idx = runIdx;
                    return (
                      <button
                        key={(it.id || it.label) + idx}
                        className={"sm-row" + (idx === hover ? " sm-row--hover" : "")}
                        onMouseEnter={() => setHover(idx)}
                        onClick={() => trigger(it)}
                      >
                        <span className="sm-row__icon">
                          {it.kind === "patient" || it.kind === "client" ? (
                            <span className={"sm-avatar sm-avatar--" + (it.color || "info")}>
                              {(it.label || "?").split(" ").map(n => n[0]).slice(0, 2).join("")}
                            </span>
                          ) : (
                            <I name={it.icon} size={14} />
                          )}
                        </span>
                        <span className="sm-row__main">
                          <span className="sm-row__label">{it.label}</span>
                          {it.sub && <span className="sm-row__sub">{it.sub}</span>}
                        </span>
                        {it.hint && <span className="sm-kbd">{it.hint}</span>}
                        <I name="interface-arrow-right" size={11} className="sm-row__arrow" />
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* ITEMS MODE */}
          {mode === "items" && (
            <div className="sm-items">
              <div className="sm-items__list">
                {/* List header */}
                <div className="sm-items__head">
                  <span className="sm-items__head-cell">Item</span>
                  <span className="sm-items__head-cell sm-items__head-cell--right">Stock</span>
                  <span className="sm-items__head-cell sm-items__head-cell--right">Price</span>
                </div>
                {itemHits.length === 0 && (
                  <div className="sm-empty">
                    <I name="medical-pills" size={20} style={{ opacity: 0.4 }} />
                    <div className="sm-empty__title">No items match “{q}”</div>
                    <div className="sm-empty__sub">Try SKU, brand, or generic name.</div>
                  </div>
                )}
                {itemCats.map(cat => (
                  <div key={cat} className="sm-group">
                    <div className="sm-grouphead">{cat} <span className="sm-grouphead__count">{itemsByCat[cat].length}</span></div>
                    {itemsByCat[cat].map((it) => {
                      runIdx++;
                      const idx = runIdx;
                      const st = stockTone(it);
                      const isSel = selected && selected.id === it.id;
                      return (
                        <button
                          key={it.id}
                          className={"sm-item" + (idx === hover ? " sm-item--hover" : "") + (isSel ? " sm-item--selected" : "")}
                          onMouseEnter={() => setHover(idx)}
                          onClick={() => setSelected(it)}
                        >
                          <span className="sm-item__main">
                            <span className="sm-item__name">{it.name}</span>
                            <span className="sm-item__meta">
                              <span className="sm-item__sku">SKU {it.sku}</span>
                              <span className="sm-item__dot">·</span>
                              <span>{it.unit}</span>
                              <span className="sm-item__dot">·</span>
                              <span>{it.supplier}</span>
                            </span>
                          </span>
                          <span className="sm-item__stock">
                            <span className={"sm-stock-dot sm-stock-dot--" + st.tone} />
                            <span className="sm-item__stock-num">{it.stock}</span>
                          </span>
                          <span className="sm-item__price">£{it.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Detail panel */}
              <aside className={"sm-detail" + (selected ? "" : " sm-detail--empty")}>
                {selected ? (
                  <ItemDetail item={selected} onClose={() => setSelected(null)} />
                ) : (
                  <div className="sm-detail__placeholder">
                    <I name="medical-pills" size={28} style={{ opacity: 0.35 }} />
                    <div className="sm-detail__placeholder-title">Select an item</div>
                    <div className="sm-detail__placeholder-sub">View live stock levels, location, expiry, and run a price check.</div>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sm-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> {mode === "items" ? "select" : "open"}</span>
          <span><kbd>Tab</kbd> switch tab</span>
          <span style={{ marginLeft: "auto" }}><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

// Item detail panel — stock + price-check breakdown
function ItemDetail({ item, onClose }) {
  const I = window.Icon || (() => null);
  const [qty, setQty] = React.useState(1);
  const [discount, setDiscount] = React.useState(0);
  const VAT = 0.20;

  const unit = item.price;
  const sub = unit * qty * (1 - discount / 100);
  const vat = sub * VAT;
  const total = sub + vat;

  const lowStock = item.stock < item.reorder;
  const outOfStock = item.stock === 0;
  const stockLabel = outOfStock ? "Out of stock" : lowStock ? "Low stock" : "In stock";
  const stockTone = outOfStock ? "danger" : lowStock ? "warning" : "success";
  const pct = Math.min(100, Math.round((item.stock / Math.max(item.reorder * 2, 1)) * 100));

  return (
    <div className="sm-detail__inner">
      <div className="sm-detail__head">
        <div className="sm-detail__cat">{item.category}</div>
        <button className="sm-detail__close" onClick={onClose} aria-label="Close detail">
          <I name="interface-cross-small" size={11} />
        </button>
      </div>
      <div className="sm-detail__title">{item.name}</div>
      <div className="sm-detail__sub">SKU {item.sku} · {item.supplier}</div>

      {/* Stock card */}
      <div className="sm-card">
        <div className="sm-card__row">
          <div>
            <div className="sm-card__label">Stock on hand</div>
            <div className="sm-card__value">{item.stock} <span className="sm-card__unit">{item.unit}</span></div>
          </div>
          <span className={"sm-pill sm-pill--" + stockTone}>
            <span className={"sm-stock-dot sm-stock-dot--" + stockTone} />
            {stockLabel}
          </span>
        </div>
        <div className="sm-bar">
          <div className={"sm-bar__fill sm-bar__fill--" + stockTone} style={{ width: pct + "%" }} />
          <div className="sm-bar__threshold" style={{ left: Math.min(100, (item.reorder / Math.max(item.reorder * 2, 1)) * 100) + "%" }} title={"Reorder at " + item.reorder} />
        </div>
        <div className="sm-card__legend">
          <span>Reorder at {item.reorder}</span>
          <span>{item.loc}</span>
        </div>
      </div>

      {/* Price check */}
      <div className="sm-card">
        <div className="sm-card__label sm-card__label--head">Price check</div>
        <div className="sm-pc">
          <label className="sm-pc__field">
            <span>Qty</span>
            <div className="sm-pc__stepper">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <input type="number" min="1" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))} />
              <button onClick={() => setQty(q => q + 1)} aria-label="Increase">+</button>
            </div>
          </label>
          <label className="sm-pc__field">
            <span>Discount %</span>
            <input
              type="number" min="0" max="100" value={discount}
              onChange={e => setDiscount(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
              className="sm-pc__num"
            />
          </label>
        </div>
        <div className="sm-pc__breakdown">
          <div className="sm-pc__line">
            <span>Unit price</span>
            <span className="sm-pc__val">£{unit.toFixed(2)}</span>
          </div>
          <div className="sm-pc__line">
            <span>Subtotal {discount > 0 && <em className="sm-pc__disc">−{discount}%</em>}</span>
            <span className="sm-pc__val">£{sub.toFixed(2)}</span>
          </div>
          <div className="sm-pc__line">
            <span>VAT (20%)</span>
            <span className="sm-pc__val">£{vat.toFixed(2)}</span>
          </div>
          <div className="sm-pc__total">
            <span>Total</span>
            <span>£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="sm-detail__meta">
        <div className="sm-meta-row"><span>Expires</span><span className="tnum">{item.expires}</span></div>
        <div className="sm-meta-row"><span>Location</span><span>{item.loc}</span></div>
        <div className="sm-meta-row"><span>Supplier</span><span>{item.supplier}</span></div>
      </div>

      <div className="sm-detail__actions">
        <button className="sm-btn sm-btn--primary" disabled={outOfStock}>
          <I name="interface-add" size={11} /> Add to invoice
        </button>
        <button className="sm-btn">
          <I name="interface-edit" size={11} /> Adjust stock
        </button>
      </div>
    </div>
  );
}

window.SearchModal = SearchModal;
