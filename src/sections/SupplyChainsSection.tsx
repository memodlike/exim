import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { Icon } from "../components/ui";

export function SupplyChainsSection({
  state,
  onOpenClient
}: {
  state: SimulationState;
  onOpenClient: (client: any) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<string>("raw");
  const currentNodeObj = state.supplyChainNodes.find((n) => n.id === selectedNode) || state.supplyChainNodes[0];

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Цепочки Поставок EXIM</h1>
          <p>Интерактивная карта этапов логистики и контрактного расчёта портфельных компаний банка.</p>
        </div>
      </header>

      {/* Interactive horizontal chain nodes */}
      <section className="card-cockpit">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", gap: "16px", padding: "10px 0", overflowX: "auto" }}>
          {state.supplyChainNodes.map((node, idx) => {
            const isSelected = node.id === selectedNode;
            const isCritical = node.riskLevel === "Высокий";
            
            return (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setSelectedNode(node.id)}
                  style={{
                    flex: 1,
                    minWidth: "150px",
                    border: "2px solid",
                    borderColor: isSelected ? "var(--primary)" : isCritical ? "var(--red-soft)" : "var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "16px",
                    background: isSelected ? "var(--primary-soft)" : "var(--surface-elevated)",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    textAlign: "left",
                    transition: "all 0.2s ease"
                  }}
                >
                  <span style={{ fontSize: "0.68rem", fontWeight: "bold", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    Этап {idx + 1}
                  </span>
                  <strong style={{ fontSize: "0.88rem", color: isSelected ? "var(--primary-text)" : "var(--text-primary)" }}>
                    {node.stage}
                  </strong>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                    <span className={`badge ${isCritical ? "status-red" : node.riskLevel === "Средний" ? "status-yellow" : "status-green"}`} style={{ fontSize: "0.65rem" }}>
                      {node.riskLevel}
                    </span>
                    {node.delayDays > 0 && (
                      <span style={{ fontSize: "0.75rem", color: "var(--red-text)", fontWeight: "bold" }}>
                        +{node.delayDays} дн. задержка
                      </span>
                    )}
                  </div>
                </button>
                {idx < state.supplyChainNodes.length - 1 && (
                  <div style={{ width: "24px", height: "2px", background: "var(--border)", flexShrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* Grid: stage details + client list */}
      <div className="dashboard-matrix">
        {/* Node detail properties */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Спецификация этапа: {currentNodeObj.stage}</h3>
              <span className="cockpit-subtitle">Аналитические показатели выбранного звена логистической цепочки</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: "12px", fontSize: "0.88rem" }}>
            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>Регионы поставок</span>
              <strong>{currentNodeObj.country}</strong>
            </div>

            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>Объем задействованного финансирования</span>
              <strong style={{ fontSize: "1.2rem", color: "var(--primary-text)" }}>{formatMoney(currentNodeObj.financingVolume)}</strong>
            </div>

            <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>Задержки транзита</span>
              <strong>{currentNodeObj.delayDays > 0 ? `${currentNodeObj.delayDays} дн. (выше SLA)` : "Норма"}</strong>
            </div>

            <div>
              <span style={{ display: "block", fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>Угроза срыва поставок</span>
              <span className={`badge ${currentNodeObj.riskLevel === "Высокий" ? "status-red" : currentNodeObj.riskLevel === "Средний" ? "status-yellow" : "status-green"}`}>
                {currentNodeObj.riskLevel === "Высокий" ? "Высокая угроза затора пошлинами" : currentNodeObj.riskLevel === "Средний" ? "Умеренные задержки таможни" : "Стабильное прохождение"}
              </span>
            </div>
          </div>
        </div>

        {/* Linked Clients */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Клиенты на этапе {currentNodeObj.stage}</h3>
              <span className="cockpit-subtitle">Портфельные компании банка, чьи транзакции проходят через данное звено</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {currentNodeObj.clients.map((cName, i) => {
              const clientObj = state.clients.find((c) => c.name === cName);
              return (
                <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px", background: "var(--surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    {clientObj ? (
                      <button className="link-action" style={{ fontSize: "0.95rem" }} onClick={() => onOpenClient(clientObj)}>
                        {clientObj.name}
                      </button>
                    ) : (
                      <strong>{cName}</strong>
                    )}
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {clientObj ? `${clientObj.segment} · Отрасль: ${clientObj.industry}` : "Портфельный импортер"}
                    </span>
                  </div>
                  {clientObj && (
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ display: "block", fontSize: "0.95rem" }}>{formatMoney(clientObj.portfolioVolume)}</strong>
                      <span className={`badge ${clientObj.riskLevel === "Высокий" ? "status-red" : clientObj.riskLevel === "Средний" ? "status-yellow" : "status-green"}`} style={{ fontSize: "0.65rem", marginTop: "2px" }}>
                        {clientObj.riskLevel}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
