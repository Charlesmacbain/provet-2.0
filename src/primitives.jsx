/* global React */
const { useState: useStateP, useEffect: useEffectP, useRef: useRefP } = React;

// Icon helper — uses currentColor via mask
function Icon({ name, size = 16, style, className = "" }) {
  const url = `assets/icons/${name}.svg`;
  return (
    <span
      className={`n-icon-mask ${className}`}
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: "currentColor",
        WebkitMask: `url(${url}) center / contain no-repeat`,
        mask: `url(${url}) center / contain no-repeat`,
        flex: "none",
        ...style,
      }}
    />
  );
}

function Avatar({ initials, color = "info", size = "" }) {
  const styleMap = {
    info:      { background: "var(--n-color-status-info-weak)",      color: "var(--n-color-text-info)" },
    success:   { background: "var(--n-color-status-success-weak)",   color: "var(--n-color-text-success)" },
    warning:   { background: "var(--n-color-status-warning-weak)",   color: "var(--n-color-text-warning)" },
    danger:    { background: "var(--n-color-status-danger-weak)",    color: "var(--n-color-text-danger)" },
    highlight: { background: "var(--n-color-status-highlight-weak)", color: "var(--n-color-text-highlight)" },
    progress:  { background: "var(--n-color-status-progress-weak)",  color: "var(--n-color-text-progress)" },
  };
  const klass = "n-avatar" + (size ? ` n-avatar--${size}` : "");
  return <div className={klass} data-tone={color} style={styleMap[color] || styleMap.info}>{initials}</div>;
}

function getInitials(name) {
  return name.split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
}

function Badge({ tone = "neutral", dot = false, children }) {
  const cls = tone === "neutral" ? "n-badge" : `n-badge n-badge--${tone}`;
  return (
    <span className={cls}>
      {dot && <span className={`n-dot n-dot--${tone === "neutral" ? "" : tone}`}></span>}
      {children}
    </span>
  );
}

function Card({ title, sub, action, children, flush, style }) {
  return (
    <section className="card" style={style}>
      {(title || action) && (
        <header className="card__header">
          <div>
            {title && <h3 className="card__title">{title}</h3>}
            {sub && <div className="card__sub">{sub}</div>}
          </div>
          {action}
        </header>
      )}
      <div className={"card__body" + (flush ? " card__body--flush" : "")}>{children}</div>
    </section>
  );
}

function speciesIcon(species) {
  const s = species.toLowerCase();
  if (s.includes("canine")) return "generic-canine";
  if (s.includes("feline")) return "generic-feline";
  if (s.includes("equine")) return "generic-equidae";
  if (s.includes("avian"))  return "generic-birds";
  if (s.includes("rodent")) return "generic-rodents";
  return "generic-pet-paw";
}

function statusBadge(status) {
  const map = {
    active:    { tone: "success",   label: "Active" },
    follow:    { tone: "warning",   label: "Follow-up due" },
    overdue:   { tone: "danger",    label: "Overdue" },
    paid:      { tone: "success",   label: "Paid" },
    pending:   { tone: "warning",   label: "Pending" },
    draft:     { tone: "neutral",   label: "Draft" },
    "checked-in": { tone: "success",   label: "Checked in" },
    "scheduled":  { tone: "info",      label: "Scheduled" },
    "in-surgery": { tone: "highlight", label: "In surgery" },
  };
  const m = map[status] || { tone: "neutral", label: status };
  return <Badge tone={m.tone} dot>{m.label}</Badge>;
}

function useDragResize({ initial, min = 200, max = 800, side = "left", storageKey } = {}) {
  const initialFromStorage = (() => {
    if (!storageKey) return initial;
    try { const v = parseInt(localStorage.getItem(storageKey), 10); return Number.isFinite(v) && v >= min && v <= max ? v : initial; }
    catch (e) { return initial; }
  })();
  const [size, setSize] = React.useState(initialFromStorage);
  const sizeRef = React.useRef(size);
  React.useEffect(() => { sizeRef.current = size; if (storageKey) { try { localStorage.setItem(storageKey, String(size)); } catch (e) {} } }, [size, storageKey]);
  const onMouseDown = React.useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    const startX = e.clientX;
    const startSize = sizeRef.current;
    const sign = side === "left" ? -1 : 1;
    const onMove = (ev) => {
      const next = Math.max(min, Math.min(max, startSize + sign * (ev.clientX - startX)));
      setSize(next);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [min, max, side]);
  return [size, onMouseDown, setSize];
}

function ResizeHandle({ side = "left", onMouseDown, style }) {
  const sideStyle = side === "left" ? { left: -3 } : { right: -3 };
  return (
    <div
      onMouseDown={onMouseDown}
      title="Drag to resize"
      style={{
        position: "absolute", top: 0, bottom: 0, width: 6, cursor: "col-resize", zIndex: 5,
        ...sideStyle, ...style,
      }}
    />
  );
}

window.PROVET_PRIM = { Icon, Avatar, Badge, Card, getInitials, speciesIcon, statusBadge, useDragResize, ResizeHandle };
