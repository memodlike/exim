import React from "react";
import type { SimulationState } from "../data/simulation";
import { Icon } from "../components/ui";

export function DataQualitySection({ state }: { state: SimulationState }) {
  const avgQuality = Math.round(
    state.dataSources.reduce((sum, s) => sum + s.qualityScore, 0) / state.dataSources.length
  );

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Качество Данных и Интеграции</h1>
          <p>Мониторинг свежести информационных витрин, SLA задержек и полноты данных внешних и внутренних систем.</p>
        </div>
      </header>

      {/* KPI summaries */}
      <section className="kpi-strip" aria-label="Сводка качества данных">
        <article className="kpi-card">
          <div className="kpi-top"><span>Индекс качества</span><Icon name="data" /></div>
          <strong className="kpi-value">{avgQuality}%</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>В пределах целевого (95%)</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Интеграции</span><Icon name="overview" /></div>
          <strong className="kpi-value">{state.dataSources.length} систем</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--yellow)" }}>2 с задержкой SLA</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Общих ошибок</span><Icon name="roadmap" /></div>
          <strong className="kpi-value" style={{ color: "var(--red)" }}>
            {state.dataSources.reduce((sum, s) => sum + s.errors, 0)}
          </strong>
          <div className="kpi-bottom"><span style={{ color: "var(--text-muted)" }}>Зафиксировано за сутки</span></div>
        </article>
      </section>

      <div className="dashboard-matrix">
        {/* Quality issues list checklist */}
        <div className="col-4 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Метрики качества данных</h3>
              <span className="cockpit-subtitle">Оценка полноты и непротиворечивости</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {state.dataQualityIssues.map((issue) => {
              const color = issue.status === "Высокий" ? "var(--red)" : issue.status === "Средний" ? "var(--yellow)" : "var(--primary)";
              return (
                <div key={issue.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", fontWeight: "bold" }}>
                    <span>{issue.metric}</span>
                    <span style={{ color }}>{issue.value}% (цель {issue.target}%)</span>
                  </div>
                  <div style={{ height: "6px", background: "var(--bg-soft)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${issue.value}%`, background: color }} />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{issue.explanation}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Integration Status Table */}
        <div className="col-8 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Реестр подключений и каналов</h3>
              <span className="cockpit-subtitle">Техническое состояние интеграционных витрин</span>
            </div>
          </div>
          <div className="table-viewport" style={{ maxHeight: "360px", overflowY: "auto" }}>
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Источник данных</th>
                  <th>Тип</th>
                  <th>Период</th>
                  <th>Обновлено</th>
                  <th>Задержка</th>
                  <th>Ошибки</th>
                  <th>Резерв</th>
                </tr>
              </thead>
              <tbody>
                {state.dataSources.map((ds) => (
                  <tr key={ds.id}>
                    <td>
                      <strong>{ds.name}</strong>
                      <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-muted)" }}>Владелец: {ds.owner}</span>
                    </td>
                    <td>{ds.type}</td>
                    <td>{ds.updateFrequency}</td>
                    <td>{ds.lastUpdate.split(" ")[1] || ds.lastUpdate}</td>
                    <td>{ds.sla}</td>
                    <td style={{ color: ds.errors > 0 ? "var(--red)" : "inherit", fontWeight: "bold" }}>{ds.errors}</td>
                    <td><code style={{ fontSize: "0.74rem" }}>{ds.fallbackOption}</code></td>
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
