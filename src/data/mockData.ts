import type {
  AIRecommendation,
  Alert,
  BudgetItem,
  Client,
  Country,
  DataQualityIssue,
  DataSource,
  DecisionLog,
  Forecast,
  Industry,
  IntegrationStatus,
  KPI,
  Product,
  RiskEvent,
  RoadmapStage,
  Role,
  Route,
  Scenario,
  SupplyChainNode,
  Transaction,
  User,
  MonthlyPoint
} from "../types";

export const months = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек"
];

export const kpis: KPI[] = [
  {
    id: "portfolio",
    title: "Портфель EXIM",
    value: "1,48 трлн ₸",
    delta: "+8,4% к плану",
    trend: "up",
    riskLevel: "Средний",
    explanation: "Суммарный объём активных экспортно-импортных продуктов и сделок."
  },
  {
    id: "clients",
    title: "Активные клиенты",
    value: "842",
    delta: "+37 за месяц",
    trend: "up",
    riskLevel: "Низкий",
    explanation: "Клиенты с активностью по EXIM-продуктам за последние 90 дней."
  },
  {
    id: "yield",
    title: "Доходность",
    value: "5,9%",
    delta: "-0,3 п.п.",
    trend: "down",
    riskLevel: "Средний",
    explanation: "Маржинальность портфеля с учётом стоимости фондирования и комиссий."
  },
  {
    id: "operations",
    title: "Операции",
    value: "12 480",
    delta: "+11% г/г",
    trend: "up",
    riskLevel: "Низкий",
    explanation: "Количество экспортно-импортных операций за выбранный период."
  },
  {
    id: "events",
    title: "Критические события",
    value: "18",
    delta: "+5 за неделю",
    trend: "down",
    riskLevel: "Критический",
    explanation: "События, требующие реакции риск-менеджмента, комплаенса или руководства."
  },
  {
    id: "forecast",
    title: "Прогноз на 30 дней",
    value: "+3,2%",
    delta: "вероятность 74%",
    trend: "stable",
    riskLevel: "Средний",
    explanation: "Ожидаемое изменение портфеля по текущим сигналам и сезонности."
  }
];

export const monthlyPortfolio: MonthlyPoint[] = [
  { month: "Янв", portfolio: 1120, income: 29, risk: 31 },
  { month: "Фев", portfolio: 1168, income: 31, risk: 29 },
  { month: "Мар", portfolio: 1212, income: 34, risk: 32 },
  { month: "Апр", portfolio: 1264, income: 35, risk: 36 },
  { month: "Май", portfolio: 1320, income: 37, risk: 38 },
  { month: "Июн", portfolio: 1394, income: 39, risk: 42 },
  { month: "Июл", portfolio: 1480, income: 41, risk: 45 }
];

export const industries: Industry[] = [
  {
    id: "logistics",
    name: "Логистика и транспорт",
    portfolioShare: 22,
    growth: 9.1,
    riskLevel: "Средний",
    explanation: "Рост связан с коридорами Китай - Казахстан - ЕС, риск создают задержки на границе."
  },
  {
    id: "wholesale",
    name: "Оптовая торговля",
    portfolioShare: 20,
    growth: 6.4,
    riskLevel: "Низкий",
    explanation: "Стабильный оборот, высокий потенциал кросс-продаж гарантий и валютных операций."
  },
  {
    id: "manufacturing",
    name: "Производство",
    portfolioShare: 18,
    growth: 4.8,
    riskLevel: "Средний",
    explanation: "Зависимость от импортных комплектующих и сроков поставки оборудования."
  },
  {
    id: "agro",
    name: "АПК",
    portfolioShare: 15,
    growth: 12.7,
    riskLevel: "Средний",
    explanation: "Сезонный рост экспорта, чувствительность к погоде и внешнему спросу."
  },
  {
    id: "metallurgy",
    name: "Металлургия",
    portfolioShare: 14,
    growth: 3.2,
    riskLevel: "Высокий",
    explanation: "Риск цены сырья и регуляторных ограничений на отдельных рынках."
  },
  {
    id: "chemistry",
    name: "Химическая промышленность",
    portfolioShare: 11,
    growth: 5.1,
    riskLevel: "Средний",
    explanation: "Повышенные требования к документам, сертификации и логистике."
  }
];

export const countries: Country[] = [
  {
    id: "china",
    name: "Китай",
    exposure: 362,
    growth: 11.8,
    riskLevel: "Средний",
    routeHealth: 76,
    keySignal: "Рост задержек на мультимодальных маршрутах."
  },
  {
    id: "eu",
    name: "Европейский союз",
    exposure: 278,
    growth: 4.1,
    riskLevel: "Высокий",
    routeHealth: 68,
    keySignal: "Усиление требований по документам и происхождению товаров."
  },
  {
    id: "uae",
    name: "ОАЭ",
    exposure: 146,
    growth: 14.2,
    riskLevel: "Низкий",
    routeHealth: 84,
    keySignal: "Потенциал торгового финансирования для оптовой торговли."
  },
  {
    id: "russia",
    name: "Россия",
    exposure: 224,
    growth: 2.4,
    riskLevel: "Высокий",
    routeHealth: 61,
    keySignal: "Повышенная проверка контрагентов и платежей."
  },
  {
    id: "turkey",
    name: "Турция",
    exposure: 172,
    growth: 7.5,
    riskLevel: "Средний",
    routeHealth: 73,
    keySignal: "Колебание сроков морской логистики."
  },
  {
    id: "india",
    name: "Индия",
    exposure: 128,
    growth: 10.6,
    riskLevel: "Средний",
    routeHealth: 79,
    keySignal: "Рост спроса на гарантии и аккредитивы."
  }
];

