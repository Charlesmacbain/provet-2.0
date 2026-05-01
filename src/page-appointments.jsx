/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconA, Avatar: AvatarA } = window.PROVET_PRIM;

// ---------- Mini month ----------
function MiniMonth() {
  // April 2026 — today = 27 Apr (Mon)
  const dow = ["S", "M", "T", "W", "T", "F", "S"];
  // April 2026 starts on a Wednesday (April 1 = Wed)
  // Cells from Sun 29 Mar through Sat 9 May (6 weeks)
  const cells = [];
  let d = new Date(2026, 2, 29); // Mar 29, 2026 (Sunday)
  for (let i = 0; i < 42; i++) {
    cells.push({
      day: d.getDate(),
      month: d.getMonth(),
      isOther: d.getMonth() !== 3
    });
    d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  }
  // Week of Apr 27 - May 3 -> highlight whole row (cells 35-41 minus last? actually 4th week starting from Sun Apr 26)
  // Sun Apr 26 = cell index 28
  const weekStart = 28; // Sun Apr 26
  const todayIdx = 29; // Mon Apr 27
  return (
    <div className="gc-mini">
      <div className="gc-mini__head">
        <span className="gc-mini__title">April 2026</span>
        <div className="gc-mini__nav">
          <button className="gc-iconbtn gc-iconbtn--xs" title="Previous month"><IconA name="arrow-left-small" size={10} /></button>
          <button className="gc-iconbtn gc-iconbtn--xs" title="Next month"><IconA name="arrow-right-small" size={10} /></button>
        </div>
      </div>
      <div className="gc-mini__grid">
        {dow.map((w, i) => <div key={i} className="gc-mini__dow">{w}</div>)}
        {cells.map((c, i) => {
          const inWeek = i >= weekStart && i < weekStart + 7;
          const isToday = i === todayIdx;
          return (
            <div key={i} className={
            "gc-mini__cell" + (
            c.isOther ? " gc-mini__cell--other" : "") + (
            inWeek ? " gc-mini__cell--inweek" : "") + (
            isToday ? " gc-mini__cell--today" : "")
            }>
              <span>{c.day}</span>
            </div>);

        })}
      </div>
    </div>);

}

// ---------- Calendar list ----------
function CalRow({ color, label, checked = true }) {
  return (
    <label className="gc-callist__row">
      <span className="gc-callist__check" style={{ background: checked ? color : "transparent", borderColor: color }}>
        {checked && <IconA name="interface-checked-small" size={10} style={{ color: "#fff" }} />}
      </span>
      <span className="gc-callist__label truncate">{label}</span>
    </label>);

}

// People to add, grouped by clinic location.
const ADD_PEOPLE_BY_CLINIC = [
  {
    clinic: "Bath Veterinary Clinic", sub: "Bath · UK · current",
    people: [
      { name: "Dr. Aarav Patel", role: "Veterinarian", initials: "AP", color: "#11894C" },
      { name: "Nora Hughes", role: "Veterinary nurse", initials: "NH", color: "#A26900" },
      { name: "Reception desk", role: "Front desk", initials: "RD", color: "#5A6BB0" },
      { name: "OR 1 — Surgery", role: "Resource", initials: "O1", color: "#D63B3B" },
      { name: "Boarding", role: "Resource", initials: "BD", color: "#5A6BB0" } ] },
  {
    clinic: "Bristol Animal Hospital", sub: "Bristol · UK",
    people: [
      { name: "Dr. Lena Müller", role: "Veterinarian", initials: "LM", color: "#1F6FEB" },
      { name: "Dr. Tomás García", role: "Veterinarian", initials: "TG", color: "#7C4DFF" },
      { name: "Imaging suite", role: "Resource", initials: "IS", color: "#0E7C5C" } ] },
  {
    clinic: "Wells Equine Practice", sub: "Wells · UK",
    people: [
      { name: "Dr. Hanna Kowalska", role: "Equine veterinarian", initials: "HK", color: "#B8860B" },
      { name: "Field unit", role: "Mobile resource", initials: "FU", color: "#666666" } ] } ];

function AddCalendarFlyout({ open, pos, onMouseEnter, onMouseLeave }) {
  if (!open) return null;
  return (
    <div
      className="sidenav__flyout sidenav__flyout--heading"
      style={{ position: "fixed", left: pos.left, top: pos.top, minWidth: 240 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className="sidenav__flyout-head">Add to my calendars</div>
      {ADD_PEOPLE_BY_CLINIC.map((group, gi) => (
        <React.Fragment key={group.clinic}>
          {gi > 0 && <hr className="sidenav__flyout-divider" />}
          <div className="sidenav__flyout-head" style={{ paddingTop: 8 }}>
            {group.clinic}
            <span style={{ fontWeight: 400, color: "var(--n-color-text-weaker)", marginLeft: 6 }}>· {group.sub}</span>
          </div>
          {group.people.map((p) => (
            <button key={p.name} className="sidenav__flyout-item">
              <span className="gc-callist__check" style={{ background: "transparent", borderColor: p.color, width: 12, height: 12 }} />
              <div className="flex-1" style={{ minWidth: 0 }}>
                <div className="clinic-menu-flyout__name truncate">{p.name}</div>
                <div className="clinic-menu-flyout__sub truncate">{p.role}</div>
              </div>
            </button>
          ))}
        </React.Fragment>
      ))}
      <hr className="sidenav__flyout-divider" />
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <IconA name="navigation-search" size={14} />
        <span className="flex-1">Search all clinics…</span>
      </button>
    </div>);
}

function LeftRail({ collapsed, onToggle }) {
  if (collapsed) {
    return (
      <aside className="gc-rail gc-rail--collapsed">
        <button className="gc-iconbtn" title="Expand sidebar" onClick={onToggle} aria-label="Expand sidebar">
          <IconA name="arrow-right-small" size={14} />
        </button>
        <button className="gc-iconbtn" title="Mini month">
          <IconA name="interface-calendar" size={14} />
        </button>
      </aside>);

  }
  return (
    <aside className="gc-rail">
      <div className="gc-rail__head">
        <button className="gc-iconbtn" title="Collapse sidebar" onClick={onToggle} aria-label="Collapse sidebar">
          <IconA name="arrow-left-small" size={14} />
        </button>
      </div>

      <MiniMonth />

      <div className="gc-search">
        <IconA name="navigation-search" size={12} style={{ color: "var(--n-color-icon)" }} />
        <input placeholder="Search for people" />
      </div>
    </aside>);

}

function CalendarsFilter() {
  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const [addPos, setAddPos] = React.useState({ left: 0, top: 0 });
  const addTimer = React.useRef(null);
  const addBtnRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const popRef = React.useRef(null);
  const [pos, setPos] = React.useState({ left: 0, top: 0 });

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const toggle = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ left: r.left, top: r.bottom + 4 });
    }
    setOpen((o) => !o);
  };

  const showAdd = (el) => {
    clearTimeout(addTimer.current);
    if (el) {
      const r = el.getBoundingClientRect();
      setAddPos({ left: r.right + 8, top: r.top - 4 });
    }
    setAddOpen(true);
  };
  const hideAdd = () => {
    clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAddOpen(false), 140);
  };

  return (
    <>
      <button ref={btnRef} className="gc-calfilter__btn" onClick={toggle} title="Calendar filters">
        <IconA name="interface-filter" size={11} />
        <span>Calendars</span>
        <IconA name="interface-dropdown-small" size={10} />
      </button>
      {open && (
        <div
          ref={popRef}
          className="gc-calfilter__pop"
          style={{ position: "fixed", left: pos.left, top: pos.top }}>
          <div className="gc-railsec">
            <div className="gc-railsec__head">
              <span>My calendars</span>
              <div className="row gap-xs">
                <button
                  ref={addBtnRef}
                  className="gc-iconbtn gc-iconbtn--xs"
                  title="Add people"
                  onMouseEnter={() => showAdd(addBtnRef.current)}
                  onMouseLeave={hideAdd}
                  onClick={(e) => { e.stopPropagation(); showAdd(addBtnRef.current); }}>
                  <IconA name="interface-add" size={10} />
                </button>
                <IconA name="interface-dropdown-small" size={10} style={{ color: "var(--n-color-icon)" }} />
              </div>
            </div>
            <AddCalendarFlyout
              open={addOpen}
              pos={addPos}
              onMouseEnter={() => clearTimeout(addTimer.current)}
              onMouseLeave={hideAdd} />
            <CalRow color="#0E7C5C" label="Dr. Sara Lindqvist" />
            <CalRow color="#1F6FEB" label="Consultations" />
            <CalRow color="#D63B3B" label="Surgery" />
            <CalRow color="#B8860B" label="Lab & imaging" />
            <CalRow color="#7C4DFF" label="Tasks" checked={false} />
          </div>
          <div className="gc-railsec">
            <div className="gc-railsec__head">
              <span>Other calendars</span>
              <div className="row gap-xs">
                <button className="gc-iconbtn gc-iconbtn--xs"><IconA name="interface-add" size={10} /></button>
                <IconA name="interface-dropdown-small" size={10} style={{ color: "var(--n-color-icon)" }} />
              </div>
            </div>
            <CalRow color="#11894C" label="Dr. Patel" />
            <CalRow color="#A26900" label="OR 1 — Surgery" />
            <CalRow color="#5A6BB0" label="Boarding" checked={false} />
            <CalRow color="#666666" label="UK Holidays" />
          </div>
        </div>
      )}
    </>);

}

