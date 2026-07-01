import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { generateInitialData } from "./generators";
import type {
  Client,
  Product,
  Country,
  Route,
  SupplyChainNode,
  Transaction,
  RiskEvent,
  Alert,
  Forecast,
  Scenario,
  AIRecommendation,
  DataSource,
  DataQualityIssue,
  DecisionLog,
  RoadmapStage,
  BudgetItem,
  IntegrationStatus,
  User,
  Role,
  MonthlyPoint
} from "../types";

export interface SimulationState {
  users: User[];
  roles: Role[];
  products: Product[];
  countries: Country[];
  clients: Client[];
  routes: Route[];
  supplyChainNodes: SupplyChainNode[];
  transactions: Transaction[];
  riskEvents: (RiskEvent & { slaHours?: number })[];
  alerts: Alert[];
  forecasts: Forecast[];
  scenarios: Scenario[];
  aiRecommendations: AIRecommendation[];
  decisions: DecisionLog[];
  dataSources: DataSource[];
  dataQualityIssues: DataQualityIssue[];
  integrationStatuses: IntegrationStatus[];
  roadmapStages: RoadmapStage[];
  budgetItems: BudgetItem[];
  monthlyPortfolio: MonthlyPoint[];
  riskCategories: string[];
  accessAreas: string[];
}

interface SimulationContextProps {
  state: SimulationState;
  isPaused: boolean;
  speed: number; // updates speed coefficient (e.g. 1 = normal, 5 = fast)
  lastUpdate: string;
  togglePause: () => void;
  setSpeed: (speed: number) => void;
  resetDemoData: () => void;
  generateCriticalRisk: () => void;
  generateManualDecision: () => void;
  addDecision: (decision: Omit<DecisionLog, "id" | "date">) => void;
  changeRecommendationStatus: (id: string, status: AIRecommendation["status"]) => void;
  markAlertReviewed: (id: string) => void;
  assignRiskOwner: (riskId: string, owner: string) => void;
  escalateRisk: (riskId: string) => void;
  closeRisk: (riskId: string) => void;
  addAlert: (alert: Omit<Alert, "id" | "detectedAt">) => void;
}