export const products: Product[] = [
  {
    id: "credit",
    name: "Кредитование экспортно-импортных операций",
    volume: 515,
    income: 18.4,
    clients: 238,
    growth: 7.6,
    riskLevel: "Средний",
    plan: 492,
    fact: 515,
    trend: [410, 428, 444, 462, 481, 499, 515],
    explanation: "Основной драйвер портфеля; риск концентрации в логистике и металлургии."
  },
  {
    id: "guarantees",
    name: "Банковские гарантии",
    volume: 244,
    income: 7.2,
    clients: 191,
    growth: 9.8,
    riskLevel: "Низкий",
    plan: 230,
    fact: 244,
    trend: [184, 191, 203, 211, 224, 236, 244],
    explanation: "Высокий спрос у клиентов оптовой торговли и строительства логистических контрактов."
  },
  {
    id: "lc",
    name: "Аккредитивы",
    volume: 198,
    income: 6.1,
    clients: 126,
    growth: 5.4,
    riskLevel: "Средний",
    plan: 205,
    fact: 198,
    trend: [172, 176, 180, 186, 190, 194, 198],
    explanation: "Ниже плана из-за задержки документов по части поставщиков ЕС."
  },
  {
    id: "trade",
    name: "Торговое финансирование",
    volume: 226,
    income: 8.7,
    clients: 154,
    growth: 12.1,
    riskLevel: "Средний",
    plan: 210,
    fact: 226,
    trend: [161, 170, 181, 194, 205, 217, 226],
    explanation: "Рост за счёт импортного оборудования и оборотного финансирования цепочек."
  },
  {
    id: "fx",
    name: "Валютные операции",
    volume: 182,
    income: 5.6,
    clients: 402,
    growth: 4.2,
    riskLevel: "Низкий",
    plan: 174,
    fact: 182,
    trend: [153, 158, 162, 168, 174, 178, 182],
    explanation: "Широкое покрытие клиентской базы, стабильная операционная доходность."
  },
  {
    id: "services",
    name: "Нефинансовые сервисы",
    volume: 62,
    income: 1.9,
    clients: 96,
    growth: 18.3,
    riskLevel: "Низкий",
    plan: 48,
    fact: 62,
    trend: [31, 35, 39, 44, 51, 58, 62],
    explanation: "Быстрый рост консультационных сервисов по маршрутам и документам."
  },
  {
    id: "analytics",
    name: "Аналитическое сопровождение",
    volume: 34,
    income: 1.1,
    clients: 68,
    growth: 21.4,
    riskLevel: "Низкий",
    plan: 28,
    fact: 34,
    trend: [16, 18, 21, 24, 27, 31, 34],
    explanation: "Сервис помогает RM выявлять потенциал и готовить предложения клиентам."
  },
  {
    id: "consulting",
    name: "Консультации для клиентов",
    volume: 19,
    income: 0.6,
    clients: 74,
    growth: 16.8,
    riskLevel: "Низкий",
    plan: 16,
    fact: 19,
    trend: [8, 10, 11, 13, 15, 17, 19],
    explanation: "Поддержка по документам, валютным расчётам и базовым маршрутам."
  }
];

