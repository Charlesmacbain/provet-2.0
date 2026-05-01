/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconP } = window.PROVET_PRIM;
const { PATIENTS: P_LIST } = window.PROVET_DATA;

function PatientsPage({ openPatient }) {
  const [q, setQ] = React.useState("");
  const filtered = P_LIST.filter(p => !q || (p.name + p.owner + p.id).toLowerCase().includes(q.toLowerCase()));

  // Group by species
  const groups = {};
  filtered.forEach(p => { (groups[p.species] ||= []).push(p); });
  const speciesList = Object.keys(groups);

  return (
    <div className="linear-page">
      <div className="page-header">
        <div><h1 className="page-header__title">Patients</h1></div>
        <div className="page-header__actions">
          <button className="n-button"><IconP name="interface-upload" size={12} /> Import</button>
          <button className="n-button n-button--primary"><IconP name="interface-add" size={12} style={{color:"#fff"}} /> New</button>
        </div>
      </div>
      <div className="linear-toolbar">
        <button className="linear-toolbar__btn"><IconP name="interface-filter" size={12} /> Filter</button>
        <span className="linear-toolbar__sep" />
        <input className="linear-toolbar__btn" placeholder="Search…" value={q} onChange={e => setQ(e.target.value)}
          style={{ background: "transparent", border: 0, outline: "none", font: "inherit", fontSize: 12, color: "var(--n-color-text)" }} />
        <span style={{ flex: 1 }} />
        <button className="linear-toolbar__btn">Display</button>
      </div>
      <div className="linear-list">
        {speciesList.map(sp => (
          <PatientGroup key={sp} name={sp} items={groups[sp]} openPatient={openPatient} />
        ))}
      </div>
    </div>
  );
}

function PatientGroup({ name, items, openPatient }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <div className="linear-group__head" onClick={() => setOpen(o => !o)}>
        <span className={"linear-group__caret" + (open ? " linear-group__caret--open" : "")}>
          <IconP name="arrow-right-small" size={10} />
        </span>
        <span className="linear-group__title">{name}</span>
        <span className="linear-group__count">{items.length}</span>
        <span className="linear-group__spacer" />
        <button className="linear-group__act"><IconP name="interface-add" size={12} /></button>
      </div>
      {open && items.map(p => (
        <div key={p.id} className="linear-row" onClick={() => openPatient(p)}>
          <span className="linear-row__id">{p.id}</span>
          <span className="linear-row__status" />
          <div className="linear-row__title">{p.name} <span style={{color:"var(--linear-faint)"}}>· {p.breed}</span></div>
          <div className="linear-row__meta">
            <span className="linear-row__chip">{p.owner}</span>
            <span className="linear-row__date">{p.lastVisit.split(" ").slice(0,2).join(" ")}</span>
            <span className="linear-row__avatar">{p.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

window.PatientsPage = PatientsPage;
