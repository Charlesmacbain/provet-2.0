/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon: IconCl, Avatar: AvatarCl, Badge: BadgeCl, speciesIcon: spCl } = window.PROVET_PRIM;
const { CLIENTS, CLIENT_TIMELINE } = window.PROVET_DATA;

// ---------------- LIST ----------------
function ClientsPage({ openClient }) {
  const [q, setQ] = React.useState("");
  const list = CLIENTS.filter(c => !q ||
    (c.name + " " + c.email + " " + c.id + " " + (c.pets||[]).map(p=>p.name).join(" ")).toLowerCase().includes(q.toLowerCase())
  );
  return (
    <div className="linear-page">
      <div className="page-header">
        <div><h1 className="page-header__title">Clients</h1></div>
        <div className="page-header__actions">
          <button className="n-button"><IconCl name="interface-upload" size={12} /> Import</button>
          <button className="n-button n-button--primary"><IconCl name="interface-add" size={12} style={{color:"#fff"}} /> New client</button>
        </div>
      </div>
      <div className="linear-toolbar">
        <button className="linear-toolbar__btn"><IconCl name="interface-filter" size={12} /> Filter</button>
        <span className="linear-toolbar__sep" />
        <input className="linear-toolbar__btn" placeholder="Search clients, pets, email…" value={q} onChange={e => setQ(e.target.value)}
          style={{ background: "transparent", border: 0, outline: "none", font: "inherit", fontSize: 12, color: "var(--n-color-text)", flex: 1 }} />
        <span style={{ flex: 1 }} />
        <button className="linear-toolbar__btn">Display</button>
      </div>
      <div className="linear-list">
        <div className="linear-group__head" style={{ background: "transparent" }}>
          <span className="linear-group__title">All clients</span>
          <span className="linear-group__count">{list.length}</span>
        </div>
        {list.map(c => (
          <div key={c.id} className="linear-row" onClick={() => openClient(c)}>
            <span className="linear-row__id">{c.id}</span>
            <span className="cl-row__avatar">
              <AvatarCl initials={c.initials} color={c.color} size="s" />
            </span>
            <div className="linear-row__title">{c.name}
              <span style={{color:"var(--linear-faint)", marginInlineStart: 8, fontWeight: 400 }}>· {(c.pets||[]).map(p=>p.name).join(", ")}</span>
            </div>
            <div className="linear-row__meta">
              {c.unpaid > 0 && <BadgeCl tone="danger" dot>£{c.balance} unpaid</BadgeCl>}
              <span className="linear-row__chip">{c.email}</span>
              <span className="linear-row__date">{c.phone || "—"}</span>
            </div>
          </div>
        ))}
      </div>
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
  { id: "labs",          label: "Labs", count: 2 },
  { id: "notes",         label: "Notes" },
  { id: "messages",      label: "Messages", count: 4 },
  { id: "tasks",         label: "Tasks" },
  { id: "forms",         label: "Forms" },
  { id: "consultations", label: "Consultations" },
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
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "var(--n-color-text-weaker)" }}>{p.species} · {p.breed || ""}</div>
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
                <span className="cl-strip__inline-label">Balance</span>
                <span className="cl-strip__inline-value cl-strip__inline-value--money">{client.balance || "£0.00"}</span>
              </span>
            </div>
          )}
          <span style={{ flex: 1 }} />
          <button
            className="cl-strip__rail-toggle"
            title="Toggle patient details panel"
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-patient-card"))}
            aria-label="Toggle patient details panel"
          >
            <IconCl name="navigation-patients" size={13} />
            <span>Details</span>
          </button>
        </div>

        {pet && (
          <div className="cl-strip__pills">
            <span className="cl-pill cl-pill--active"><span className="cl-pill__dot" /> Active</span>
            <span className="cl-pill cl-pill--info">Insurance · {pet.insurance || "Petplan"} · {pet.insuranceTier || "Gold"}</span>
            {pet.allergies && <span className="cl-pill cl-pill--allergy">Allergy · {pet.allergies}</span>}
            {pet.vaccineDue && <span className="cl-pill cl-pill--warn"><span className="cl-pill__dot cl-pill__dot--warn" /> Vaccine due in {pet.vaccineDue}</span>}
            <span className="cl-pill cl-pill--neutral">Microchip · {(pet.microchip || "985112000123456").slice(0, 6)}…</span>
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
        </div>
      </div>

      {/* Body: rail + content */}
      <div className="cl-body cl-body--no-rail">
        <main className="cl-main">
          {tab === "chart" && pet && <ChartTab pet={pet} />}
          {tab !== "chart" && (
            <div className="cl-empty">
              <IconCl name="file-patient-records" size={28} />
              <div className="cl-empty__title">{PET_TABS.find(t=>t.id===tab).label}</div>
              <div className="cl-empty__sub">{pet?.name}'s {PET_TABS.find(t=>t.id===tab).label.toLowerCase()} appear here.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ChartTab({ pet }) {
  return (
    <div className="cl-chart">
      <div className="cl-chart__head">
        <div>
          <div className="cl-chart__title">Recent visits → {pet.name}</div>
          <div className="cl-chart__sub">Last 12 months · 6 events</div>
        </div>
        <div className="row gap-xs">
          <button className="n-button n-button--s"><IconCl name="interface-filter" size={11} /> All types</button>
          <button className="n-button n-button--s"><IconCl name="interface-download" size={11} /> Export</button>
        </div>
      </div>

      <div className="cl-timeline">
        {CLIENT_TIMELINE.map((e, i) => (
          <div key={i} className={"cl-event cl-event--" + e.tone}>
            <div className="cl-event__date">
              <div className="cl-event__day">{e.date.split(" ")[0]}</div>
              <div className="cl-event__mon">{e.date.split(" ")[1]}</div>
              <div className="cl-event__yr">{e.date.split(" ")[2]}</div>
            </div>
            <div className="cl-event__bar" />
            <div className="cl-event__card">
              <div className="cl-event__row">
                <div className="cl-event__icon">
                  <IconCl name={e.icon} size={14} />
                </div>
                <div className="flex-1">
                  <div className="cl-event__title">{e.title}</div>
                  <div className="cl-event__meta">
                    <span><IconCl name="interface-time" size={11} /> {e.time}</span>
                    <span><IconCl name="user" size={11} /> {e.vet}</span>
                  </div>
                </div>
                <button className="cl-event__more"><IconCl name="interface-menu-small" size={12} /></button>
              </div>
              <div className="cl-event__note">{e.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ClientsPage = ClientsPage;
window.ClientDetailPage = ClientDetailPage;