export const clients: Client[] = [
  {
    id: "c-001",
    name: "ТОО «КазЭкспорт Логистик»",
    segment: "Крупный бизнес",
    industry: "Логистика и транспорт",
    country: "Китай",
    rm: "RM Алматы-1",
    portfolioVolume: 64.2,
    income: 2.8,
    riskLevel: "Средний",
    potentialScore: 82,
    clientScore: 78,
    products: ["Кредитование экспортно-импортных операций", "Банковские гарантии", "Валютные операции"],
    lastActivity: "30.06.2026",
    recommendedAction: "Проверить задержки на маршруте и предложить гарантию под новый контракт.",
    status: "Требует внимания",
    turnover: [7.2, 7.5, 8.1, 7.8, 8.6, 8.9, 9.4],
    riskIndicators: ["Задержка 4 дня", "Рост доли одного маршрута", "План выше факта по аккредитивам"],
    supplyChain: "Китай - Достык - Алматы - ЕС"
  },
  {
    id: "c-002",
    name: "ТОО «АгроПром Экспорт»",
    segment: "Средний бизнес",
    industry: "АПК",
    country: "Турция",
    rm: "RM Шымкент-2",
    portfolioVolume: 38.6,
    income: 1.4,
    riskLevel: "Низкий",
    potentialScore: 91,
    clientScore: 86,
    products: ["Торговое финансирование", "Валютные операции", "Аналитическое сопровождение"],
    lastActivity: "29.06.2026",
    recommendedAction: "Подготовить предложение по сезонному финансированию экспорта.",
    status: "Потенциал роста",
    turnover: [4.1, 4.0, 4.5, 5.2, 5.8, 6.4, 7.1],
    riskIndicators: ["Сезонность", "Зависимость от цен на сырьё"],
    supplyChain: "Казахстан - Актау - Турция"
  },
  {
    id: "c-003",
    name: "ТОО «Металл Трейд Центральная Азия»",
    segment: "Крупный бизнес",
    industry: "Металлургия",
    country: "Европейский союз",
    rm: "RM Астана-1",
    portfolioVolume: 88.9,
    income: 3.6,
    riskLevel: "Высокий",
    potentialScore: 68,
    clientScore: 61,
    products: ["Аккредитивы", "Кредитование экспортно-импортных операций", "Валютные операции"],
    lastActivity: "28.06.2026",
    recommendedAction: "Пересмотреть лимит и запросить обновление документов по происхождению товара.",
    status: "На контроле",
    turnover: [10.5, 10.1, 9.8, 9.4, 8.9, 8.6, 8.1],
    riskIndicators: ["Снижение оборота", "Регуляторный риск", "Рост срока проверки документов"],
    supplyChain: "Караганда - Лодзь - Роттердам"
  },
  {
    id: "c-004",
    name: "ТОО «ХимСнаб Импорт»",
    segment: "Средний бизнес",
    industry: "Химическая промышленность",
    country: "Индия",
    rm: "RM Алматы-3",
    portfolioVolume: 27.4,
    income: 1.1,
    riskLevel: "Средний",
    potentialScore: 74,
    clientScore: 72,
    products: ["Банковские гарантии", "Аккредитивы", "Консультации для клиентов"],
    lastActivity: "27.06.2026",
    recommendedAction: "Проверить сертификаты поставщика и включить клиента в мониторинг документов.",
    status: "Требует внимания",
    turnover: [2.8, 3.0, 3.1, 3.3, 3.1, 3.4, 3.5],
    riskIndicators: ["Сертификация", "Поставщик впервые в цепочке"],
    supplyChain: "Индия - порт Мундра - Актау - Алматы"
  },
  {
    id: "c-005",
    name: "ТОО «Оптомаркет Азия»",
    segment: "Массовый бизнес",
    industry: "Оптовая торговля",
    country: "ОАЭ",
    rm: "RM Алматы-2",
    portfolioVolume: 21.8,
    income: 0.9,
    riskLevel: "Низкий",
    potentialScore: 88,
    clientScore: 84,
    products: ["Валютные операции", "Нефинансовые сервисы", "Торговое финансирование"],
    lastActivity: "01.07.2026",
    recommendedAction: "Предложить пакет валютных операций и сопровождение поставок из ОАЭ.",
    status: "Потенциал роста",
    turnover: [2.0, 2.3, 2.6, 2.9, 3.2, 3.5, 3.9],
    riskIndicators: ["Рост оборота", "Высокий потенциал кросс-продаж"],
    supplyChain: "ОАЭ - Алматы - розничные сети"
  },
  {
    id: "c-006",
    name: "ТОО «Индустрия Комплект»",
    segment: "Средний бизнес",
    industry: "Производство",
    country: "Россия",
    rm: "RM Караганда-1",
    portfolioVolume: 42.5,
    income: 1.7,
    riskLevel: "Высокий",
    potentialScore: 63,
    clientScore: 58,
    products: ["Кредитование экспортно-импортных операций", "Валютные операции"],
    lastActivity: "26.06.2026",
    recommendedAction: "Передать событие в комплаенс и проверить альтернативный маршрут поставки.",
    status: "На контроле",
    turnover: [5.4, 5.2, 5.0, 4.8, 4.4, 4.1, 3.9],
    riskIndicators: ["Проверка платежей", "Зависимость от одного поставщика", "Снижение оборота"],
    supplyChain: "Россия - Петропавловск - Караганда"
  }
];

export const routes: Route[] = [
  {
    id: "r-1",
    name: "Китай - Казахстан - ЕС",
    from: "Китай",
    to: "Европейский союз",
    corridor: "Средний коридор",
    transportMode: "ЖД + авто",
    borderPoints: ["Достык", "Хоргос", "Сарыагаш"],
    averageDelayDays: 4.2,
    riskLevel: "Средний",
    financingVolume: 218,
    clients: ["ТОО «КазЭкспорт Логистик»", "ТОО «Металл Трейд Центральная Азия»"]
  },
  {
    id: "r-2",
    name: "Казахстан - Актау - Турция",
    from: "Казахстан",
    to: "Турция",
    corridor: "Каспийский маршрут",
    transportMode: "Авто + море",
    borderPoints: ["Актау", "Баку", "Карс"],
    averageDelayDays: 2.8,
    riskLevel: "Средний",
    financingVolume: 96,
    clients: ["ТОО «АгроПром Экспорт»"]
  },
  {
    id: "r-3",
    name: "ОАЭ - Алматы",
    from: "ОАЭ",
    to: "Казахстан",
    corridor: "Авиа + авто",
    transportMode: "Авиа",
    borderPoints: ["Дубай", "Алматы"],
    averageDelayDays: 1.1,
    riskLevel: "Низкий",
    financingVolume: 54,
    clients: ["ТОО «Оптомаркет Азия»"]
  },
  {
    id: "r-4",
    name: "Индия - Актау - Алматы",
    from: "Индия",
    to: "Казахстан",
    corridor: "Морской маршрут",
    transportMode: "Море + ЖД",
    borderPoints: ["Мундра", "Актау", "Алматы"],
    averageDelayDays: 3.7,
    riskLevel: "Средний",
    financingVolume: 71,
    clients: ["ТОО «ХимСнаб Импорт»"]
  }
];

