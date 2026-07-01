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
  MonthlyPoint,
  RiskLevel,
  Severity,
  Status,
  RoleName
} from "../types";

// Helper for deterministic pseudo-random numbers
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

const rnd = mulberry32(1234567);

// Basic lists
const companyNames = [
  "ТОО КазМеталл Экспорт", "АО AgroTrade Kazakhstan", "ТОО Silk Road Logistics",
  "ТОО QazChem Export", "АО Eurasia Grain", "ТОО TransCaspian Supply",
  "ТОО Alatau Equipment Import", "АО Central Asia Machinery", "ТОО Steppe Food Export",
  "АО Industrial Finance Group", "ТОО Tengri Mining", "АО Qazaq Petroleum",
  "ТОО Nomad Logistics", "АО KazInterTrade", "ТОО Altay Gold", "АО Caspian Marine",
  "ТОО Semey Leather", "АО KazBeef Industries", "ТОО Pavlodar Agro", "АО Turkestan Cotton",
  "ТОО Ulytau Copper", "АО KazSnack Foods", "ТОО Zhetysu Logistics", "АО Saryarka Steel",
  "ТОО Aktobe Chemical", "АО Baykonur HighTech", "ТОО KazCement", "АО Nomad Cargo",
  "ТОО Tobol Grain", "АО Qazaq Wool", "ТОО Oral Machinery", "АО Kokshetau Milk",
  "ТОО KazPlast", "АО Caspian Energy", "ТОО Aral Salt", "АО QazAqua Industries",
  "ТОО Mangystau Transport", "АО Altai Mining", "ТОО Taraz Fertilizer", "АО Balkhash Copper",
  "ТОО Irtysh Grain", "АО QazTech Solutions", "ТОО Stepnogorsk Chemical", "АО Zhasyl Energy",
  "ТОО KazPaper"
];

const countryNames = [
  "Китай", "Европейский союз", "ОАЭ", "Россия", "Турция", "Индия", "США", "Великобритания",
  "Узбекистан", "Кыргызстан", "Таджикистан", "Азербайджан", "Германия", "Италия", "Нидерланды",
  "Польша", "Япония", "Южная Корея", "Вьетнам", "Иран", "Саудовская Аравия", "Канада",
  "Бразилия", "Египет", "Сингапур"
];

const productNames = [
  "Кредитование экспортно-импортных операций", "Банковские гарантии", "Аккредитивы",
  "Торговое финансирование", "Валютные операции", "Нефинансовые сервисы",
  "Аналитическое сопровождение", "Консультации для клиентов", "Валютное хеджирование",
  "Факторинг экспортный", "Факторинг импортный", "Форфейтинг сделок",
  "Эскроу-счета в валюте", "Проектное EXIM-финансирование", "Синдицированные кредиты",
  "Лизинг импортного оборудования", "Структурированные торговые кредиты",
  "Страхование валютных рисков", "Таможенные гарантии", "Коммерческий консалтинг"
];

const clientSegments = ["Крупный бизнес", "Средний бизнес", "Массовый бизнес"];

const industries = [
  "Логистика и транспорт", "Оптовая торговля", "Производство", "АПК",
  "Металлургия", "Химическая промышленность"
];

