import React, { useState } from "react";
import type { SimulationState } from "../data/simulation";
import type { AIRecommendation } from "../types";
import { Icon } from "../components/ui";

export function AIRecommendationsSection({
  state,
  onChangeStatus,
  onAddDecision
}: {
  state: SimulationState;
  onChangeStatus: (id: string, status: AIRecommendation["status"]) => void;
  onAddDecision: (decision: any) => void;
}) {
  const [filter, setFilter] = useState<AIRecommendation["status"] | "Все">("На рассмотрении");
  const filteredRecs = state.aiRecommendations.filter(
    (r) => filter === "Все" || r.status === filter
  );

  const handleAction = (id: string, action: AIRecommendation["status"], title: string, sugg: string) => {
    onChangeStatus(id, action);
    onAddDecision({
      decision: `Рекомендация ИИ ${action === "Принято" ? "утверждена" : "отклонена"}: ${title}`,
      owner: "EXIM бизнес",
      sourceSignal: "Модуль рекомендаций ИИ",
      result: action === "Принято" ? `Запущена реализация: ${sugg}` : "Отклонено решением экспертной комиссии банка.",
      status: action === "Принято" ? "Принято" : "Отклонено"
    });
  };

  return (
    <div className="workspace-main">
      <header className="section-header">
        <div>
          <h1>Рекомендации ИИ (Ассистент EXIM)</h1>
          <p>Интеллектуальные предложения по минимизации страновых рисков, валютной маржинальности и лимитам.</p>
        </div>
        <div className="period-select">
          <span>Статус:</span>
          <select value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="Все">Все</option>
            <option value="На рассмотрении">На рассмотрении</option>
            <option value="Принято">Принятые</option>
            <option value="Отклонено">Отклоненные</option>
            <option value="На доработке">На доработке</option>
          </select>
        </div>
      </header>

      {/* Grid of recommendations */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {filteredRecs.map((rec) => {
          const isPending = rec.status === "На рассмотрении";
          const scoreClass = rec.confidence >= 85 ? "status-green" : rec.confidence >= 75 ? "status-yellow" : "status-neutral";

          return (
            <article
              key={rec.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "20px",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`badge ${scoreClass}`}>Уверенность: {rec.confidence}%</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontWeight: "bold" }}>{rec.createdAt}</span>
              </div>

              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)" }}>{rec.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted-strong)", lineHeight: "1.4" }}>
                {rec.explanation}
              </p>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "10px", fontSize: "0.82rem" }}>
                <strong style={{ display: "block", color: "var(--primary-text)", marginBottom: "4px" }}>Рекомендуемое действие:</strong>
                <span>{rec.suggestedAction}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
                <span>Роль: <strong>{rec.responsibleRole}</strong></span>
                <span>Клиент: <strong>{rec.relatedClient || "Портфель"}</strong></span>
              </div>

              {isPending && (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button
                    className="btn-primary btn-small"
                    style={{ flex: 1 }}
                    onClick={() => handleAction(rec.id, "Принято", rec.title, rec.suggestedAction)}
                  >
                    Принять
                  </button>
                  <button
                    className="btn-secondary btn-small"
                    style={{ flex: 1 }}
                    onClick={() => handleAction(rec.id, "Отклонено", rec.title, rec.suggestedAction)}
                  >
                    Отклонить
                  </button>
                </div>
              )}
            </article>
          );
        })}
        {filteredRecs.length === 0 && (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px", gridColumn: "span 3" }}>Нет рекомендаций ИИ в этом статусе</p>
        )}
      </section>
    </div>
  );
}
