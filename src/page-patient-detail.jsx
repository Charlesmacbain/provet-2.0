/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconD, Avatar: AvatarD, Card: CardD, Badge: BadgeD, statusBadge: sbD, getInitials: giD, speciesIcon: spD } = window.PROVET_PRIM;
const { VITALS } = window.PROVET_DATA;

function Vital({ v }) {
  return (
    <div className="vital">
      <div className="vital__label">{v.label}</div>
      <div className="vital__row">
        <div className="vital__value">{v.value}</div>
        <div className="vital__unit">{v.unit}</div>
      </div>
      <div className={"vital__bar" + (v.tone === "warn" ? " vital__bar--warn" : v.tone === "danger" ? " vital__bar--danger" : "")}>
        <i style={{ width: v.bar + "%" }}></i>
      </div>
    </div>
  );
}

const CHARGE_CATALOG = [
  { code: "C-GEN",  desc: "Consultation — General",          price: 55 },
  { code: "C-EXT",  desc: "Consultation — Extended",         price: 85 },
  { code: "VAC-DH", desc: "Vaccination — DHPP booster",      price: 35 },
  { code: "RX-APO", desc: "Apoquel 16mg × 30 tablets",       price: 42 },
  { code: "LAB-CBC",desc: "Lab — CBC + biochemistry panel",  price: 78 },
  { code: "PROC-NT",desc: "Nail trim",                        price: 18 },
  { code: "IMG-XR", desc: "Imaging — Radiograph (single view)", price: 95 },
];

