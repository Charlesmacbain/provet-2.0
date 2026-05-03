/* global React, ReactDOM */
const { Sidenav } = window.PROVET_SHELL;

function App() {
  const [page, setPage] = React.useState("appointments");
  const [openedPatient, setOpenedPatient] = React.useState(null);
  const [openedClient, setOpenedClient] = React.useState(null);
  const [aiMode, setAiMode] = React.useState("closed");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [apptSide, setApptSide] = React.useState(null);
  const onToggleAside = () => setAiMode(m => m === "sidebar" ? "closed" : "sidebar");

  React.useEffect(() => {
    const onOpen = () => setSearchOpen(true);
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("open-search", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-search", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const goPage = (p) => {
    if (p === "ai") { setAiMode("fullscreen"); return; }
    if (aiMode === "fullscreen") setAiMode("sidebar");
    setOpenedPatient(null); setOpenedClient(null); setPage(p);
  };
  const openPatient = (p) => { setOpenedPatient(p); setPage("patient-detail"); };
  const openClient = (c) => { setOpenedClient(c); setPage("client-detail"); };

  let pageEl = null;
  if (page === "appointments") pageEl = <window.AppointmentsPage openPatient={openPatient} apptSide={apptSide} setApptSide={setApptSide} />;
  else if (page === "patients") pageEl = <window.PatientsPage openPatient={openPatient} />;
  else if (page === "patient-detail" && openedPatient) pageEl = <window.PatientDetailPage patient={openedPatient} onBack={() => setPage("patients")} />;
  else if (page === "clients") pageEl = <window.ClientsPage openClient={openClient} />;
  else if (page === "client-detail" && openedClient) pageEl = <window.ClientDetailPage client={openedClient} onBack={() => setPage("clients")} />;
  else if (page === "invoices") pageEl = <window.InvoicesPage />;
  else if (page === "inbox") pageEl = <window.InboxPage />;
  else if (page === "conversations") pageEl = <window.ConversationsPage />;
  else if (page === "billing") pageEl = <window.BillingPage />;
  else {
    const stubs = {
      tasks:         { icon: "navigation-tasks",     title: "Tasks",         sub: "Your team's open work" },
      lab:           { icon: "medical-flask",        title: "Lab orders",    sub: "Pending and recent panels" },
      prescriptions: { icon: "medical-prescription", title: "Prescriptions", sub: "Active scripts and refills" },
      imaging:       { icon: "medical-radiology-scan", title: "Imaging",     sub: "Radiology, ultrasound and reports" },
      inventory:     { icon: "navigation-catalog",   title: "Inventory",     sub: "Stock, suppliers and reorder points" },
      reports:       { icon: "navigation-reports",   title: "Reports",       sub: "Financial, clinical and operational" },
      settings:      { icon: "navigation-settings",  title: "Settings",      sub: "Practice, users, billing and integrations" },
    };
    const s = stubs[page] || { icon: "interface-info", title: "Page", sub: "" };
    pageEl = <window.StubPage {...s} />;
  }

  const showAside = aiMode === "sidebar" || (page === "appointments" && !!apptSide);
  const navActiveId = aiMode === "fullscreen" ? "ai" : page;
  const closeAi = () => setAiMode("closed");

  return (
    <div className="app-shell density-compact">
      <Sidenav page={navActiveId} setPage={goPage} onToggleAside={onToggleAside} />
      <div className={"main" + (showAside ? " main--with-aside" : "")}>
        {aiMode === "fullscreen" ? (
          <window.AskAI mode="fullscreen" setMode={setAiMode} onClose={closeAi} />
        ) : (
          <div className={"content" + (["clients", "billing", "conversations"].includes(page) ? " content--bare" : "")}>{pageEl}</div>
        )}
        {showAside && (
          <div className={"right-rail" + (page === "appointments" && apptSide ? " right-rail--row" : "")}>
            {(page === "appointments" && apptSide) ? (
              <>
                <window.ApptSidePanel state={apptSide} setState={setApptSide} />
                {aiMode === "sidebar" && <window.AskAI mode="sidebar" setMode={setAiMode} onClose={closeAi} />}
              </>
            ) : (
              <window.AskAI mode="sidebar" setMode={setAiMode} onClose={closeAi} />
            )}
          </div>
        )}
      </div>
      {aiMode !== "sidebar" && aiMode !== "fullscreen" && (
        <window.AskAI mode={aiMode === "floating" ? "floating" : "closed"} setMode={setAiMode} onClose={closeAi} />
      )}
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} onNavigate={(p, ent) => {
        setSearchOpen(false);
        if (p === "patient-detail") openPatient(ent);
        else if (p === "client-detail") openClient(ent);
        else goPage(p);
      }} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
