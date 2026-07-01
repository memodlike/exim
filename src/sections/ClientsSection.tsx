import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import { formatMoney } from "../utils";
import type { Client } from "../types";
import { Icon } from "../components/ui";

export function ClientsSection({
  state,
  onOpenClient
}: {
  state: SimulationState;
  onOpenClient: (client: Client) => void;
}) {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("Все");
  const [countryFilter, setCountryFilter] = useState("Все");
  const [riskFilter, setRiskFilter] = useState("Все");

  const industries = ["Все", ...Array.from(new Set(state.clients.map((c) => c.industry)))];
  const countries = ["Все", ...Array.from(new Set(state.clients.map((c) => c.country)))];

  const filteredClients = state.clients.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.rm.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "Все" || c.industry === industryFilter;
    const matchesCountry = countryFilter === "Все" || c.country === countryFilter;
    const matchesRisk = riskFilter === "Все" || c.riskLevel === riskFilter;

    return matchesSearch && matchesIndustry && matchesCountry && matchesRisk;
  });

  const handleReset = () => {
    setSearch("");
    setIndustryFilter("Все");
    setCountryFilter("Все");
    setRiskFilter("Все");
  };

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Клиенты EXIM направления</h1>
          <p>Портфельные группы экспортеров и импортеров. Мониторинг кредитных оценок и активности.</p>
        </div>
      </header>

      {/* Filter strip */}
      <section style={{ display: "flex", flexWrap: "wrap", gap: "12px", border: "1px solid var(--border)", padding: "16px", borderRadius: "var(--radius-lg)", background: "var(--surface)", alignItems: "center" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "180px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Поиск клиента или RM:</span>
          <input
            type="text"
            placeholder="Введите название или имя RM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "6px 12px", background: "var(--bg-soft)" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "150px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Отрасль:</span>
          <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "6px", background: "var(--bg-soft)" }}>
            {industries.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "150px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Страна контрагента:</span>
          <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "6px", background: "var(--bg-soft)" }}>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "4px", minWidth: "150px" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)" }}>Уровень риска:</span>
          <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} style={{ border: "1px solid var(--border-strong)", borderRadius: "var(--radius-md)", padding: "6px", background: "var(--bg-soft)" }}>
            <option value="Все">Все</option>
            <option value="Низкий">Низкий</option>
            <option value="Средний">Средний</option>
            <option value="Высокий">Высокий</option>
          </select>
        </label>

        <button className="btn-secondary btn-small" onClick={handleReset} style={{ alignSelf: "flex-end" }}>
          Сбросить фильтры
        </button>
      </section>

      {/* Clients list table */}
      <section className="card-cockpit">
        <div className="table-viewport">
          <table className="dense-table">
            <thead>
              <tr>
                <th>Наименование клиента</th>
                <th>Отрасль</th>
                <th>Страна партнер</th>
                <th>RM</th>
                <th>Объем портфеля</th>
                <th>Оценка скоринга</th>
                <th>Статус риска</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>
                    <button className="link-action" onClick={() => onOpenClient(client)}>
                      {client.name}
                    </button>
                    <span style={{ display: "block", fontSize: "0.7rem", color: "var(--text-muted)" }}>{client.segment}</span>
                  </td>
                  <td>{client.industry}</td>
                  <td>{client.country}</td>
                  <td>{client.rm}</td>
                  <td><strong>{formatMoney(client.portfolioVolume)}</strong></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <strong>{client.clientScore}</strong>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>/100</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${client.riskLevel === "Высокий" ? "status-red" : client.riskLevel === "Средний" ? "status-yellow" : "status-green"}`}>
                      {client.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--text-muted)", padding: "30px" }}>
                    Нет клиентов по заданным параметрам поиска
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
