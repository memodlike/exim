import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { LineChart } from "../components/charts";
import { Icon } from "../components/ui";

export function ForecastsSection({ state }: { state: SimulationState }) {
  const [selectedScenario, setSelectedScenario] = useState<string>(state.scenarios[0]?.id || "");
  const currentScenario = state.scenarios.find((s) => s.id === selectedScenario) || state.scenarios[0];

  // Simulated forecast curves based on stress level
  const baseCurve = [1394, 1420, 1450, 1480];
  const positiveCurve = [1394, 1460, 1520, 1590];
  const negativeCurve = [1394, 1370, 1340, 1310];

  const getForecastCurve = () => {
    if (!currentScenario) return baseCurve;
    if (currentScenario.riskLevel === "Критический" || currentScenario.riskLevel === "Высокий") {
      return negativeCurve;
    }
    if (currentScenario.riskLevel === "Низкий") {
      return positiveCurve;
    }
    return baseCurve;
  };

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Прогнозы и Сценарии (What-If)</h1>
          <p>Сравнительный анализ стресс-сценариев и прогнозные модели влияния на портфель EXIM.</p>
        </div>
      </header>

      {/* Grid: Left Scenarios list, Right Graph */}
      <div className="dashboard-matrix">
        {/* Scenarios List */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Перечень стресс-сценариев</h3>
              <span className="cockpit-subtitle">Выберите сценарий для симуляции на графике прогноза</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "390px", overflowY: "auto" }}>
            {state.scenarios.map((scen) => {
              const isSelected = scen.id === selectedScenario;
              return (
                <button
                  key={scen.id}
                  onClick={() => setSelectedScenario(scen.id)}
                  style={{
                    border: "1px solid",
                    borderColor: isSelected ? "var(--primary)" : "var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    background: isSelected ? "var(--primary-soft)" : "var(--surface)",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    transition: "all 0.2s ease"
                  }}
                >
                  <strong style={{ fontSize: "0.86rem", color: isSelected ? "var(--primary-text)" : "var(--text-primary)" }}>
                    {scen.title}
                  </strong>
                  <span className={`badge ${scen.riskLevel === "Критический" || scen.riskLevel === "Высокий" ? "status-red" : "status-yellow"}`} style={{ alignSelf: "flex-start", fontSize: "0.6rem" }}>
                    {scen.riskLevel} Риск
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Forecast chart projection */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Прогнозные траектории портфеля</h3>
              <span className="cockpit-subtitle">Сравнение базового тренда и симуляции выбранного стресс-сценария (млрд ₸)</span>
            </div>
          </div>

          <LineChart
            labels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"]}
            series={state.monthlyPortfolio.map(p => p.portfolio)}
            forecast={getForecastCurve()}
            label="Сравнительный график прогноза"
            unit="млрд ₸"
          />

          {currentScenario && (
            <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px", background: "var(--bg-soft)", marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <strong style={{ fontSize: "0.95rem" }}>Оценка влияния сценария:</strong>
              <p style={{ fontSize: "0.86rem", color: "var(--text-muted-strong)" }}>{currentScenario.expectedImpact}</p>
              <div style={{ fontSize: "0.82rem", display: "grid", gap: "4px" }}>
                <div><strong>Затронутые продукты:</strong> {currentScenario.affectedProducts.join(", ")}</div>
                <div><strong>Рекомендованная реакция банка:</strong> <span style={{ color: "var(--primary-text)", fontWeight: "bold" }}>{currentScenario.recommendedDecision}</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
