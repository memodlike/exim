import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import { Icon } from "../components/ui";

export function CountriesRoutesSection({ state }: { state: SimulationState }) {
  const [corridorFilter, setCorridorFilter] = useState("Все");
  const uniqueCorridors = ["Все", ...Array.from(new Set(state.routes.map((r) => r.corridor)))];

  const filteredRoutes = state.routes.filter(
    (r) => corridorFilter === "Все" || r.corridor === corridorFilter
  );

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>География и Маршруты EXIM</h1>
          <p>Мониторинг торговых коридоров, транспортных путей и прохождения пограничных постов.</p>
        </div>
        <div className="period-select">
          <span>Торговый коридор:</span>
          <select value={corridorFilter} onChange={(e) => setCorridorFilter(e.target.value)}>
            {uniqueCorridors.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Grid: Left Countries list, Right corridors list */}
      <div className="dashboard-matrix">
        {/* Countries Table */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Страновые риски и экспозиция</h3>
              <span className="cockpit-subtitle">Совокупный объем риска на страны торговых партнеров</span>
            </div>
          </div>
          <div className="table-viewport" style={{ maxHeight: "400px", overflowY: "auto" }}>
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Страна</th>
                  <th>Лимит риска (экспозиция)</th>
                  <th>Динамика (экспорт)</th>
                  <th>Здоровье путей</th>
                  <th>Оценка риска</th>
                </tr>
              </thead>
              <tbody>
                {state.countries.map((country) => (
                  <tr key={country.id}>
                    <td><strong>{country.name}</strong></td>
                    <td>{formatMoney(country.exposure)}</td>
                    <td style={{ color: country.growth > 0 ? "var(--primary)" : "var(--red)" }}>
                      {country.growth > 0 ? `+${country.growth}` : country.growth}%
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{country.routeHealth}%</span>
                        <div style={{ flex: 1, height: "6px", background: "var(--bg-soft)", borderRadius: "3px", width: "60px", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${country.routeHealth}%`, background: country.routeHealth < 75 ? "var(--red)" : country.routeHealth < 85 ? "var(--yellow)" : "var(--primary)" }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${country.riskLevel === "Высокий" ? "status-red" : country.riskLevel === "Средний" ? "status-yellow" : "status-green"}`}>
                        {country.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corridor Health metrics */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Операционные задержки на постах</h3>
              <span className="cockpit-subtitle">Состояние прохождения контрольных точек</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px", overflowY: "auto" }}>
            {[
              { point: "Достык (ЖД)", delay: "1.2 дня", health: "94%", status: "Стабильно" },
              { point: "Хоргос (Авто)", delay: "3.5 дня", health: "76%", status: "Задержка" },
              { point: "Актау (Порт)", delay: "4.8 дня", health: "68%", status: "Затор" },
              { point: "Сарыагаш (ЖД)", delay: "0.8 дня", health: "98%", status: "Стабильно" },
              { point: "Курык (Море)", delay: "2.1 дня", health: "88%", status: "Стабильно" }
            ].map((pt, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px", background: "var(--bg-soft)", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "0.86rem", color: "var(--text-primary)" }}>{pt.point}</strong>
                  <span className={`badge ${pt.status === "Стабильно" ? "status-green" : pt.status === "Задержка" ? "status-yellow" : "status-red"}`}>
                    {pt.status}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted-strong)" }}>
                  <span>Ср. задержка: <strong>{pt.delay}</strong></span>
                  <span>Пропускная: <strong>{pt.health}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Routes map list */}
        <div className="col-12 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Карта логистических коридоров и финансирования</h3>
              <span className="cockpit-subtitle">Список активных цепочек движения товаров и валютного обеспечения</span>
            </div>
          </div>
          <div className="table-viewport">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Маршрут</th>
                  <th>Тип коридора</th>
                  <th>Транспорт</th>
                  <th>Пропускные посты</th>
                  <th>Задержки (дн)</th>
                  <th>Объем лимита</th>
                  <th>Уровень риска</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.slice(0, 15).map((route) => (
                  <tr key={route.id}>
                    <td><strong>{route.name}</strong></td>
                    <td>{route.corridor}</td>
                    <td>{route.transportMode}</td>
                    <td>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {route.borderPoints.map((bp) => (
                          <span className="drawer-chip" key={bp} style={{ fontSize: "0.7rem", padding: "2px 6px" }}>{bp}</span>
                        ))}
                      </div>
                    </td>
                    <td>{route.averageDelayDays}</td>
                    <td><strong>{formatMoney(route.financingVolume)}</strong></td>
                    <td>
                      <span className={`badge ${route.riskLevel === "Высокий" ? "status-red" : route.riskLevel === "Средний" ? "status-yellow" : "status-green"}`}>
                        {route.riskLevel}
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