const rolesList: { name: any; description: string; permissions: string[] }[] = [
  { name: "Руководство банка", description: "Смотрит исполнительные дашборды и карточки решений.", permissions: ["Обзор EXIM", "Прогнозы", "Журнал решений", "Эскалации"] },
  { name: "EXIM бизнес", description: "Управляет продуктами, клиентскими сценариями и планом развития.", permissions: ["Продукты", "Клиенты", "Рекомендации", "Дорожная карта"] },
  { name: "RM", description: "Работает с закреплёнными клиентами и рекомендациями.", permissions: ["Клиенты", "Рекомендации", "События по клиентам"] },
  { name: "Риск-менеджер", description: "Проверяет риски, лимиты, эскалации и планы реакции.", permissions: ["Риски", "Клиенты", "Журнал решений"] },
  { name: "Комплаенс", description: "Проверяет события комплаенса и регуляторные ограничения.", permissions: ["Риски", "Источники данных", "Аудит"] },
  { name: "Финансовый мониторинг", description: "Контролирует платежные события и подозрительные операции.", permissions: ["Риски", "Операции", "Аудит"] },
  { name: "Аналитик", description: "Настраивает витрины, методики KPI и аналитические представления.", permissions: ["Дашборды", "Методики", "Прогнозы"] },
  { name: "Data owner", description: "Отвечает за качество, владельцев и SLA источников данных.", permissions: ["Источники данных", "Качество данных", "Сверка"] },
  { name: "IT support", description: "Следит за интеграциями, журналами и техническими ошибками.", permissions: ["Интеграции", "Журналы", "Настройки"] },
  { name: "Администратор", description: "Управляет пользователями, ролями, доступом и справочниками.", permissions: ["Пользователи", "Роли", "Настройки", "Аудит"] }
];

const userNames = [
  "Тимур Ахметов", "Айбек Сарсенов", "Марат Ибрагимов", "Асель Каримова", "Алина Оспанова",
  "Руслан Даутов", "Жандос Умаров", "Динара Алиева", "Ербол Бауыржан", "Серик Нуртазин",
  "Арман Тажибаев", "Берик Нурланов", "Кайрат Сабитов", "Нурлан Есенов", "Аскар Абишев",
  "Бахытжан Жумагулов", "Саят Мухамеджанов", "Еркебулан Даулетов", "Алия Бексултанова", "Асет Кожанов"
];

const riskCategories = [
  "Неясная бизнес-цель",
  "Расширение периметра сверх MVP",
  "Несогласованные пользовательские сценарии",
  "Несогласованная методология KPI",
  "Отсутствие владельцев данных",
  "Задержки интеграций",
  "Нестабильность внешних источников",
  "Ограничения ЦОИБ",
  "Ложные сигналы ИИ",
  "Недостаточная производительность",
  "Недостаток ресурсов",
  "Зависимость от IT, ODEPT и подрядчиков",
  "Нереалистичный срок внедрения",
  "Недостаточный бюджет или резерв",
  "Позднее тестирование и ИБ",
  "Низкое вовлечение пользователей",
  "Дублирование BI / риск-систем",
  "Изменение внешней экономики или регулирования"
];

const accessAreas = [
  "Обзор",
  "Клиенты",
  "Риски",
  "Рекомендации",
  "Источники",
  "Методики",
  "Администрирование"
];

// Helper to choose random item from list using rnd()
function choose<T>(arr: T[]): T {
  return arr[Math.floor(rnd() * arr.length)];
}