export const supplyChainNodes: SupplyChainNode[] = [
  {
    id: "raw",
    stage: "Поставщик сырья",
    label: "Сырьё и комплектующие",
    country: "Китай / Индия",
    riskLevel: "Средний",
    delayDays: 2,
    financingVolume: 176,
    clients: ["ТОО «ХимСнаб Импорт»", "ТОО «Индустрия Комплект»"]
  },
  {
    id: "manufacturer",
    stage: "Производитель",
    label: "Производство и упаковка",
    country: "Казахстан",
    riskLevel: "Низкий",
    delayDays: 0,
    financingVolume: 254,
    clients: ["ТОО «АгроПром Экспорт»", "ТОО «Металл Трейд Центральная Азия»"]
  },
  {
    id: "distributor",
    stage: "Дистрибьютор",
    label: "Консолидация груза",
    country: "Казахстан / ОАЭ",
    riskLevel: "Средний",
    delayDays: 1,
    financingVolume: 132,
    clients: ["ТОО «Оптомаркет Азия»"]
  },
  {
    id: "wholesale",
    stage: "Опт / розница",
    label: "Оптовый канал",
    country: "Казахстан / ЕС",
    riskLevel: "Высокий",
    delayDays: 4,
    financingVolume: 211,
    clients: ["ТОО «КазЭкспорт Логистик»", "ТОО «Металл Трейд Центральная Азия»"]
  },
  {
    id: "buyer",
    stage: "Финальный покупатель",
    label: "Контракт и оплата",
    country: "ЕС / Турция",
    riskLevel: "Средний",
    delayDays: 2,
    financingVolume: 189,
    clients: ["ТОО «АгроПром Экспорт»"]
  }
];

export const transactions: Transaction[] = [
  {
    id: "t-001",
    date: "01.07.2026",
    client: "ТОО «Оптомаркет Азия»",
    product: "Валютные операции",
    country: "ОАЭ",
    industry: "Оптовая торговля",
    amount: 2.8,
    margin: 0.12,
    status: "Исполнена"
  },
  {
    id: "t-002",
    date: "30.06.2026",
    client: "ТОО «КазЭкспорт Логистик»",
    product: "Банковские гарантии",
    country: "Китай",
    industry: "Логистика и транспорт",
    amount: 7.4,
    margin: 0.31,
    status: "В обработке"
  },
  {
    id: "t-003",
    date: "29.06.2026",
    client: "ТОО «Металл Трейд Центральная Азия»",
    product: "Аккредитивы",
    country: "Европейский союз",
    industry: "Металлургия",
    amount: 12.2,
    margin: 0.44,
    status: "На проверке"
  },
  {
    id: "t-004",
    date: "28.06.2026",
    client: "ТОО «Индустрия Комплект»",
    product: "Кредитование экспортно-импортных операций",
    country: "Россия",
    industry: "Производство",
    amount: 9.1,
    margin: 0.36,
    status: "Приостановлена"
  }
];

export const riskEvents: RiskEvent[] = [
  {
    id: "risk-001",
    title: "Нестабильность внешнего источника данных",
    category: "Нестабильность внешних источников данных",
    factor: "Поступление данных по логистике задерживается более чем на 6 часов.",
    probability: 4,
    impact: 2,
    severity: "Высокая",
    status: "В работе",
    owner: "Data owner",
    detectedAt: "01.07.2026 09:15",
    source: "Логистическая платформа",
    affectedClient: "ТОО «КазЭкспорт Логистик»",
    recommendation: "Переключить расчёт маршрутов на резервный источник и уведомить RM.",
    escalationRequired: true
  },
  {
    id: "risk-002",
    title: "Расширение периметра сверх MVP",
    category: "Расширение периметра сверх MVP",
    factor: "Запрошены дополнительные отчёты без утверждённого владельца данных.",
    probability: 3,
    impact: 2,
    severity: "Средняя",
    status: "На проверке",
    owner: "EXIM бизнес",
    detectedAt: "30.06.2026 17:40",
    source: "Протокол рабочей группы",
    recommendation: "Зафиксировать изменения через комитет проекта и оценить влияние на сроки.",
    escalationRequired: false
  },
  {
    id: "risk-003",
    title: "Неполная методология расчёта KPI",
    category: "Несогласованная методология расчёта KPI",
    factor: "Показатель доходности отличается между DWH и витриной BI.",
    probability: 4,
    impact: 3,
    severity: "Высокая",
    status: "Эскалировано",
    owner: "Аналитик",
    detectedAt: "29.06.2026 12:20",
    source: "BI layer",
    recommendation: "Согласовать единый справочник методик и владельца расчёта.",
    escalationRequired: true
  },
  {
    id: "risk-004",
    title: "Ограничения ЦОИБ по интеграции",
    category: "Ограничения информационной безопасности и ЦОИБ",
    factor: "Требуется дополнительная проверка канала обмена с внешним API.",
    probability: 3,
    impact: 3,
    severity: "Высокая",
    status: "В работе",
    owner: "IT support",
    detectedAt: "28.06.2026 15:05",
    source: "Журнал интеграций",
    recommendation: "Провести ревью схемы доступа до пилота и подготовить резервный сценарий.",
    escalationRequired: true
  },
  {
    id: "risk-005",
    title: "Ложный сигнал ИИ по снижению оборота",
    category: "Недостоверные рекомендации ИИ и ложные сигналы",
    factor: "Модель не учла сезонное закрытие склада клиента.",
    probability: 2,
    impact: 2,
    severity: "Средняя",
    status: "Закрыто",
    owner: "Риск-менеджмент",
    detectedAt: "27.06.2026 10:10",
    source: "Модуль рекомендаций",
    affectedClient: "ТОО «АгроПром Экспорт»",
    recommendation: "Добавить сезонные признаки и оставить рекомендацию только после проверки RM.",
    escalationRequired: false
  },
  {
    id: "risk-006",
    title: "Низкое вовлечение пользователей пилота",
    category: "Низкое вовлечение пользователей",
    factor: "Часть RM не открывала карточки рекомендаций более 7 дней.",
    probability: 3,
    impact: 1,
    severity: "Средняя",
    status: "Новый",
    owner: "EXIM бизнес",
    detectedAt: "01.07.2026 08:30",
    source: "Аудит действий",
    recommendation: "Провести короткое обучение и добавить еженедельный дайджест.",
    escalationRequired: false
  },
  {
    id: "risk-007",
    title: "Изменение регуляторных требований",
    category: "Изменения внешней экономики или регулирования",
    factor: "По отдельным направлениям требуется дополнительная проверка документов.",
    probability: 3,
    impact: 3,
    severity: "Высокая",
    status: "В работе",
    owner: "Комплаенс",
    detectedAt: "30.06.2026 11:25",
    source: "Комплаенс-мониторинг",
    affectedClient: "ТОО «Металл Трейд Центральная Азия»",
    recommendation: "Обновить чек-лист документов и уведомить RM по затронутым клиентам.",
    escalationRequired: true
  }
];

