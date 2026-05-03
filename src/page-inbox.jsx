/* global React, PROVET_PRIM, PROVET_DATA */
const { Icon: IconIB, useDragResize: useDragResizeIB, ResizeHandle: ResizeHandleIB } = window.PROVET_PRIM;
const { CLIENTS: INBOX_CLIENTS } = window.PROVET_DATA;

const ITEMS = [
  { group: "Today", id: "BVC-128", title: "Sign off Bella Andersen's bloodwork report", status: "todo", prio: "high", date: "Today", who: "SL", clientId: "CL-10247" },
  { group: "Today", id: "BVC-127", title: "Call Mrs. Olsen — vaccine reminder", status: "todo", prio: "med", date: "Today", who: "SL", clientId: "CL-10246" },
  { group: "Today", id: "BVC-126", title: "Refill prescription — Apoquel 16mg × 30", status: "in-progress", prio: "med", date: "Today", who: "RP", clientId: "CL-10248" },
  { group: "Today", id: "BVC-125", title: "Review post-op notes — Pixel Schmidt", status: "todo", prio: "med", date: "Today", who: "SL", clientId: "CL-10242" },
  { group: "Today", id: "BVC-124", title: "Drug interaction flagged — Pepper Romano", status: "blocked", prio: "high", date: "Today", who: "AP", clientId: "CL-10240" },
  { group: "Today", id: "BVC-123", title: "Lab uploaded results for Milo Olsen", status: "todo", prio: "low", date: "Today", who: "—", clientId: "CL-10246" },

  { group: "This week", id: "BVC-120", title: "Approve dental treatment plan — Charlie Park", status: "todo", prio: "med", date: "Tue", who: "AP" },
  { group: "This week", id: "BVC-119", title: "Vaccination protocol PDF — quarterly update", status: "in-progress", prio: "low", date: "Wed", who: "SL" },
  { group: "This week", id: "BVC-118", title: "Order suture pack restock", status: "todo", prio: "low", date: "Wed", who: "OP" },
  { group: "This week", id: "BVC-117", title: "Follow-up: Luna Kowalski booster", status: "todo", prio: "med", date: "Thu", who: "SL", clientId: "CL-10245" },
  { group: "This week", id: "BVC-116", title: "Equine pre-purchase report — Pepper Romano", status: "todo", prio: "med", date: "Thu", who: "AP", clientId: "CL-10240" },
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

function InboxRow({ it, selected, onSelect }) {
  return (
    <div
      className={"linear-row" + (selected ? " linear-row--selected" : "")}
      onClick={() => onSelect && onSelect(it.id)}
    >
      <div className="linear-row__title">{it.title}</div>
      <div className="linear-row__meta">
        <span className="linear-row__date">{it.date}</span>
        <span className="linear-row__avatar">{it.who}</span>
      </div>
    </div>
  );
}

function InboxGroup({ name, count, items, selectedId, onSelect }) {
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
      </div>
      {open && items.map(it => (
        <InboxRow key={it.id} it={it} selected={it.id === selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

function InboxAddTask({ onAdd }) {
  const [text, setText] = React.useState("");
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
  };
  return (
    <div className="inbox-add">
      <span className="inbox-add__icon"><IconIB name="interface-add" size={12} /></span>
      <input
        className="inbox-add__input"
        type="text"
        value={text}
        placeholder="Add a task…"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
      />
      {text.trim() && (
        <button className="inbox-add__submit" onClick={submit} title="Add task">
          <IconIB name="interface-arrow-right-small" size={11} />
        </button>
      )}
    </div>
  );
}

function InboxPage() {
  const groups = ["Today", "This week", "Later"];
  const [tasks, setTasks] = React.useState(ITEMS);
  const [selectedId, setSelectedId] = React.useState(ITEMS[0].id);
  const [filter, setFilter] = React.useState("all"); // all | unread | mentions
  const [leftW, onLeftResize] = useDragResizeIB({ initial: 360, min: 240, max: 720, side: "right", storageKey: "provet.inboxList.width" });

  const selected = tasks.find(t => t.id === selectedId) || null;
  const client = (selected && selected.clientId)
    ? INBOX_CLIENTS.find(c => c.id === selected.clientId)
    : null;

  const addTask = (title) => {
    const used = tasks.map(t => parseInt((t.id || "").replace("BVC-", ""), 10)).filter(n => !isNaN(n));
    const next = (used.length ? Math.max(...used) : 100) + 1;
    const fresh = {
      group: "Today",
      id: "BVC-" + next,
      title,
      status: "todo",
      prio: "med",
      date: "Today",
      who: "SL",
    };
    setTasks(prev => [fresh, ...prev]);
    setSelectedId(fresh.id);
  };

  const counts = {
    all: tasks.length,
    unread: 12,
    mentions: 3,
  };

  return (
    <div className="inbox-split">
      {/* LEFT: task list card */}
      <aside className="inbox-split__left" style={{ width: leftW, position: "relative" }}>
        <ResizeHandleIB side="right" onMouseDown={onLeftResize} style={{ right: -3, zIndex: 5 }} />
        <div className="inbox-split__head">
          <h1 className="inbox-split__title">Inbox</h1>
          <button className="linear-toolbar__btn" title="Filter">
            <IconIB name="interface-filter" size={12} />
          </button>
        </div>
        <div className="inbox-split__tabs">
          <button
            className={"linear-toolbar__btn" + (filter === "all" ? " linear-toolbar__btn--active" : "")}
            onClick={() => setFilter("all")}>
            All <span className="inbox-count">{counts.all}</span>
          </button>
          <button
            className={"linear-toolbar__btn" + (filter === "unread" ? " linear-toolbar__btn--active" : "")}
            onClick={() => setFilter("unread")}>
            Unread <span className="inbox-count">{counts.unread}</span>
          </button>
          <button
            className={"linear-toolbar__btn" + (filter === "mentions" ? " linear-toolbar__btn--active" : "")}
            onClick={() => setFilter("mentions")}>
            Mentions <span className="inbox-count">{counts.mentions}</span>
          </button>
        </div>
        <InboxAddTask onAdd={addTask} />
        <div className="inbox-split__scroll">
          <div className="linear-list">
            {groups.map(g => {
              const items = tasks.filter(i => i.group === g);
              if (!items.length) return null;
              return (
                <InboxGroup
                  key={g}
                  name={g}
                  count={items.length}
                  items={items}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              );
            })}
          </div>
        </div>
      </aside>

      {/* RIGHT: client page for the selected task */}
      <section className="inbox-split__right">
        {client ? (
          <window.ClientDetailPage
            key={client.id}
            client={client}
            onBack={() => setSelectedId(null)}
          />
        ) : (
          <InboxRightEmpty selected={selected} />
        )}
      </section>
    </div>
  );
}

function InboxRightEmpty({ selected }) {
  if (!selected) {
    return (
      <div className="inbox-empty">
        <IconIB name="navigation-tasks" size={36} />
        <div className="inbox-empty__title">Select a task</div>
        <div className="inbox-empty__sub">Pick a task on the left to see the related client and patient here.</div>
      </div>
    );
  }
  return (
    <div className="inbox-empty">
      <IconIB name="navigation-tasks" size={36} />
      <div className="inbox-empty__title">{selected.title}</div>
      <div className="inbox-empty__sub">Internal task — no client linked.</div>
    </div>
  );
}

window.InboxPage = InboxPage;
