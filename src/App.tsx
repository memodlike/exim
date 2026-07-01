import React, { useState, useEffect } from "react";
import { SimulationProvider, useSimulation } from "./data/simulation";
import { Icon } from "./components/ui";
import { CommandBar } from "./components/CommandBar";
import { ClientDetailPanel, RiskDetailPanel } from "./components/Panels";
import type { Client, RiskEvent } from "./types";

// Import modular sections
import { PulseSection } from "./sections/PulseSection";
import { PortfolioSection } from "./sections/PortfolioSection";
import { ClientsSection } from "./sections/ClientsSection";
import { CountriesRoutesSection } from "./sections/CountriesRoutesSection";
import { SupplyChainsSection } from "./sections/SupplyChainsSection";
import { RisksSection } from "./sections/RisksSection";
import { ForecastsSection } from "./sections/ForecastsSection";
import { AIRecommendationsSection } from "./sections/AIRecommendationsSection";
import { DecisionsSection } from "./sections/DecisionsSection";
import { DataQualitySection } from "./sections/DataQualitySection";
import { AdminSection } from "./sections/AdminSection";

interface Toast {
  id: string;
  message: string;
}

type TabId =
  | "pulse"
  | "portfolio"
  | "clients"
  | "routes"
  | "chain"
  | "risks"
  | "forecast"
  | "ai"
  | "decisions"
  | "data"
  | "admin";

