import React, { useState } from "react";
import { clamp } from "../utils";
import type { RiskEvent, RiskLevel } from "../types";
import { riskClass } from "../utils";

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  content: string;
}

// 1. Line Chart (Fact + Forecast)
export function LineChart({
  labels,
  series,
  forecast,
  height = 220,
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
  const [tooltip, setTooltip] = useState<TooltipState>({ show: false, x: 0, y: 0, content: "" });
  const allValues = [...series, ...(forecast ?? [])];
  const min = Math.min(...allValues) * 0.95;
  const max = Math.max(...allValues) * 1.05;
  const width = 640;
  const padding = 34;
  const totalPoints = allValues.length;
  const xStep = (width - padding * 2) / Math.max(totalPoints - 1, 1);
  const y = (val: number) => height - padding - ((val - min) / (max - min)) * (height - padding * 2);
  const x = (idx: number) => padding + idx * xStep;

  const actualPath = series.map((val, idx) => `${idx === 0 ? "M" : "L"} ${x(idx)} ${y(val)}`).join(" ");
  const forecastStart = series.length - 1;
  const forecastValues = forecast ? [series[series.length - 1], ...forecast] : [];
  const forecastPath = forecastValues
    .map((val, idx) => `${idx === 0 ? "M" : "L"} ${x(forecastStart + idx)} ${y(val)}`)
    .join(" ");

  const handleMouseEnter = (event: React.MouseEvent, val: number, lbl: string) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.left + window.scrollX + 10,
      y: rect.top + window.scrollY - 30,
      content: `${lbl}: ${val} ${unit}`
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <div className="chart-scroll" style={{ position: "relative" }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        <g className="grid-lines">
          {[0, 1, 2, 3].map((tick) => {
            const yy = padding + tick * ((height - padding * 2) / 3);
            return <line key={tick} className="grid-line" x1={padding} x2={width - padding} y1={yy} y2={yy} />;
          })}
        </g>
        
        {/* Actual Path */}
        <path d={actualPath} className="chart-line-actual" />
        
        {/* Forecast Path */}
        {forecast ? <path d={forecastPath} className="chart-line-forecast" /> : null}

        {/* Actual Points */}
        {series.map((val, idx) => (
          <circle
            key={`a-pt-${idx}`}
            cx={x(idx)}
            cy={y(val)}
            r="4.5"
            className="point-actual"
            onMouseEnter={(e) => handleMouseEnter(e, val, labels[idx] || "")}
            onMouseLeave={handleMouseLeave}
          />
        ))}

        {/* Forecast Points */}
        {forecast
          ? forecast.map((val, idx) => {
              const totalIdx = series.length + idx;
              const fLabel = `Прогноз +${idx + 1}`;
              return (
                <circle
                  key={`f-pt-${idx}`}
                  cx={x(totalIdx)}
                  cy={y(val)}
                  r="4.5"
                  className="point-forecast"
                  onMouseEnter={(e) => handleMouseEnter(e, val, fLabel)}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })
          : null}

        {/* Axis Labels */}
        {[...labels, ...(forecast ? ["+1", "+2", "+3", "+4"] : [])].slice(0, totalPoints).map((lbl, idx) => (
          <text key={`lbl-${idx}`} className="axis-label" x={x(idx)} y={height - 10} textAnchor="middle">
            {lbl}
          </text>
        ))}
      </svg>

      {forecast ? (
        <div className="chart-legend-wrap">
          <span className="chart-legend-item"><i className="actual" /> Факт</span>
          <span className="chart-legend-item"><i className="forecast" /> Прогноз</span>
        </div>
      ) : null}

      {tooltip.show && (
        <div
          style={{
            position: "absolute",
            left: `${tooltip.x - 30}px`,
            top: `${tooltip.y - 120}px`,
            background: "rgba(9,15,12,0.9)",
            color: "#ffffff",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "0.74rem",
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 100,
            whiteSpace: "nowrap"
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
}

// 2. Donut Chart
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
    <div className="donut-chart-container" role="img" aria-label={label}>
      <svg viewBox="0 0 160 160" className="donut-svg">
        <circle cx="80" cy="80" r="54" className="donut-base-circle" />
        {items.map((item, idx) => {
          const dash = (item.value / total) * 100;
          const segment = (
            <circle
              key={`donut-${idx}`}
              cx="80"
              cy="80"
              r="54"
              className="donut-seg-circle"
              stroke={item.color}
              strokeDasharray={`${dash} ${100 - dash}`}
              strokeDashoffset={offset}
            />
          );
          offset -= dash;
          return segment;
        })}
        <text x="80" y="76" textAnchor="middle" className="donut-total-text">
          {total}
        </text>
        <text x="80" y="96" textAnchor="middle" className="donut-lbl-text">
          доля
        </text>
      </svg>
      <div className="donut-legend-list">
        {items.map((item, idx) => (
          <span className="donut-legend-item" key={`leg-${idx}`}>
            <i style={{ backgroundColor: item.color }} />
            {item.label}
            <strong>{item.value}%</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

// 3. Bar Chart
export function BarChart({
  items,
  label
}: {
  items: { label: string; value: number; target?: number }[];
  label: string;
}) {
  const max = Math.max(...items.flatMap((item) => [item.value, item.target ?? 0]), 1);

  return (
    <div className="bar-chart-list" role="img" aria-label={label}>
      {items.map((item, idx) => {
        const valPct = (item.value / max) * 100;
        const targetPct = item.target ? (item.target / max) * 100 : null;
        return (
          <div className="bar-chart-row" key={`bar-${idx}`}>
            <span title={item.label}>{item.label}</span>
            <div className="bar-chart-track">
              <b className="bar-chart-fill" style={{ width: `${valPct}%` }} />
              {targetPct !== null ? (
                <i
                  className="bar-chart-target-line"
                  style={{ left: `${targetPct}%` }}
                  title={`Цель: ${item.target}`}
                />
              ) : null}
            </div>
            <strong>{item.value}</strong>
          </div>
        );
      })}
    </div>
  );
}

// 4. Bullet Chart
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

// 5. Risk Matrix
export function RiskMatrix({
  events,
  onSelect
}: {
  events: { id: string; title: string; probability: number; impact: number; severity: string }[];
  onSelect?: (risk: RiskEvent) => void;
}) {
  return (
    <div className="matrix-container">
      <span className="matrix-label-y">Влияние</span>
      <div className="matrix-grid-cells">
        {[3, 2, 1].map((impact) =>
          [1, 2, 3, 4, 5].map((probability) => {
            const eventsInCell = events.filter(
              (event) => event.impact === impact && event.probability === probability
            );
            const score = impact * probability;
            const severityClass = score >= 10 ? "cell-red" : score >= 6 ? "cell-yellow" : "cell-green";
            const isDisabled = eventsInCell.length === 0;

            return (
              <button
                key={`${impact}-${probability}`}
                className={`matrix-grid-cell ${severityClass}`}
                onClick={() => eventsInCell[0] && onSelect?.(eventsInCell[0] as any)}
                disabled={isDisabled}
                title={`Вероятность ${probability}, влияние ${impact}: ${eventsInCell.length} событий`}
              >
                {eventsInCell.length > 0 ? (
                  <span>{eventsInCell.length}</span>
                ) : (
                  ""
                )}
              </button>
            );
          })
        )}
      </div>
      <span className="matrix-label-x">Вероятность</span>
    </div>
  );
}

// 6. Sparkline
export function Sparkline({ values }: { values: number[] }) {
  const width = 100;
  const height = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const xStep = width / Math.max(values.length - 1, 1);
  const path = values
    .map((val, idx) => {
      const x = idx * xStep;
      const y = height - ((val - min) / Math.max(max - min, 1)) * (height - 6) - 3;
      return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} aria-hidden="true" style={{ width: "100px", height: "30px" }}>
      <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
