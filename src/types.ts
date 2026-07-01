export type RiskLevel = "Низкий" | "Средний" | "Высокий" | "Критический";
export type Severity = "Низкая" | "Средняя" | "Высокая";
export type Status =
  | "Новый"
  | "В работе"
  | "На проверке"
  | "Эскалировано"
  | "Закрыто"
  | "Принято"
  | "Отклонено";

export type RoleName =
  | "Руководство банка"
  | "EXIM бизнес"
  | "RM"
  | "Риск-менеджмент"
  | "Комплаенс"
  | "Финансовый мониторинг"
  | "Аналитик"
  | "Data owner"
  | "IT support"
  | "Администратор";

export interface Role {
  id: string;
  name: RoleName;
  description: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  role: RoleName;
  department: string;
  status: "Активен" | "Ожидает подтверждения" | "Заблокирован";
  lastLogin: string;
}

export interface Industry {
  id: string;
  name: string;
  portfolioShare: number;
  growth: number;
  riskLevel: RiskLevel;
  explanation: string;
}

export interface Country {
  id: string;
  name: string;
  exposure: number;
  growth: number;
  riskLevel: RiskLevel;
  routeHealth: number;
  keySignal: string;
}

export interface Product {
  id: string;
  name: string;
  volume: number;
  income: number;
  clients: number;
  growth: number;
  riskLevel: RiskLevel;
  plan: number;
  fact: number;
  trend: number[];
  explanation: string;
}

export interface Client {
  id: string;
  name: string;
  segment: string;
  industry: string;
  country: string;
  rm: string;
  portfolioVolume: number;
  income: number;
  riskLevel: RiskLevel;
  potentialScore: number;
  clientScore: number;
  products: string[];
  lastActivity: string;
  recommendedAction: string;
  status: "Стабилен" | "Требует внимания" | "Потенциал роста" | "На контроле";
  turnover: number[];
  riskIndicators: string[];
  supplyChain: string;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  corridor: string;
  transportMode: string;
  borderPoints: string[];
  averageDelayDays: number;
  riskLevel: RiskLevel;
  financingVolume: number;
  clients: string[];
}

export interface SupplyChainNode {
  id: string;
  stage: string;
  label: string;
  country: string;
  riskLevel: RiskLevel;
  delayDays: number;
  financingVolume: number;
  clients: string[];
}

export interface Transaction {
  id: string;
  date: string;
  client: string;
  product: string;
  country: string;
  industry: string;
  amount: number;
  margin: number;
  status: "Исполнена" | "В обработке" | "На проверке" | "Приостановлена";
}

export interface KPI {
  id: string;
  title: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "stable";
  riskLevel: RiskLevel;
  explanation: string;
}

export interface RiskEvent {
  id: string;
  title: string;
  category: string;
  factor: string;
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3;
  severity: Severity;
  status: Status;
  owner: RoleName;
  detectedAt: string;
  source: string;
  affectedClient?: string;
  recommendation: string;
  escalationRequired: boolean;
}

export interface Alert {
  id: string;
  title: string;
  severity: Severity;
  status: "Новый" | "Просмотрено" | "Закрыто";
  source: string;
  detectedAt: string;
  owner: RoleName;
  response: string;
}

export interface Forecast {
  id: string;
  name: string;
  values: number[];
  forecastValues: number[];
  confidence: number;
  riskLevel: RiskLevel;
  explanation: string;
}

export interface Scenario {
  id: string;
  title: string;
  expectedImpact: string;
  affectedClients: string[];
  affectedProducts: string[];
  riskLevel: RiskLevel;
  recommendedDecision: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  explanation: string;
  confidence: number;
  sourceSignals: string[];
  suggestedAction: string;
  responsibleRole: RoleName;
  status: "На рассмотрении" | "Принято" | "Отклонено" | "На доработке";
  createdAt: string;
  relatedClient?: string;
  relatedRisk?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: "Внутренний" | "Внешний";
  owner: RoleName;
  updateFrequency: string;
  status: "Работает" | "Задержка" | "Ошибка" | "Резервный режим";
  lastUpdate: string;
  qualityScore: number;
  sla: string;
  errors: number;
  fallbackOption: string;
}

export interface DataQualityIssue {
  id: string;
  metric: string;
  value: number;
  target: number;
  status: RiskLevel;
  explanation: string;
}

export interface DecisionLog {
  id: string;
  date: string;
  decision: string;
  owner: RoleName;
  sourceSignal: string;
  result: string;
  status: Status;
}

export interface RoadmapStage {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  owner: string;
  status: "Запланировано" | "В работе" | "Завершено" | "Риск задержки";
  deliverables: string[];
}

export interface BudgetItem {
  id: string;
  name: string;
  planned: number;
  reserved: number;
  status: RiskLevel;
}

export interface IntegrationStatus {
  id: string;
  system: string;
  owner: RoleName;
  status: "Стабильно" | "Задержка" | "Ошибка" | "Планируется";
  latency: string;
  lastSync: string;
  notes: string;
}

export interface MonthlyPoint {
  month: string;
  portfolio: number;
  income: number;
  risk: number;
}
