import type { ReactNode } from "react";
import { riskClass, trendClass } from "../utils";
import type { RiskLevel, Severity, Status } from "../types";

type IconName =
  | "overview"
  | "products"
  | "clients"
  | "chain"
  | "risk"
  | "forecast"
  | "ai"
  | "data"
  | "roadmap"
  | "admin"
  | "search"
  | "menu"
  | "close"
  | "check"
  | "x"
  | "arrow"
  | "filter"
  | "log";

const iconPaths: Record<IconName, ReactNode> = {
  overview: (
    <>
      <path d="M4 14h5V4H4z" />
      <path d="M15 20h5V10h-5z" />
      <path d="M4 20h5v-3H4z" />
      <path d="M15 7h5V4h-5z" />
    </>
  ),
  products: (
    <>
      <path d="M4 7l8-4 8 4-8 4z" />
      <path d="M4 7v10l8 4 8-4V7" />
      <path d="M12 11v10" />
    </>
  ),
  clients: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  chain: (
    <>
      <circle cx="5" cy="12" r="3" />
      <circle cx="19" cy="5" r="3" />
      <circle cx="19" cy="19" r="3" />
      <path d="M8 11l8-5" />
      <path d="M8 13l8 5" />
    </>
  ),
  risk: (
    <>
      <path d="M12 3l10 18H2z" />
      <path d="M12 9v5" />
      <path d="M12 17h.01" />
    </>
  ),
  forecast: (
    <>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M21 6v6h-6" />
      <path d="M3 21h18" />
    </>
  ),
  ai: (
    <>
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
      <rect x="7" y="7" width="10" height="10" rx="3" />
      <path d="M10 11h4" />
      <path d="M10 14h2" />
    </>
  ),
  data: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
      <path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  roadmap: (
    <>
      <path d="M4 19V5" />
      <path d="M20 19V5" />
      <path d="M4 7h16" />
      <path d="M4 13h16" />
      <path d="M8 7v6" />
      <path d="M15 13v6" />
    </>
  ),
  admin: (
    <>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9c.25.6.84 1 1.55 1H21a2 2 0 0 1 0 4h-.08a1.7 1.7 0 0 0-1.52 1z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  close: (
    <>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
  check: <path d="M20 6L9 17l-5-5" />,
  x: (
    <>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5h16" />
      <path d="M7 12h10" />
      <path d="M10 19h4" />
    </>
  ),
  log: (
    <>
      <path d="M8 3h8l4 4v14H8z" />
      <path d="M16 3v5h5" />
      <path d="M4 7v14h4" />
      <path d="M11 13h6" />
      <path d="M11 17h4" />
    </>
  )
};

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {iconPaths[name]}
    </svg>
  );
}

export function StatusBadge({ value }: { value: RiskLevel | Severity | Status | string }) {
  return <span className={`status-badge ${riskClass(value)}`}>{value}</span>;
}

export function DashboardCard({
  title,
  value,
  delta,
  trend,
  risk,
  explanation,
  onClick
}: {
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "stable";
  risk: RiskLevel;
  explanation: string;
  onClick?: () => void;
}) {
  return (
    <button className="metric-card" onClick={onClick} aria-label={`${title}: ${value}. ${explanation}`}>
      <span className="metric-topline">
        <span>{title}</span>
        <StatusBadge value={risk} />
      </span>
      <strong>{value}</strong>
      <span className={`metric-delta ${trendClass(trend)}`}>{delta}</span>
      <small>{explanation}</small>
    </button>
  );
}

export function SectionHeader({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="section-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </header>
  );
}

export function ChartCard({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="chart-card">
      <div className="card-heading">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="empty-state">
      <Icon name="search" size={24} />
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

export function MiniProgress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="mini-progress" aria-label={`${label ?? "Прогресс"} ${value}%`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function FilterSelect({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search-field">
      <Icon name="search" />
      <span className="sr-only">Поиск</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
