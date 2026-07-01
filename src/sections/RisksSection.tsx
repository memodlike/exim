import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { RiskMatrix } from "../components/charts";
import type { RiskEvent } from "../types";
import { Icon } from "../components/ui";

export function RisksSection({
  state,
  onOpenRisk,
  onAddDecision
}: {
  state: SimulationState;
  onOpenRisk: (risk: RiskEvent) => void;
  onAddDecision: (decision: any) => void;
}) {
  const [riskFilter, setRiskFilter] = useState("Все");
  const openRisks = state.riskEvents.filter((r) => r.status !== "Закрыто");

  const filteredRisks = state.riskEvents.filter(
    (r) => riskFilter === "Все" || r.status === riskFilter
  );

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Матрица и Управление Рисками</h1>
          <p>Оперативная карта рисков EXIM-портфеля. Сопоставление вероятности, влияния и контроль SLA.</p>
        </div>
        <div className="period-select">
          <span>Статус риска:</span>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}>
            <option value="Все">Все</option>
            <option value="Новый">Новые</option>
            <option value="В работе">В работе</option>
            <option value="Эскалировано">Эскалированы</option>
            <option value="Закрыто">Закрытые</option>
          </select>
        </div>
      </header>

      {/* Grid: Left Matrix, Right SLA alerts */}
      <div className="dashboard-matrix">
        {/* Risk Matrix widget */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Карта рисков (Вероятность / Влияние)</h3>
              <span className="cockpit-subtitle">Кликните по ячейке для фокуса и принятия решения по инцидентам</span>
            </div>
          </div>
          <RiskMatrix events={openRisks as any} onSelect={onOpenRisk} />
        </div>

        {/* Active SLA Alarm Queue */}
        <div className="col-5 card-cockpit" style={{ maxHeight: "350px", overflow: "hidden" }}>
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Контроль SLA по инцидентам</h3>
              <span className="cockpit-subtitle">Оставшееся время реакции по регламенту банка</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            {openRisks.map((risk) => (
              <div
                key={risk.id}
                onClick={() => onOpenRisk(risk)}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "10px",
                  background: "var(--surface)",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <strong style={{ fontSize: "0.85rem", display: "block" }}>{risk.title}</strong>
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>Ответственный: {risk.owner}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: "bold",
                      color: risk.slaHours && risk.slaHours <= 6 ? "var(--red)" : "inherit"
                    }}
                  >
                    {risk.slaHours ? `${risk.slaHours.toFixed(1)} ч.` : "Снят"}
                  </span>
                  <span className={`badge ${risk.severity === "Высокая" ? "status-red" : "status-yellow"}`} style={{ display: "block", fontSize: "0.6rem", marginTop: "2px" }}>
                    {risk.severity}
                  </span>
                </div>
              </div>
            ))}
            {openRisks.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", padding: "20px" }}>Нет активных инцидентов</p>
            )}
          </div>
        </div>

        {/* Incidents Table list */}
        <div className="col-12 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Реестр рисков и компенсирующих мер</h3>
              <span className="cockpit-subtitle">Полный перечень событий рисков, закрепленных владельцев и SLA</span>
            </div>
          </div>
          <div className="table-viewport">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Идентификатор</th>
                  <th>Событие риска</th>
                  <th>Категория</th>
                  <th>Владелец</th>
                  <th>Обнаружено</th>
                  <th>SLA таймер</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredRisks.map((risk) => (
                  <tr key={risk.id}>
                    <td><code>{risk.id}</code></td>
                    <td>
                      <button className="link-action" onClick={() => onOpenRisk(risk)}>
                        {risk.title}
                      </button>
                      <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Клиент: {risk.affectedClient || "Все портфельные"}</span>
                    </td>
                    <td>{risk.category}</td>
                    <td>{risk.owner}</td>
                    <td>{risk.detectedAt}</td>
                    <td>
                      <strong style={{ color: risk.slaHours && risk.slaHours <= 6 ? "var(--red)" : "inherit" }}>
                        {risk.status === "Закрыто" ? "Выполнен" : risk.slaHours ? `${risk.slaHours.toFixed(1)} ч.` : "Снят"}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge ${risk.status === "Закрыто" ? "status-green" : risk.status === "Эскалировано" ? "status-red" : "status-yellow"}`}>
                        {risk.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
