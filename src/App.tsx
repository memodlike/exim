import { useEffect, useMemo, useState } from "react";
import { alerts as seedAlerts, decisions as seedDecisions } from "./data/mockData";
import type { AIRecommendation, Alert, Client, DecisionLog, RiskEvent } from "./types";
import { ClientDetailPanel, RiskDetailPanel } from "./components/Panels";
import { Icon } from "./components/ui";
import {
  AdminSection,
  AISection,
  ClientsSection,
  DataSourcesSection,
  DecisionJournal,
  ForecastsSection,
  OverviewSection,
  ProductsSection,
  RisksSection,
  RoadmapSection,
  seedRecommendations,
  SupplyChainSection
} from "./sections/Sections";

type SectionId =
  | "overview"
  | "products"
  | "clients"
  | "chains"
  | "risks"
  | "forecasts"
  | "ai"
  | "data"
  | "roadmap"
  | "admin";

const navigation: { id: SectionId; label: string; icon: Parameters<typeof Icon>[0]["name"] }[] = [
  { id: "overview", label: "Обзор EXIM", icon: "overview" },
  { id: "products", label: "Продукты", icon: "products" },
  { id: "clients", label: "Клиенты", icon: "clients" },
  { id: "chains", label: "Цепочки поставок", icon: "chain" },
  { id: "risks", label: "Риски и события", icon: "risk" },
  { id: "forecasts", label: "Прогнозы и сценарии", icon: "forecast" },
  { id: "ai", label: "Рекомендации ИИ", icon: "ai" },
  { id: "data", label: "Источники данных", icon: "data" },
  { id: "roadmap", label: "Дорожная карта", icon: "roadmap" },
  { id: "admin", label: "Администрирование", icon: "admin" }
];

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskEvent | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(seedRecommendations);
  const [alerts, setAlerts] = useState<Alert[]>(seedAlerts);
  const [decisions, setDecisions] = useState<DecisionLog[]>(seedDecisions);
  const [toast, setToast] = useState("Данные обновлены: 01.07.2026 10:30");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeSection]);

  const sharedProps = useMemo(
    () => ({
      recommendations,
      alerts,
      decisions,
      onOpenClient: (client: Client) => {
        setSelectedClient(client);
        setSelectedRisk(null);
      },
      onOpenRisk: (risk: RiskEvent) => {
        setSelectedRisk(risk);
        setSelectedClient(null);
      },
      onRecommendationStatus: (id: string, status: AIRecommendation["status"]) => {
        setRecommendations((current) =>
          current.map((recommendation) => (recommendation.id === id ? { ...recommendation, status } : recommendation))
        );
        setToast(`Статус рекомендации изменён: ${status}`);
      },
      onAlertReviewed: (id: string) => {
        setAlerts((current) =>
          current.map((alert) => (alert.id === id ? { ...alert, status: "Просмотрено" } : alert))
        );
        setToast("Алерт отмечен как просмотренный");
      },
      onAddDecision: (decision: Omit<DecisionLog, "id" | "date">) => {
        setDecisions((current) => [
          {
            ...decision,
            id: `d-${Date.now()}`,
            date: "01.07.2026"
          },
          ...current
        ]);
        setToast("Запись добавлена в журнал решений");
      }
    }),
    [alerts, decisions, recommendations]
  );

  const renderSection = () => {
    switch (activeSection) {
      case "products":
        return <ProductsSection />;
      case "clients":
        return <ClientsSection {...sharedProps} />;
      case "chains":
        return <SupplyChainSection {...sharedProps} />;
      case "risks":
        return <RisksSection {...sharedProps} />;
      case "forecasts":
        return <ForecastsSection />;
      case "ai":
        return <AISection {...sharedProps} />;
      case "data":
        return <DataSourcesSection />;
      case "roadmap":
        return <RoadmapSection />;
      case "admin":
        return <AdminSection {...sharedProps} />;
      case "overview":
      default:
        return <OverviewSection {...sharedProps} />;
    }
  };

  const activeLabel = navigation.find((item) => item.id === activeSection)?.label ?? "Обзор EXIM";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNavOpen ? "open" : ""}`} aria-label="Основная навигация">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <div>
            <strong>bcc.kz</strong>
            <small>Ситуационный центр EXIM</small>
          </div>
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.id}
              className={item.id === activeSection ? "active" : ""}
              onClick={() => {
                setActiveSection(item.id);
                setMobileNavOpen(false);
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Режим прототипа</strong>
          <span>Данные демонстрационные. Реальные решения требуют проверки ответственными ролями.</span>
        </div>
      </aside>

      {mobileNavOpen ? <button className="nav-scrim" aria-label="Закрыть меню" onClick={() => setMobileNavOpen(false)} /> : null}

      <div className="main-shell">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)} aria-label="Открыть меню">
            <Icon name="menu" />
          </button>
          <div>
            <span>Информационно-аналитическая система ситуационного центра банка</span>
            <strong>{activeLabel}</strong>
          </div>
          <div className="topbar-actions">
            <label className="period-select">
              <span>Период</span>
              <select defaultValue="Июль 2026">
                <option>Июль 2026</option>
                <option>Июнь 2026</option>
                <option>2 квартал 2026</option>
              </select>
            </label>
            <label className="period-select">
              <span>Роль</span>
              <select defaultValue="Руководство банка">
                <option>Руководство банка</option>
                <option>EXIM бизнес</option>
                <option>RM</option>
                <option>Риск-менеджмент</option>
                <option>Data owner</option>
              </select>
            </label>
            <button className="secondary-button">
              <Icon name="filter" /> Фильтры
            </button>
          </div>
        </header>

        <main>
          <div className="workspace">
            <div className="workspace-main">{renderSection()}</div>
            <DecisionJournal decisions={decisions} />
          </div>
        </main>
      </div>

      <ClientDetailPanel client={selectedClient} decisions={decisions} onClose={() => setSelectedClient(null)} />
      <RiskDetailPanel
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onDecision={(risk) =>
          sharedProps.onAddDecision({
            decision: `Реакция на риск: ${risk.title}`,
            owner: risk.owner,
            sourceSignal: risk.factor,
            result: risk.recommendation,
            status: "В работе"
          })
        }
      />

      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}

export default App;
