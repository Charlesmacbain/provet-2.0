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

function PatientDetailPage({ patient, onBack }) {
  const [tab, setTab] = React.useState("summary");
  const tabs = [
    { id: "summary",    label: "Summary" },
    { id: "vitals",     label: "Vitals" },
    { id: "history",    label: "History",  count: 14 },
    { id: "rx",         label: "Prescriptions", count: 3 },
    { id: "lab",        label: "Lab",      count: 2 },
    { id: "imaging",    label: "Imaging" },
    { id: "files",      label: "Files",    count: 7 },
    { id: "invoices",   label: "Invoices" },
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
              <button className="n-button n-button--s" onClick={() => window.dispatchEvent(new CustomEvent("toggle-patient-card"))} title="Toggle patient details panel">
                <IconD name="navigation-patients" size={12} /> Details
              </button>
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
      {tab !== "summary" && (
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

window.PatientDetailPage = PatientDetailPage;
