/* global React, PROVET_PRIM */
const { Icon: IconIB } = window.PROVET_PRIM;

const ITEMS = [
  { group: "Today", id: "BVC-128", title: "Sign off Bella Andersen's bloodwork report", status: "todo", prio: "high", date: "Today", who: "SL" },
  { group: "Today", id: "BVC-127", title: "Call Mrs. Olsen — vaccine reminder", status: "todo", prio: "med", date: "Today", who: "SL" },
  { group: "Today", id: "BVC-126", title: "Refill prescription — Apoquel 16mg × 30", status: "in-progress", prio: "med", date: "Today", who: "RP" },
  { group: "Today", id: "BVC-125", title: "Review post-op notes — Pixel Schmidt", status: "todo", prio: "med", date: "Today", who: "SL" },
  { group: "Today", id: "BVC-124", title: "Drug interaction flagged — Pepper Romano", status: "blocked", prio: "high", date: "Today", who: "AP" },
  { group: "Today", id: "BVC-123", title: "Lab uploaded results for Milo Olsen", status: "todo", prio: "low", date: "Today", who: "—" },

  { group: "This week", id: "BVC-120", title: "Approve dental treatment plan — Charlie Park", status: "todo", prio: "med", date: "Tue", who: "AP" },
  { group: "This week", id: "BVC-119", title: "Vaccination protocol PDF — quarterly update", status: "in-progress", prio: "low", date: "Wed", who: "SL" },
  { group: "This week", id: "BVC-118", title: "Order suture pack restock", status: "todo", prio: "low", date: "Wed", who: "OP" },
  { group: "This week", id: "BVC-117", title: "Follow-up: Luna Kowalski booster", status: "todo", prio: "med", date: "Thu", who: "SL" },
  { group: "This week", id: "BVC-116", title: "Equine pre-purchase report — Pepper Romano", status: "todo", prio: "med", date: "Thu", who: "AP" },
  { group: "This week", id: "BVC-115", title: "Quarterly clinic insurance review", status: "todo", prio: "low", date: "Fri", who: "—" },

  { group: "Later", id: "BVC-110", title: "Annual renewal — controlled-drugs license", status: "todo", prio: "high", date: "May 14", who: "SL" },
  { group: "Later", id: "BVC-109", title: "Staff CPD scheduling for Q2", status: "todo", prio: "low", date: "May 18", who: "—" },
  { group: "Later", id: "BVC-108", title: "Switch lab supplier — review proposal", status: "todo", prio: "med", date: "May 22", who: "AP" },
];

function InboxStatusGlyph({ s }) {
  return <span className={"linear-row__status linear-row__status--" + s} />;
}

function InboxPriority({ p }) {
  return (
    <span className={"linear-row__priority linear-row__priority--" + p}>
      <span /><span /><span />
    </span>
  );
}

function InboxRow({ it }) {
  return (
    <div className="linear-row">
      <span className="linear-row__id">{it.id}</span>
      <InboxPriority p={it.prio} />
      <InboxStatusGlyph s={it.status} />
      <div className="linear-row__title">{it.title}</div>
      <div className="linear-row__meta">
        <span className="linear-row__chip">Inbox</span>
        <span className="linear-row__date">{it.date}</span>
        <span className="linear-row__avatar">{it.who}</span>
      </div>
    </div>
  );
}

function InboxGroup({ name, count, items }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <div className="linear-group__head" onClick={() => setOpen(o => !o)}>
        <span className={"linear-group__caret" + (open ? " linear-group__caret--open" : "")}>
          <IconIB name="arrow-right-small" size={10} />
        </span>
        <span className="linear-group__title">{name}</span>
        <span className="linear-group__count">{count}</span>
        <span className="linear-group__spacer" />
        <button className="linear-group__act" title="Add"><IconIB name="interface-add" size={12} /></button>
        <button className="linear-group__act" title="More"><IconIB name="interface-menu-small" size={12} /></button>
      </div>
      {open && items.map(it => <InboxRow key={it.id} it={it} />)}
    </div>
  );
}

function InboxPage() {
  const groups = ["Today", "This week", "Later"];
  return (
    <div className="linear-page">
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Inbox</h1>
        </div>
        <div className="page-header__actions">
          <button className="n-button"><IconIB name="interface-filter" size={12} /> Filter</button>
          <button className="n-button"><IconIB name="interface-sort-small" size={12} /> Sort</button>
        </div>
      </div>
      <div className="linear-toolbar">
        <button className="linear-toolbar__btn"><IconIB name="interface-checked-small" size={12} /> All</button>
        <button className="linear-toolbar__btn">Unread <span style={{color:"var(--linear-faint)"}}>12</span></button>
        <button className="linear-toolbar__btn">Mentions <span style={{color:"var(--linear-faint)"}}>3</span></button>
        <span className="linear-toolbar__sep" />
        <button className="linear-toolbar__btn"><IconIB name="interface-filter" size={12} /> Add filter</button>
        <span style={{ flex: 1 }} />
        <button className="linear-toolbar__btn">Display</button>
      </div>
      <div className="linear-list">
        {groups.map(g => {
          const items = ITEMS.filter(i => i.group === g);
          return <InboxGroup key={g} name={g} count={items.length} items={items} />;
        })}
      </div>
    </div>
  );
}

window.InboxPage = InboxPage;