// Deterministic generator helpers
export function generateInitialData() {
  // Reset seed
  const r = mulberry32(1234567);

  // 1. Generate Users (20 users)
  const users: User[] = userNames.map((name, i) => {
    const roleObj = rolesList[i % rolesList.length];
    return {
      id: `u-${i + 1}`,
      name,
      role: roleObj.name,
      department: roleObj.name === "Руководство банка" ? "Правление" : roleObj.name.split(" ")[0],
      status: r() > 0.15 ? "Активен" : "Ожидает подтверждения",
      lastLogin: `01.07.2026 ${String(Math.floor(r() * 4) + 8).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}`
    };
  });

  // 2. Generate Roles (10 roles)
  const roles: Role[] = rolesList.map((ro, i) => ({
    id: `role-${i + 1}`,
    name: ro.name,
    description: ro.description,
    permissions: ro.permissions
  }));

  // 3. Generate Products (20 products)
  const productsList: Product[] = productNames.map((name, i) => {
    const volume = Math.round(r() * 450) + 50;
    const plan = Math.round(volume * (0.9 + r() * 0.2));
    const clientsCount = Math.round(volume * 0.8) + 10;
    const income = parseFloat((volume * 0.035).toFixed(1));
    const growth = parseFloat((r() * 15 - 2).toFixed(1));
    const riskLevel: RiskLevel = volume > 300 ? "Средний" : volume > 150 ? "Высокий" : "Низкий";

    // Generate turnover trend for 7 months
    const trend = Array.from({ length: 7 }, (_, idx) => {
      const base = volume * 0.8;
      const step = volume * 0.2 * (idx / 6);
      return Math.round(base + step + (r() * 30 - 15));
    });

    return {
      id: `prod-${i + 1}`,
      name,
      volume,
      income,
      clients: clientsCount,
      growth,
      riskLevel,
      plan,
      fact: volume,
      trend,
      explanation: `Продукт ${name.toLowerCase()} показывает стабильный оборот и прогнозируемую доходность.`
    };
  });

  // 4. Generate Countries (25 countries)
  const countriesList: Country[] = countryNames.map((name, i) => {
    const exposure = Math.round(r() * 350) + 20;
    const growth = parseFloat((r() * 12 - 2).toFixed(1));
    const routeHealth = Math.round(65 + r() * 30);
    const riskLevel: RiskLevel = routeHealth < 70 ? "Высокий" : routeHealth < 85 ? "Средний" : "Низкий";

    return {
      id: `coun-${i + 1}`,
      name,
      exposure,
      growth,
      riskLevel,
      routeHealth,
      keySignal: routeHealth < 75 ? "Фиксируются задержки прохождения таможенного контроля." : "Стабильное прохождение коридоров."
    };
  });

  // 5. Generate Clients (45 clients)
  const clientsList: Client[] = companyNames.map((name, i) => {
    const countryObj = countriesList[i % countriesList.length];
    const segment = clientSegments[i % clientSegments.length];
    const industry = industries[i % industries.length];
    const portfolioVolume = parseFloat((r() * 75 + 10).toFixed(1));
    const income = parseFloat((portfolioVolume * 0.045).toFixed(1));
    const potentialScore = Math.round(60 + r() * 38);
    const clientScore = Math.round(55 + r() * 40);
    const riskLevel: RiskLevel = clientScore < 65 ? "Высокий" : clientScore < 80 ? "Средний" : "Низкий";

    // Linked products (2-4 products)
    const linkedProducts = [
      productsList[0].name,
      productsList[1].name,
      productsList[(i + 2) % productsList.length].name,
      productsList[(i + 4) % productsList.length].name
    ].slice(0, Math.floor(r() * 3) + 2);

    const turnover = Array.from({ length: 7 }, (_, idx) => {
      const base = portfolioVolume * 0.1;
      return parseFloat((base + r() * 2).toFixed(1));
    });

    return {
      id: `cli-${String(i + 1).padStart(3, "0")}`,
      name,
      segment,
      industry,
      country: countryObj.name,
      rm: `RM ${choose(["Алматы", "Астана", "Караганда", "Шымкент"])}-${(i % 3) + 1}`,
      portfolioVolume,
      income,
      riskLevel,
      potentialScore,
      clientScore,
      products: linkedProducts,
      lastActivity: `30.06.2026`,
      recommendedAction: `Провести встречу по расширению лимита торгового финансирования.`,
      status: riskLevel === "Высокий" ? "На контроле" : riskLevel === "Средний" ? "Требует внимания" : "Стабилен",
      turnover,
      riskIndicators: riskLevel === "Высокий" ? ["Снижение рейтинга контрагента", "Рост задержек на таможне"] : ["Сезонное колебание оборота"],
      supplyChain: `${countryObj.name} - ${choose(["Достык", "Актау", "Хоргос"])} - Казахстан`
    };
  });

  // 6. Generate Trade Routes / Logistics (50 routes)
  const routesList: Route[] = Array.from({ length: 50 }, (_, i) => {
    const countryObj = countriesList[i % countriesList.length];
    const clientObj = clientsList[i % clientsList.length];
    const financingVolume = Math.round(r() * 120) + 15;
    const averageDelayDays = parseFloat((r() * 5 + 0.5).toFixed(1));
    const routeHealth = Math.round(70 + r() * 28);
    const riskLevel: RiskLevel = averageDelayDays > 3.5 ? "Высокий" : averageDelayDays > 2.0 ? "Средний" : "Низкий";

    return {
      id: `route-${i + 1}`,
      name: `${countryObj.name} - Казахстан - ${choose(["ЕС", "Турция", "СНГ"])}`,
      from: countryObj.name,
      to: choose(["Казахстан", "Европейский союз", "Турция"]),
      corridor: choose(["Средний коридор", "Каспийский маршрут", "Северный маршрут", "Мультимодальный"]),
      transportMode: choose(["ЖД + авто", "Море + ЖД", "Авто", "Авиа"]),
      borderPoints: [choose(["Достык", "Хоргос", "Актау"]), choose(["Сарыагаш", "Баку", "Стамбул"])],
      averageDelayDays,
      riskLevel,
      financingVolume,
      clients: [clientObj.name]
    };
  });

  // 7. Supply Chain Nodes (5 stages)
  const supplyChainNodesList: SupplyChainNode[] = [
    { id: "raw", stage: "Поставщик сырья", label: "Сырьё и комплектующие", country: "Китай / Индия", riskLevel: "Средний", delayDays: 2, financingVolume: 176, clients: [companyNames[0], companyNames[1]] },
    { id: "manufacturer", stage: "Производитель", label: "Производство и сборка", country: "Казахстан", riskLevel: "Низкий", delayDays: 0, financingVolume: 284, clients: [companyNames[2], companyNames[4]] },
    { id: "distributor", stage: "Дистрибьютор", label: "Консолидация грузов", country: "Казахстан / ОАЭ", riskLevel: "Средний", delayDays: 1, financingVolume: 152, clients: [companyNames[5]] },
    { id: "wholesale", stage: "Опт и логистика", label: "Оптовый канал", country: "Казахстан / ЕС", riskLevel: "Высокий", delayDays: 4, financingVolume: 221, clients: [companyNames[3]] },
    { id: "buyer", stage: "Конечный покупатель", label: "Контрактный расчёт", country: "ЕС / Турция", riskLevel: "Средний", delayDays: 2, financingVolume: 198, clients: [companyNames[1]] }
  ];

  // 8. Generate Transactions/Operations (120 operations)
  const transactionsList: Transaction[] = Array.from({ length: 120 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    const product = productsList[i % productsList.length];
    const amount = parseFloat((r() * 8 + 0.5).toFixed(1));
    const margin = parseFloat((r() * 0.3 + 0.1).toFixed(2));
    const status = choose(["Исполнена", "В обработке", "На проверке", "Приостановлена"] as const);
    const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");

    return {
      id: `t-${String(i + 1).padStart(3, "0")}`,
      date: `${day}.06.2026`,
      client: client.name,
      product: product.name,
      country: client.country,
      industry: client.industry,
      amount,
      margin,
      status: status as any
    };
  });

  // 9. Generate Risk Events (60 events)
  const riskEventsList: RiskEvent[] = Array.from({ length: 60 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    const country = countriesList[i % countriesList.length];
    const probability = choose([1, 2, 3, 4, 5] as const);
    const impact = choose([1, 2, 3] as const);
    const score = probability * impact;
    const severity: Severity = score >= 10 ? "Высокая" : score >= 6 ? "Средняя" : "Низкая";
    const status = choose(["Новый", "В работе", "На проверке", "Эскалировано", "Закрыто"] as const);
    const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");

    return {
      id: `risk-${String(i + 1).padStart(3, "0")}`,
      title: `Повышение риска по направлению ${country.name}`,
      category: choose([
        "Санкционный/комплаенс-риск", "Логистический риск", "Валютный риск",
        "Страновой риск", "Риск лимитов", "Риск просрочки"
      ]),
      factor: `Задержка оформления таможенных деклараций для грузов из ${country.name}.`,
      probability,
      impact,
      severity,
      status: status as any,
      owner: choose(["Риск-менеджер", "RM", "Комплаенс", "IT support", "Data owner"] as const) as RoleName,
      detectedAt: `${day}.06.2026 11:30`,
      source: choose(["Таможенный API", "Логистический хаб", "Служба комплаенс"]),
      affectedClient: client.name,
      recommendation: `Провести сверку документов по контрагентам, эскалировать RM.`,
      escalationRequired: severity === "Высокая"
    };
  });

  // 10. Generate Live Alerts/Signals (80 alerts)
  const alertsList: Alert[] = Array.from({ length: 80 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");
    const severity: Severity = r() > 0.75 ? "Высокая" : r() > 0.4 ? "Средняя" : "Низкая";

    return {
      id: `a-${i + 1}`,
      title: `Превышение лимита задолженности: ${client.name}`,
      severity,
      status: choose(["Новый", "Просмотрено", "Закрыто"] as const) as any,
      source: choose(["CRM", "DWH", "Лимитные системы"]),
      detectedAt: `01.07.2026 ${String(Math.floor(r() * 4) + 8).padStart(2, "0")}:${String(Math.floor(r() * 60)).padStart(2, "0")}`,
      owner: choose(["RM", "Риск-менеджер", "Финансовый мониторинг"] as const) as RoleName,
      response: `Проверить обеспечение по кредиту и направить уведомление клиенту.`
    };
  });

  // 11. Generate AI Recommendations (40 recommendations)
  const aiRecommendationsList: AIRecommendation[] = Array.from({ length: 40 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    const risk = riskEventsList[i % riskEventsList.length];
    const confidence = Math.round(70 + r() * 25);
    const status = choose(["На рассмотрении", "Принято", "Отклонено", "На доработке"] as const);

    return {
      id: `rec-${i + 1}`,
      title: `Оптимизация кредитного лимита для ${client.name}`,
      explanation: `Анализ структуры сделок и оборота показывает возможность увеличения маржинальности на 1.2% при переходе на гарантированные аккредитивы.`,
      confidence,
      sourceSignals: ["Увеличение маржинальности", "Стабильный скоринг", "Рост экспорта"],
      suggestedAction: `Предложить переход с прямого кредитования на аккредитивную форму расчетов.`,
      responsibleRole: choose(["RM", "EXIM бизнес", "Риск-менеджер"] as const) as RoleName,
      status: status as any,
      createdAt: `01.07.2026`,
      relatedClient: client.name,
      relatedRisk: risk.id
    };
  });

  // 12. Generate Decision Log (40 decisions)
  const decisionsList: DecisionLog[] = Array.from({ length: 40 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");

    return {
      id: `d-${i + 1}`,
      date: `${day}.06.2026`,
      decision: `Согласован альтернативный маршрут транзита для ${client.name}`,
      owner: choose(["EXIM бизнес", "Риск-менеджер", "Руководство банка"] as const) as RoleName,
      sourceSignal: "Задержка на таможенном посту Хоргос",
      result: "Транзит перенаправлен на Достык. Срок доставки сокращен на 2 дня.",
      status: choose(["Принято", "В работе", "Закрыто"] as const) as any
    };
  });

  // 13. Data Sources (15 sources)
  const dataSourcesList: DataSource[] = [
    { id: "ds-1", name: "CRM bcc.kz", type: "Внутренний", owner: "Data owner", updateFrequency: "Каждые 15 мин", status: "Работает", lastUpdate: "01.07.2026 10:45", qualityScore: 97, sla: "99.9%", errors: 0, fallbackOption: "Кэш витрины CRM" },
    { id: "ds-2", name: "Core Banking System", type: "Внутренний", owner: "IT support", updateFrequency: "В реальном времени", status: "Работает", lastUpdate: "01.07.2026 10:49", qualityScore: 99, sla: "99.99%", errors: 0, fallbackOption: "Резервный нод СУБД" },
    { id: "ds-3", name: "DWH / Hadoop Cluster", type: "Внутренний", owner: "IT support", updateFrequency: "Каждый час", status: "Работает", lastUpdate: "01.07.2026 10:00", qualityScore: 94, sla: "99.5%", errors: 1, fallbackOption: "Инкрементальный снимок" },
    { id: "ds-4", name: "API Валютных курсов KASE", type: "Внешний", owner: "Аналитик", updateFrequency: "Каждые 5 мин", status: "Работает", lastUpdate: "01.07.2026 10:45", qualityScore: 98, sla: "99.9%", errors: 0, fallbackOption: "Резервное API Bloomberg" },
    { id: "ds-5", name: "Портал Таможенных Услуг РК", type: "Внешний", owner: "Комплаенс", updateFrequency: "Каждые 2 часа", status: "Задержка", lastUpdate: "01.07.2026 08:30", qualityScore: 82, sla: "97.0%", errors: 3, fallbackOption: "Ручной запрос реестра" },
    { id: "ds-6", name: "Логистический хаб КТЖ", type: "Внешний", owner: "Data owner", updateFrequency: "Каждые 4 часа", status: "Задержка", lastUpdate: "01.07.2026 06:15", qualityScore: 78, sla: "96.5%", errors: 5, fallbackOption: "Партнерский XML-фид" },
    { id: "ds-7", name: "Справочник Клиентов ГБД ЮЛ", type: "Внешний", owner: "Комплаенс", updateFrequency: "Ежедневно", status: "Работает", lastUpdate: "01.07.2026 01:00", qualityScore: 95, sla: "98.5%", errors: 0, fallbackOption: "Локальный справочник контрагентов" },
    { id: "ds-8", name: "Служба Риск-Метрик (BI layer)", type: "Внутренний", owner: "Аналитик", updateFrequency: "Каждый час", status: "Работает", lastUpdate: "01.07.2026 10:00", qualityScore: 92, sla: "99.0%", errors: 2, fallbackOption: "Выгрузка XLS" },
    { id: "ds-9", name: "Шлюз Платежей SWIFT", type: "Внутренний", owner: "IT support", updateFrequency: "В реальном времени", status: "Работает", lastUpdate: "01.07.2026 10:49", qualityScore: 99, sla: "99.99%", errors: 0, fallbackOption: "Резервный канал SWIFT Alliance" },
    { id: "ds-10", name: "Модуль рекомендаций ИИ", type: "Внутренний", owner: "Аналитик", updateFrequency: "Каждые 6 часов", status: "Работает", lastUpdate: "01.07.2026 06:00", qualityScore: 88, sla: "95.0%", errors: 1, fallbackOption: "Статические правила" },
    { id: "ds-11", name: "Система лимитов ODEPT", type: "Внутренний", owner: "IT support", updateFrequency: "Каждые 30 мин", status: "Работает", lastUpdate: "01.07.2026 10:30", qualityScore: 93, sla: "99.0%", errors: 0, fallbackOption: "Автономный сервер лимитов" },
    { id: "ds-12", name: "API Таможни КНР (Customs)", type: "Внешний", owner: "Data owner", updateFrequency: "Каждые 12 часов", status: "Резервный режим", lastUpdate: "01.07.2026 00:00", qualityScore: 85, sla: "95.0%", errors: 4, fallbackOption: "Зеркало API Сингапура" },
    { id: "ds-13", name: "API Таможни ЕС (Eurostat)", type: "Внешний", owner: "Комплаенс", updateFrequency: "Ежедневно", status: "Работает", lastUpdate: "30.06.2026 23:00", qualityScore: 94, sla: "97.5%", errors: 1, fallbackOption: "Кэшированный дамп" },
    { id: "ds-14", name: "Справочник Налоговой службы РК", type: "Внешний", owner: "Комплаенс", updateFrequency: "Еженедельно", status: "Работает", lastUpdate: "28.06.2026 04:00", qualityScore: 96, sla: "98.0%", errors: 0, fallbackOption: "Оффлайн-база БИН" },
    { id: "ds-15", name: "API Логистики ОАЭ (DP World)", type: "Внешний", owner: "Data owner", updateFrequency: "Каждые 8 часов", status: "Работает", lastUpdate: "01.07.2026 04:00", qualityScore: 91, sla: "96.0%", errors: 2, fallbackOption: "Резервный фид почты" }
  ];

  // 14. Data Quality Issues (30 issues)
  const dataQualityIssuesList: DataQualityIssue[] = Array.from({ length: 30 }, (_, i) => {
    const src = dataSourcesList[i % dataSourcesList.length];
    return {
      id: `dq-${i + 1}`,
      metric: choose(["Полнота", "Своевременность", "Дубликаты", "Точность", "Сверка"]),
      value: Math.round(75 + r() * 20),
      target: 95,
      status: choose(["Низкий", "Средний", "Высокий"] as const),
      explanation: `Зафиксированы расхождения по полю БИН контрагента в системе ${src.name}.`
    };
  });

  // 15. Forecast Scenarios (12 monthly points or forecast series)
  const forecastsList: Forecast[] = Array.from({ length: 12 }, (_, i) => {
    const prod = productsList[i % productsList.length];
    return {
      id: `fc-${i + 1}`,
      name: `Прогноз портфеля по продукту: ${prod.name.split(" ")[0]}`,
      values: [120, 128, 134, 140, 148, 154, 162],
      forecastValues: [168, 172, 178, 184],
      confidence: Math.round(70 + r() * 25),
      riskLevel: choose(["Низкий", "Средний", "Высокий"] as const),
      explanation: `Прогноз построен на основе сезонного тренда и исторических данных за 3 года.`
    };
  });

  // 16. Stress Scenarios (10 stress scenarios)
  const scenariosList: Scenario[] = Array.from({ length: 10 }, (_, i) => {
    const client = clientsList[i % clientsList.length];
    return {
      id: `scen-${i + 1}`,
      title: `Сценарий ${i + 1}: ${choose(["Девальвация валюты", "Закрытие границ", "Новые пошлины ЕС", "Нарушение цепочек"])}`,
      expectedImpact: `Ожидается снижение маржинальности экспорта у ${client.name} на 15%, возможно высвобождение лимитов.`,
      affectedClients: [client.name, clientsList[(i + 5) % clientsList.length].name],
      affectedProducts: [productsList[0].name, productsList[1].name],
      riskLevel: choose(["Средний", "Высокий", "Критический"] as const),
      recommendedDecision: `Установить дополнительный мониторинг залогового обеспечения и сократить овердрафты.`
    };
  });

  // 17. Integration Status Records (20 statuses)
  const integrationStatusesList: IntegrationStatus[] = Array.from({ length: 20 }, (_, i) => {
    const src = dataSourcesList[i % dataSourcesList.length];
    return {
      id: `intg-${i + 1}`,
      system: `${src.name} -> Витрина EXIM`,
      owner: src.owner,
      status: choose(["Стабильно", "Задержка", "Ошибка", "Планируется"] as const),
      latency: `${Math.floor(r() * 20) + 1} мин`,
      lastSync: `01.07.2026 10:${String(Math.floor(r() * 50) + 10).padStart(2, "0")}`,
      notes: src.status === "Задержка" ? "Идет проверка SLA каналов связи." : "Синхронизация успешна, ошибок нет."
    };
  });

  // 18. Roadmap Stages (7 stages)
  const roadmapStagesList: RoadmapStage[] = [
    { id: "stage-1", name: "Инициация проекта", start: "Июль 2026", end: "Июль 2026", progress: 100, owner: "Проектный офис", status: "Завершено", deliverables: ["Старт проекта", "Утверждение плана", "Назначение владельцев"] },
    { id: "stage-2", name: "Сбор требований", start: "Август 2026", end: "Сентябрь 2026", progress: 68, owner: "EXIM бизнес", status: "В работе", deliverables: ["Сценарии пользователей", "Методики KPI", "Матрица ролей"] },
    { id: "stage-3", name: "Подготовка данных", start: "Сентябрь 2026", end: "Ноябрь 2026", progress: 45, owner: "Data owner", status: "В работе", deliverables: ["Каталог источников", "Витрина EXIM", "Контроль качества"] },
    { id: "stage-4", name: "Проектирование", start: "Октябрь 2026", end: "Ноябрь 2026", progress: 35, owner: "Архитектура", status: "В работе", deliverables: ["Архитектура", "BPMN процесс", "Макеты интерфейса"] },
    { id: "stage-5", name: "Разработка", start: "Ноябрь 2026", end: "Март 2027", progress: 18, owner: "IT support", status: "Запланировано", deliverables: ["MVP", "Интеграции", "Ролевой доступ"] },
    { id: "stage-6", name: "Пилот", start: "Апрель 2027", end: "Май 2027", progress: 0, owner: "EXIM бизнес", status: "Запланировано", deliverables: ["Пилотный запуск", "Обучение пользователей"] },
    { id: "stage-7", name: "Запуск", start: "Июнь 2027", end: "Июль 2027", progress: 0, owner: "Проектный офис", status: "Запланировано", deliverables: ["Подготовка запуска", "Передача в IT support"] }
  ];

  // 19. Budget Items (3 items)
  const budgetItemsList: BudgetItem[] = [
    { id: "b-1", name: "Разработка и интеграции", planned: 420, reserved: 58, status: "Средний" },
    { id: "b-2", name: "Информационная безопасность", planned: 86, reserved: 21, status: "Высокий" },
    { id: "b-3", name: "Обучение и внедрение", planned: 44, reserved: 8, status: "Низкий" }
  ];

  // 20. KPI monthly portfolio trend points (7 months)
  const monthlyPortfolioList: MonthlyPoint[] = [
    { month: "Янв", portfolio: 1120, income: 29, risk: 31 },
    { month: "Фев", portfolio: 1168, income: 31, risk: 29 },
    { month: "Мар", portfolio: 1212, income: 34, risk: 32 },
    { month: "Апр", portfolio: 1264, income: 35, risk: 36 },
    { month: "Май", portfolio: 1320, income: 37, risk: 38 },
    { month: "Июн", portfolio: 1394, income: 39, risk: 42 },
    { month: "Июл", portfolio: 1480, income: 41, risk: 45 }
  ];

  // Add random remaining SLA hours to risk events (between 2 and 48 hours)
  const initializedRiskEvents = riskEventsList.map((re, i) => ({
    ...re,
    slaHours: re.status !== "Закрыто" ? (i % 24) + 4 : 0
  }));

  return {
    users,
    roles,
    products: productsList,
    countries: countriesList,
    clients: clientsList,
    routes: routesList,
    supplyChainNodes: supplyChainNodesList,
    transactions: transactionsList,
    riskEvents: initializedRiskEvents,
    alerts: alertsList,
    forecasts: forecastsList,
    scenarios: scenariosList,
    aiRecommendations: aiRecommendationsList,
    decisions: decisionsList,
    dataSources: dataSourcesList,
    dataQualityIssues: dataQualityIssuesList,
    integrationStatuses: integrationStatusesList,
    roadmapStages: roadmapStagesList,
    budgetItems: budgetItemsList,
    monthlyPortfolio: monthlyPortfolioList,
    riskCategories,
    accessAreas
  };
}