// ---------- Header bar ----------
function CalHeader({ view, setView, onCreate }) {
  return (
    <div className="gc-topbar" style={{ backgroundColor: "rgb(252, 252, 253)" }}>
      <button className="n-button n-button--s">Today</button>
      <button className="gc-iconbtn" title="Previous week"><IconA name="arrow-left-small" size={12} /></button>
      <button className="gc-iconbtn" title="Next week"><IconA name="arrow-right-small" size={12} /></button>
      <span className="gc-range">27 Apr — 3 May 2026</span>
      <div style={{ flex: 1 }}></div>
      <button className="gc-iconbtn" title="Search"><IconA name="navigation-search" size={14} /></button>
      <button className="gc-iconbtn" title="Help"><IconA name="interface-help" size={14} /></button>
      <button className="gc-iconbtn" title="Settings"><IconA name="navigation-settings" size={14} /></button>
      <CalendarsFilter />
      <div className="gc-segmented">
        {["Day", "Week", "Kanban", "List"].map((v) =>
        <button
          key={v}
          className={"gc-segmented__btn" + (view === v.toLowerCase() ? " gc-segmented__btn--active" : "")}
          onClick={() => setView(v.toLowerCase())}>
          {v}</button>
        )}
      </div>
      <button className="gc-create" onClick={onCreate}>
        <span className="gc-create__plus"><IconA name="interface-add" size={14} /></span>
        <span>Create</span>
      </button>
    </div>);

}

// ---------- Week grid ----------
const DAYS = [
{ name: "SUN", num: 27, today: true, date: "Apr 27" },
{ name: "MON", num: 28, today: false, date: "Apr 28" },
{ name: "TUE", num: 29, today: false, date: "Apr 29" },
{ name: "WED", num: 30, today: false, date: "Apr 30" },
{ name: "THU", num: 1, today: false, date: "May 1" },
{ name: "FRI", num: 2, today: false, date: "May 2" },
{ name: "SAT", num: 3, today: false, date: "May 3" }];


const ALLDAY = [
{ col: 0, span: 7, title: "OR 1 deep clean", cal: "or" },
{ col: 1, span: 3, title: "Conference: BVNA Congress · Birmingham", cal: "events" },
{ col: 4, span: 2, title: "Dr. Patel — out of office", cal: "ooo" },
{ col: 6, span: 1, title: "Bank holiday", cal: "holiday" }];


