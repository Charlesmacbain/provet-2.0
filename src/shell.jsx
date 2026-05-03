/* global React */
const { Icon, Avatar, getInitials } = window.PROVET_PRIM;
const { ORG, USER, CLINICS = [] } = window.PROVET_DATA;

const NAV = {
  primary: [
    { id: "inbox", label: "Inbox", icon: "navigation-inbox", count: 12 },
    { id: "appointments", label: "Calendar", icon: "interface-calendar", count: 24 },
    { id: "clients", label: "Clients", icon: "user-multiple" },
    { id: "conversations", label: "Conversations", icon: "interface-email", count: 8 },
    { id: "billing", label: "Billing", icon: "navigation-finances" },
    { id: "reports", label: "Reports", icon: "navigation-reports" },
  ],
  pinned: [
    { id: "pinned-bella", label: "Bella · Setälä", icon: "generic-pet-paw", color: "#10B981" },
    { id: "pinned-milo", label: "Milo · Collins", icon: "generic-pet-paw", color: "#4178D4" },
    { id: "pinned-unpaid", label: "Unpaid invoices", icon: "navigation-finances", color: "#F59E0B" },
  ],
  views: [
    { id: "view-surgeries", label: "Today's surgeries", icon: "medical-bandage", color: "#E26464" },
    { id: "view-inpatients", label: "Inpatients", icon: "generic-pet-paw", color: "#3B82F6" },
    { id: "view-lab", label: "Lab orders", icon: "medical-flask", count: 7, color: "#8B5CF6" },
    { id: "view-followups", label: "Follow-ups due", icon: "interface-time", count: 3, color: "#F59E0B" },
  ],
};