function AppContent() {
  const {
    state,
    isPaused,
    speed,
    lastUpdate,
    togglePause,
    setSpeed,
    resetDemoData,
    generateCriticalRisk,
    generateManualDecision,
    addDecision,
    changeRecommendationStatus,
    markAlertReviewed,
    assignRiskOwner,
    escalateRisk,
    closeRisk,
    addAlert
  } = useSimulation();

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabId>(() => {
    return (localStorage.getItem("exim-active-tab") as TabId) || "pulse";
  });

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    return localStorage.getItem("exim-sidebar-expanded") !== "false";
  });

  // UI Theme
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("exim-theme") as "light" | "dark") || "light";
  });

  // Search & detail drawers
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedRisk, setSelectedRisk] = useState<RiskEvent | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Apply tab persistence
  useEffect(() => {
    localStorage.setItem("exim-active-tab", activeTab);
  }, [activeTab]);

  // Apply sidebar state persistence
  useEffect(() => {
    localStorage.setItem("exim-sidebar-expanded", String(sidebarExpanded));
  }, [sidebarExpanded]);

  // Apply theme class to root element
  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("exim-theme", theme);
  }, [theme]);

  // Cmd+K Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
    triggerToast("Цветовая схема интерфейса успешно изменена.");
  };

  const triggerToast = (message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Wrap actions to trigger toasts
  const handleAddDecision = (decision: any) => {
    addDecision(decision);
    triggerToast("Управленческое решение зафиксировано в реестре.");
  };

  const handleResolveAlert = (id: string) => {
    markAlertReviewed(id);
    triggerToast("Оповещение помечено как просмотренное.");
  };

  const handleRecommendationStatus = (id: string, status: any) => {
    changeRecommendationStatus(id, status);
    triggerToast(`Рекомендация ИИ переведена в статус: ${status}`);
  };

  const renderSection = () => {
    switch (activeTab) {
      case "pulse":
        return (
          <PulseSection
            state={state}
            onOpenClient={setSelectedClient}
            onOpenRisk={setSelectedRisk}
            onResolveAlert={handleResolveAlert}
            onAddDecision={handleAddDecision}
          />
        );
      case "portfolio":
        return <PortfolioSection state={state} />;
      case "clients":
        return <ClientsSection state={state} onOpenClient={setSelectedClient} />;
      case "routes":
        return <CountriesRoutesSection state={state} />;
      case "chain":
        return <SupplyChainsSection state={state} onOpenClient={setSelectedClient} />;
      case "risks":
        return (
          <RisksSection
            state={state}
            onOpenRisk={setSelectedRisk}
            onAddDecision={handleAddDecision}
          />
        );
      case "forecast":
        return <ForecastsSection state={state} />;
      case "ai":
        return (
          <AIRecommendationsSection
            state={state}
            onChangeStatus={handleRecommendationStatus}
            onAddDecision={handleAddDecision}
          />
        );
      case "decisions":
        return <DecisionsSection state={state} onAddDecision={handleAddDecision} />;
      case "data":
        return <DataQualitySection state={state} />;
      case "admin":
        return (
          <AdminSection
            state={state}
            isPaused={isPaused}
            speed={speed}
            onTogglePause={() => {
              togglePause();
              triggerToast(isPaused ? "Симуляция событий возобновлена." : "Симуляция событий приостановлена.");
            }}
            onSetSpeed={(s) => {
              setSpeed(s);
              triggerToast(`Установлена скорость симулятора: ${s}x`);
            }}
            onResetData={() => {
              resetDemoData();
              triggerToast("Демо-данные сброшены к исходным.");
            }}
            onGenerateRisk={() => {
              generateCriticalRisk();
              triggerToast("Сгенерирован критический комплаенс-риск.");
            }}
            onGenerateDecision={() => {
              generateManualDecision();
              triggerToast("Сгенерировано новое управленческое решение.");
            }}
          />
        );
      default:
        return <PulseSection state={state} onOpenClient={setSelectedClient} onOpenRisk={setSelectedRisk} onResolveAlert={handleResolveAlert} onAddDecision={handleAddDecision} />;
    }
  };

  const navItems: { id: TabId; label: string; icon: any }[] = [
    { id: "pulse", label: "Пульс EXIM", icon: "overview" },
    { id: "portfolio", label: "Портфель", icon: "products" },
    { id: "clients", label: "Клиенты", icon: "clients" },
    { id: "routes", label: "Страны и пути", icon: "chain" },
    { id: "chain", label: "Цепочки поставок", icon: "chain" },
    { id: "risks", label: "Риски и события", icon: "risk" },
    { id: "forecast", label: "Прогнозы (What-If)", icon: "forecast" },
    { id: "ai", label: "Рекомендации ИИ", icon: "ai" },
    { id: "decisions", label: "Решения", icon: "log" },
    { id: "data", label: "Качество данных", icon: "data" },
    { id: "admin", label: "Администрирование", icon: "admin" }
  ];

  return (
    <div className="app-shell">
      {/* Sidebar Navigation */}
      <aside className={`sidebar ${sidebarExpanded ? "expanded" : "collapsed"}`} aria-label="Основное меню">
        <div className="brand">
          <div className="brand-mark" />
          <div className="brand-text">
            <strong>EXIM COCKPIT</strong>
            <small>Ситуационный Центр</small>
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon name={item.icon} size={18} />
              {sidebarExpanded && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <strong>Обновлено</strong>
          <span>Синхронизация с DWH/Core успешна. Свежесть данных: {lastUpdate}</span>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Top Header */}
        <header className="topbar">
          <div className="topbar-branding">
            <span>Ситуационный Анализ EXIM</span>
            <strong>EXIM Situational Command Center</strong>
          </div>

          <div className="topbar-actions">
            <button className="live-indicator" onClick={togglePause} title="Нажмите для паузы/запуска симуляции">
              <span className="live-dot" style={{ backgroundColor: isPaused ? "var(--yellow)" : "var(--primary)" }} />
              {isPaused ? "Симуляция на паузе" : "Live Симуляция"}
            </button>
            <button className="btn-secondary btn-small" onClick={() => setSearchOpen(true)}>
              <Icon name="search" /> Поиск (Cmd+K)
            </button>
            <button className="btn-icon" onClick={toggleTheme} aria-label="Сменить тему оформления">
              <Icon name="overview" />
            </button>
          </div>
        </header>

        {/* Live News alert ticker strip */}
        <div className="ticker-strip">
          <span className="ticker-title">Сигналы</span>
          <div className="ticker-wrap">
            <div className="ticker-content">
              {state.alerts.map((al) => (
                <span
                  key={al.id}
                  className="ticker-item"
                  onClick={() => {
                    const rObj = state.riskEvents.find(r => r.affectedClient === al.title.split(": ")[1]);
                    if (rObj) setSelectedRisk(rObj);
                    else triggerToast(`Сигнал: ${al.title}`);
                  }}
                >
                  [{al.detectedAt}] <span>{al.title}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Section */}
        <main>{renderSection()}</main>

        <footer style={{ padding: "16px", textAlign: "center", borderTop: "1px solid var(--border)", fontSize: "0.78rem", color: "var(--text-muted)", background: "var(--surface)" }}>
          Демонстрационные данные. Не являются официальной банковской отчётностью. EXIM Bank Kazakhstan © 2026.
        </footer>
      </div>

      {/* Mobile Nav Bar */}
      <nav className="mobile-nav-bar" aria-label="Мобильное меню">
        <button className={`mobile-nav-btn ${activeTab === "pulse" ? "active" : ""}`} onClick={() => setActiveTab("pulse")}>
          <Icon name="overview" size={20} />
          <span>Пульс</span>
        </button>
        <button className={`mobile-nav-btn ${activeTab === "portfolio" ? "active" : ""}`} onClick={() => setActiveTab("portfolio")}>
          <Icon name="products" size={20} />
          <span>Портфель</span>
        </button>
        <button className={`mobile-nav-btn ${activeTab === "clients" ? "active" : ""}`} onClick={() => setActiveTab("clients")}>
          <Icon name="clients" size={20} />
          <span>Клиенты</span>
        </button>
        <button className={`mobile-nav-btn ${activeTab === "risks" ? "active" : ""}`} onClick={() => setActiveTab("risks")}>
          <Icon name="risk" size={20} />
          <span>Риски</span>
        </button>
        <button className={`mobile-nav-btn ${activeTab === "admin" ? "active" : ""}`} onClick={() => setActiveTab("admin")}>
          <Icon name="admin" size={20} />
          <span>Админ</span>
        </button>
      </nav>

      {/* Slide-over Drawers */}
      <ClientDetailPanel
        client={selectedClient}
        decisions={state.decisions}
        onClose={() => setSelectedClient(null)}
        onAddDecision={handleAddDecision}
      />

      <RiskDetailPanel
        risk={selectedRisk}
        users={state.users}
        onClose={() => setSelectedRisk(null)}
        onAssignOwner={assignRiskOwner}
        onEscalate={escalateRisk}
        onCloseRisk={closeRisk}
        onAddDecision={handleAddDecision}
      />

      {/* Cmd + K Global search overlay */}
      <CommandBar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        clients={state.clients}
        risks={state.riskEvents as any}
        products={state.products}
        routes={state.routes}
        onOpenClient={(c) => {
          setSelectedClient(c);
          setSearchOpen(false);
        }}
        onOpenRisk={(r) => {
          setSelectedRisk(r);
          setSearchOpen(false);
        }}
        onSwitchSection={setActiveTab}
        toggleTheme={toggleTheme}
        generateCriticalRisk={generateCriticalRisk}
        generateManualDecision={generateManualDecision}
      />

      {/* Toast Alert popup container */}
      <div className="toast-container" aria-live="polite">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            <span>{toast.message}</span>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>
              <Icon name="close" size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
