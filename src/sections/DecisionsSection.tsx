import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import type { DecisionLog } from "../types";
import { Icon } from "../components/ui";

export function DecisionsSection({
  state,
  onAddDecision
}: {
  state: SimulationState;
  onAddDecision: (decision: Omit<DecisionLog, "id" | "date">) => void;
}) {
  const [search, setSearch] = useState("");
  const [newDecision, setNewDecision] = useState("");
  const [newOwner, setNewOwner] = useState("EXIM бизнес");
  const [newSignal, setNewSignal] = useState("");
  const [newResult, setNewResult] = useState("");

  const filteredDecisions = state.decisions.filter((d) => {
    return d.decision.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase()) ||
      d.sourceSignal.toLowerCase().includes(search.toLowerCase());
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecision.trim()) return;

    onAddDecision({
      decision: newDecision,
      owner: newOwner as any,
      sourceSignal: newSignal || "Ручной ввод руководителя",
      result: newResult || "Принято в исполнение профильными службами банка.",
      status: "Принято"
    });

    setNewDecision("");
    setNewSignal("");
    setNewResult("");
  };

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Журнал Решений и Аудит</h1>
          <p>Фиксация принятых управленческих решений, назначений ответственных и контроль исполнения SLA.</p>
        </div>
      </header>

      <div className="dashboard-matrix">
        {/* Register Decision Form */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Внести управленческое решение</h3>
              <span className="cockpit-subtitle">Ручная регистрация директивы или протокольного поручения</span>
            </div>
          </div>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Решение (Директива):</span>
              <input
                type="text"
                required
                placeholder="Например: Активировать транзитные гарантии для АО AgroTrade"
                value={newDecision}
                onChange={(e) => setNewDecision(e.target.value)}
                style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px", background: "var(--bg-soft)", fontSize: "0.85rem" }}
              />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Ответственный орган:</span>
                <select
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px", background: "var(--bg-soft)", fontSize: "0.85rem" }}
                >
                  <option value="Руководство банка">Руководство банка</option>
                  <option value="EXIM бизнес">EXIM бизнес</option>
                  <option value="Риск-менеджер">Риск-менеджер</option>
                  <option value="Комплаенс">Комплаенс</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Сигнал-триггер:</span>
                <input
                  type="text"
                  placeholder="Рост задержек на таможне"
                  value={newSignal}
                  onChange={(e) => setNewSignal(e.target.value)}
                  style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px", background: "var(--bg-soft)", fontSize: "0.85rem" }}
                />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Ожидаемый результат:</span>
              <textarea
                placeholder="Снижение срока валютной очистки до 12 часов..."
                value={newResult}
                onChange={(e) => setNewResult(e.target.value)}
                rows={2}
                style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "8px", background: "var(--bg-soft)", fontSize: "0.85rem", resize: "none" }}
              />
            </label>

            <button type="submit" className="btn-primary">
              <Icon name="check" /> Зафиксировать в реестре
            </button>
          </form>
        </div>

        {/* Decisions History List */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">История и протокол решений</h3>
              <span className="cockpit-subtitle">Аудируемый журнал распоряжений и согласований</span>
            </div>
            <input
              type="text"
              placeholder="Фильтр по тексту..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "6px 12px", background: "var(--bg-soft)", fontSize: "0.82rem", width: "160px" }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
            {filteredDecisions.map((dec) => (
              <article key={dec.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "14px", background: "var(--surface)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", color: "var(--text-muted)", marginBottom: "6px", fontWeight: "bold" }}>
                  <span>{dec.date}</span>
                  <span>{dec.owner}</span>
                </div>
                <h4 style={{ color: "var(--primary-text)", fontSize: "0.94rem", fontWeight: "800", marginBottom: "4px" }}>{dec.decision}</h4>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted-strong)", marginBottom: "4px" }}>
                  <strong>Триггер:</strong> {dec.sourceSignal}
                </p>
                <p style={{ fontSize: "0.84rem", color: "var(--text-muted-strong)" }}>
                  <strong>Результат:</strong> {dec.result}
                </p>
              </article>
            ))}
            {filteredDecisions.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>Нет зафиксированных решений</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
