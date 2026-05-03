/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconA, Avatar: AvatarA } = window.PROVET_PRIM;

// ---------- Mini month ----------
function MiniMonth({ onToggle }) {
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
        <div className="gc-mini__head-left">
          {onToggle && (
            <button className="gc-iconbtn gc-iconbtn--xs gc-mini__menu" title="Collapse sidebar" onClick={onToggle} aria-label="Collapse sidebar">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <line x1="2.5" y1="4" x2="13.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="2.5" y1="12" x2="13.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <span className="gc-mini__title">April 2026</span>
        </div>
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
        <button className="gc-iconbtn gc-mini__menu" title="Expand sidebar" onClick={onToggle} aria-label="Expand sidebar">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="2.5" y1="4" x2="13.5" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="2.5" y1="12" x2="13.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </aside>);

  }
  return (
    <aside className="gc-rail">
      <MiniMonth onToggle={onToggle} />

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

// ---------- People picker ----------
const DAY_PEOPLE = [
  { id: "sara",   name: "Dr. Sara Lindqvist",  role: "Lead vet",              color: "#0E7C5C", initials: "SL", vetMatch: "Lindqvist" },
  { id: "patel",  name: "Dr. Aarav Patel",     role: "Veterinarian",          color: "#11894C", initials: "AP", vetMatch: "Patel" },
  { id: "lena",   name: "Dr. Lena Müller",     role: "Veterinarian",          color: "#1F6FEB", initials: "LM", vetMatch: "Müller" },
  { id: "tomas",  name: "Dr. Tomás García",    role: "Veterinarian",          color: "#7C4DFF", initials: "TG", vetMatch: "García" },
  { id: "hanna",  name: "Dr. Hanna Kowalska",  role: "Equine veterinarian",   color: "#B8860B", initials: "HK", vetMatch: "Kowalska" },
  { id: "nora",   name: "Nora Hughes",         role: "Veterinary nurse",      color: "#A26900", initials: "NH", vetMatch: "Hughes" },
  { id: "owen",   name: "Owen Park",           role: "Veterinary nurse",      color: "#D63B3B", initials: "OP", vetMatch: "Park" },
  { id: "amelia", name: "Dr. Amelia Wright",   role: "Veterinarian",          color: "#5A6BB0", initials: "AW", vetMatch: "Wright" },
  { id: "ben",    name: "Dr. Ben Chen",        role: "Veterinarian",          color: "#0EA5E9", initials: "BC", vetMatch: "Chen" },
  { id: "chloe",  name: "Chloe Davis",         role: "Veterinary technician", color: "#F59E0B", initials: "CD", vetMatch: "Davis" },
  { id: "diego",  name: "Dr. Diego Reyes",     role: "Surgeon",               color: "#EF4444", initials: "DR", vetMatch: "Reyes" },
  { id: "ella",   name: "Ella Brooks",         role: "Reception",             color: "#666666", initials: "EB", vetMatch: "Brooks" },
  { id: "fatima", name: "Dr. Fatima Khan",     role: "Dermatologist",         color: "#A855F7", initials: "FK", vetMatch: "Khan" },
  { id: "george", name: "George Mitchell",     role: "Boarding lead",         color: "#3B82F6", initials: "GM", vetMatch: "Mitchell" },
  { id: "hugo",   name: "Dr. Hugo Lambert",    role: "Cardiology consult",    color: "#10B981", initials: "HL", vetMatch: "Lambert" },
];
const MAX_PEOPLE_DAY = 15;
const MAX_PEOPLE_WEEK = 3;

function PeoplePicker({ selectedIds, setSelectedIds, max, label = "Show in view" }) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ left: 0, top: 0 });
  const btnRef = React.useRef(null);
  const popRef = React.useRef(null);

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

  const togglePerson = (id) => {
    setSelectedIds(curr => {
      if (curr.includes(id)) return curr.length > 1 ? curr.filter(x => x !== id) : curr;
      if (curr.length >= max) return curr;
      return [...curr, id];
    });
  };

  const selectedPeople = selectedIds.map(id => DAY_PEOPLE.find(p => p.id === id)).filter(Boolean);

  return (
    <>
      <button ref={btnRef} className="gc-calfilter__btn" onClick={toggle} title="People shown in Day view">
        <IconA name="user-multiple" size={11} />
        <span>People</span>
        <span style={{ display: "inline-flex", marginInlineStart: 2, marginInlineEnd: 2 }}>
          {selectedPeople.slice(0, 3).map((p, i) => (
            <span key={p.id} style={{
              width: 14, height: 14, borderRadius: "50%",
              background: p.color, color: "#fff",
              fontSize: 'var(--n-font-size-body)', fontWeight: 600, lineHeight: "14px", textAlign: "center",
              display: "inline-block",
              marginInlineStart: i === 0 ? 0 : -4,
              border: "1.5px solid #fff",
            }}>{p.initials}</span>
          ))}
        </span>
        <IconA name="interface-dropdown-small" size={10} />
      </button>
      {open && (
        <div
          ref={popRef}
          className="gc-calfilter__pop"
          style={{ position: "fixed", left: pos.left, top: pos.top, minWidth: 240 }}>
          <div className="gc-railsec" style={{ maxHeight: 360, overflowY: "auto" }}>
            <div className="gc-railsec__head">
              <span>{label}</span>
              <span style={{ color: "var(--n-color-text-weaker)", fontWeight: 400, fontSize: 'var(--n-font-size-body)' }}>
                {selectedIds.length} / {max}
              </span>
            </div>
            {DAY_PEOPLE.map((p) => {
              const isSel = selectedIds.includes(p.id);
              const isDisabled = !isSel && selectedIds.length >= max;
              return (
                <label
                  key={p.id}
                  className="gc-callist__row"
                  style={{ opacity: isDisabled ? 0.4 : 1, cursor: isDisabled ? "not-allowed" : "pointer" }}
                  onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                >
                  <span className="gc-callist__check" style={{ background: isSel ? p.color : "transparent", borderColor: p.color }}>
                    {isSel && <IconA name="interface-checked-small" size={10} style={{ color: "#fff" }} />}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSel}
                    disabled={isDisabled}
                    onChange={() => togglePerson(p.id)}
                    style={{ display: "none" }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }} className="truncate">{p.name}</div>
                    <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }} className="truncate">{p.role}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ---------- Header bar ----------
function CalHeader({ view, setView, onCreate, dayPeopleIds, setDayPeopleIds, weekPeopleIds, setWeekPeopleIds }) {
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [pickerPos, setPickerPos] = React.useState({ left: 0, top: 0 });
  const rangeBtnRef = React.useRef(null);
  const pickerRef = React.useRef(null);
  React.useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e) => {
      if (pickerRef.current?.contains(e.target)) return;
      if (rangeBtnRef.current?.contains(e.target)) return;
      setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);
  const togglePicker = () => {
    if (rangeBtnRef.current) {
      const r = rangeBtnRef.current.getBoundingClientRect();
      setPickerPos({ left: r.left, top: r.bottom + 6 });
    }
    setPickerOpen((o) => !o);
  };
  return (
    <div className="gc-topbar" style={{ backgroundColor: "rgb(252, 252, 253)" }}>
      {/* Left: title + navigation */}
      <span className="gc-title">Calendar</span>
      <span className="gc-topbar__divider" aria-hidden="true" />
      <button className="n-button n-button--s">Today</button>
      <button className="gc-iconbtn" title="Previous week"><IconA name="arrow-left-small" size={12} /></button>
      <button className="gc-iconbtn" title="Next week"><IconA name="arrow-right-small" size={12} /></button>
      <button ref={rangeBtnRef} type="button" className="gc-range gc-range--btn" onClick={togglePicker} aria-haspopup="dialog" aria-expanded={pickerOpen}>
        27 Apr — 3 May 2026
        <IconA name="interface-dropdown-small" size={10} />
      </button>
      {pickerOpen && (
        <div ref={pickerRef} className="gc-range__pop" style={{ position: "fixed", left: pickerPos.left, top: pickerPos.top }}>
          <MiniMonth />
        </div>
      )}

      <div style={{ flex: 1 }}></div>

      {/* Right: view toggle, contextual picker, calendars filter, meta tools, primary action */}
      <div className="gc-segmented">
        {["Day", "Week", "Kanban", "List"].map((v) =>
        <button
          key={v}
          className={"gc-segmented__btn" + (view === v.toLowerCase() ? " gc-segmented__btn--active" : "")}
          onClick={() => setView(v.toLowerCase())}>
          {v}</button>
        )}
      </div>
      {view === "day" && (
        <PeoplePicker selectedIds={dayPeopleIds} setSelectedIds={setDayPeopleIds} max={MAX_PEOPLE_DAY} label="Show in Day view" />
      )}
      {view === "week" && (
        <PeoplePicker selectedIds={weekPeopleIds} setSelectedIds={setWeekPeopleIds} max={MAX_PEOPLE_WEEK} label="Show in Week view" />
      )}
      <CalendarsFilter />
      <span className="gc-topbar__divider" aria-hidden="true" />
      <button className="gc-iconbtn" title="Search"><IconA name="navigation-search" size={14} /></button>
      <button className="gc-iconbtn" title="Help"><IconA name="interface-help" size={14} /></button>
      <button className="gc-iconbtn" title="Settings"><IconA name="navigation-settings" size={14} /></button>
      <button className="gc-create" onClick={onCreate}>
        <span className="gc-create__plus"><IconA name="interface-add" size={14} /></span>
        <span>Create</span>
      </button>
    </div>);

}

// ---------- Week grid ----------
const DAYS = [
{ name: "MON", num: 27, today: false, date: "Apr 27" },
{ name: "TUE", num: 28, today: false, date: "Apr 28" },
{ name: "WED", num: 29, today: false, date: "Apr 29" },
{ name: "THU", num: 30, today: false, date: "Apr 30" },
{ name: "FRI", num: 1, today: false, date: "May 1" },
{ name: "SAT", num: 2, today: true, date: "May 2" },
{ name: "SUN", num: 3, today: false, date: "May 3" }];


const ALLDAY = [
{ col: 1, span: 4, title: "Therapy BU trip @Malta", cal: "therapy_banner" },
{ col: 6, span: 1, title: "🎁 Alexander Ohagan birthday", cal: "gift" },
{ col: 1, span: 1, title: "No internal mtg day", cal: "block" },
{ col: 2, span: 1, title: "Marcy McCall MacBain reach out", cal: "meeting_soft" },
{ col: 3, span: 1, title: "No internal mtg day", cal: "block" },
{ col: 4, span: 1, title: "Linneaus + GX signed", cal: "highlight" }];


// Each event: {col, start, end, title, sub, cal}
// cal -> color mapping below
const EVENTS = [
// Mon 27 (col 0)
{ col: 0, start: 11.0, end: 13.0, title: "Catch up || prep || review", sub: "1:1", cal: "personal" },
{ col: 0, start: 11.0, end: 11.75, title: "Intro Call", sub: "Zoom", cal: "meeting_soft" },
{ col: 0, start: 13.0, end: 14.0, title: "Weekly Vet ExCom + Metrics", sub: "Zoom", cal: "meeting_soft" },
{ col: 0, start: 15.0, end: 15.75, title: "⚠ Charles MacBain <> ...", sub: "Conflict", cal: "meeting_soft" },

// Tue 28 (col 1)
{ col: 1, start: 10.833, end: 14.166, title: "✈️ Flight to MLA from LHR T4 (KM 101) || Booking reference: GYXLVM", sub: "British Airways", cal: "flight" },
{ col: 1, start: 14.166, end: 15.166, title: "Driver Airport > hotel || meeting point: arrival...", sub: "Transfer", cal: "flight" },
{ col: 1, start: 15.5, end: 15.75, title: "Kare / Charles", sub: "1:1", cal: "meeting_soft" },
{ col: 1, start: 17.0, end: 19.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Welcome cocktail", sub: "Malta", cal: "therapy" },
{ col: 1, start: 17.0, end: 17.75, title: "Charles M...", sub: "1:1", cal: "meeting_soft" },
{ col: 1, start: 19.0, end: 21.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Team Dinner", sub: "Malta", cal: "therapy" },

// Wed 29 (col 2)
{ col: 2, start: 12.25, end: 13.5, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Lunch", sub: "Malta", cal: "therapy" },
{ col: 2, start: 13.5, end: 14.0, title: "Product Excom/DRIs:", sub: "Zoom", cal: "meeting_soft" },
{ col: 2, start: 13.5, end: 14.0, title: "The...", sub: "", cal: "meeting_soft" },
{ col: 2, start: 14.0, end: 17.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Afternoon Drinks & Nibbles", sub: "Malta", cal: "therapy" },
{ col: 2, start: 14.5, end: 15.5, title: "Product Excom/...", sub: "Cancelled", cal: "cancelled" },
{ col: 2, start: 15.5, end: 16.5, title: "hold for ...", sub: "", cal: "cancelled" },
{ col: 2, start: 16.5, end: 17.0, title: "Nordl...", sub: "", cal: "cancelled" },
{ col: 2, start: 17.0, end: 17.75, title: "Charles MacBain <> ...", sub: "1:1", cal: "meeting_soft" },
{ col: 2, start: 18.5, end: 19.25, title: "🌴Therapy BU Trip @Malta", sub: "Malta", cal: "therapy" },
{ col: 2, start: 18.5, end: 19.25, title: "🌴Therapy BU Trip @...", sub: "Malta", cal: "therapy" },
{ col: 2, start: 19.5, end: 21.5, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Team Dinner @ Chophouse", sub: "Malta", cal: "therapy" },
{ col: 2, start: 21.5, end: 22.5, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Shuttl...", sub: "Malta", cal: "therapy" },

// Thu 30 (col 3)
{ col: 3, start: 11.75, end: 13.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Lunch", sub: "Malta", cal: "therapy" },
{ col: 3, start: 14.0, end: 17.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Afternoon Drinks & Nibbles", sub: "Malta", cal: "therapy" },
{ col: 3, start: 15.0, end: 16.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Quiz...", sub: "Malta", cal: "therapy" },
{ col: 3, start: 16.0, end: 17.0, title: "Quick Connect", sub: "", cal: "meeting_soft" },
{ col: 3, start: 17.0, end: 17.75, title: "Didier Breton <> Cha...", sub: "1:1", cal: "meeting_soft" },
{ col: 3, start: 18.5, end: 19.25, title: "🌴Therapy BU Trip @Ma...", sub: "Malta", cal: "therapy" },
{ col: 3, start: 18.5, end: 19.25, title: "🌴Therapy BU Trip @Ma...", sub: "Malta", cal: "therapy" },
{ col: 3, start: 19.5, end: 21.5, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Team Dinner @ Surprise spot!", sub: "Malta", cal: "therapy" },
{ col: 3, start: 21.5, end: 23.5, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || Party!!!", sub: "Malta", cal: "therapy" },
{ col: 3, start: 23.0, end: 24.0, title: "🌴Therapy BU Trip @Malta 🍹 🇲🇹 || ...", sub: "Malta", cal: "therapy" },

// Fri 1 (col 4)
{ col: 4, start: 12.25, end: 13.0, title: "Amy / Charles", sub: "1:1", cal: "meeting_soft" },
{ col: 4, start: 13.5, end: 13.75, title: "Charles / Juha", sub: "1:1", cal: "meeting_soft" },
{ col: 4, start: 14.0, end: 14.75, title: "Charles <> Danny", sub: "1:1", cal: "meeting_soft" },

// Sat 2 (col 5) — today
{ col: 5, start: 14.25, end: 14.75, title: "Haircut", sub: "", cal: "meeting_soft" },

// Sun 3 (col 6) — empty
];

// Demo events for other people, used when comparing calendars in Week view.
const EXTRA_EVENTS_BY_PERSON = {
  patel: [
    { col: 0, start: 9.0,  end: 10.0, title: "Pre-op consult — Pixel",   sub: "Rm 2",   cal: "consult" },
    { col: 0, start: 14.0, end: 16.0, title: "Spay surgery — Felix",     sub: "OR 2",   cal: "surgery" },
    { col: 1, start: 11.0, end: 12.0, title: "Imaging — Olive Brown",    sub: "X-ray",  cal: "lab" },
    { col: 2, start: 15.0, end: 16.0, title: "Vaccination — Bruno",      sub: "Rm 1",   cal: "consult" },
    { col: 3, start: 13.0, end: 14.0, title: "Lameness recheck — Hiro",  sub: "Rm 3",   cal: "consult" },
    { col: 4, start: 9.5,  end: 10.5, title: "Bloodwork review",         sub: "Phone",  cal: "lab" },
    { col: 4, start: 16.0, end: 17.0, title: "Charlie / dental f/u",     sub: "Rm 3",   cal: "consult" },
  ],
  lena: [
    { col: 0, start: 10.0, end: 11.0, title: "Wellness exam — Daisy",    sub: "Rm 3",   cal: "consult" },
    { col: 1, start: 14.0, end: 15.0, title: "Dental cleaning — Charlie",sub: "OR 1",   cal: "surgery" },
    { col: 2, start: 9.0,  end: 10.5, title: "Pre-purchase exam",        sub: "Field",  cal: "consult" },
    { col: 3, start: 11.0, end: 12.5, title: "Suture removal — Asha",    sub: "Rm 2",   cal: "consult" },
    { col: 3, start: 14.0, end: 15.0, title: "Behavior consult — Riley", sub: "Rm 2",   cal: "consult" },
    { col: 4, start: 15.0, end: 16.0, title: "Recheck — Buddy Lee",      sub: "Rm 1",   cal: "consult" },
  ],
  tomas: [
    { col: 0, start: 13.0, end: 14.0, title: "Cardiology consult",       sub: "Rm 1",   cal: "consult" },
    { col: 2, start: 10.0, end: 11.5, title: "Echo — Pepper Romano",     sub: "Imaging",cal: "lab" },
    { col: 4, start: 11.0, end: 12.0, title: "Follow-up — Pixel",        sub: "Rm 2",   cal: "consult" },
  ],
};

const CAL_COLORS = {
  meeting_soft:    { bg: "#DCE8F4", fg: "#1F3A5F" },
  therapy:         { bg: "#D6E4EE", fg: "#1F3A5F" },
  therapy_banner:  { bg: "#F4D5B8", fg: "#7A3F00" },
  flight:          { bg: "#FBE3A8", fg: "#6B4A00" },
  highlight:       { bg: "#FFEFB8", fg: "#7C5800" },
  block:           { bg: "#FBE0B6", fg: "#7A4500" },
  personal:        { bg: "#EDDDF2", fg: "#5B2A78" },
  gift:            { bg: "#D6E4F4", fg: "#1F3A5F" },
  cancelled:       { bg: "#F0F0F0", fg: "#888", border: "1px dashed #aaa" },
  // legacy (kept for other views)
  vet:     { bg: "#0E7C5C", fg: "#fff" },
  consult: { bg: "#1F6FEB", fg: "#fff" },
  surgery: { bg: "#D63B3B", fg: "#fff" },
  lab:     { bg: "#B8860B", fg: "#fff" },
  task:    { bg: "#7C4DFF", fg: "#fff" },
  ooo:     { bg: "#666",    fg: "#fff" },
  events:  { bg: "#0EA5E9", fg: "#fff" },
  or:      { bg: "#A26900", fg: "#fff" },
  holiday: { bg: "#11894C", fg: "#fff" }
};

const HOURS = Array.from({ length: 13 }, (_, i) => 11 + i); // 11am..11pm
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

function WeekGrid({ peopleIds = ["sara"] }) {
  const apptCtx = React.useContext(ApptCtx);
  const people = React.useMemo(
    () => peopleIds.map(id => DAY_PEOPLE.find(p => p.id === id)).filter(Boolean),
    [peopleIds]
  );

  const grouped = React.useMemo(() => {
    const all = [
      ...EVENTS.map(e => ({ ...e, person: "sara" })),
      ...Object.entries(EXTRA_EVENTS_BY_PERSON).flatMap(
        ([person, list]) => list.map(e => ({ ...e, person }))
      ),
    ].filter(e => peopleIds.includes(e.person));
    const byCell = {};
    all.forEach(e => {
      const k = `${e.col}_${e.person}`;
      (byCell[k] ||= []).push(e);
    });
    Object.keys(byCell).forEach(k => {
      // Sort by start, then by longest first when starts tie.
      byCell[k].sort((a, b) => a.start - b.start || b.end - a.end);
      // For Week view, only one event per overlapping time slot per person —
      // drop later-starting events that collide with one we've already kept.
      const kept = [];
      for (const ev of byCell[k]) {
        if (kept.some(prev => ev.start < prev.end && ev.end > prev.start)) continue;
        kept.push(ev);
      }
      kept.forEach(ev => { ev._lane = 0; ev._lanes = 1; });
      byCell[k] = kept;
    });
    return byCell;
  }, [peopleIds]);

  const NOW = 17.883; // 5:53 PM today
  const todayCol = 5;
  const N = Math.max(people.length, 1);
  const totalCols = 7 * N;
  const showSubHeaders = N > 1;

  const openEvent = (e) => {
    const found = TODAY_APPTS.find((a) => a.patient === e.title || a.reason === e.title);
    const appt = found || {
      id: `evt-${e.col}-${e.start}-${e.person}`,
      time: fmtTime(e.start), end: fmtTime(e.end),
      patient: e.title, species: null, owner: e.sub || "—",
      reason: e.title, vet: "—", room: e.sub || "—",
      cal: e.cal, status: "scheduled" };
    apptCtx.open({ kind: "appt", appt });
  };

  return (
    <div className="gc-grid">
      {/* Day header strip — each day spans N person sub-columns */}
      <div className="gc-daystrip" style={{ gridTemplateColumns: `60px repeat(${totalCols}, 1fr)` }}>
        <div className="gc-daystrip__gutter">GMT</div>
        {DAYS.map((d, i) =>
          <div key={i} className={"gc-daystrip__cell" + (d.today ? " gc-daystrip__cell--today" : "")}
               style={{ gridColumn: `span ${N}` }}>
            <span className="gc-daystrip__name">{d.name.charAt(0) + d.name.slice(1).toLowerCase()}</span>
            {" "}
            {d.today ? <span className="gc-daystrip__pill">{d.num}</span> : <span className="gc-daystrip__num">{d.num}</span>}
          </div>
        )}
      </div>

      {/* Person sub-headers — only when comparing 2+ people */}
      {showSubHeaders && (
        <div className="gc-peoplestrip" style={{
          display: "grid",
          gridTemplateColumns: `60px repeat(${totalCols}, 1fr)`,
          borderBottom: "1px solid var(--n-color-border)",
          background: "var(--n-color-surface)",
        }}>
          <div style={{ borderInlineEnd: "1px solid var(--n-color-border)" }} />
          {DAYS.flatMap((d, di) =>
            people.map((p, pi) => (
              <div key={`${di}-${p.id}`} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "4px 6px",
                fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)",
                borderInlineStart: pi === 0
                  ? "1px solid var(--n-color-border)"
                  : "1px dashed var(--n-color-border-weaker, #ECECEC)",
                minWidth: 0,
              }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: p.color, color: "#fff",
                  fontSize: 'var(--n-font-size-body)', fontWeight: 600, lineHeight: "14px", textAlign: "center",
                  flex: "none",
                }}>{p.initials}</span>
                <span className="truncate" style={{ minWidth: 0 }}>{p.name.replace(/^Dr\. /, "")}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* All-day strip — spans all sub-columns of each day */}
      <div className="gc-allday" style={{ gridTemplateColumns: "60px 1fr" }}>
        <div className="gc-allday__gutter">All day</div>
        <div className="gc-allday__lanes" style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}>
          {ALLDAY.map((a, i) => {
            const c = CAL_COLORS[a.cal] || CAL_COLORS.consult;
            return (
              <div key={i} className="gc-allday__chip" style={{
                gridColumn: `${a.col * N + 1} / span ${a.span * N}`,
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

        <div className="gc-hours__cols" style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}>
          {DAYS.flatMap((d, di) =>
            people.map((p, pi) => {
              const cell = grouped[`${di}_${p.id}`] || [];
              return (
                <div key={`${di}-${p.id}`} className={"gc-daycol" + (d.today ? " gc-daycol--today" : "")}
                     style={pi > 0 ? { borderInlineStart: "1px dashed var(--n-color-border-weaker, #ECECEC)" } : undefined}>
                  {HOURS.map((h, hi) =>
                    <div key={hi} className="gc-daycol__slot" style={{ height: HOUR_PX }} />
                  )}
                  {di === todayCol &&
                    <div className="gc-now" style={{ top: (NOW - HOURS[0]) * HOUR_PX }}>
                      <span className="gc-now__dot"></span>
                    </div>
                  }
                  {cell.map((e, i) => {
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
              );
            })
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

// ---------- Day view (per-person columns) ----------
function parseTimeStr(s) {
  const [h, m] = s.split(":").map(Number);
  return h + m / 60;
}

function DayView({ peopleIds }) {
  const apptCtx = React.useContext(ApptCtx);
  const people = React.useMemo(
    () => peopleIds.map(id => DAY_PEOPLE.find(p => p.id === id)).filter(Boolean),
    [peopleIds]
  );

  const eventsByCol = React.useMemo(() => {
    const map = Object.fromEntries(people.map((p, i) => [i, []]));
    TODAY_APPTS.forEach((a) => {
      const col = people.findIndex(p => a.vet && a.vet.includes(p.vetMatch));
      if (col < 0) return;
      map[col].push({
        col,
        start: parseTimeStr(a.time),
        end: parseTimeStr(a.end),
        title: a.patient,
        sub: a.reason,
        cal: a.cal,
        appt: a,
      });
    });
    const flat = [];
    Object.values(map).forEach((list) => {
      list.sort((x, y) => x.start - y.start || y.end - x.end);
      const lanes = [];
      list.forEach((ev) => {
        let lane = 0;
        while (lanes[lane] && lanes[lane] > ev.start) lane++;
        lanes[lane] = ev.end;
        ev._lane = lane;
        ev._lanes = 1;
      });
      const total = lanes.length;
      list.forEach((ev) => { ev._lanes = total; flat.push(ev); });
    });
    return flat;
  }, [people]);

  const NOW = 14.25; // 2:15 PM
  const HOURS_D = Array.from({ length: 11 }, (_, i) => 8 + i); // 8am..6pm

  if (people.length === 0) {
    return (
      <div className="gc-grid">
        <div style={{ padding: 48, textAlign: "center", color: "var(--n-color-text-weaker)" }}>
          <IconA name="user-multiple" size={28} style={{ color: "var(--n-color-text-weakest)", marginBottom: 8 }} />
          <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>No people selected</div>
          <div style={{ fontSize: 'var(--n-font-size-body)', marginTop: 4 }}>Use the People picker in the toolbar to pick up to {MAX_PEOPLE} calendars to view.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="gc-grid">
      {/* Person header strip */}
      <div className="gc-daystrip" style={{ gridTemplateColumns: `60px repeat(${people.length}, 1fr)` }}>
        <div className="gc-daystrip__gutter">GMT</div>
        {people.map((p, i) => (
          <div key={p.id} className="gc-daystrip__cell" style={{ flexDirection: "column", gap: 0, padding: "8px 12px", alignItems: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>
              <span style={{
                width: 18, height: 18, borderRadius: "50%",
                background: p.color, color: "#fff",
                fontSize: 'var(--n-font-size-body)', fontWeight: 600, lineHeight: "18px", textAlign: "center",
                display: "inline-block", flex: "none",
              }}>{p.initials}</span>
              <span className="truncate">{p.name}</span>
            </div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)", marginTop: 2, marginInlineStart: 26 }}>{p.role}</div>
          </div>
        ))}
      </div>

      {/* All-day strip (empty for per-person view) */}
      <div className="gc-allday" style={{ gridTemplateColumns: "60px 1fr" }}>
        <div className="gc-allday__gutter">All day</div>
        <div className="gc-allday__lanes" style={{ gridTemplateColumns: `repeat(${people.length}, 1fr)` }} />
      </div>

      {/* Hours grid */}
      <div className="gc-hours">
        <div className="gc-hours__gutter">
          {HOURS_D.map((h) =>
            <div key={h} className="gc-hours__label" style={{ height: HOUR_PX }}>{fmtTime(h)}</div>
          )}
        </div>

        <div className="gc-hours__cols" style={{ gridTemplateColumns: `repeat(${people.length}, 1fr)` }}>
          {people.map((p, ci) =>
            <div key={p.id} className="gc-daycol">
              {HOURS_D.map((h, hi) =>
                <div key={hi} className="gc-daycol__slot" style={{ height: HOUR_PX }} />
              )}

              <div className="gc-now" style={{ top: (NOW - HOURS_D[0]) * HOUR_PX }}>
                <span className="gc-now__dot"></span>
              </div>

              {eventsByCol.filter((e) => e.col === ci).map((e, i) => {
                const color = CAL_COLORS[e.cal] || CAL_COLORS.consult;
                const top = (e.start - HOURS_D[0]) * HOUR_PX;
                const height = (e.end - e.start) * HOUR_PX - 2;
                const widthPct = 100 / e._lanes;
                const leftPct = e._lane * widthPct;
                const isShort = e.end - e.start <= 0.5;
                return (
                  <div
                    key={i}
                    className={"gc-event" + (isShort ? " gc-event--short" : "")}
                    onClick={() => apptCtx.open({ kind: "appt", appt: e.appt })}
                    style={{
                      top, height,
                      left: `calc(${leftPct}% + 2px)`,
                      width: `calc(${widthPct}% - 4px)`,
                      background: color.bg,
                      color: color.fg,
                      cursor: "pointer"
                    }}>
                    <div className="gc-event__title truncate">{e.title}</div>
                    {!isShort && <div className="gc-event__sub truncate">{fmtTime(e.start)} · {e.sub}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ApptSidePanel({ state, setState }) {
  const [tab, setTab] = React.useState("info"); // info | patient | client
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
  const { useDragResize: useDragResizeA, ResizeHandle: ResizeHandleA } = window.PROVET_PRIM;
  const [apptW, onApptResize] = useDragResizeA({ initial: 320, min: 260, max: 560, side: "left", storageKey: "provet.apptSide.width" });

  return (
    <aside className="aside aside--appt gc-side" style={{ width: apptW, flex: "0 0 auto", position: "relative" }}>
      <ResizeHandleA side="left" onMouseDown={onApptResize} />
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
        </div>
        <button className="gc-side__close" title="Close" onClick={close}>
          <IconA name="interface-close-small" size={14} />
        </button>
      </div>

      {tab === "patient" && a ? (
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
            <span className="gc-side__avatar" style={{ width: 20, height: 20, fontSize: 'var(--n-font-size-body)' }}>{a.vet.replace(/Dr\.?\s*/, "").charAt(0)}</span>
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
        <div className="gc-side__title" style={{ fontSize: 'var(--n-font-size-body)', marginBottom: 6 }}>Client &amp; patient</div>
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
          <span className="gc-side__avatar" style={{ width: 44, height: 44, fontSize: 'var(--n-font-size-body)', background: "var(--n-color-active)", color: "var(--n-color-text)" }}>
            <IconA name={speciesIcon} size={20} />
          </span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gc-side__title" style={{ fontSize: 'var(--n-font-size-body)', marginBottom: 2 }}>{a.patient}</div>
            <div className="gc-side__sub" style={{ fontSize: 'var(--n-font-size-body)' }}>
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
        <div className="gc-side__title" style={{ fontSize: 'var(--n-font-size-body)', marginBottom: 8, color: "var(--n-color-text-weaker)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Snapshot</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>Weight</div>
            <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600 }} className="tnum">{e.weight}</div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: e.weightTrend === "stable" ? "var(--n-color-text-weaker)" : "#b8860b" }}>{e.weightTrend}</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>Age</div>
            <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600 }} className="tnum">{e.age}</div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>DOB on file</div>
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
          <span className="gc-side__row-val tnum" style={{ fontFamily: 'var(--n-font-family)' }}>{e.microchip}</span>
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
              <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, color: "var(--n-color-text)" }}>{v.title}</span>
              <span className="tnum" style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>{v.date}</span>
            </div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)", marginTop: 2 }}>{v.who}</div>
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
          <span className="gc-side__avatar" style={{ width: 44, height: 44, fontSize: 'var(--n-font-size-body)' }}>{initials}</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="gc-side__title" style={{ fontSize: 'var(--n-font-size-body)', marginBottom: 2 }}>{e.ownerName}</div>
            <div className="gc-side__sub" style={{ fontSize: 'var(--n-font-size-body)' }}>Client since {e.sinceYear}</div>
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
            {e.balance}{e.overdue && <span style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 500, marginLeft: 4 }}>overdue</span>}
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
          <span className="gc-side__avatar" style={{ width: 24, height: 24, fontSize: 'var(--n-font-size-body)', background: "var(--n-color-active)" }}>
            <IconA name="generic-pet-paw" size={11} />
          </span>
          <span style={{ minWidth: 0 }}>
            <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, color: "var(--n-color-text)" }}>{a.patient}</div>
            <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>{speciesLabel(e.species)} · {e.breed}</div>
          </span>
          <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-accent)", fontWeight: 500 }}>This visit</span>
        </div>
        {e.otherPets.map((p, i) => (
          <div key={i} className="gc-side__row" style={{ padding: "10px 12px", gridTemplateColumns: "28px 1fr auto" }}>
            <span className="gc-side__avatar" style={{ width: 24, height: 24, fontSize: 'var(--n-font-size-body)', background: "var(--n-color-active)" }}>
              <IconA name="generic-pet-paw" size={11} />
            </span>
            <span style={{ minWidth: 0 }}>
              <div style={{ fontSize: 'var(--n-font-size-body)', fontWeight: 600, color: "var(--n-color-text)" }}>{p.name}</div>
              <div style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }}>{speciesLabel(p.species)} · {p.breed}</div>
            </span>
            <span style={{ fontSize: 'var(--n-font-size-body)', color: "var(--n-color-text-weaker)" }} className="tnum">{p.age}</span>
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

  const loadPeople = (key, max, fallback) => {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      if (Array.isArray(v) && v.length > 0 && v.length <= max && v.every(id => DAY_PEOPLE.some(p => p.id === id))) return v;
    } catch {}
    return fallback;
  };
  const [dayPeopleIds, setDayPeopleIds] = React.useState(() =>
    loadPeople("provet.cal.dayPeople", MAX_PEOPLE_DAY, ["sara", "patel", "lena"])
  );
  const [weekPeopleIds, setWeekPeopleIds] = React.useState(() =>
    loadPeople("provet.cal.weekPeople", MAX_PEOPLE_WEEK, ["sara"])
  );
  React.useEffect(() => {
    try { localStorage.setItem("provet.cal.dayPeople", JSON.stringify(dayPeopleIds)); } catch {}
  }, [dayPeopleIds]);
  React.useEffect(() => {
    try { localStorage.setItem("provet.cal.weekPeople", JSON.stringify(weekPeopleIds)); } catch {}
  }, [weekPeopleIds]);

  // Allow App to control panel state from outside; fall back to local state
  // if not provided (e.g. when used standalone).
  const [localState, setLocalState] = React.useState(null);
  const sideState = apptSide !== undefined ? apptSide : localState;
  const setSideState = setApptSide || setLocalState;
  const open = React.useCallback((s) => setSideState(s), [setSideState]);
  return (
    <ApptCtx.Provider value={{ open }}>
      <div className="gc">
        <CalHeader
          view={view} setView={setView}
          onCreate={() => open({ kind: "create" })}
          dayPeopleIds={dayPeopleIds} setDayPeopleIds={setDayPeopleIds}
          weekPeopleIds={weekPeopleIds} setWeekPeopleIds={setWeekPeopleIds}
        />
        <div className="gc-body">
          <main className="gc-main">
            {view === "week"   && <WeekGrid peopleIds={weekPeopleIds} />}
            {view === "day"    && <DayView peopleIds={dayPeopleIds} />}
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