export const alerts: Alert[] = [
  {
    id: "a-1",
    title: "Снижение оборота клиента на 18%",
    severity: "Высокая",
    status: "Новый",
    source: "DWH",
    detectedAt: "01.07.2026 10:05",
    owner: "RM",
    response: "Связаться с клиентом и уточнить причину отклонения."
  },
  {
    id: "a-2",
    title: "Задержка обновления внешнего источника",
    severity: "Средняя",
    status: "Новый",
    source: "Внешний API",
    detectedAt: "01.07.2026 09:15",
    owner: "Data owner",
    response: "Проверить резервный источник и SLA."
  },
  {
    id: "a-3",
    title: "Платёж требует дополнительной проверки",
    severity: "Высокая",
    status: "Просмотрено",
    source: "Финансовый мониторинг",
    detectedAt: "30.06.2026 16:45",
    owner: "Финансовый мониторинг",
    response: "Передать на проверку финансовому мониторингу."
  }
];

export const forecasts: Forecast[] = [
  {
    id: "portfolio",
    name: "Прогноз портфеля",
    values: [1120, 1168, 1212, 1264, 1320, 1394, 1480],
    forecastValues: [1518, 1562, 1604, 1640],
    confidence: 74,
    riskLevel: "Средний",
    explanation: "Рост сохранится при условии стабильности маршрутов Китай и ОАЭ."
  },
  {
    id: "clients",
    name: "Прогноз роста клиентов",
    values: [704, 721, 748, 774, 803, 821, 842],
    forecastValues: [858, 872, 889, 904],
    confidence: 69,
    riskLevel: "Низкий",
    explanation: "Потенциал создают оптовая торговля, АПК и аналитическое сопровождение."
  },
  {
    id: "risk",
    name: "Прогноз риска",
    values: [31, 29, 32, 36, 38, 42, 45],
    forecastValues: [47, 49, 48, 46],
    confidence: 66,
    riskLevel: "Высокий",
    explanation: "Риск будет повышенным до стабилизации внешних источников и маршрутов."
  }
];