// Each event: {col, start, end, title, sub, cal}
// cal -> color mapping below
const EVENTS = [
// Sun 27 (today)
{ col: 0, start: 8.0, end: 8.5, title: "Daily huddle", sub: "Conf room", cal: "vet" },
{ col: 0, start: 9.0, end: 9.5, title: "Bella Andersen — wellness", sub: "Rm 2 · Lindqvist", cal: "consult" },
{ col: 0, start: 9.5, end: 10.5, title: "Pixel Schmidt — spay surgery", sub: "OR 1 · Lindqvist", cal: "surgery" },
{ col: 0, start: 11.0, end: 11.5, title: "Milo Olsen — vaccination", sub: "Rm 1 · Lindqvist", cal: "consult" },
{ col: 0, start: 13.0, end: 14.0, title: "Hiro Tanaka — lameness f/u", sub: "Rm 3 · Patel", cal: "consult" },
{ col: 0, start: 14.0, end: 14.5, title: "Lab — bloodwork review", sub: "Lindqvist", cal: "lab" },
{ col: 0, start: 15.0, end: 16.0, title: "Charlie Park — dental", sub: "OR 2 · Patel", cal: "surgery" },
// Mon 28
{ col: 1, start: 8.5, end: 9.5, title: "Asha Rao — surgery consult", sub: "Rm 2", cal: "consult" },
{ col: 1, start: 10.0, end: 11.0, title: "Mochi Yamada — GI workup", sub: "Lindqvist", cal: "consult" },
{ col: 1, start: 11.0, end: 12.0, title: "Imaging — Olive Brown", sub: "X-ray suite", cal: "lab" },
{ col: 1, start: 13.5, end: 14.5, title: "Bruno Costa — recheck", sub: "Rm 1 · Lindqvist", cal: "consult" },
{ col: 1, start: 15.0, end: 16.5, title: "Surgery — Coco Bernard", sub: "OR 1 · Patel", cal: "surgery" },
// Tue 29
{ col: 2, start: 9.0, end: 9.5, title: "Daisy Mendez — annual", sub: "Lindqvist", cal: "consult" },
{ col: 2, start: 9.5, end: 11.0, title: "Pepper Romano — pre-purchase", sub: "Patel", cal: "consult" },
{ col: 2, start: 11.0, end: 11.5, title: "Tasks review", sub: "Lindqvist", cal: "task" },
{ col: 2, start: 13.0, end: 14.0, title: "Charlie Park — dental f/u", sub: "Rm 3 · Patel", cal: "consult" },
{ col: 2, start: 14.0, end: 15.5, title: "Surgery — Riley Black", sub: "OR 1 · Lindqvist", cal: "surgery" },
// Wed 30
{ col: 3, start: 8.0, end: 9.0, title: "Surgery prep — OR 1", sub: "Pre-op briefing", cal: "surgery" },
{ col: 3, start: 9.0, end: 10.5, title: "Spay block — 3 patients", sub: "OR 1 · Lindqvist", cal: "surgery" },
{ col: 3, start: 11.0, end: 11.5, title: "Toby Green — derm", sub: "Rm 2 · Lindqvist", cal: "consult" },
{ col: 3, start: 13.0, end: 14.0, title: "Felix White — vaccine", sub: "Rm 1 · Patel", cal: "consult" },
{ col: 3, start: 14.5, end: 15.5, title: "Bloodwork — 4 panels", sub: "Lab", cal: "lab" },
// Thu 1
{ col: 4, start: 9.0, end: 10.0, title: "Buddy Lee — wellness", sub: "Rm 2 · Lindqvist", cal: "consult" },
{ col: 4, start: 10.0, end: 11.5, title: "Imaging — Pepper Romano", sub: "X-ray suite", cal: "lab" },
{ col: 4, start: 13.0, end: 14.5, title: "Surgery — Nala Brooks", sub: "OR 1 · Patel", cal: "surgery" },
{ col: 4, start: 15.0, end: 15.5, title: "Ziggy Park — suture removal", sub: "Rm 3", cal: "consult" },
// Fri 2
{ col: 5, start: 8.5, end: 9.5, title: "Team meeting", sub: "Conf room", cal: "vet" },
{ col: 5, start: 10.0, end: 11.0, title: "Behavior consult — Riley Black", sub: "Rm 2", cal: "consult" },
{ col: 5, start: 11.0, end: 12.0, title: "Inventory check", sub: "Stockroom", cal: "task" },
{ col: 5, start: 13.0, end: 14.0, title: "Bella — bloodwork results", sub: "Phone · Lindqvist", cal: "consult" },
{ col: 5, start: 14.0, end: 15.0, title: "Surgery — Pixel f/u", sub: "OR 2 · Lindqvist", cal: "surgery" },
// Sat 3
{ col: 6, start: 9.0, end: 10.0, title: "Walk-in clinic", sub: "Rm 1", cal: "consult" },
{ col: 6, start: 10.0, end: 11.0, title: "Walk-in clinic", sub: "Rm 1", cal: "consult" },
{ col: 6, start: 11.0, end: 12.0, title: "Walk-in clinic", sub: "Rm 1", cal: "consult" }];


const CAL_COLORS = {
  vet: { bg: "#0E7C5C", fg: "#fff" },
  consult: { bg: "#1F6FEB", fg: "#fff" },
  surgery: { bg: "#D63B3B", fg: "#fff" },
  lab: { bg: "#B8860B", fg: "#fff" },
  task: { bg: "#7C4DFF", fg: "#fff" },
  ooo: { bg: "#666", fg: "#fff" },
  events: { bg: "#0EA5E9", fg: "#fff" },
  or: { bg: "#A26900", fg: "#fff" },
  holiday: { bg: "#11894C", fg: "#fff" }
};

const HOURS = Array.from({ length: 13 }, (_, i) => 7 + i); // 7am..7pm
const HOUR_PX = 48;

// Compute overlap groups per column for proper side-by-side rendering
function layoutEvents(events) {
  const byCol = {};
  events.forEach((e) => {(byCol[e.col] ||= []).push(e);});
  const out = [];
  Object.values(byCol).forEach((list) => {
    list.sort((a, b) => a.start - b.start || b.end - a.end);
    // simple lane assignment
    const lanes = [];
    list.forEach((ev) => {
      let lane = 0;
      while (lanes[lane] && lanes[lane] > ev.start) lane++;
      lanes[lane] = ev.end;
      ev._lane = lane;
    });
    const totalLanes = lanes.length;
    list.forEach((ev) => {ev._lanes = totalLanes;out.push(ev);});
  });
  return out;
}

