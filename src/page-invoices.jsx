/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconI } = window.PROVET_PRIM;
const { INVOICES } = window.PROVET_DATA;

function InvoicesPage() {
  const groups = {};
  INVOICES.forEach(i => { (groups[i.status] ||= []).push(i); });
  const order = ["overdue","pending","draft","paid"];
  const labels = { overdue: "Overdue", pending: "Pending", draft: "Drafts", paid: "Paid" };
  return (
    <div className="linear-page">
      <div className="page-header">
        <div><h1 className="page-header__title">Invoices</h1></div>
        <div className="page-header__actions">
          <button className="n-button"><IconI name="interface-download" size={12} /> Export</button>
          <button className="n-button n-button--primary"><IconI name="interface-add" size={12} style={{color:"#fff"}} /> New</button>
        </div>
      </div>
      <div className="linear-toolbar">
        <button className="linear-toolbar__btn"><IconI name="interface-filter" size={12} /> Filter</button>
        <span className="linear-toolbar__sep" />
        <button className="linear-toolbar__btn">All</button>
        <button className="linear-toolbar__btn">Outstanding</button>
        <span style={{ flex: 1 }} />
        <button className="linear-toolbar__btn">Display</button>
      </div>
      <div className="linear-list">
        {order.filter(s => groups[s]).map(s => (
          <InvoiceGroup key={s} name={labels[s]} items={groups[s]} status={s} />
        ))}
      </div>
    </div>
  );
}

function InvoiceGroup({ name, items, status }) {
  const [open, setOpen] = React.useState(true);
  const statusGlyph = status === "overdue" ? "blocked" : status === "pending" ? "in-progress" : status === "paid" ? "done" : "todo";
  return (
    <div>
      <div className="linear-group__head" onClick={() => setOpen(o => !o)}>
        <span className={"linear-group__caret" + (open ? " linear-group__caret--open" : "")}>
          <IconI name="arrow-right-small" size={10} />
        </span>
        <span className="linear-group__title">{name}</span>
        <span className="linear-group__count">{items.length}</span>
        <span className="linear-group__spacer" />
      </div>
      {open && items.map(i => (
        <div key={i.id} className="linear-row">
          <span className="linear-row__id">{i.id.replace("INV-","")}</span>
          <span className={"linear-row__status linear-row__status--" + statusGlyph} />
          <div className="linear-row__title">{i.client} <span style={{color:"var(--linear-faint)"}}>· {i.patient}</span></div>
          <div className="linear-row__meta">
            <span className="linear-row__chip">£{i.amount.toFixed(2)}</span>
            <span className="linear-row__date">{i.date.split(" ").slice(0,2).join(" ")}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StubPage({ icon, title, sub }) {
  return (
    <div className="linear-page">
      <div className="page-header">
        <div><h1 className="page-header__title">{title}</h1></div>
        <div className="page-header__actions">
          <button className="n-button n-button--primary"><IconI name="interface-add" size={12} style={{color:"#fff"}} /> New</button>
        </div>
      </div>
      <div className="linear-toolbar">
        <button className="linear-toolbar__btn"><IconI name="interface-filter" size={12} /> Filter</button>
        <span style={{ flex: 1 }} />
        <button className="linear-toolbar__btn">Display</button>
      </div>
      <div style={{ padding: 48, textAlign: "center", color: "var(--linear-faint)" }}>
        <IconI name={icon} size={28} style={{ opacity: 0.5, marginBottom: 12 }} />
        <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weak)" }}>{sub || "Nothing here yet."}</div>
      </div>
    </div>
  );
}

window.InvoicesPage = InvoicesPage;
window.StubPage = StubPage;