export const scenarios: Scenario[] = [
  {
    id: "s-1",
    title: "Если вырастет курс валют",
    expectedImpact: "Маржа по валютным операциям вырастет, но часть клиентов сократит импортные заявки.",
    affectedClients: ["ТОО «Оптомаркет Азия»", "ТОО «Индустрия Комплект»"],
    affectedProducts: ["Валютные операции", "Кредитование экспортно-импортных операций"],
    riskLevel: "Средний",
    recommendedDecision: "Подготовить предложения по хеджированию и лимитам на короткий период."
  },
  {
    id: "s-2",
    title: "Если увеличатся задержки на маршруте",
    expectedImpact: "Срок оборота финансирования вырастет на 3-5 дней, повысится нагрузка на RM.",
    affectedClients: ["ТОО «КазЭкспорт Логистик»", "ТОО «Металл Трейд Центральная Азия»"],
    affectedProducts: ["Аккредитивы", "Банковские гарантии"],
    riskLevel: "Высокий",
    recommendedDecision: "Включить клиентов в ежедневный мониторинг и предложить альтернативный маршрут."
  },
  {
    id: "s-3",
    title: "Если снизится спрос в отрасли",
    expectedImpact: "Оборот металлургии снизится, высвободится лимит для АПК и торговли.",
    affectedClients: ["ТОО «Металл Трейд Центральная Азия»"],
    affectedProducts: ["Кредитование экспортно-импортных операций", "Аккредитивы"],
    riskLevel: "Средний",
    recommendedDecision: "Перераспределить план продаж и пересмотреть отраслевые лимиты."
  },
  {
    id: "s-4",
    title: "Если изменится регуляторное требование",
    expectedImpact: "Увеличится срок проверки документов и число событий комплаенса.",
    affectedClients: ["ТОО «ХимСнаб Импорт»", "ТОО «Металл Трейд Центральная Азия»"],
    affectedProducts: ["Аккредитивы", "Торговое финансирование"],
    riskLevel: "Высокий",
    recommendedDecision: "Обновить чек-лист документов и закрепить владельца контроля."
  },
  {
    id: "s-5",
    title: "Если внешний источник данных недоступен",
    expectedImpact: "Точность прогноза маршрутов снизится, часть сигналов перейдёт в ручной режим.",
    affectedClients: ["ТОО «КазЭкспорт Логистик»", "ТОО «Оптомаркет Азия»"],
    affectedProducts: ["Аналитическое сопровождение", "Нефинансовые сервисы"],
    riskLevel: "Средний",
    recommendedDecision: "Включить резервный источник и показать статус качества данных на дашборде."
  }
];

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "rec-1",
    title: "Связаться с клиентом с высоким потенциалом",
    explanation: "Оборот клиента растёт три месяца подряд, но доля торгового финансирования ниже среднего по сегменту.",
    confidence: 86,
    sourceSignals: ["Рост оборота", "Высокий потенциал", "Низкий риск"],
    suggestedAction: "RM подготовить предложение по торговому финансированию до 05.07.2026.",
    responsibleRole: "RM",
    status: "На рассмотрении",
    createdAt: "01.07.2026",
    relatedClient: "ТОО «Оптомаркет Азия»"
  },
  {
    id: "rec-2",
    title: "Проверить резкое снижение оборота",
    explanation: "Оборот клиента снизился на 18% относительно среднего за последние 90 дней.",
    confidence: 79,
    sourceSignals: ["Снижение оборота", "Отклонение от сезонности", "Рост срока поставки"],
    suggestedAction: "RM уточнить причину, риск-менеджмент проверить влияние на лимит.",
    responsibleRole: "RM",
    status: "На рассмотрении",
    createdAt: "01.07.2026",
    relatedClient: "ТОО «Металл Трейд Центральная Азия»",
    relatedRisk: "risk-007"
  },
  {
    id: "rec-3",
    title: "Пересмотреть лимит",
    explanation: "Клиент использует 92% лимита, при этом маршрут и страна имеют повышенный риск.",
    confidence: 72,
    sourceSignals: ["Высокая загрузка лимита", "Страна высокого риска", "Событие комплаенса"],
    suggestedAction: "Риск-менеджмент обновить лимит после проверки документов.",
    responsibleRole: "Риск-менеджмент",
    status: "На доработке",
    createdAt: "30.06.2026",
    relatedClient: "ТОО «Индустрия Комплект»",
    relatedRisk: "risk-004"
  },
  {
    id: "rec-4",
    title: "Проверить нестабильный источник данных",
    explanation: "Система видит задержку обновления внешней логистической платформы и снижает доверие к прогнозу маршрутов.",
    confidence: 81,
    sourceSignals: ["SLA нарушен", "Качество данных 71%", "Рост ручных корректировок"],
    suggestedAction: "Data owner включить резервный источник и отметить проблему в журнале решений.",
    responsibleRole: "Data owner",
    status: "На рассмотрении",
    createdAt: "01.07.2026",
    relatedRisk: "risk-001"
  }
];

export const dataSources: DataSource[] = [
  {
    id: "ds-1",
    name: "CRM",
    type: "Внутренний",
    owner: "Data owner",
    updateFrequency: "Каждые 2 часа",
    status: "Работает",
    lastUpdate: "01.07.2026 10:00",
    qualityScore: 94,
    sla: "99,5%",
    errors: 1,
    fallbackOption: "Ручная выгрузка по заявке"
  },
  {
    id: "ds-2",
    name: "DWH",
    type: "Внутренний",
    owner: "IT support",
    updateFrequency: "Ежедневно",
    status: "Работает",
    lastUpdate: "01.07.2026 06:00",
    qualityScore: 91,
    sla: "99,7%",
    errors: 2,
    fallbackOption: "Снимок предыдущего дня"
  },
  {
    id: "ds-3",
    name: "Банковские операции",
    type: "Внутренний",
    owner: "IT support",
    updateFrequency: "Каждый час",
    status: "Работает",
    lastUpdate: "01.07.2026 10:30",
    qualityScore: 96,
    sla: "99,8%",
    errors: 0,
    fallbackOption: "Очередь повторной загрузки"
  },
  {
    id: "ds-4",
    name: "KPI RM",
    type: "Внутренний",
    owner: "Аналитик",
    updateFrequency: "Ежедневно",
    status: "Задержка",
    lastUpdate: "30.06.2026 23:00",
    qualityScore: 83,
    sla: "98,0%",
    errors: 4,
    fallbackOption: "Расчёт по DWH"
  },
  {
    id: "ds-5",
    name: "ODEPT",
    type: "Внутренний",
    owner: "IT support",
    updateFrequency: "По событию",
    status: "Резервный режим",
    lastUpdate: "01.07.2026 08:20",
    qualityScore: 78,
    sla: "97,5%",
    errors: 3,
    fallbackOption: "Очередь событий"
  },
  {
    id: "ds-6",
    name: "Логистические платформы",
    type: "Внешний",
    owner: "Data owner",
    updateFrequency: "Каждые 4 часа",
    status: "Задержка",
    lastUpdate: "01.07.2026 03:10",
    qualityScore: 71,
    sla: "95,0%",
    errors: 7,
    fallbackOption: "Партнёрский API"
  },
  {
    id: "ds-7",
    name: "Рыночные данные",
    type: "Внешний",
    owner: "Аналитик",
    updateFrequency: "Ежедневно",
    status: "Работает",
    lastUpdate: "01.07.2026 07:45",
    qualityScore: 89,
    sla: "98,5%",
    errors: 1,
    fallbackOption: "Снимок предыдущего дня"
  },
  {
    id: "ds-8",
    name: "Государственные базы",
    type: "Внешний",
    owner: "Комплаенс",
    updateFrequency: "Ежедневно",
    status: "Работает",
    lastUpdate: "01.07.2026 05:30",
    qualityScore: 87,
    sla: "97,0%",
    errors: 2,
    fallbackOption: "Ручная проверка"
  }
];

