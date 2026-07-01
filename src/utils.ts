import type { RiskLevel, Severity, Status } from "./types";

export function formatMoney(value: number, unit = "млрд ₸") {
  return `${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(value)} ${unit}`;
}

export function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 1
  }).format(value)}%`;
}

export function riskClass(level: RiskLevel | Severity | Status | string) {
  const normalized = level.toLowerCase();

  if (
    normalized.includes("низ") ||
    normalized.includes("закрыто") ||
    normalized.includes("принято") ||
    normalized.includes("стабильно") ||
    normalized.includes("работает")
  ) {
    return "status-green";
  }

  if (
    normalized.includes("сред") ||
    normalized.includes("в работе") ||
    normalized.includes("провер") ||
    normalized.includes("задерж")
  ) {
    return "status-yellow";
  }

  if (
    normalized.includes("выс") ||
    normalized.includes("крит") ||
    normalized.includes("ошибка") ||
    normalized.includes("эскал")
  ) {
    return "status-red";
  }

  return "status-neutral";
}

export function trendClass(trend: "up" | "down" | "stable") {
  if (trend === "up") return "trend-up";
  if (trend === "down") return "trend-down";
  return "trend-stable";
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

export function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}