function PatientDetailPage({ patient, onBack }) {
  const [tab, setTab] = React.useState("summary");
  const billing = window.PROVET_BILLING.useBilling();
  const charges = billing.charges.filter(c => c.patientId === patient.id);
  const invoices = billing.invoices.filter(i => i.patientId === patient.id);
  const addCharge = (item) =>
    window.PROVET_BILLING.addCharge({ patientId: patient.id, patientName: patient.name, ...item });
  const removeCharge = (id) => window.PROVET_BILLING.removeCharge(id);
  const settle = (ids, method) => {
    const created = window.PROVET_BILLING.settle(ids, method);
    return created && created[0] ? created[0].id : null;
  };

  const unpaidCount = charges.filter(c => !c.paid).length;
  const tabs = [
    { id: "summary",    label: "Summary" },
    { id: "vitals",     label: "Vitals" },
    { id: "history",    label: "History",  count: 14 },
    { id: "rx",         label: "Prescriptions", count: 3 },
    { id: "lab",        label: "Lab",      count: 2 },
    { id: "imaging",    label: "Imaging" },
    { id: "files",      label: "Files",    count: 7 },
    { id: "consult",    label: "Consult" },
    { id: "billing",    label: "Billing",  count: unpaidCount || null },
    { id: "invoices",   label: "Invoices", count: invoices.length || null },
  ];

  return (
    <div className="content__inner">
      <div className="crumbs">
        <a onClick={onBack} style={{cursor:"pointer"}}>Patients</a>
        <span className="crumbs__sep">/</span>
        <span>{patient.name}</span>
      </div>

      <div className="patient-hero">
        <AvatarD initials={giD(patient.name)} color={patient.color} size="l" />
        <div className="flex-1">
          <div className="row-between" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="patient-hero__name">{patient.name}</div>
              <div className="patient-hero__meta">
                <span className="patient-hero__meta-item"><IconD name={spD(patient.species)} size={14} /> {patient.species} · {patient.breed}</span>
                <span className="patient-hero__meta-item"><IconD name={patient.sex === "F" ? "medical-female" : "medical-male"} size={14} /> {patient.sex === "F" ? "Female" : "Male"}{patient.neutered ? ", neutered" : ", intact"}</span>
                <span className="patient-hero__meta-item"><IconD name="medical-birthday" size={14} /> {patient.age}</span>
                <span className="patient-hero__meta-item tnum"><IconD name="generic-pet-food" size={14} /> {patient.weight}</span>
                <span className="patient-hero__meta-item tnum"><IconD name="interface-time" size={14} /> Last seen {patient.lastVisit}</span>
              </div>
            </div>
            <div className="patient-hero__actions">
              <button className="n-button n-button--s"><IconD name="interface-bookmark" size={12} /> Save</button>
              <button className="n-button n-button--s"><IconD name="interface-print" size={12} /> Print</button>
              <button className="n-button n-button--s n-button--primary"><IconD name="interface-add" size={12} style={{color:"#fff"}} /> New consult</button>
            </div>
          </div>

          <div className="row gap-s" style={{ marginTop: 10, flexWrap: "wrap" }}>
            {sbD(patient.status)}
            <BadgeD tone="info">Insurance · Petplan</BadgeD>
            <BadgeD tone="highlight">Allergy · Penicillin</BadgeD>
            <BadgeD tone="warning" dot>Vaccine due in 14d</BadgeD>
            <BadgeD tone="neutral">Microchip · 985112…</BadgeD>
          </div>

          <div className="factrow">
            <div className="fact">
              <div className="fact__label">Owner</div>
              <div className="fact__value">{patient.owner}</div>
              <div className="text-xs muted">+44 7700 900{Math.floor(Math.random()*900)+100}</div>
            </div>
            <div className="fact">
              <div className="fact__label">Primary vet</div>
              <div className="fact__value">Dr. Sara Lindqvist</div>
              <div className="text-xs muted">Bath Veterinary Clinic</div>
            </div>
            <div className="fact">
              <div className="fact__label">Insurance</div>
              <div className="fact__value">Petplan · Gold</div>
              <div className="text-xs muted">Active until 31 Dec 2026</div>
            </div>
            <div className="fact">
              <div className="fact__label">Account balance</div>
              <div className="fact__value tnum" style={{ color: "var(--n-color-text-success)" }}>£0.00</div>
              <div className="text-xs muted">No outstanding</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={"page-tab" + (tab === t.id ? " page-tab--active" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.count != null && <span className="page-tab__count">{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "summary" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <CardD title="Vitals — last recorded" sub="Today, 09:14 · Dr. Lindqvist">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {VITALS.map(v => <Vital key={v.label} v={v} />)}
              </div>
            </CardD>
            <CardD title="Problem list" action={<button className="n-button n-button--s">Add</button>} flush>
              {[
                { name: "Atopic dermatitis", since: "Sep 2024", status: "Active", tone: "warning" },
                { name: "Mild gingivitis",   since: "Jan 2025", status: "Monitoring", tone: "info" },
                { name: "Cruciate strain (resolved)", since: "May 2023", status: "Resolved", tone: "neutral" },
              ].map(p => (
                <div key={p.name} className="list-row">
                  <IconD name="medical-bandage" size={16} style={{ color: "var(--n-color-icon)" }} />
                  <div className="flex-1">
                    <div className="list-row__title">{p.name}</div>
                    <div className="list-row__sub">Since {p.since}</div>
                  </div>
                  <BadgeD tone={p.tone}>{p.status}</BadgeD>
                </div>
              ))}
            </CardD>
            <CardD title="Recent visits" action={<button className="n-button n-button--s">View history</button>} flush>
              <table className="n-table">
                <thead><tr><th>Date</th><th>Reason</th><th>Vet</th><th>Outcome</th></tr></thead>
                <tbody>
                  <tr><td className="tnum">14 Mar 2026</td><td>Annual wellness exam</td><td>Dr. Lindqvist</td><td><BadgeD tone="success">Healthy</BadgeD></td></tr>
                  <tr><td className="tnum">02 Feb 2026</td><td>Itching follow-up</td><td>Dr. Lindqvist</td><td><BadgeD tone="warning">Apoquel ↑</BadgeD></td></tr>
                  <tr><td className="tnum">11 Dec 2025</td><td>Booster — DHPP</td><td>Dr. Patel</td><td><BadgeD tone="info">Vaccinated</BadgeD></td></tr>
                  <tr><td className="tnum">19 Sep 2025</td><td>Skin scraping</td><td>Dr. Lindqvist</td><td><BadgeD tone="highlight">Atopy dx</BadgeD></td></tr>
                </tbody>
              </table>
            </CardD>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="n-banner n-banner--warning">
              <img className="n-banner__icon" src="assets/icons/interface-warning.svg" alt="" />
              <div><div className="n-banner__title">Vaccine due in 14 days</div>DHPP booster recommended by 30 Mar 2026.</div>
            </div>
            <CardD title="Active prescriptions" action={<button className="n-button n-button--s">+ Add</button>} flush>
              {[
                { drug: "Apoquel 16 mg", dose: "1 tab PO q12h", refills: 2, vet: "Lindqvist" },
                { drug: "Cytopoint",     dose: "2 mg/kg SC q4-8w", refills: 0, vet: "Lindqvist" },
                { drug: "Omega-3 chews", dose: "1 chew PO q24h",   refills: 5, vet: "Lindqvist" },
              ].map(rx => (
                <div key={rx.drug} className="list-row">
                  <IconD name="medical-pill" size={16} style={{ color: "var(--n-color-icon)" }} />
                  <div className="flex-1">
                    <div className="list-row__title">{rx.drug}</div>
                    <div className="list-row__sub">{rx.dose} · Refills: {rx.refills} · Dr. {rx.vet}</div>
                  </div>
                </div>
              ))}
            </CardD>
            <CardD title="Reminders" flush>
              {[
                { what: "Annual wellness exam", when: "14 Mar 2027", icon: "interface-calendar" },
                { what: "Heartworm test",       when: "01 Apr 2026", icon: "medical-blood" },
                { what: "Dental cleaning",      when: "Jun 2026",    icon: "medical-surgery" },
              ].map(r => (
                <div key={r.what} className="list-row">
                  <IconD name={r.icon} size={16} style={{ color: "var(--n-color-icon)" }} />
                  <div className="flex-1">
                    <div className="list-row__title">{r.what}</div>
                    <div className="list-row__sub tnum">{r.when}</div>
                  </div>
                  <button className="n-button n-button--s">Send</button>
                </div>
              ))}
            </CardD>
          </div>
        </div>
      )}
      {tab === "consult" && (
        <ConsultTab onAdd={addCharge} onGoBilling={() => setTab("billing")} />
      )}
      {tab === "billing" && (
        <BillingTab charges={charges} onRemove={removeCharge} onSettle={settle} onGoInvoices={() => setTab("invoices")} />
      )}
      {tab === "invoices" && (
        <InvoicesTab invoices={invoices} />
      )}
      {tab !== "summary" && tab !== "consult" && tab !== "billing" && tab !== "invoices" && (
        <div className="card">
          <div className="empty">
            <IconD name="file-patient-records" size={36} className="empty__icon" />
            <div className="empty__title">{tabs.find(t => t.id === tab).label} view</div>
            <div className="empty__sub">This area shows {patient.name}'s {tabs.find(t => t.id === tab).label.toLowerCase()}. Switch tabs above to explore.</div>
            <button className="n-button n-button--s" onClick={() => setTab("summary")}>Back to summary</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ConsultTab({ onAdd, onGoBilling }) {
  const [added, setAdded] = React.useState([]);
  const add = (item) => {
    onAdd(item);
    setAdded(p => [...p, { ...item, when: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      <CardD title="Add to consultation" sub="Items added here flow to the Billing tab." flush>
        <div className="catalog-grid">
          {CHARGE_CATALOG.map(c => (
            <button key={c.code} className="catalog-item" onClick={() => add({ desc: c.desc, price: c.price })}>
              <div className="catalog-item__name">{c.desc}</div>
              <div className="catalog-item__price tnum">£{c.price.toFixed(2)}</div>
            </button>
          ))}
        </div>
      </CardD>
      <CardD title={`Added this consult (${added.length})`} action={
        added.length > 0 ? <button className="n-button n-button--s n-button--primary" onClick={onGoBilling}>Go to billing</button> : null
      } flush>
        {added.length === 0 ? (
          <div className="empty" style={{ padding: 24 }}>
            <div className="empty__title">Nothing added yet</div>
            <div className="empty__sub">Pick items from the catalog to bill them.</div>
          </div>
        ) : added.map((a, i) => (
          <div key={i} className="list-row">
            <IconD name="navigation-finances" size={16} style={{ color: "var(--n-color-icon)" }} />
            <div className="flex-1">
              <div className="list-row__title">{a.desc}</div>
              <div className="list-row__sub">Added {a.when}</div>
            </div>
            <div className="tnum" style={{ fontWeight: 500 }}>£{a.price.toFixed(2)}</div>
          </div>
        ))}
      </CardD>
    </div>
  );
}

function BillingTab({ charges, onRemove, onSettle, onGoInvoices }) {
  const unpaid = charges.filter(c => !c.paid);
  const [selected, setSelected] = React.useState(new Set());
  const [payOpen, setPayOpen] = React.useState(false);
  const [paid, setPaid] = React.useState(null); // {invoice, total, method}

  React.useEffect(() => {
    setSelected(prev => new Set([...prev].filter(id => unpaid.some(c => c.id === id))));
  }, [charges]); // prune ids that disappeared

  const allSelected = unpaid.length > 0 && unpaid.every(c => selected.has(c.id));
  const toggle = (id) => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(unpaid.map(c => c.id)));

  const selectedItems = unpaid.filter(c => selected.has(c.id));
  const selectedTotal = selectedItems.reduce((s, c) => s + c.qty * c.price, 0);
  const unpaidTotal = unpaid.reduce((s, c) => s + c.qty * c.price, 0);

  const confirmPay = (method) => {
    const inv = onSettle([...selected], method);
    setPayOpen(false);
    setSelected(new Set());
    setPaid({ invoice: inv, total: selectedTotal, method });
  };

  return (
    <CardD
      title="Billing"
      sub={unpaid.length === 0 ? "No unpaid items." : `${unpaid.length} unpaid item${unpaid.length === 1 ? "" : "s"} · £${unpaidTotal.toFixed(2)} total`}
      action={
        <div className="row gap-s">
          <button className="n-button n-button--s" disabled={selected.size === 0} onClick={() => setSelected(new Set())}>Clear</button>
          <button className="n-button n-button--s n-button--primary" disabled={selected.size === 0} onClick={() => setPayOpen(true)}>
            Pay {selected.size > 0 ? `(£${selectedTotal.toFixed(2)})` : ""}
          </button>
        </div>
      }
      flush>
      {paid && (
        <div className="n-banner n-banner--success" style={{ margin: 12 }}>
          <div>
            <div className="n-banner__title">Invoice {paid.invoice} created</div>
            £{paid.total.toFixed(2)} paid by {paid.method}.{" "}
            <a style={{ cursor: "pointer", textDecoration: "underline" }} onClick={onGoInvoices}>View invoices</a>
          </div>
        </div>
      )}
      {unpaid.length === 0 ? (
        <div className="empty" style={{ padding: 32 }}>
          <IconD name="navigation-finances" size={36} className="empty__icon" />
          <div className="empty__title">All settled</div>
          <div className="empty__sub">No unpaid items for this patient.</div>
        </div>
      ) : (
        <table className="n-table billing-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}>
                <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
              </th>
              <th>Item</th>
              <th style={{ width: 80 }}>Date</th>
              <th style={{ width: 60, textAlign: "right" }}>Qty</th>
              <th style={{ width: 90, textAlign: "right" }}>Price</th>
              <th style={{ width: 90, textAlign: "right" }}>Total</th>
              <th style={{ width: 40 }}></th>
            </tr>
          </thead>
          <tbody>
            {unpaid.map(c => (
              <tr key={c.id} className={selected.has(c.id) ? "billing-row--selected" : ""}>
                <td><input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} /></td>
                <td>{c.desc}</td>
                <td className="tnum muted">{c.date}</td>
                <td className="tnum" style={{ textAlign: "right" }}>{c.qty}</td>
                <td className="tnum" style={{ textAlign: "right" }}>£{c.price.toFixed(2)}</td>
                <td className="tnum" style={{ textAlign: "right", fontWeight: 500 }}>£{(c.qty * c.price).toFixed(2)}</td>
                <td>
                  <button className="n-button n-button--s" onClick={() => onRemove(c.id)} title="Remove" aria-label="Remove">
                    <IconD name="interface-delete" size={12} />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="billing-totals">
              <td colSpan={5} style={{ textAlign: "right", fontWeight: 500 }}>
                {selected.size > 0 ? `Selected (${selected.size}):` : "Unpaid total:"}
              </td>
              <td className="tnum" style={{ textAlign: "right", fontWeight: 600 }}>
                £{(selected.size > 0 ? selectedTotal : unpaidTotal).toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
      )}

      {payOpen && (
        <PaymentModal items={selectedItems} total={selectedTotal} onClose={() => setPayOpen(false)} onPay={confirmPay} />
      )}
    </CardD>
  );
}

function PaymentModal({ items, total, onClose, onPay }) {
  const [method, setMethod] = React.useState("Card");
  const methods = [
    { id: "Card",      label: "Card",      icon: "navigation-finances", sub: "Chip & PIN or contactless" },
    { id: "Cash",      label: "Cash",      icon: "navigation-finances", sub: "Settle from till" },
    { id: "Insurance", label: "Insurance", icon: "interface-bookmark",  sub: "Petplan · Gold (claim)" },
  ];
  return (
    <div className="pay-modal__backdrop" onClick={onClose}>
      <div className="pay-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pay-modal__head">
          <div>
            <div className="pay-modal__title">Take payment</div>
            <div className="pay-modal__sub">{items.length} item{items.length === 1 ? "" : "s"} · £{total.toFixed(2)}</div>
          </div>
          <button className="n-button n-button--s" onClick={onClose} aria-label="Close">
            <IconD name="interface-close-small" size={12} />
          </button>
        </div>
        <div className="pay-modal__items">
          {items.map(i => (
            <div key={i.id} className="pay-modal__item">
              <span>{i.desc}</span>
              <span className="tnum">£{(i.qty * i.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="pay-modal__methods">
          {methods.map(m => (
            <button
              key={m.id}
              className={"pay-method" + (method === m.id ? " pay-method--active" : "")}
              onClick={() => setMethod(m.id)}>
              <IconD name={m.icon} size={18} />
              <div className="flex-1" style={{ textAlign: "start" }}>
                <div style={{ fontWeight: 500, fontSize: 'var(--n-font-size-body)' }}>{m.label}</div>
                <div className="text-xs muted">{m.sub}</div>
              </div>
              {method === m.id && <IconD name="interface-checked-small" size={14} />}
            </button>
          ))}
        </div>
        <div className="pay-modal__foot">
          <button className="n-button n-button--s" onClick={onClose}>Cancel</button>
          <button className="n-button n-button--primary" onClick={() => onPay(method)}>
            Pay £{total.toFixed(2)} by {method}
          </button>
        </div>
      </div>
    </div>
  );
}

function InvoicesTab({ invoices }) {
  if (invoices.length === 0) {
    return (
      <div className="card">
        <div className="empty">
          <IconD name="navigation-finances" size={36} className="empty__icon" />
          <div className="empty__title">No invoices yet</div>
          <div className="empty__sub">Settle items from the Billing tab to generate invoices.</div>
        </div>
      </div>
    );
  }
  return (
    <CardD title={`Invoices (${invoices.length})`} flush>
      <table className="n-table">
        <thead><tr><th>Invoice</th><th>Date</th><th>Items</th><th>Method</th><th style={{ textAlign: "right" }}>Total</th></tr></thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td className="tnum">{inv.id}</td>
              <td className="tnum muted">{inv.date}</td>
              <td>{inv.items}</td>
              <td><BadgeD tone="info">{inv.method}</BadgeD></td>
              <td className="tnum" style={{ textAlign: "right", fontWeight: 500 }}>£{inv.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CardD>
  );
}

window.PatientDetailPage = PatientDetailPage;
window.PaymentModal = PaymentModal;