export const dataQualityIssues: DataQualityIssue[] = [
  {
    id: "dq-1",
    metric: "Полнота",
    value: 93,
    target: 95,
    status: "Средний",
    explanation: "Не заполнены коды маршрутов по части операций."
  },
  {
    id: "dq-2",
    metric: "Своевременность",
    value: 86,
    target: 95,
    status: "Высокий",
    explanation: "Задержка внешней логистической платформы снижает актуальность прогноза."
  },
  {
    id: "dq-3",
    metric: "Дубликаты",
    value: 2,
    target: 1,
    status: "Средний",
    explanation: "Повторные записи по платежам после ручной корректировки."
  },
  {
    id: "dq-4",
    metric: "Ошибки",
    value: 1.7,
    target: 1,
    status: "Средний",
    explanation: "Ошибки классификации продукта по старым договорам."
  },
  {
    id: "dq-5",
    metric: "Сверка",
    value: 98,
    target: 98,
    status: "Низкий",
    explanation: "DWH и BI слой сходятся по ключевым портфельным показателям."
  }
];

export const decisions: DecisionLog[] = [
  {
    id: "d-1",
    date: "01.07.2026",
    decision: "Включить резервный источник логистических данных",
    owner: "Data owner",
    sourceSignal: "Задержка внешней логистической платформы",
    result: "Прогноз маршрута пересчитан, RM уведомлены.",
    status: "В работе"
  },
  {
    id: "d-2",
    date: "30.06.2026",
    decision: "Передать событие по клиенту в риск-менеджмент",
    owner: "RM",
    sourceSignal: "Снижение оборота и рост задержки документов",
    result: "Событие принято риск-менеджером.",
    status: "Эскалировано"
  },
  {
    id: "d-3",
    date: "28.06.2026",
    decision: "Обновить методологию доходности",
    owner: "Аналитик",
    sourceSignal: "Расхождение KPI между DWH и BI",
    result: "Согласование назначено на 03.07.2026.",
    status: "На проверке"
  }
];

export const roadmapStages: RoadmapStage[] = [
  {
    id: "stage-1",
    name: "Инициация проекта",
    start: "Июль 2026",
    end: "Июль 2026",
    progress: 100,
    owner: "Проектный офис",
    status: "Завершено",
    deliverables: ["Старт проекта", "Утверждение рабочего плана", "Назначение владельцев"]
  },
  {
    id: "stage-2",
    name: "Сбор требований",
    start: "Август 2026",
    end: "Сентябрь 2026",
    progress: 68,
    owner: "EXIM бизнес",
    status: "В работе",
    deliverables: ["Сценарии пользователей", "Методики KPI", "Матрица ролей"]
  },
  {
    id: "stage-3",
    name: "Подготовка данных",
    start: "Сентябрь 2026",
    end: "Ноябрь 2026",
    progress: 45,
    owner: "Data owner",
    status: "В работе",
    deliverables: ["Каталог источников", "Витрина EXIM", "Контроль качества данных"]
  },
  {
    id: "stage-4",
    name: "Проектирование решения",
    start: "Октябрь 2026",
    end: "Ноябрь 2026",
    progress: 35,
    owner: "Архитектура",
    status: "В работе",
    deliverables: ["Архитектура", "BPMN процесс", "Макеты интерфейса"]
  },
  {
    id: "stage-5",
    name: "Разработка системы",
    start: "Ноябрь 2026",
    end: "Март 2027",
    progress: 18,
    owner: "IT support",
    status: "Запланировано",
    deliverables: ["MVP", "Интеграции", "Ролевой доступ", "Журнал решений"]
  },
  {
    id: "stage-6",
    name: "Пилот проекта",
    start: "Апрель 2027",
    end: "Май 2027",
    progress: 0,
    owner: "EXIM бизнес",
    status: "Запланировано",
    deliverables: ["Пилот", "Обучение пользователей", "Сбор обратной связи"]
  },
  {
    id: "stage-7",
    name: "Завершение проекта",
    start: "Июнь 2027",
    end: "Июль 2027",
    progress: 0,
    owner: "Проектный офис",
    status: "Запланировано",
    deliverables: ["Подготовка запуска", "Передача в IT", "Запуск в промышленную эксплуатацию"]
  }
];

