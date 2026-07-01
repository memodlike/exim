import React, { useState } from "react";
import type { Client, DecisionLog, RiskEvent, User } from "../types";
import { formatMoney } from "../utils";
import { LineChart } from "./charts";
import { Icon } from "./ui";

interface ClientDetailPanelProps {
  client: Client | null;
  decisions: DecisionLog[];
  onClose: () => void;
  onAddDecision: (decision: Omit<DecisionLog, "id" | "date">) => void;
}

export function ClientDetailPanel({
  client,
  decisions,
  onClose,
  onAddDecision
}: ClientDetailPanelProps) {
  if (!client) return null;

  const clientDecisions = decisions.filter(
    (d) => d.decision.includes(client.name) || d.sourceSignal.includes(client.name)
  );

  return (
    <>
      <div className="detail-drawer-scrim" onClick={onClose} />
      <aside className="detail-drawer" aria-label="Карточка клиента">
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <span className="drawer-kicker">Профиль клиента</span>
            <h2 className="drawer-title">{client.name}</h2>
            <p className="drawer-subtitle">
              {client.segment} · {client.industry} · {client.country}
            </p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Закрыть карточку клиента">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-grid-stats">
          <div className="drawer-stat-card">
            <span>Портфель</span>
            <strong>{formatMoney(client.portfolioVolume)}</strong>
          </div>
          <div className="drawer-stat-card">
            <span>Доход</span>
            <strong>{formatMoney(client.income)}</strong>
          </div>
          <div className="drawer-stat-card">
            <span>Скоринг</span>
            <strong>{client.clientScore}/100</strong>
          </div>
          <div className="drawer-stat-card">
            <span>Потенциал</span>
            <strong>{client.potentialScore}/100</strong>
          </div>
        </div>

        <div className="drawer-section">
          <h3>Текущие продукты</h3>
          <div className="drawer-chip-list">
            {client.products.map((product) => (
              <span className="drawer-chip" key={product}>{product}</span>
            ))}
          </div>
        </div>

        <div className="drawer-section">
          <h3>Оборот за 7 месяцев</h3>
          <LineChart
            labels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"]}
            series={client.turnover}
            label={`Динамика оборота клиента ${client.name}`}
            unit="млн ₸"
            height={160}
          />
        </div>

        <div className="drawer-section">
          <h3>Индикаторы риска</h3>
          <div className="drawer-chip-list">
            {client.riskIndicators.map((indicator) => (
              <span className="drawer-chip" key={indicator} style={{ borderColor: "var(--red-soft)", color: "var(--red-text)", background: "var(--red-soft)" }}>
                {indicator}
              </span>
            ))}
          </div>
        </div>

        <div className="drawer-section">
          <h3>Связанная цепочка</h3>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted-strong)" }}>{client.supplyChain}</p>
        </div>

        <div className="drawer-section drawer-action-card">
          <h3 style={{ borderLeftColor: "var(--primary-text)", color: "var(--primary-text)" }}>Рекомендованное действие</h3>
          <p>{client.recommendedAction}</p>
          <button
            className="btn-primary"
            onClick={() => {
              onAddDecision({
                decision: `Утверждены меры по клиенту ${client.name}`,
                owner: "RM",
                sourceSignal: `Рекомендация: ${client.recommendedAction}`,
                result: "RM инициировал проведение переговоров с клиентом.",
                status: "В работе"
              });
              onClose();
            }}
          >
            <Icon name="log" /> Принять решение
          </button>
        </div>

        <div className="drawer-section">
          <h3>История решений по клиенту</h3>
          {clientDecisions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {clientDecisions.slice(0, 3).map((decision) => (
                <article className="compact-log" key={decision.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px", background: "var(--bg-soft)", fontSize: "0.8rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-muted)", marginBottom: "4px" }}>
                    <span>{decision.date}</span>
                    <span>{decision.owner}</span>
                  </div>
                  <strong style={{ display: "block", color: "var(--primary-text)", marginBottom: "2px" }}>{decision.decision}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted-strong)" }}>{decision.result}</p>
                </article>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", textAlign: "center", padding: "10px" }}>История решений пуста</p>
          )}
        </div>
      </aside>
    </>
  );
}

interface RiskDetailPanelProps {
  risk: (RiskEvent & { slaHours?: number }) | null;
  users: User[];
  onClose: () => void;
  onAssignOwner: (riskId: string, owner: string) => void;
  onEscalate: (riskId: string) => void;
  onCloseRisk: (riskId: string) => void;
  onAddDecision: (decision: Omit<DecisionLog, "id" | "date">) => void;
}

