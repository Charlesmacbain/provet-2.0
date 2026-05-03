/* global React, PROVET_DATA, PROVET_PRIM */
const { Icon, Avatar, Card, Badge, getInitials, statusBadge, speciesIcon } = window.PROVET_PRIM;
const { STATS, APPOINTMENTS_TODAY, ACTIVITY, TASKS, PATIENTS, ICON } = window.PROVET_DATA;

function Stat({ label, value, delta, up, sub }) {
  let cls = "stat__delta";
  let arrow = null;
  if (up === true)  { cls += " stat__delta--up"; arrow = <Icon name="graph-trend-up" size={14} />; }
  if (up === false) { cls += " stat__delta--down"; arrow = <Icon name="graph-trend-down" size={14} />; }
  return (
    <div className="stat">
      <div className="stat__label">{label}</div>
      <div className="stat__value">{value}</div>
      <div className="row gap-s text-s">
        {delta && <span className={cls}>{arrow}{delta}</span>}
        {sub && <span className="muted">· {sub}</span>}
      </div>
    </div>
  );
}

function ActivityIcon({ tone, name }) {
  const styleMap = {
    info:      { background: "var(--n-color-status-info-weak)",      color: "var(--n-color-text-info)" },
    success:   { background: "var(--n-color-status-success-weak)",   color: "var(--n-color-text-success)" },
    warning:   { background: "var(--n-color-status-warning-weak)",   color: "var(--n-color-text-warning)" },
    danger:    { background: "var(--n-color-status-danger-weak)",    color: "var(--n-color-text-danger)" },
    highlight: { background: "var(--n-color-status-highlight-weak)", color: "var(--n-color-text-highlight)" },
  };
  return (
    <div className="activity-item__dot" style={styleMap[tone]}>
      <Icon name={name} size={14} />
    </div>
  );
}

function DashboardPage({ openPatient, goPage }) {
  const [taskState, setTaskState] = React.useState(TASKS);
  const toggleTask = (id) => setTaskState(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const next6 = APPOINTMENTS_TODAY.slice(0, 6);

  return (
    <div className="content__inner">
      <div className="page-header">
        <div>
          <div className="crumbs">
            <a>Workspace</a>
            <span className="crumbs__sep">/</span>
            <span>Dashboard</span>
          </div>
          <h1 className="page-header__title">Good morning, Sara</h1>
          <div className="page-header__sub tnum">Mon, 16 Mar 2026 · 6 patients waiting · 24 appointments today</div>
        </div>
        <div className="page-header__actions">
          <button className="n-button"><Icon name="interface-calendar" size={14} /> New appointment</button>
          <button className="n-button n-button--primary"><Icon name="interface-add" size={14} style={{color:"#fff"}} /> Quick add</button>
        </div>
      </div>

      {/* stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
        {STATS.map(s => <Stat key={s.label} {...s} />)}
      </div>

      {/* main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        {/* left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card
            title="Today's schedule"
            sub="Mon, 16 Mar · Showing first 6 of 24"
            action={<button className="n-button n-button--s" onClick={() => goPage("appointments")}>View all</button>}
            flush
          >
            {next6.map((a, i) => (
              <div key={i} className="list-row" onClick={() => openPatient(PATIENTS.find(p => p.name === a.patient) || PATIENTS[0])}>
                <div className="list-row__time tnum">{a.time}</div>
                <Avatar initials={getInitials(a.patient)} color={a.tone} size="s" />
                <div className="flex-1">
                  <div className="list-row__title">{a.patient}</div>
                  <div className="list-row__sub">{a.reason} · {a.vet}</div>
                </div>
                {statusBadge(a.status)}
              </div>
            ))}
          </Card>

          <Card
            title="Recently seen"
            sub="Patients you opened in the last 7 days"
            action={<button className="n-button n-button--s" onClick={() => goPage("patients")}>All patients</button>}
            flush
          >
            <table className="n-table">
              <thead><tr>
                <th>Patient</th><th>Owner</th><th>Last visit</th><th>Status</th>
              </tr></thead>
              <tbody>
                {PATIENTS.slice(0, 5).map(p => (
                  <tr key={p.id} style={{ cursor: "pointer" }} onClick={() => openPatient(p)}>
                    <td>
                      <div className="cell-patient">
                        <Avatar initials={getInitials(p.name)} color={p.color} size="s" />
                        <div>
                          <div className="cell-patient__name">{p.name}</div>
                          <div className="cell-patient__id">{p.id} · {p.species} · {p.breed}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.owner}</td>
                    <td className="tnum muted">{p.lastVisit}</td>
                    <td>{statusBadge(p.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Activity" sub="Across the clinic" flush>
            <div style={{ padding: "0 16px" }}>
              {ACTIVITY.map((a, i) => (
                <div key={i} className="activity-item">
                  <ActivityIcon tone={a.tone} name={a.icon} />
                  <div className="flex-1">
                    <div className="activity-item__title">
                      <b>{a.who}</b> {a.what} <b>{a.target}</b>
                    </div>
                    <div className="activity-item__time">{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Waiting room" sub="2 in waiting · avg wait 14m" flush>
            <div style={{ padding: "0 16px 12px" }}>
              {[
                { name: "Bella Andersen", reason: "Annual exam", time: "14m", tone: "info" },
                { name: "Milo Olsen",     reason: "Vaccination", time: "8m",  tone: "warning" },
              ].map((w, i) => (
                <div key={i} className="activity-item">
                  <Avatar initials={getInitials(w.name)} color={w.tone} size="s" />
                  <div className="flex-1">
                    <div className="activity-item__title"><b>{w.name}</b> · {w.reason}</div>
                    <div className="activity-item__time">Waiting {w.time}</div>
                  </div>
                  <button className="n-button n-button--s">Call in</button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
