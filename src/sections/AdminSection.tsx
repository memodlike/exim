import React from "react";
import type { SimulationState } from "../data/simulation";
import { Icon } from "../components/ui";

export function AdminSection({
  state,
  isPaused,
  speed,
  onTogglePause,
  onSetSpeed,
  onResetData,
  onGenerateRisk,
  onGenerateDecision
}: {
  state: SimulationState;
  isPaused: boolean;
  speed: number;
  onTogglePause: () => void;
  onSetSpeed: (speed: number) => void;
  onResetData: () => void;
  onGenerateRisk: () => void;
  onGenerateDecision: () => void;
}) {
  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Администрирование Ситуационного Центра</h1>
          <p>Управление ролевыми правами доступа, аудит входов в систему и настройка параметров симулятора в реальном времени.</p>
        </div>
      </header>

      <div className="dashboard-matrix">
        {/* Simulation Control Panel */}
        <div className="col-5 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Пульт управления симулятором</h3>
              <span className="cockpit-subtitle">Настройка частоты и генерации экстренных инцидентов</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className={`btn-primary ${isPaused ? "btn-secondary" : ""}`}
                style={{ flex: 1 }}
                onClick={onTogglePause}
              >
                <Icon name={isPaused ? "roadmap" : "roadmap"} /> {isPaused ? "Возобновить поток" : "Остановить поток"}
              </button>
              <button className="btn-secondary" onClick={onResetData} title="Сбросить все данные к начальным значениям">
                Сбросить демо-данные
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                Ускорить обновления (Множитель времени):
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 5, 10].map((s) => (
                  <button
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      border: "1px solid",
                      borderColor: speed === s ? "var(--primary)" : "var(--border)",
                      borderRadius: "var(--radius-md)",
                      background: speed === s ? "var(--primary-soft)" : "var(--surface)",
                      fontWeight: "bold",
                      fontSize: "0.82rem"
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: "bold", color: "var(--text-muted)", display: "block" }}>
                Генерация инцидентов:
              </span>
              <button className="btn-secondary btn-small" onClick={onGenerateRisk}>
                Сгенерировать критический риск
              </button>
              <button className="btn-secondary btn-small" onClick={onGenerateDecision}>
                Сгенерировать управленческое решение
              </button>
            </div>
          </div>
        </div>

        {/* Roles & Permissions Catalog */}
        <div className="col-7 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Матрица ролей и разрешений</h3>
              <span className="cockpit-subtitle">Реестр полномочий ситуационного центра</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "350px", overflowY: "auto" }}>
            {state.roles.map((role) => (
              <div key={role.id} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "12px", background: "var(--bg-soft)", display: "flex", flexDirection: "column", gap: "4px" }}>
                <strong style={{ fontSize: "0.88rem", color: "var(--primary-text)" }}>{role.name}</strong>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted-strong)" }}>{role.description}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {role.permissions.map((p) => (
                    <span className="drawer-chip" key={p} style={{ fontSize: "0.68rem", padding: "1px 6px" }}>{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Session Users Table */}
        <div className="col-12 card-cockpit">
          <div className="cockpit-heading">
            <div className="cockpit-title-wrap">
              <h3 className="cockpit-title">Контроль сессий пользователей</h3>
              <span className="cockpit-subtitle">Журнал активных сессий и последний вход в Situational Center</span>
            </div>
          </div>
          <div className="table-viewport">
            <table className="dense-table">
              <thead>
                <tr>
                  <th>Пользователь</th>
                  <th>Роль</th>
                  <th>Департамент</th>
                  <th>Последняя активность</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {state.users.slice(0, 10).map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.name}</strong></td>
                    <td>{user.role}</td>
                    <td>{user.department}</td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <span className={`badge ${user.status === "Активен" ? "status-green" : "status-yellow"}`}>
                        {user.status}
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
