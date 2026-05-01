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

window.PROVET_PRIM = { Icon, Avatar, Badge, Card, getInitials, speciesIcon, statusBadge };
