import { clamp } from "../utils";

export function LineChart({
  labels,
  series,
  forecast,
  height = 240,
  label,
  unit = ""
}: {
  labels: string[];
  series: number[];
  forecast?: number[];
  height?: number;
  label: string;
  unit?: string;
}) {
  const allValues = [...series, ...(forecast ?? [])];
  const min = Math.min(...allValues) * 0.96;
  const max = Math.max(...allValues) * 1.04;
  const width = 720;
  const padding = 38;
  const totalPoints = allValues.length;
  const xStep = (width - padding * 2) / Math.max(totalPoints - 1, 1);
  const y = (value: number) => height - padding - ((value - min) / (max - min)) * (height - padding * 2);
  const x = (index: number) => padding + index * xStep;
  const actualPath = series.map((value, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`).join(" ");
  const forecastStart = series.length - 1;
  const forecastValues = forecast ? [series[series.length - 1], ...forecast] : [];
  const forecastPath = forecastValues
    .map((value, index) => `${index === 0 ? "M" : "L"} ${x(forecastStart + index)} ${y(value)}`)
    .join(" ");

  return (
    <div className="chart-scroll" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart">
        <g className="grid-lines">
          {[0, 1, 2, 3].map((tick) => {
            const yy = padding + tick * ((height - padding * 2) / 3);
            return <line key={tick} x1={padding} x2={width - padding} y1={yy} y2={yy} />;
          })}
        </g>
        <path d={actualPath} className="line-actual" />
        {forecast ? <path d={forecastPath} className="line-forecast" /> : null}
        {series.map((value, index) => (
          <g key={`${value}-${index}`}>
            <circle cx={x(index)} cy={y(value)} r="4.5" className="point-actual" />
            <text x={x(index)} y={y(value) - 12} textAnchor="middle">
              {value}
              {unit}
            </text>
          </g>
        ))}
        {forecast
          ? forecast.map((value, index) => (
              <g key={`f-${value}-${index}`}>
                <circle cx={x(series.length + index)} cy={y(value)} r="4.5" className="point-forecast" />
                <text x={x(series.length + index)} y={y(value) - 12} textAnchor="middle">
                  {value}
                  {unit}
                </text>
              </g>
            ))
          : null}
        {[...labels, ...(forecast ? ["+1", "+2", "+3", "+4"] : [])].slice(0, totalPoints).map((month, index) => (
          <text key={`${month}-${index}`} className="axis-label" x={x(index)} y={height - 12} textAnchor="middle">
            {month}
          </text>
        ))}
      </svg>
      {forecast ? (
        <div className="chart-legend">
          <span>
            <i className="legend-line actual" /> Факт
          </span>
          <span>
            <i className="legend-line forecast" /> Прогноз
          </span>
        </div>
      ) : null}
    </div>
  );
}

export function DonutChart({
  items,
  label
}: {
  items: { label: string; value: number; color: string }[];
  label: string;
}) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let offset = 25;

  return (
    <div className="donut-wrap" role="img" aria-label={label}>
      <svg viewBox="0 0 160 160" className="donut-chart">
        <circle cx="80" cy="80" r="54" className="donut-base" />
        {items.map((item) => {
          const dash = (item.value / total) * 100;
          const circle = (
            <circle
              key={item.label}
              cx="80"
              cy="80"
              r="54"
              className="donut-segment"
              stroke={item.color}
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={offset}
            />
          );
          offset -= dash;
          return circle;
        })}
        <text x="80" y="76" textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x="80" y="96" textAnchor="middle" className="donut-label">
          доля
        </text>
      </svg>
      <div className="donut-legend">
        {items.map((item) => (
          <span key={item.label}>
            <i style={{ backgroundColor: item.color }} />
            {item.label}
            <b>{item.value}%</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export function BarChart({
  items,
  label
}: {
  items: { label: string; value: number; target?: number }[];
  label: string;
}) {
  const max = Math.max(...items.flatMap((item) => [item.value, item.target ?? 0]));

  return (
    <div className="bar-chart" role="img" aria-label={label}>
      {items.map((item) => (
        <div className="bar-row" key={item.label}>
          <span>{item.label}</span>
          <div className="bar-track">
            {item.target ? (
              <i className="bar-target" style={{ left: `${(item.target / max) * 100}%` }} title="План" />
            ) : null}
            <b style={{ width: `${(item.value / max) * 100}%` }} />
          </div>
          <strong>{item.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function BulletChart({
  value,
  target,
  label
}: {
  value: number;
  target: number;
  label: string;
}) {
  const percentage = clamp((value / target) * 100, 0, 130);
  const targetPosition = clamp((target / Math.max(value, target)) * 100, 0, 100);

  return (
    <div className="bullet" aria-label={`${label}: факт ${value}, план ${target}`}>
      <div className="bullet-label">
        <span>{label}</span>
        <b>
          {value} / {target}
        </b>
      </div>
      <div className="bullet-track">
        <span className="bullet-zone red" />
        <span className="bullet-zone yellow" />
        <span className="bullet-zone green" />
        <strong style={{ width: `${clamp(percentage, 0, 100)}%` }} />
        <i style={{ left: `${targetPosition}%` }} />
      </div>
    </div>
  );
}

export function RiskMatrix({
  events,
  onSelect
}: {
  events: { id: string; title: string; probability: number; impact: number; severity: string }[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="risk-matrix" role="img" aria-label="Матрица риска вероятность и влияние">
      <span className="matrix-y">Влияние</span>
      <div className="matrix-grid">
        {[3, 2, 1].map((impact) =>
          [1, 2, 3, 4, 5].map((probability) => {
            const eventsInCell = events.filter((event) => event.impact === impact && event.probability === probability);
            const score = impact * probability;
            const severityClass = score >= 10 ? "matrix-red" : score >= 6 ? "matrix-yellow" : "matrix-green";
            return (
              <button
                key={`${impact}-${probability}`}
                className={`matrix-cell ${severityClass}`}
                onClick={() => eventsInCell[0] && onSelect?.(eventsInCell[0].id)}
                disabled={!eventsInCell.length}
                aria-label={`Вероятность ${probability}, влияние ${impact}, событий ${eventsInCell.length}`}
              >
                {eventsInCell.map((event) => (
                  <span key={event.id} title={event.title}>
                    {event.title.slice(0, 2)}
                  </span>
                ))}
              </button>
            );
          })
        )}
      </div>
      <span className="matrix-x">Вероятность</span>
    </div>
  );
}

export function Sparkline({ values }: { values: number[] }) {
  const width = 110;
  const height = 34;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const xStep = width / Math.max(values.length - 1, 1);
  const path = values
    .map((value, index) => {
      const x = index * xStep;
      const y = height - ((value - min) / Math.max(max - min, 1)) * (height - 8) - 4;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={path} />
    </svg>
  );
}