const SimulationContext = createContext<SimulationContextProps | undefined>(undefined);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SimulationState>(() => {
    const saved = localStorage.getItem("exim-sim-state");
    return saved ? JSON.parse(saved) : generateInitialData();
  });

  const [isPaused, setIsPaused] = useState<boolean>(() => {
    return localStorage.getItem("exim-sim-paused") === "true";
  });

  const [speed, setSpeedState] = useState<number>(() => {
    return Number(localStorage.getItem("exim-sim-speed")) || 1;
  });

  const [lastUpdate, setLastUpdate] = useState<string>("10:49:00");
  const tickRef = useRef<(() => void) | null>(null);

  // Save changes
  useEffect(() => {
    localStorage.setItem("exim-sim-state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("exim-sim-paused", String(isPaused));
  }, [isPaused]);

  useEffect(() => {
    localStorage.setItem("exim-sim-speed", String(speed));
  }, [speed]);

  // Main ticking logic
  const tick = () => {
    // 1. Current timestamp
    const now = new Date();
    setLastUpdate(now.toTimeString().split(" ")[0]);

    // 2. Fluctuating metrics / indicators
    setState((prev) => {
      // Fluctuate product volumes slightly (+/- 0.05%)
      const updatedProducts = prev.products.map((p) => {
        const coef = 1 + (Math.random() * 0.001 - 0.0005);
        const newVolume = Math.round(p.volume * coef);
        return {
          ...p,
          volume: newVolume,
          fact: newVolume
        };
      });

      // Decrement active risks SLA hours
      const updatedRisks = prev.riskEvents.map((r) => {
        if (r.status !== "Закрыто" && r.slaHours && r.slaHours > 0) {
          const delta = speed * 0.1; // decrement proportionally to speed coefficient
          const nextVal = parseFloat((r.slaHours - delta).toFixed(2));
          return {
            ...r,
            slaHours: nextVal > 0 ? nextVal : 0,
            status: nextVal <= 0 ? ("Новый" as const) : r.status // escalate status indicator
          };
        }
        return r;
      });

      // Periodically trigger a minor warning alert/incident (1% chance per tick)
      let alertsCopy = [...prev.alerts];
      if (Math.random() < 0.02 * speed) {
        const clientsList = prev.clients;
        const randomClient = clientsList[Math.floor(Math.random() * clientsList.length)];
        alertsCopy.unshift({
          id: `a-triggered-${Date.now()}`,
          title: `Всплеск объема операций: ${randomClient.name}`,
          severity: "Средняя",
          status: "Новый",
          source: "Core Banking API",
          detectedAt: now.toLocaleTimeString(),
          owner: "RM",
          response: "Связаться с импортером и запросить таможенную спецификацию."
        });
      }

      return {
        ...prev,
        products: updatedProducts,
        riskEvents: updatedRisks,
        alerts: alertsCopy
      };
    });
  };

  tickRef.current = tick;

  // Run simulation interval
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (tickRef.current) tickRef.current();
    }, 2000 / speed); // speed up simulation ticking

    return () => clearInterval(interval);
  }, [isPaused, speed]);

  // Controls
  const togglePause = () => setIsPaused((prev) => !prev);
  const setSpeed = (s: number) => setSpeedState(s);

  const resetDemoData = () => {
    const data = generateInitialData();
    setState(data);
    setIsPaused(false);
    setSpeedState(1);
    const now = new Date();
    setLastUpdate(now.toTimeString().split(" ")[0]);
  };

  const generateCriticalRisk = () => {
    const now = new Date();
    const newRiskId = `risk-gen-${Date.now()}`;
    const newRisk: RiskEvent = {
      id: newRiskId,
      title: "Выявление незадекларированных санкционных компонентов",
      category: "Санкционный/комплаенс-риск",
      factor: "Таможенный комплаенс обнаружил совпадение кодов двойного назначения в поставке.",
      probability: 5,
      impact: 3,
      severity: "Высокая",
      status: "Новый",
      owner: "Комплаенс",
      detectedAt: `${now.toLocaleDateString()} ${now.toLocaleTimeString().slice(0, 5)}`,
      source: "Комплаенс-сканер",
      affectedClient: chooseClientName(),
      recommendation: "Приостановить платеж, запросить разъяснительное письмо.",
      escalationRequired: true,
      slaHours: 12
    } as any;

    setState((prev) => {
      const updatedRisks = [newRisk, ...prev.riskEvents];
      const updatedAlerts = [
        {
          id: `a-gen-${Date.now()}`,
          title: "Критический комплаенс-риск: незадекларированный груз",
          severity: "Высокая" as const,
          status: "Новый" as const,
          source: "Комплаенс-сканер",
          detectedAt: now.toLocaleTimeString(),
          owner: "Комплаенс" as const,
          response: "Запустить проверку цепочки поставок."
        },
        ...prev.alerts
      ];
      return {
        ...prev,
        riskEvents: updatedRisks,
        alerts: updatedAlerts
      };
    });
  };

  const chooseClientName = () => {
    return state.clients[Math.floor(Math.random() * state.clients.length)]?.name || "ТОО КазМеталл Экспорт";
  };

  const generateManualDecision = () => {
    const now = new Date();
    const newDec: DecisionLog = {
      id: `d-gen-${Date.now()}`,
      date: "01.07.2026",
      decision: `Экстренное решение по лимитам ${chooseClientName()}`,
      owner: "Риск-менеджер",
      sourceSignal: "Ручная симуляция управления",
      result: "Утвержден временный овердрафт для обеспечения прохождения таможни.",
      status: "Принято"
    };

    setState((prev) => ({
      ...prev,
      decisions: [newDec, ...prev.decisions]
    }));
  };

  const addDecision = (decision: Omit<DecisionLog, "id" | "date">) => {
    setState((prev) => ({
      ...prev,
      decisions: [
        {
          ...decision,
          id: `d-${Date.now()}`,
          date: "01.07.2026"
        },
        ...prev.decisions
      ]
    }));
  };

  const changeRecommendationStatus = (id: string, status: AIRecommendation["status"]) => {
    setState((prev) => ({
      ...prev,
      aiRecommendations: prev.aiRecommendations.map((r) =>
        r.id === id ? { ...r, status } : r
      )
    }));
  };

  const markAlertReviewed = (id: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) =>
        a.id === id ? { ...a, status: "Просмотрено" as const } : a
      )
    }));
  };

  const assignRiskOwner = (riskId: string, owner: string) => {
    setState((prev) => ({
      ...prev,
      riskEvents: prev.riskEvents.map((r) =>
        r.id === riskId ? { ...r, owner: owner as any, status: "В работе" as const } : r
      )
    }));
  };

  const escalateRisk = (riskId: string) => {
    setState((prev) => ({
      ...prev,
      riskEvents: prev.riskEvents.map((r) =>
        r.id === riskId ? { ...r, status: "Эскалировано" as const, slaHours: 6 } : r
      )
    }));
  };

  const closeRisk = (riskId: string) => {
    setState((prev) => ({
      ...prev,
      riskEvents: prev.riskEvents.map((r) =>
        r.id === riskId ? { ...r, status: "Закрыто" as const, slaHours: 0 } : r
      )
    }));
  };

  const addAlert = (alert: Omit<Alert, "id" | "detectedAt">) => {
    const now = new Date();
    setState((prev) => ({
      ...prev,
      alerts: [
        {
          ...alert,
          id: `a-${Date.now()}`,
          detectedAt: now.toLocaleTimeString()
        },
        ...prev.alerts
      ]
    }));
  };

  return (
    <SimulationContext.Provider
      value={{
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
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