export const pertRows = [
  ["Инициация проекта", 0.5, 1, 1.5, 1],
  ["Сбор требований", 1, 1.5, 2, 1.5],
  ["Подготовка данных", 1.5, 2, 2.5, 2],
  ["Проектирование решения", 1, 1.5, 2, 1.5],
  ["Разработка системы", 3, 4, 5.5, 4],
  ["Пилот проекта", 0.5, 1, 1.5, 1],
  ["Завершение проекта", 0.5, 1, 1.5, 1],
  ["Итого", 8, 12, 16, 12]
] as const;

export const budgetItems: BudgetItem[] = [
  {
    id: "b-1",
    name: "Разработка и интеграции",
    planned: 420,
    reserved: 58,
    status: "Средний"
  },
  {
    id: "b-2",
    name: "Информационная безопасность",
    planned: 86,
    reserved: 21,
    status: "Высокий"
  },
  {
    id: "b-3",
    name: "Обучение и внедрение",
    planned: 44,
    reserved: 8,
    status: "Низкий"
  }
];

export const roles: Role[] = [
  {
    id: "role-1",
    name: "Руководство банка",
    description: "Смотрит исполнительные дашборды и карточки решений.",
    permissions: ["Обзор EXIM", "Прогнозы", "Журнал решений", "Эскалации"]
  },
  {
    id: "role-2",
    name: "EXIM бизнес",
    description: "Управляет продуктами, клиентскими сценариями и планом развития.",
    permissions: ["Продукты", "Клиенты", "Рекомендации", "Дорожная карта"]
  },
  {
    id: "role-3",
    name: "RM",
    description: "Работает с закреплёнными клиентами и рекомендациями.",
    permissions: ["Клиенты", "Рекомендации", "События по клиентам"]
  },
  {
    id: "role-4",
    name: "Риск-менеджмент",
    description: "Проверяет риски, лимиты, эскалации и планы реакции.",
    permissions: ["Риски", "Клиенты", "Журнал решений"]
  },
  {
    id: "role-5",
    name: "Комплаенс",
    description: "Проверяет события комплаенса и регуляторные ограничения.",
    permissions: ["Риски", "Источники данных", "Аудит"]
  },
  {
    id: "role-6",
    name: "Финансовый мониторинг",
    description: "Контролирует платежные события и подозрительные операции.",
    permissions: ["Риски", "Операции", "Аудит"]
  },
  {
    id: "role-7",
    name: "Аналитик",
    description: "Настраивает витрины, методики KPI и аналитические представления.",
    permissions: ["Дашборды", "Методики", "Прогнозы"]
  },
  {
    id: "role-8",
    name: "Data owner",
    description: "Отвечает за качество, владельцев и SLA источников данных.",
    permissions: ["Источники данных", "Качество данных", "Сверка"]
  },
  {
    id: "role-9",
    name: "IT support",
    description: "Следит за интеграциями, журналами и техническими ошибками.",
    permissions: ["Интеграции", "Журналы", "Настройки"]
  },
  {
    id: "role-10",
    name: "Администратор",
    description: "Управляет пользователями, ролями, доступом и справочниками.",
    permissions: ["Пользователи", "Роли", "Настройки", "Аудит"]
  }
];

export const users: User[] = [
  {
    id: "u-1",
    name: "Пользователь руководства",
    role: "Руководство банка",
    department: "Правление",
    status: "Активен",
    lastLogin: "01.07.2026 09:50"
  },
  {
    id: "u-2",
    name: "Пользователь EXIM",
    role: "EXIM бизнес",
    department: "EXIM",
    status: "Активен",
    lastLogin: "01.07.2026 09:30"
  },
  {
    id: "u-3",
    name: "Пользователь риска",
    role: "Риск-менеджмент",
    department: "Риски",
    status: "Активен",
    lastLogin: "30.06.2026 18:10"
  },
  {
    id: "u-4",
    name: "Пользователь данных",
    role: "Data owner",
    department: "Данные",
    status: "Ожидает подтверждения",
    lastLogin: "30.06.2026 12:05"
  }
];

export const integrationStatuses: IntegrationStatus[] = [
  {
    id: "i-1",
    system: "CRM -> витрина EXIM",
    owner: "IT support",
    status: "Стабильно",
    latency: "18 мин",
    lastSync: "01.07.2026 10:12",
    notes: "Ошибок критичности высокой нет."
  },
  {
    id: "i-2",
    system: "DWH -> BI layer",
    owner: "IT support",
    status: "Стабильно",
    latency: "42 мин",
    lastSync: "01.07.2026 06:40",
    notes: "Идёт сверка доходности по продуктам."
  },
  {
    id: "i-3",
    system: "Внешний API логистики",
    owner: "Data owner",
    status: "Задержка",
    latency: "6 ч 50 мин",
    lastSync: "01.07.2026 03:10",
    notes: "Включён резервный мониторинг."
  },
  {
    id: "i-4",
    system: "Риск-системы -> события",
    owner: "Риск-менеджмент",
    status: "Стабильно",
    latency: "9 мин",
    lastSync: "01.07.2026 10:24",
    notes: "События классифицируются по матрице вероятность/влияние."
  }
];

export const riskCategories = [
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

export const accessAreas = [
  "Обзор",
  "Клиенты",
  "Риски",
  "Рекомендации",
  "Источники",
  "Методики",
  "Администрирование"
];