function fmtTime(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const ampm = hh >= 12 ? "PM" : "AM";
  const h12 = (hh + 11) % 12 + 1;
  return mm === 0 ? `${h12} ${ampm}` : `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function WeekGrid() {
  const events = React.useMemo(() => layoutEvents(EVENTS.map((e) => ({ ...e }))), []);
  const NOW = 14.25; // 2:15 PM today
  const todayCol = 0;
  const apptCtx = React.useContext(ApptCtx);
  const openEvent = (e) => {
    const found = TODAY_APPTS.find((a) => a.patient === e.title || a.reason === e.title);
    const appt = found || {
      id: `evt-${e.col}-${e.start}`,
      time: fmtTime(e.start), end: fmtTime(e.end),
      patient: e.title, species: null, owner: e.sub || "—",
      reason: e.title, vet: "—", room: e.sub || "—",
      cal: e.cal, status: "scheduled" };
    apptCtx.open({ kind: "appt", appt });
  };

  return (
    <div className="gc-grid">
      {/* Day header strip */}
      <div className="gc-daystrip">
        <div className="gc-daystrip__gutter">GMT</div>
        {DAYS.map((d, i) =>
        <div key={i} className={"gc-daystrip__cell" + (d.today ? " gc-daystrip__cell--today" : "")}>
            <div className="gc-daystrip__name">{d.name}</div>
            <div className="gc-daystrip__num">
              {d.today ? <span className="gc-daystrip__pill">{d.num}</span> : d.num}
            </div>
          </div>
        )}
      </div>

      {/* All-day strip */}
      <div className="gc-allday">
        <div className="gc-allday__gutter">All day</div>
        <div className="gc-allday__lanes">
          {ALLDAY.map((a, i) => {
            const c = CAL_COLORS[a.cal] || CAL_COLORS.consult;
            return (
              <div key={i} className="gc-allday__chip" style={{
                gridColumn: `${a.col + 1} / span ${a.span}`,
                background: c.bg, color: c.fg
              }}>{a.title}</div>);

          })}
        </div>
      </div>

      {/* Scrollable hours */}
      <div className="gc-hours">
        <div className="gc-hours__gutter">
          {HOURS.map((h) =>
          <div key={h} className="gc-hours__label" style={{ height: HOUR_PX }}>{fmtTime(h)}</div>
          )}
        </div>

        <div className="gc-hours__cols">
          {DAYS.map((d, ci) =>
          <div key={ci} className={"gc-daycol" + (d.today ? " gc-daycol--today" : "")}>
              {/* hour lines */}
              {HOURS.map((h, hi) =>
            <div key={hi} className="gc-daycol__slot" style={{ height: HOUR_PX }} />
            )}

              {/* now indicator */}
              {ci === todayCol &&
            <div className="gc-now" style={{ top: (NOW - HOURS[0]) * HOUR_PX }}>
                  <span className="gc-now__dot"></span>
                </div>
            }

              {/* events */}
              {events.filter((e) => e.col === ci).map((e, i) => {
              const c = CAL_COLORS[e.cal] || CAL_COLORS.consult;
              const top = (e.start - HOURS[0]) * HOUR_PX;
              const height = (e.end - e.start) * HOUR_PX - 2;
              const widthPct = 100 / e._lanes;
              const leftPct = e._lane * widthPct;
              const isShort = e.end - e.start <= 0.5;
              return (
                <div
                  key={i}
                  className={"gc-event" + (isShort ? " gc-event--short" : "")}
                  onClick={() => openEvent(e)}
                  style={{
                    top, height,
                    left: `calc(${leftPct}% + 2px)`,
                    width: `calc(${widthPct}% - 4px)`,
                    background: c.bg,
                    color: c.fg,
                    cursor: "pointer"
                  }}>
                  
                    <div className="gc-event__title truncate">{e.title}</div>
                    {!isShort && <div className="gc-event__sub truncate">{fmtTime(e.start)} · {e.sub}</div>}
                  </div>);

            })}
            </div>
          )}
        </div>
      </div>
    </div>);

}

// ---------- Shared appt rows (today's appointments enriched) ----------
const TODAY_APPTS = [
  { id: "a1",  time: "08:00", end: "08:30", patient: "Bella Andersen",   species: "canine", owner: "Karin Andersen",  reason: "Annual wellness exam",       vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "completed" },
  { id: "a2",  time: "08:30", end: "09:00", patient: "Daily huddle",     species: null,     owner: "Internal",         reason: "Team huddle",                vet: "—",             room: "Conf",  cal: "vet",     status: "completed" },
  { id: "a3",  time: "09:00", end: "09:30", patient: "Milo Olsen",       species: "canine", owner: "Amy Collins",      reason: "Vaccination — DHPP booster", vet: "Dr. Lindqvist", room: "Rm 1",  cal: "consult", status: "completed" },
  { id: "a4",  time: "09:30", end: "10:30", patient: "Pixel Schmidt",    species: "feline", owner: "Liam Schmidt",     reason: "Spay surgery",               vet: "Dr. Lindqvist", room: "OR 1",  cal: "surgery", status: "in-room" },
  { id: "a5",  time: "10:00", end: "10:30", patient: "Hiro Tanaka",      species: "canine", owner: "Yuki Tanaka",      reason: "Lameness recheck",           vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "checked-in" },
  { id: "a6",  time: "10:30", end: "11:00", patient: "Mochi Yamada",     species: "feline", owner: "Ren Yamada",       reason: "GI workup",                  vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "checked-in" },
  { id: "a7",  time: "11:00", end: "11:30", patient: "Olive Brown",      species: "canine", owner: "Mark Brown",       reason: "Imaging — X-ray L hind",     vet: "Dr. Patel",     room: "X-ray", cal: "lab",     status: "checked-in" },
  { id: "a8",  time: "11:30", end: "12:00", patient: "Toby Green",       species: "canine", owner: "Sophie Green",     reason: "Dermatology consult",        vet: "Dr. Lindqvist", room: "Rm 1",  cal: "consult", status: "ready-checkout" },
  { id: "a9",  time: "13:00", end: "13:30", patient: "Felix White",      species: "feline", owner: "Anna White",       reason: "FVRCP vaccine",              vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "scheduled" },
  { id: "a10", time: "13:30", end: "14:00", patient: "Bruno Costa",      species: "canine", owner: "Marco Costa",      reason: "Post-op recheck",            vet: "Dr. Lindqvist", room: "Rm 1",  cal: "consult", status: "scheduled" },
  { id: "a11", time: "14:00", end: "14:30", patient: "Rocco Murphy",     species: "canine", owner: "Sean Murphy",      reason: "Bloodwork results review",   vet: "Dr. Lindqvist", room: "Phone", cal: "lab",     status: "scheduled" },
  { id: "a12", time: "14:30", end: "15:30", patient: "Charlie Park",     species: "canine", owner: "Joon Park",        reason: "Dental cleaning + scale",    vet: "Dr. Patel",     room: "OR 2",  cal: "surgery", status: "scheduled" },
  { id: "a13", time: "15:00", end: "15:30", patient: "Asha Rao",         species: "feline", owner: "Priya Rao",        reason: "Surgery consult",            vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "scheduled" },
  { id: "a14", time: "15:30", end: "16:00", patient: "Pepper Romano",    species: "canine", owner: "Eli Romano",       reason: "Pre-purchase exam",          vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "scheduled" },
  { id: "a15", time: "16:00", end: "16:30", patient: "Riley Black",      species: "canine", owner: "Tara Black",       reason: "Behavior consult",           vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "scheduled" },
  { id: "a16", time: "16:30", end: "17:00", patient: "Ziggy Park",       species: "feline", owner: "Joon Park",        reason: "Suture removal",             vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "scheduled" },
  { id: "a17", time: "17:00", end: "17:30", patient: "Buddy Lee",        species: "canine", owner: "Helen Lee",        reason: "Wellness exam",              vet: "Dr. Lindqvist", room: "Rm 1",  cal: "consult", status: "scheduled" },
  { id: "a18", time: "17:30", end: "18:00", patient: "Coco Bernard",     species: "canine", owner: "Luc Bernard",      reason: "Recheck — ear infection",    vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "scheduled" },
];

const STATUS_META = {
  scheduled:       { label: "Scheduled",       tone: "#8A8F98",  pill: "Scheduled" },
  "checked-in":    { label: "Checked in",      tone: "#1F6FEB",  pill: "Checked in" },
  "in-room":       { label: "In room",         tone: "#7C4DFF",  pill: "In room" },
  "ready-checkout":{ label: "Ready to checkout", tone: "#B8860B", pill: "Ready to checkout" },
  completed:       { label: "Completed",       tone: "#0E7C5C",  pill: "Completed" },
};

const KANBAN_COLS = ["scheduled", "checked-in", "in-room", "ready-checkout", "completed"];

function SpeciesGlyph({ kind }) {
  if (!kind) return <span className="kn-glyph kn-glyph--neutral">·</span>;
  const map = { canine: "generic-pet-paw", feline: "generic-pet-paw" };
  return <IconA name={map[kind] || "generic-pet-paw"} size={11} style={{ color: "var(--n-color-text-weaker)" }} />;
}

// ---------- Kanban ----------
function KanbanBoard() {
  const apptCtx = React.useContext(ApptCtx);
  const grouped = React.useMemo(() => {
    const g = Object.fromEntries(KANBAN_COLS.map(k => [k, []]));
    TODAY_APPTS.forEach(a => { (g[a.status] || g.scheduled).push(a); });
    return g;
  }, []);
  return (
    <div className="kn">
      {KANBAN_COLS.map((key) => {
        const meta = STATUS_META[key];
        const items = grouped[key] || [];
        return (
          <section key={key} className="kn-col">
            <header className="kn-col__head">
              <span className="kn-col__dot" style={{ background: meta.tone }} />
              <span className="kn-col__title">{meta.label}</span>
              <span className="kn-col__count">{items.length}</span>
              <div style={{ flex: 1 }} />
              <button className="gc-iconbtn gc-iconbtn--xs" title="Add"><IconA name="interface-add" size={10} /></button>
              <button className="gc-iconbtn gc-iconbtn--xs" title="More"><IconA name="interface-menu-small" size={10} /></button>
            </header>
            <div className="kn-col__body">
              {items.map((a) => {
                const c = CAL_COLORS[a.cal] || CAL_COLORS.consult;
                return (
                  <article key={a.id} className="kn-card" onClick={() => apptCtx.open({ kind: "appt", appt: a })} style={{ cursor: "pointer" }}>
                    <span className="kn-card__bar" style={{ background: c.bg }} />
                    <div className="kn-card__row kn-card__row--top">
                      <span className="kn-card__time tnum">{a.time}</span>
                      <span className="kn-card__dur tnum">{Math.round((parseTime(a.end) - parseTime(a.time)) * 60)}m</span>
                      <div style={{ flex: 1 }} />
                      <span className="kn-card__pill" style={{ borderColor: meta.tone, color: meta.tone }}>{meta.pill}</span>
                    </div>
                    <div className="kn-card__title">
                      <SpeciesGlyph kind={a.species} />
                      <span className="truncate">{a.patient}</span>
                    </div>
                    <div className="kn-card__sub truncate">{a.reason}</div>
                    <div className="kn-card__meta">
                      <span className="truncate">{a.owner}</span>
                      <span className="kn-card__dot-sep">·</span>
                      <span>{a.room}</span>
                    </div>
                    <div className="kn-card__foot">
                      <AvatarA name={a.vet} size="2xs" />
                      <span className="truncate">{a.vet}</span>
                    </div>
                  </article>
                );
              })}
              <button className="kn-col__add">
                <IconA name="interface-add" size={11} style={{ color: "var(--n-color-icon)" }} />
                <span>Add appointment</span>
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function parseTime(s) {
  const [h, m] = s.split(":").map(Number);
  return h + m / 60;
}

// ---------- List ----------
const LIST_DAYS = [
  { key: "today",     label: "Today",       sub: "Mon, 27 Apr 2026", filter: () => TODAY_APPTS },
  { key: "tomorrow",  label: "Tomorrow",    sub: "Tue, 28 Apr 2026",
    items: [
      { id: "t1",  time: "08:30", end: "09:30", patient: "Asha Rao",      species: "feline", owner: "Priya Rao",       reason: "Surgery consult",          vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "scheduled" },
      { id: "t2",  time: "10:00", end: "11:00", patient: "Mochi Yamada",  species: "feline", owner: "Ren Yamada",      reason: "GI workup",                vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "scheduled" },
      { id: "t3",  time: "11:00", end: "12:00", patient: "Olive Brown",   species: "canine", owner: "Mark Brown",      reason: "Imaging — X-ray L hind",   vet: "Dr. Patel",     room: "X-ray", cal: "lab",     status: "scheduled" },
      { id: "t4",  time: "13:30", end: "14:30", patient: "Bruno Costa",   species: "canine", owner: "Marco Costa",     reason: "Post-op recheck",          vet: "Dr. Lindqvist", room: "Rm 1",  cal: "consult", status: "scheduled" },
      { id: "t5",  time: "15:00", end: "16:30", patient: "Coco Bernard",  species: "canine", owner: "Luc Bernard",     reason: "Mass removal — surgery",   vet: "Dr. Patel",     room: "OR 1",  cal: "surgery", status: "scheduled" },
    ]
  },
  { key: "wed",       label: "Wednesday",   sub: "Wed, 29 Apr 2026",
    items: [
      { id: "w1",  time: "09:00", end: "09:30", patient: "Daisy Mendez",  species: "canine", owner: "Carlos Mendez",   reason: "Annual wellness exam",     vet: "Dr. Lindqvist", room: "Rm 2",  cal: "consult", status: "scheduled" },
      { id: "w2",  time: "09:30", end: "11:00", patient: "Pepper Romano", species: "equine", owner: "Eli Romano",      reason: "Pre-purchase exam",        vet: "Dr. Patel",     room: "Field", cal: "consult", status: "scheduled" },
      { id: "w3",  time: "13:00", end: "14:00", patient: "Charlie Park",  species: "canine", owner: "Joon Park",       reason: "Dental f/u",               vet: "Dr. Patel",     room: "Rm 3",  cal: "consult", status: "scheduled" },
      { id: "w4",  time: "14:00", end: "15:30", patient: "Riley Black",   species: "canine", owner: "Tara Black",      reason: "Surgery — orthopedic",     vet: "Dr. Lindqvist", room: "OR 1",  cal: "surgery", status: "scheduled" },
    ]
  },
];

function ListView() {
  const apptCtx = React.useContext(ApptCtx);
  return (
    <div className="ls">
      <div className="ls-toolbar">
        <div className="ls-tabs">
          <button className="ls-tab ls-tab--active">All <span className="ls-tab__count">42</span></button>
          <button className="ls-tab">Mine <span className="ls-tab__count">14</span></button>
          <button className="ls-tab">Surgery <span className="ls-tab__count">5</span></button>
          <button className="ls-tab">Lab <span className="ls-tab__count">3</span></button>
        </div>
        <div style={{ flex: 1 }} />
        <button className="ls-chip"><IconA name="interface-filter" size={11} /> Filter</button>
        <button className="ls-chip"><IconA name="interface-sort-small" size={11} /> Time ↑</button>
        <button className="ls-chip"><IconA name="interface-edit" size={11} /> Group: Day</button>
      </div>

      <div className="ls-head">
        <div className="ls-cell ls-cell--time">Time</div>
        <div className="ls-cell ls-cell--patient">Patient</div>
        <div className="ls-cell">Owner</div>
        <div className="ls-cell ls-cell--reason">Reason</div>
        <div className="ls-cell">Vet</div>
        <div className="ls-cell ls-cell--room">Room</div>
        <div className="ls-cell ls-cell--status">Status</div>
        <div className="ls-cell ls-cell--end" />
      </div>

      <div className="ls-body">
        {LIST_DAYS.map((day) => {
          const items = day.filter ? day.filter() : day.items;
          return (
            <section key={day.key} className="ls-section">
              <header className="ls-section__head">
                <IconA name="interface-dropdown-small" size={10} style={{ color: "var(--n-color-icon)" }} />
                <span className="ls-section__label">{day.label}</span>
                <span className="ls-section__sub">{day.sub}</span>
                <span className="ls-section__count">{items.length}</span>
              </header>
              {items.map((a) => {
                const c = CAL_COLORS[a.cal] || CAL_COLORS.consult;
                const meta = STATUS_META[a.status];
                return (
                  <div key={a.id} className="ls-row" onClick={() => apptCtx.open({ kind: "appt", appt: a })} style={{ cursor: "pointer" }}>
                    <div className="ls-cell ls-cell--time">
                      <span className="ls-row__bar" style={{ background: c.bg }} />
                      <span className="tnum">{a.time}</span>
                      <span className="ls-row__dur tnum">– {a.end}</span>
                    </div>
                    <div className="ls-cell ls-cell--patient">
                      <SpeciesGlyph kind={a.species} />
                      <span className="ls-row__name truncate">{a.patient}</span>
                    </div>
                    <div className="ls-cell truncate">{a.owner}</div>
                    <div className="ls-cell ls-cell--reason truncate">{a.reason}</div>
                    <div className="ls-cell ls-cell--vet">
                      <AvatarA name={a.vet} size="2xs" />
                      <span className="truncate">{a.vet}</span>
                    </div>
                    <div className="ls-cell ls-cell--room truncate">{a.room}</div>
                    <div className="ls-cell ls-cell--status">
                      <span className="ls-pill" style={{ borderColor: meta.tone, color: meta.tone }}>
                        <span className="ls-pill__dot" style={{ background: meta.tone }} />
                        {meta.pill}
                      </span>
                    </div>
                    <div className="ls-cell ls-cell--end">
                      <button className="gc-iconbtn gc-iconbtn--xs" title="More"><IconA name="interface-menu-small" size={10} /></button>
                    </div>
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Day view (single day, reuse week grid for one column) ----------
function DayView() {
  const apptCtx = React.useContext(ApptCtx);
  return (
    <div className="gc-day">
      <div className="gc-day__inner">
        <div className="gc-day__head">
          <div className="gc-day__name">MONDAY</div>
          <div className="gc-day__num">27 April</div>
        </div>
        <div className="gc-day__list">
          {TODAY_APPTS.map((a) => {
            const c = CAL_COLORS[a.cal] || CAL_COLORS.consult;
            const meta = STATUS_META[a.status];
            return (
              <div key={a.id} className="gc-day__row" onClick={() => apptCtx.open({ kind: "appt", appt: a })} style={{ cursor: "pointer" }}>
                <div className="gc-day__time tnum">
                  <span>{a.time}</span>
                  <span className="gc-day__time-end">{a.end}</span>
                </div>
                <span className="gc-day__bar" style={{ background: c.bg }} />
                <div className="gc-day__body">
                  <div className="gc-day__title">
                    <SpeciesGlyph kind={a.species} />
                    <span>{a.patient}</span>
                    <span className="gc-day__sep">·</span>
                    <span className="gc-day__reason truncate">{a.reason}</span>
                  </div>
                  <div className="gc-day__meta">
                    <AvatarA name={a.vet} size="2xs" />
                    <span>{a.vet}</span>
                    <span className="gc-day__sep">·</span>
                    <span>{a.room}</span>
                    <span className="gc-day__sep">·</span>
                    <span>{a.owner}</span>
                  </div>
                </div>
                <span className="ls-pill" style={{ borderColor: meta.tone, color: meta.tone }}>
                  <span className="ls-pill__dot" style={{ background: meta.tone }} />
                  {meta.pill}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ApptSidePanel({ state, setState }) {
  const [tab, setTab] = React.useState("info"); // info | patient | client | chat
  React.useEffect(() => {
    if (!state) return;
    if (state.kind === "create") setTab("info");
    else if (state.kind === "appt") setTab("info");
  }, [state?.kind, state?.appt?.id]);

  if (!state) return null;
  const close = () => setState(null);

  const a = state.kind === "appt" ? state.appt : null;
  const cal = a ? (CAL_COLORS[a.cal] || CAL_COLORS.consult) : null;
  const status = a ? STATUS_META[a.status] : null;
  const isCreate = state.kind === "create";

  return (
    <aside className="aside aside--appt gc-side">
      <div className="gc-side__head">
        <div className="gc-side__tabs">
          <button
            className={"gc-side__tab" + (tab === "info" ? " gc-side__tab--active" : "")}
            title={isCreate ? "Create" : "Appointment"}
            onClick={() => setTab("info")}>
            <IconA name="interface-calendar" size={14} />
          </button>
          <button
            className={"gc-side__tab" + (tab === "patient" ? " gc-side__tab--active" : "")}
            title="Patient info"
            disabled={isCreate}
            style={isCreate ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
            onClick={() => !isCreate && setTab("patient")}>
            <IconA name="generic-pet-paw" size={14} />
          </button>
          <button
            className={"gc-side__tab" + (tab === "client" ? " gc-side__tab--active" : "")}
            title="Client info"
            disabled={isCreate}
            style={isCreate ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
            onClick={() => !isCreate && setTab("client")}>
            <IconA name="user-single" size={14} />
          </button>
          <button
            className={"gc-side__tab" + (tab === "chat" ? " gc-side__tab--active" : "")}
            title="Chat with Provet"
            onClick={() => setTab("chat")}>
            <IconA name="interface-chat" size={14} />
          </button>
        </div>
        <button className="gc-side__close" title="Close" onClick={close}>
          <IconA name="interface-close-small" size={14} />
        </button>
      </div>

      {tab === "chat" ? (
        <div className="gc-side__body">
          {window.AskAIChatPanel
            ? <window.AskAIChatPanel mode="sidebar" />
            : <div className="gc-side__body--pad"><div className="gc-side__sub">Chat unavailable.</div></div>}
        </div>
      ) : tab === "patient" && a ? (
        <ApptPatientView appt={a} />
      ) : tab === "client" && a ? (
        <ApptClientView appt={a} />
      ) : isCreate ? (
        <CreatePicker setState={setState} close={close} />
      ) : (
        <ApptInfoView appt={a} cal={cal} status={status} />
      )}
    </aside>);
}

function CreatePicker({ setState, close }) {
  const items = [
    { kind: "appointment", icon: "interface-calendar", title: "New appointment", desc: "Book a slot for an existing client and patient." },
    { kind: "client",      icon: "user-multiple",      title: "New client",      desc: "Add a new client (owner) to this clinic." },
    { kind: "patient",     icon: "generic-pet-paw",    title: "New patient",     desc: "Register a new pet under an existing client." } ];
  return (
    <div className="gc-side__body gc-side__body--pad">
      <div className="gc-side__h2">Create</div>
      <div className="gc-side__sub" style={{ marginBottom: 12 }}>What would you like to create?</div>
      <div className="gc-side__create-grid">
        {items.map((it) => (
          <button key={it.kind} className="gc-side__create-card" onClick={close}>
            <span className="gc-side__create-icon"><IconA name={it.icon} size={16} /></span>
            <span className="gc-side__create-text">
              <span className="gc-side__create-title">{it.title}</span>
              <span className="gc-side__create-desc">{it.desc}</span>
            </span>
          </button>
        ))}
      </div>
    </div>);
}

function ApptInfoView({ appt: a, cal, status }) {
  return (
    <div className="gc-side__body gc-side__body--pad">
      <div className="gc-side__card">
        <div className="gc-side__title">
          <span style={{ width: 10, height: 10, borderRadius: 3, background: cal.bg, flex: "none" }} />
          {a.patient}
        </div>
        <div className="gc-side__sub">{a.reason}</div>
        <div className="gc-side__chip-row">
          <span className="gc-side__chip gc-side__chip--active">
            <span className="gc-side__status-dot" style={{ background: status.tone }} />
            {status.pill}
          </span>
        </div>
      </div>

      <div className="gc-side__card">
        <div className="gc-side__row">
          <span className="gc-side__row-label">When</span>
          <span className="gc-side__row-val">Mon, 27 Apr 2026 · {a.time}–{a.end}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Veterinarian</span>
          <span className="gc-side__row-val">
            <span className="gc-side__avatar" style={{ width: 20, height: 20, fontSize: 10 }}>{a.vet.replace(/Dr\.?\s*/, "").charAt(0)}</span>
            {a.vet}
          </span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Room</span>
          <span className="gc-side__row-val">{a.room}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Calendar</span>
          <span className="gc-side__row-val">
            <span style={{ width: 8, height: 8, borderRadius: 2, background: cal.bg }} />
            {a.cal === "consult" ? "Consultations" :
             a.cal === "surgery" ? "Surgery" :
             a.cal === "lab" ? "Lab & imaging" :
             a.cal === "vet" ? "Internal" : a.cal}
          </span>
        </div>
      </div>

      <div className="gc-side__card">
        <div className="gc-side__title" style={{ fontSize: 13, marginBottom: 6 }}>Client &amp; patient</div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Owner</span>
          <span className="gc-side__row-val">{a.owner}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Patient</span>
          <span className="gc-side__row-val">{a.patient} · {a.species || "—"}</span>
        </div>
      </div>

      <div className="gc-side__btnrow">
        <button className="n-button n-button--s n-button--primary" style={{ flex: 1 }}>Open in detail</button>
        <button className="n-button n-button--s">Edit</button>
      </div>
    </div>);
}

// Deterministic enrichment for the side panel. Derives stable
// extra fields from the appointment so the Patient/Client tabs
// always have something concrete to show.
function enrichForSidePanel(a) {
  const patientName = (a.patient || "").split(" ")[0] || "Patient";
  const ownerName = a.owner || "—";
  const species = a.species || "canine";

  // Tiny stable hash on patient id for deterministic detail
  const seed = (a.id || a.patient || "x").split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const breeds = {
    canine: ["Labrador", "Cocker Spaniel", "Bulldog", "Shiba Inu", "Border Collie", "Beagle"],
    feline: ["Maine Coon", "Domestic SH", "Bengal", "British Shorthair", "Ragdoll"],
    avian:  ["Cockatiel", "Budgerigar"],
    equine: ["Andalusian"],
  };
  const list = breeds[species] || breeds.canine;
  const breed = list[seed % list.length];
  const sex = (seed % 2 === 0) ? "F (sp.)" : "M (n.)";
  const ages = ["1 yr", "2 yr", "3 yr", "5 yr", "7 yr", "9 yr"];
  const age = ages[seed % ages.length];
  const weights = species === "feline"
    ? ["3.4 kg", "4.2 kg", "5.1 kg", "6.0 kg"]
    : species === "avian" ? ["0.09 kg", "0.04 kg"]
    : species === "equine" ? ["498 kg"]
    : ["12.4 kg", "18.7 kg", "22.7 kg", "28.4 kg", "32.0 kg"];
  const weight = weights[seed % weights.length];
  const microchip = "956 000 0" + String(10000000 + (seed * 4817) % 89999999).slice(0, 8);

  // Owner-side derived fields
  const firstOwner = ownerName.split(" ")[0] || "Owner";
  const lastOwner = ownerName.split(" ").slice(1).join(" ") || "Andersen";
  const phone = "+44 7" + String(700000 + (seed * 313) % 299999).slice(0, 6) + " " + String(100 + (seed * 37) % 899);
  const email = (firstOwner + "." + lastOwner).toLowerCase().replace(/[^a-z.]/g, "") + "@gmail.com";
  const sinceYear = 2018 + (seed % 7);
  const balanceN = ((seed * 17) % 240) - 30;
  const balance = balanceN >= 0 ? `£${balanceN.toFixed(2)}` : `−£${Math.abs(balanceN).toFixed(2)}`;
  const overdue = balanceN < 0;
  const addr = `${10 + (seed % 89)} ${["Rosemary Ln","Whitfield Rd","Park View","Albion St","Hillcrest Ave"][seed % 5]}, ${["Brighton","Bristol","Leeds","Manchester","Edinburgh"][seed % 5]}`;

  // Visits
  const visits = [
    { date: "14 Mar 2026", title: "Wellness exam", who: "Dr. Lindqvist" },
    { date: "02 Jan 2026", title: "Vaccination — DHPP", who: "Dr. Patel" },
    { date: "18 Oct 2025", title: "Lameness recheck", who: "Dr. Lindqvist" },
  ];

  // Pet roster (other pets under same client)
  const otherPets = [
    { name: "Whiskers", species: "feline", breed: "Domestic SH", age: "9 yr" },
    { name: "Pip", species: "avian", breed: "Budgerigar", age: "2 yr" },
  ].slice(0, (seed % 3));

  return {
    patientName, ownerName, species, breed, sex, age, weight, microchip,
    phone, email, sinceYear, balance, overdue, addr,
    visits, otherPets,
    alerts: (seed % 4 === 0) ? ["Allergies"] : [],
    weightTrend: (seed % 3 === 0) ? "+0.4 kg vs Mar" : "stable",
  };
}

function speciesLabel(s) {
  if (!s) return "—";
  const t = String(s).toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function ApptPatientView({ appt: a }) {
  const e = enrichForSidePanel(a);
  const speciesIcon = e.species === "feline" ? "generic-pet-paw"
                    : e.species === "avian"  ? "generic-pet-paw"
                    : "generic-pet-paw";
  return (
    <div className="gc-side__body gc-side__body--pad">
      {/* Header: avatar + name + breed line + quick actions */}
      <div className="gc-side__card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span className="gc-side__avatar" style={{ width: 44, height: 44, fontSize: 16, background: "var(--n-color-active)", color: "var(--n-color-text)" }}>
            <IconA name={speciesIcon} size={20} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gc-side__title" style={{ fontSize: 15, marginBottom: 2 }}>{a.patient}</div>
            <div className="gc-side__sub" style={{ fontSize: 12 }}>
              {speciesLabel(e.species)} · {e.breed} · {e.sex} · {e.age}
            </div>
          </div>
        </div>
        <div className="gc-side__chip-row" style={{ marginTop: 0 }}>
          {e.alerts.map((al) => (
            <span key={al} className="gc-side__chip" style={{ background: "color-mix(in oklab, #c0392b 14%, transparent)", color: "#c0392b", borderColor: "transparent" }}>
              <IconA name="interface-alert-triangle" size={10} />{al}
            </span>
          ))}
          <span className="gc-side__chip"><IconA name="interface-tag" size={10} />Active</span>
        </div>
      </div>

      {/* Vitals snapshot */}
      <div className="gc-side__card">
        <div className="gc-side__title" style={{ fontSize: 12, marginBottom: 8, color: "var(--n-color-text-weaker)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Snapshot</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>Weight</div>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="tnum">{e.weight}</div>
            <div style={{ fontSize: 10, color: e.weightTrend === "stable" ? "var(--n-color-text-weaker)" : "#b8860b" }}>{e.weightTrend}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>Age</div>
            <div style={{ fontSize: 14, fontWeight: 600 }} className="tnum">{e.age}</div>
            <div style={{ fontSize: 10, color: "var(--n-color-text-weaker)" }}>DOB on file</div>
          </div>
        </div>
      </div>

      {/* Identifiers */}
      <div className="gc-side__card">
        <div className="gc-side__row">
          <span className="gc-side__row-label">Species</span>
          <span className="gc-side__row-val">{speciesLabel(e.species)}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Breed</span>
          <span className="gc-side__row-val">{e.breed}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Sex</span>
          <span className="gc-side__row-val">{e.sex}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Microchip</span>
          <span className="gc-side__row-val tnum" style={{ fontFamily: "var(--n-font-family-mono, ui-monospace)" }}>{e.microchip}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Reminders</span>
          <span className="gc-side__row-val">DHPP booster due May</span>
        </div>
      </div>

      {/* Recent visits */}
      <div className="gc-side__h2">Recent visits</div>
      <div className="gc-side__card" style={{ padding: 0 }}>
        {e.visits.map((v, i) => (
          <div key={i} className="gc-side__row" style={{ padding: "10px 12px", display: "block" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--n-color-text)" }}>{v.title}</span>
              <span className="tnum" style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>{v.date}</span>
            </div>
            <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)", marginTop: 2 }}>{v.who}</div>
          </div>
        ))}
      </div>

      <div className="gc-side__btnrow">
        <button className="n-button n-button--s n-button--primary" style={{ flex: 1 }}>Open patient record</button>
        <button className="n-button n-button--s" title="New note"><IconA name="interface-edit" size={12} /></button>
      </div>
    </div>);
}

function ApptClientView({ appt: a }) {
  const e = enrichForSidePanel(a);
  const initials = (e.ownerName || "—").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="gc-side__body gc-side__body--pad">
      {/* Header */}
      <div className="gc-side__card">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <span className="gc-side__avatar" style={{ width: 44, height: 44, fontSize: 14 }}>{initials}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gc-side__title" style={{ fontSize: 15, marginBottom: 2 }}>{e.ownerName}</div>
            <div className="gc-side__sub" style={{ fontSize: 12 }}>Client since {e.sinceYear}</div>
          </div>
        </div>
        {/* Quick actions */}
        <div style={{ display: "flex", gap: 6 }}>
          <button className="n-button n-button--s" style={{ flex: 1 }}><IconA name="interface-phone" size={11} /> Call</button>
          <button className="n-button n-button--s" style={{ flex: 1 }}><IconA name="interface-message" size={11} /> SMS</button>
          <button className="n-button n-button--s" title="Email"><IconA name="interface-email" size={11} /></button>
        </div>
      </div>

      {/* Contact */}
      <div className="gc-side__card">
        <div className="gc-side__row">
          <span className="gc-side__row-label">Phone</span>
          <span className="gc-side__row-val tnum">{e.phone}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Email</span>
          <span className="gc-side__row-val truncate" style={{ minWidth: 0 }}>{e.email}</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Address</span>
          <span className="gc-side__row-val">{e.addr}</span>
        </div>
      </div>

      {/* Account */}
      <div className="gc-side__card">
        <div className="gc-side__row">
          <span className="gc-side__row-label">Balance</span>
          <span className="gc-side__row-val tnum" style={{ color: e.overdue ? "#c0392b" : "var(--n-color-text)", fontWeight: 600 }}>
            {e.balance}{e.overdue && <span style={{ fontSize: 10, fontWeight: 500, marginLeft: 4 }}>overdue</span>}
          </span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Payment</span>
          <span className="gc-side__row-val">Card on file · ••4421</span>
        </div>
        <div className="gc-side__row">
          <span className="gc-side__row-label">Reminders</span>
          <span className="gc-side__row-val">Email + SMS</span>
        </div>
      </div>

      {/* Pets under this client */}
      <div className="gc-side__h2">Pets ({1 + e.otherPets.length})</div>
      <div className="gc-side__card" style={{ padding: 0 }}>
        <div className="gc-side__row" style={{ padding: "10px 12px", gridTemplateColumns: "28px 1fr auto" }}>
          <span className="gc-side__avatar" style={{ width: 24, height: 24, fontSize: 10, background: "var(--n-color-active)" }}>
            <IconA name="generic-pet-paw" size={11} />
          </span>
          <span style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--n-color-text)" }}>{a.patient}</div>
            <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>{speciesLabel(e.species)} · {e.breed}</div>
          </span>
          <span style={{ fontSize: 10, color: "var(--n-color-accent)", fontWeight: 500 }}>This visit</span>
        </div>
        {e.otherPets.map((p, i) => (
          <div key={i} className="gc-side__row" style={{ padding: "10px 12px", gridTemplateColumns: "28px 1fr auto" }}>
            <span className="gc-side__avatar" style={{ width: 24, height: 24, fontSize: 10, background: "var(--n-color-active)" }}>
              <IconA name="generic-pet-paw" size={11} />
            </span>
            <span style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--n-color-text)" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>{speciesLabel(p.species)} · {p.breed}</div>
            </span>
            <span style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }} className="tnum">{p.age}</span>
          </div>
        ))}
      </div>

      <div className="gc-side__btnrow">
        <button className="n-button n-button--s n-button--primary" style={{ flex: 1 }}>Open client record</button>
        <button className="n-button n-button--s" title="New invoice"><IconA name="interface-add" size={12} /></button>
      </div>
    </div>);
}

const ApptCtx = React.createContext({ open: () => {} });

function AppointmentsPage({ apptSide, setApptSide }) {
  const [view, setView] = React.useState("week");
  const [railCollapsed, setRailCollapsed] = React.useState(false);
  // Allow App to control panel state from outside; fall back to local state
  // if not provided (e.g. when used standalone).
  const [localState, setLocalState] = React.useState(null);
  const sideState = apptSide !== undefined ? apptSide : localState;
  const setSideState = setApptSide || setLocalState;
  const open = React.useCallback((s) => setSideState(s), [setSideState]);
  return (
    <ApptCtx.Provider value={{ open }}>
      <div className="gc">
        <CalHeader view={view} setView={setView} onCreate={() => open({ kind: "create" })} />
        <div className="gc-body">
          <LeftRail collapsed={railCollapsed} onToggle={() => setRailCollapsed((c) => !c)} />
          <main className="gc-main">
            {view === "week"   && <WeekGrid />}
            {view === "day"    && <DayView />}
            {view === "kanban" && <KanbanBoard />}
            {view === "list"   && <ListView />}
          </main>
          {/* Inline panel shown only when App didn't take it over */}
          {apptSide === undefined && <ApptSidePanel state={sideState} setState={setSideState} />}
        </div>
      </div>
    </ApptCtx.Provider>);

}

window.ApptSidePanel = ApptSidePanel;

window.AppointmentsPage = AppointmentsPage;