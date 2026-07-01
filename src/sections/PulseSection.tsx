import React from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { Icon } from "../components/ui";
import { LineChart, DonutChart } from "../components/charts";
import type { RiskEvent, Alert, Client } from "../types";

export function PulseSection({
  state,
  onOpenClient,
  onOpenRisk,
  onResolveAlert,
  onAddDecision
}: {
  state: SimulationState;
  onOpenClient: (client: Client) => void;
  onOpenRisk: (risk: RiskEvent) => void;
  onResolveAlert: (id: string) => void;
  onAddDecision: (decision: any) => void;
}) {
  const activeAlerts = state.alerts.filter((a) => a.status === "Новый");
  const openRisks = state.riskEvents.filter((r) => r.status !== "Закрыто");
  const criticalRisks = openRisks.filter((r) => r.severity === "Высокая");
  
  // Calculate aggregate portfolio size
  const totalPortfolio = state.clients.reduce((sum, c) => sum + c.portfolioVolume, 0);
  const activeClientsCount = state.clients.length;
  
  // Average SLA time for unresolved risks
  const unresolvedSlaList = openRisks.filter(r => r.slaHours !== undefined).map(r => r.slaHours!);
  const avgSla = unresolvedSlaList.length > 0 
    ? (unresolvedSlaList.reduce((a, b) => a + b, 0) / unresolvedSlaList.length).toFixed(1)
    : "0";

  // Data Quality average score
  const avgDqScore = Math.round(state.dataSources.reduce((sum, s) => sum + s.qualityScore, 0) / state.dataSources.length);

  // Filter top critical risk
  const topCriticalRisk = openRisks[0];

  return (
    <div className="workspace-main">
      {/* Executive Warning Banner */}
      <section className="exec-summary-block critical" aria-label="Сводное предупреждение">
        <svg className="exec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <div className="exec-content">
          <h2 className="exec-title">Сводка Ситуационного Центра</h2>
          <p className="exec-desc">
            За последние 15 минут зафиксировано увеличение странового риска по коридору <strong>Китай - Казахстан</strong>. Под угрозой задержек находится <strong>14 операций</strong> объемом <strong>18,4 млрд ₸</strong>. Рекомендуется активировать альтернативный маршрут через таможенный пост Достык.
          </p>
        </div>
      </section>

      {/* KPI Strip */}
      <section className="kpi-strip" aria-label="Ключевые показатели">
        <article className="kpi-card">
          <div className="kpi-top"><span>EXIM-Портфель</span><Icon name="overview" size={14} /></div>
          <strong className="kpi-value">{formatMoney(totalPortfolio)}</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>↑ +4.2%</span><span className="kpi-desc">за месяц</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Клиентские группы</span><Icon name="clients" size={14} /></div>
          <strong className="kpi-value">{activeClientsCount}</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>↑ +2</span><span className="kpi-desc">активных контракта</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Открытые риски</span><Icon name="risk" size={14} /></div>
          <strong className="kpi-value" style={{ color: openRisks.length > 10 ? "var(--red)" : "inherit" }}>
            {openRisks.length}
          </strong>
          <div className="kpi-bottom"><span style={{ color: "var(--red)" }}>{criticalRisks.length} критических</span><span className="kpi-desc">SLA на контроле</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Оповещения</span><Icon name="roadmap" size={14} /></div>
          <strong className="kpi-value" style={{ color: activeAlerts.length > 5 ? "var(--yellow)" : "inherit" }}>
            {activeAlerts.length}
          </strong>
          <div className="kpi-bottom"><span style={{ color: "var(--yellow)" }}>Требуют проверки</span><span className="kpi-desc">в системе CRM/DWH</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Ср. SLA реакции</span><Icon name="roadmap" size={14} /></div>
          <strong className="kpi-value">{avgSla} ч.</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>↓ -1.2 ч</span><span className="kpi-desc">улучшение времени</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Качество данных</span><Icon name="data" size={14} /></div>
          <strong className="kpi-value">{avgDqScore}%</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>Стабильно</span><span className="kpi-desc">интеграции в норме</span></div>
        </article>
      </section>

      {/* Main Grid: Left Column Charts, Right Column Alerts */}
      <div className="dashboard-matrix">
        <div className="col-8 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Динамика портфеля и прогноз доходности</h3>
              <span className="cockpit-subtitle">Анализ тренда на базе исторических данных и прогнозов ИИ (млрд ₸)</span>
            </div>
          </div>
          
          <LineChart
            labels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"]}
            series={state.monthlyPortfolio.map(p => p.portfolio)}
            forecast={[1530, 1580, 1610, 1660]}
            label="Экспоненциальное сглаживание портфеля"
            unit="млрд ₸"
          />
        </div>

        {/* Live Alerts Stream */}
        <div className="col-4 card-cockpit" style={{ maxHeight: "330px", overflow: "hidden" }}>
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Очередь оповещений</h3>
              <span className="cockpit-subtitle">Требующие срочного просмотра</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
            {activeAlerts.slice(0, 10).map((alert) => (
              <article key={alert.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "10px", background: "var(--surface-elevated)", fontSize: "0.82rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px", fontWeight: "bold" }}>
                  <span style={{ color: alert.severity === "Высокая" ? "var(--red)" : "var(--yellow)" }}>{alert.severity}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.72rem" }}>{alert.detectedAt}</span>
                </div>
                <strong style={{ display: "block", color: "var(--text-primary)", marginBottom: "4px" }}>{alert.title}</strong>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.74rem" }}>{alert.source}</span>
                  <button className="link-action" style={{ fontSize: "0.75rem" }} onClick={() => onResolveAlert(alert.id)}>
                    Пометить просмотренным
                  </button>
                </div>
              </article>
            ))}
            {activeAlerts.length === 0 && (
              <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", padding: "20px" }}>Нет новых оповещений</p>
            )}
          </div>
        </div>

        {/* Risk Incident Cockpit */}
        <div className="col-6 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Оперативный штаб: фокус риска</h3>
              <span className="cockpit-subtitle">Текущий критический риск, требующий управленческого вмешательства</span>
            </div>
          </div>

          {topCriticalRisk ? (
            <article style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "16px", background: "var(--bg-soft)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="badge status-red">{topCriticalRisk.severity} критичность</span>
                <span style={{ fontWeight: "800", color: topCriticalRisk.slaHours && topCriticalRisk.slaHours <= 6 ? "var(--red)" : "inherit" }}>
                  SLA: {topCriticalRisk.slaHours ? `${topCriticalRisk.slaHours.toFixed(1)} ч.` : "Снят"}
                </span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{topCriticalRisk.title}</h4>
              <p style={{ fontSize: "0.86rem", color: "var(--text-muted-strong)" }}>
                <strong>Фактор:</strong> {topCriticalRisk.factor}
              </p>
              {topCriticalRisk.affectedClient && (
                <div style={{ fontSize: "0.84rem" }}>
                  <strong>Затронутый клиент:</strong>{" "}
                  <button className="link-action" onClick={() => {
                    const clientObj = state.clients.find(c => c.name === topCriticalRisk.affectedClient);
                    if (clientObj) onOpenClient(clientObj);
                  }}>
                    {topCriticalRisk.affectedClient}
                  </button>
                </div>
              )}
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "space-between", gap: "10px" }}>
                <button className="btn-primary btn-small" onClick={() => onOpenRisk(topCriticalRisk)}>
                  Открыть и Записать Решение
                </button>
              </div>
            </article>
          ) : (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem", padding: "40px" }}>Все критические риски устранены</p>
          )}
        </div>

        {/* Concentration Metrics */}
        <div className="col-6 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Структура сделок по отраслям</h3>
              <span className="cockpit-subtitle">Концентрация портфеля EXIM банка в разрезе секторов экономики (%)</span>
            </div>
          </div>
          <DonutChart
            label="Концентрация по отраслям"
            items={[
              { label: "Металлургия", value: 32, color: "var(--primary)" },
              { label: "АПК", value: 24, color: "var(--blue)" },
              { label: "Логистика", value: 18, color: "var(--yellow)" },
              { label: "Производство", value: 15, color: "var(--red)" },
              { label: "Другие", value: 11, color: "var(--text-muted)" }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