function HoverNavSection({ label, icon, items, page, setPage, collapsed }) {
  const fly = useHoverFlyout();
  const activeChild = items.find(i => i.id === page);
  return (
    <div className="sidenav__flyout-wrap" ref={fly.ref}
      onMouseEnter={fly.show} onMouseLeave={fly.hide}>
      <button className={"sidenav__item" + (collapsed ? " sidenav__item--icon" : "") + (activeChild ? " sidenav__item--active" : "")}
        aria-label={label} data-tip={collapsed ? label : undefined}>
        <Icon name={icon} size={20} className="sidenav__icon" />
        {!collapsed && <span className="flex-1 truncate" style={{ textAlign: "start" }}>{label}</span>}
      </button>
      {fly.open && (
        <div className="sidenav__flyout" style={{ position: "fixed", left: fly.pos.left, top: fly.pos.top, minWidth: 200 }}
          onMouseEnter={fly.keep} onMouseLeave={fly.hide}>
          {items.map((item) => (
            <button key={item.id}
              className={"sidenav__flyout-item" + (page === item.id ? " sidenav__flyout-item--active" : "")}
              onClick={() => { setPage(item.id); fly.hide(); }}>
              <Icon name={item.icon} size={14} className="sidenav__icon" style={item.color ? { color: item.color } : undefined} />
              <span className="flex-1 truncate" style={{ textAlign: "start" }}>{item.label}</span>
              {item.count != null && <span className="sidenav__count">{item.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NavItem({ item, active, onClick, collapsed }) {
  if (collapsed) {
    return (
      <button
        className={"sidenav__item sidenav__item--icon" + (active ? " sidenav__item--active" : "")}
        onClick={onClick}
        aria-label={item.label}
        data-tip={item.label}>
        <Icon name={item.icon} size={20} className="sidenav__icon" style={item.color ? { color: item.color } : undefined} />
        {item.id === "inbox" && item.count != null && <span className="sidenav__icon-badge">{item.count > 9 ? "9+" : item.count}</span>}
      </button>
    );
  }
  return (
    <button
      className={"sidenav__item" + (active ? " sidenav__item--active" : "")}
      onClick={onClick}>
      <Icon name={item.icon} size={20} className="sidenav__icon" style={item.color ? { color: item.color } : undefined} />
      <span className="flex-1 truncate">{item.label}</span>
      {item.count != null && <span className="sidenav__count">{item.count}</span>}
    </button>
  );
}

function ClinicMenu({ open, onClose, flyout, pos, onMouseEnter, onMouseLeave }) {
  const ref = React.useRef(null);
  const [query, setQuery] = React.useState("");
  React.useEffect(() => {
    if (!open || flyout) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, flyout]);
  React.useEffect(() => { if (!open) setQuery(""); }, [open]);
  if (!open) return null;
  const style = flyout && pos
    ? { position: "fixed", left: pos.left, ...(pos.bottom != null ? { bottom: pos.bottom, top: "auto" } : { top: pos.top }), minWidth: 220 }
    : { position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, minWidth: 220 };
  const filtered = CLINICS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.location.toLowerCase().includes(query.toLowerCase())
  );
  const RECENT_LIMIT = 3;
  const showSearch = CLINICS.length > RECENT_LIMIT;
  const list = query ? filtered : filtered.slice(0, RECENT_LIMIT);
  return (
    <div ref={ref} className="sidenav__flyout sidenav__flyout--heading clinic-menu-flyout" style={style}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="sidenav__flyout-head">Switch clinic</div>
      <button className="sidenav__flyout-item sidenav__flyout-item--active">
        <Icon name="generic-hospital" size={14} className="sidenav__icon" />
        <div className="flex-1">
          <div className="clinic-menu-flyout__name">{ORG.name}</div>
          <div className="clinic-menu-flyout__sub">{ORG.location}</div>
        </div>
        <Icon name="interface-checked-small" size={14} style={{ color: "var(--n-color-accent)" }} />
      </button>
      {showSearch && (
        <div className="clinic-menu-flyout__search">
          <Icon name="navigation-search" size={12} className="sidenav__icon" />
          <input type="text" placeholder="Search clinics" value={query}
            onChange={(e) => setQuery(e.target.value)} />
        </div>
      )}
      {list.map((c) => (
        <button key={c.name} className="sidenav__flyout-item">
          <Icon name="generic-hospital" size={14} className="sidenav__icon" />
          <div className="flex-1">
            <div className="clinic-menu-flyout__name">{c.name}</div>
            <div className="clinic-menu-flyout__sub">{c.location}</div>
          </div>
        </button>
      ))}
      {query && list.length === 0 && (
        <div className="clinic-menu-flyout__empty">No clinics found</div>
      )}
      <hr className="sidenav__flyout-divider" />
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <Icon name="interface-help" size={14} className="sidenav__icon" />
        <span className="flex-1">Help &amp; support</span>
      </button>
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <Icon name="navigation-settings" size={14} className="sidenav__icon" />
        <span className="flex-1">Settings</span>
      </button>
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <Icon name="interface-logout" size={14} className="sidenav__icon" />
        <span className="flex-1">Sign out</span>
      </button>
    </div>
  );
}

function UserMenu({ open, flyout, pos, onMouseEnter, onMouseLeave }) {
  if (!open) return null;
  const style = flyout && pos
    ? { position: "fixed", left: pos.left, ...(pos.bottom != null ? { bottom: pos.bottom, top: "auto" } : { top: pos.top }), minWidth: 220 }
    : undefined;
  const others = [
    { name: "Dr. Aarav Patel", role: "Veterinarian", initials: "AP", color: "info" },
    { name: "Nora Hughes", role: "Veterinary nurse", initials: "NH", color: "warning" },
    { name: "Reception desk", role: "Front desk", initials: "RD", color: "highlight" },
  ];
  return (
    <div className="sidenav__flyout sidenav__flyout--heading clinic-menu-flyout" style={style}
      onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="sidenav__flyout-head">Signed in as</div>
      <button className="sidenav__flyout-item sidenav__flyout-item--active">
        <Avatar initials={USER.initials} color="success" size="s" />
        <div className="flex-1">
          <div className="clinic-menu-flyout__name">{USER.name}</div>
          <div className="clinic-menu-flyout__sub">{USER.role}</div>
        </div>
        <Icon name="interface-checked-small" size={14} style={{ color: "var(--n-color-accent)" }} />
      </button>
      <div className="sidenav__flyout-head">Switch user</div>
      {others.map((u) => (
        <button key={u.name} className="sidenav__flyout-item">
          <Avatar initials={u.initials} color={u.color} size="s" />
          <div className="flex-1">
            <div className="clinic-menu-flyout__name">{u.name}</div>
            <div className="clinic-menu-flyout__sub">{u.role}</div>
          </div>
        </button>
      ))}
      <hr className="sidenav__flyout-divider" />
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <Icon name="user-multiple" size={14} className="sidenav__icon" />
        <span className="flex-1">My profile</span>
      </button>
      <button className="sidenav__flyout-item sidenav__flyout-item--action">
        <Icon name="interface-logout" size={14} className="sidenav__icon" />
        <span className="flex-1">Sign out</span>
      </button>
    </div>
  );
}

function useHoverFlyout() {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState({ left: 0, top: 0, bottom: 0 });
  const timer = React.useRef(null);
  const ref = React.useRef(null);
  const show = () => {
    clearTimeout(timer.current);
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      setPos({ left: r.right + 8, top: r.top, bottom: window.innerHeight - r.bottom });
    }
    setOpen(true);
  };
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 140); };
  const keep = () => clearTimeout(timer.current);
  return { open, pos, ref, show, hide, keep };
}

function Sidenav({ page, setPage, onToggleAside }) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const brand = useHoverFlyout();
  const user = useHoverFlyout();

  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem("nav.collapsed") === "1"; } catch { return false; }
  });
  const [width, setWidth] = React.useState(() => {
    try {
      const v = parseInt(localStorage.getItem("nav.width") || "200", 10);
      return Number.isFinite(v) ? v : 200;
    } catch { return 200; }
  });

  React.useEffect(() => {
    const shell = document.querySelector(".app-shell");
    if (!shell) return;
    shell.style.setProperty("--nav-width", collapsed ? "44px" : width + "px");
  }, [collapsed, width]);

  React.useEffect(() => {
    try { localStorage.setItem("nav.collapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);
  React.useEffect(() => {
    try { localStorage.setItem("nav.width", String(width)); } catch {}
  }, [width]);

  React.useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === ".") { e.preventDefault(); setCollapsed(c => !c); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const SidebarToggleIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="6" y1="3.5" x2="6" y2="12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
  const ToggleButton = (
    <button className="sidenav__toggle" onClick={() => setCollapsed(c => !c)}
      aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
      data-tip={collapsed ? "Open sidebar  ⌘." : "Close sidebar  ⌘."}>
      {SidebarToggleIcon}
    </button>
  );

  const startDrag = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = collapsed ? 44 : width;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (ev) => {
      const next = startW + (ev.clientX - startX);
      if (next < 130) { setCollapsed(true); }
      else { setCollapsed(false); setWidth(Math.min(360, Math.max(160, next))); }
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const ResizeHandle = (
    <div className="sidenav__resize" onMouseDown={startDrag}
      onDoubleClick={() => { setCollapsed(false); setWidth(200); }}
      title="Drag to resize · double-click to reset" />
  );

  return (
    <nav className={`sidenav ${collapsed ? "sidenav--collapsed" : "sidenav--full"}`}>
      {ResizeHandle}

      {/* Brand */}
      <div className="sidenav__brand-wrap" ref={brand.ref}>
        {collapsed ? (
          <div className="sidenav__item sidenav__item--icon sidenav__item--brand"
            onMouseEnter={brand.show} onMouseLeave={brand.hide}>
            <span className="topbar__logo-mark">{ORG.name.charAt(0)}</span>
          </div>
        ) : (
          <>
            <button type="button" className="sidenav__brand"
              onMouseEnter={brand.show} onMouseLeave={brand.hide}>
              <span className="topbar__logo-mark" aria-hidden="true">{ORG.name.charAt(0)}</span>
              <span className="sidenav__clinic-name truncate flex-1">{ORG.name}</span>
            </button>
            {ToggleButton}
          </>
        )}
        <ClinicMenu open={brand.open} flyout pos={{ left: brand.pos.left, top: brand.pos.top }}
          onMouseEnter={brand.keep} onMouseLeave={brand.hide} />
      </div>

      {/* Search */}
      {collapsed ? (
        <div className="sidenav__group">
          <button className="sidenav__item sidenav__item--icon"
            onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}
            aria-label="Search" data-tip="Search">
            <Icon name="navigation-search" className="sidenav__icon" size={18} />
          </button>
          {NAV.primary.map((item) =>
            <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} collapsed />
          )}
          <HoverNavSection label="Recent" icon="interface-time" items={NAV.pinned} page={page} setPage={setPage} collapsed />
          <HoverNavSection label="Views" icon="interface-filter" items={NAV.views} page={page} setPage={setPage} collapsed />
        </div>
      ) : (
        <>
          <button className="sidenav__item sidenav__item--search"
            onClick={() => window.dispatchEvent(new CustomEvent("open-search"))}>
            <Icon name="navigation-search" className="sidenav__icon" size={16} />
            <span style={{ flex: 1, textAlign: "start" }}>Search</span>
            <span className="sidenav__search-kbd">⌘K</span>
          </button>
          <div className="sidenav__group">
            {NAV.primary.map((item) =>
              <NavItem key={item.id} item={item} active={page === item.id} onClick={() => setPage(item.id)} />
            )}
          </div>
          <div className="sidenav__group">
            <HoverNavSection label="Recent" icon="interface-time" items={NAV.pinned} page={page} setPage={setPage} />
            <HoverNavSection label="Views" icon="interface-filter" items={NAV.views} page={page} setPage={setPage} />
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Footer */}
      {collapsed ? (
        <div className="sidenav__footer sidenav__footer--icon" ref={user.ref}
          onMouseEnter={user.show} onMouseLeave={user.hide}>
          <Avatar initials={USER.initials} color="success" />
          <UserMenu open={user.open} flyout pos={{ left: user.pos.left, bottom: user.pos.bottom }}
            onMouseEnter={user.keep} onMouseLeave={user.hide} />
        </div>
      ) : (
        <div className="sidenav__footer">
          <div className="sidenav__user" ref={user.ref}
            onMouseEnter={user.show} onMouseLeave={user.hide}>
            <Avatar initials={USER.initials} color="success" />
            <div className="sidenav__user-meta flex-1 truncate">
              <div className="sidenav__user-name truncate">{USER.name}</div>
              <div className="sidenav__user-role">{USER.role}</div>
            </div>
            <UserMenu open={user.open} flyout pos={{ left: user.pos.left, bottom: user.pos.bottom + 40 }}
              onMouseEnter={user.keep} onMouseLeave={user.hide} />
          </div>
        </div>
      )}
    </nav>
  );
}

window.PROVET_SHELL = { Sidenav };
