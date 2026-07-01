import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { BarChart } from "../components/charts";
import { Icon } from "../components/ui";

export function PortfolioSection({ state }: { state: SimulationState }) {
  const [productFilter, setProductFilter] = useState("Все");
  const uniqueProducts = ["Все", ...Array.from(new Set(state.products.map((p) => p.name)))];

  const filteredProducts = state.products.filter(
    (p) => productFilter === "Все" || p.name === productFilter
  );

  const totalVol = filteredProducts.reduce((sum, p) => sum + p.volume, 0);
  const totalInc = filteredProducts.reduce((sum, p) => sum + p.income, 0);

  const barChartItems = filteredProducts.slice(0, 10).map((p) => ({
    label: p.name,
    value: p.volume,
    target: p.plan
  }));

  const recentOps = state.transactions.filter(
    (t) => productFilter === "Все" || t.product === productFilter
  );

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Портфель продуктов EXIM</h1>
          <p>Мониторинг утилизации лимитов финансирования, кредитования, гарантий и аккредитивов.</p>
        </div>
        <div className="period-select">
          <span>Продукт:</span>
          <select value={productFilter} onChange={(e) => setProductFilter(e.target.value)}>
            {uniqueProducts.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Mini Aggregates */}
      <section className="kpi-strip" aria-label="Сводка портфеля">
        <article className="kpi-card">
          <div className="kpi-top"><span>Объем утилизации</span><Icon name="products" /></div>
          <strong className="kpi-value">{formatMoney(totalVol)}</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>В рамках лимита</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Доходность продуктов</span><Icon name="overview" /></div>
          <strong className="kpi-value">{formatMoney(totalInc)}</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>Чистый маржинальный доход</span></div>
        </article>

        <article className="kpi-card">
          <div className="kpi-top"><span>Количество сделок</span><Icon name="roadmap" /></div>
          <strong className="kpi-value">{recentOps.length}</strong>
          <div className="kpi-bottom"><span style={{ color: "var(--primary)" }}>Активных транзакций</span></div>
        </article>
      </section>

      <div className="dashboard-matrix">
        {/* Product limits utilization */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Утилизация лимитов / факт против плана</h3>
              <span className="cockpit-subtitle">Сопоставление фактического объема против планового лимита по продуктам (млрд ₸)</span>
            </div>
          </div>
          <BarChart items={barChartItems} label="Факт против лимита" />
        </div>

        {/* Product Concentration */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Детализация продуктов</h3>
              <span className="cockpit-subtitle">Текущие уровни риска продуктов</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "310px", overflowY: "auto" }}>
            {filteredProducts.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                <div>
                  <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>{p.name}</strong>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Клиентов: {p.clients}</span>
                </div>
                <span className={`badge ${p.riskLevel === "Высокий" ? "status-red" : p.riskLevel === "Средний" ? "status-yellow" : "status-green"}`}>
                  {p.riskLevel}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="col-12 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Реестр недавних операций EXIM</h3>
              <span className="cockpit-subtitle">Операционные транзакции клиентов по выбранным фильтрам продуктов</span>
            </div>
          </div>
          <div className="table-viewport">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Клиент</th>
                  <th>Продукт</th>
                  <th>Страна</th>
                  <th>Сумма (млн ₸)</th>
                  <th>Маржа</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentOps.slice(0, 15).map((op) => (
                  <tr key={op.id}>
                    <td>{op.date}</td>
                    <td><strong>{op.client}</strong></td>
                    <td>{op.product}</td>
                    <td>{op.country}</td>
                    <td>{op.amount}</td>
                    <td>{(op.margin * 100).toFixed(2)}%</td>
                    <td>
                      <span className={`badge ${op.status === "Исполнена" ? "status-green" : op.status === "Приостановлена" ? "status-red" : "status-yellow"}`}>
                        {op.status}
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