export function RiskDetailPanel({
  risk,
  users,
  onClose,
  onAssignOwner,
  onEscalate,
  onCloseRisk,
  onAddDecision
}: RiskDetailPanelProps) {
  const [selectedOwner, setSelectedOwner] = useState("");

  if (!risk) return null;

  const handleAssign = (owner: string) => {
    onAssignOwner(risk.id, owner);
    onAddDecision({
      decision: `Назначен ответственный по риску: ${risk.title}`,
      owner: owner as any,
      sourceSignal: risk.factor,
      result: `Риск передан в работу роли ${owner}.`,
      status: "В работе"
    });
  };

  const handleEscalate = () => {
    onEscalate(risk.id);
    onAddDecision({
      decision: `Эскалация риска: ${risk.title}`,
      owner: "Руководство банка",
      sourceSignal: risk.factor,
      result: "Вопрос вынесен на кредитный комитет банка. SLA снижен до 6 часов.",
      status: "Эскалировано"
    });
    onClose();
  };

  const handleClose = () => {
    onCloseRisk(risk.id);
    onAddDecision({
      decision: `Закрытие инцидента риска: ${risk.title}`,
      owner: risk.owner,
      sourceSignal: risk.factor,
      result: "Приняты все компенсирующие меры, инцидент закрыт.",
      status: "Закрыто"
    });
    onClose();
  };

  const severityClass = (level: string) => {
    if (level === "Высокая") return "status-red";
    if (level === "Средняя") return "status-yellow";
    return "status-green";
  };

  return (
    <>
      <div className="detail-drawer-scrim" onClick={onClose} />
      <aside className="detail-drawer" aria-label="Карточка риска">
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <span className="drawer-kicker">Событие риска</span>
            <h2 className="drawer-title">{risk.title}</h2>
            <p className="drawer-subtitle">{risk.category}</p>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Закрыть карточку риска">
            <Icon name="close" />
          </button>
        </div>

        <div className="drawer-grid-stats">
          <div className="drawer-stat-card">
            <span>Вероятность</span>
            <strong>{risk.probability}/5</strong>
          </div>
          <div className="drawer-stat-card">
            <span>Влияние</span>
            <strong>{risk.impact}/3</strong>
          </div>
          <div className="drawer-stat-card">
            <span>Критичность</span>
            <span className={`badge ${severityClass(risk.severity)}`} style={{ alignSelf: "flex-start", marginTop: "4px" }}>
              {risk.severity}
            </span>
          </div>
          <div className="drawer-stat-card">
            <span>Срок SLA</span>
            <strong style={{ color: risk.slaHours && risk.slaHours <= 4 ? "var(--red)" : "inherit" }}>
              {risk.status === "Закрыто" ? "Закрыт" : risk.slaHours ? `${risk.slaHours.toFixed(1)} ч.` : "Снят"}
            </strong>
          </div>
        </div>

        <div className="drawer-section">
          <h3>Описание Фактора</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{risk.factor}</p>
        </div>

        <div className="drawer-section">
          <h3>Аналитика события</h3>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted-strong)", display: "grid", gap: "6px" }}>
            <div><strong>Обнаружено:</strong> {risk.detectedAt}</div>
            <div><strong>Источник сигнала:</strong> {risk.source}</div>
            {risk.affectedClient && (
              <div><strong>Затронутый клиент:</strong> {risk.affectedClient}</div>
            )}
            <div><strong>Текущий ответственный:</strong> {risk.owner}</div>
            <div><strong>Статус:</strong> <span className={`badge ${severityClass(risk.status === "Закрыто" ? "Низкая" : risk.status === "В работе" ? "Средняя" : "Высокая")}`}>{risk.status}</span></div>
          </div>
        </div>

        <div className="drawer-section drawer-action-card">
          <h3 style={{ borderLeftColor: "var(--primary-text)", color: "var(--primary-text)" }}>Рекомендация Системы</h3>
          <p>{risk.recommendation}</p>
          <div className="button-row">
            {risk.status !== "Закрыто" && (
              <>
                <button className="btn-primary" onClick={handleClose}>
                  <Icon name="check" /> Выполнить и закрыть
                </button>
                <button className="btn-secondary" onClick={handleEscalate}>
                  <Icon name="arrow" /> Эскалировать
                </button>
              </>
            )}
          </div>
        </div>

        {risk.status !== "Закрыто" && (
          <div className="drawer-section" style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px", background: "var(--bg-soft)" }}>
            <h3>Назначить ответственного</h3>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <select
                value={selectedOwner}
                onChange={(e) => setSelectedOwner(e.target.value)}
                style={{ flex: 1, border: "1px solid var(--border-strong)", background: "#ffffff", padding: "8px", borderRadius: "var(--radius-md)" }}
              >
                <option value="">Выберите роль...</option>
                <option value="RM">RM</option>
                <option value="Риск-менеджер">Риск-менеджер</option>
                <option value="Комплаенс">Комплаенс-офицер</option>
                <option value="IT support">IT support</option>
                <option value="Data owner">Data owner</option>
              </select>
              <button
                className="btn-primary btn-small"
                disabled={!selectedOwner}
                onClick={() => {
                  handleAssign(selectedOwner);
                  setSelectedOwner("");
                }}
              >
                Назначить
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

