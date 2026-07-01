import { useMemo, useState } from "react";
import {
  accessAreas,
  aiRecommendations as seedRecommendations,
  budgetItems,
  clients,
  countries,
  dataQualityIssues,
  dataSources,
  forecasts,
  industries,
  integrationStatuses,
  kpis,
  monthlyPortfolio,
  pertRows,
  products,
  riskCategories,
  riskEvents,
  roadmapStages,
  roles,
  routes,
  scenarios,
  supplyChainNodes,
  transactions,
  users
} from "../data/mockData";
import type { AIRecommendation, Alert, Client, DecisionLog, RiskEvent } from "../types";
import { formatMoney, formatPercent } from "../utils";
import { BarChart, BulletChart, DonutChart, LineChart, RiskMatrix } from "../components/charts";
import {
  ChartCard,
  DashboardCard,
  EmptyState,
  FilterSelect,
  Icon,
  MiniProgress,
  SearchInput,
  SectionHeader,
  StatusBadge
} from "../components/ui";
import { ClientMiniTrend } from "../components/Panels";

const palette = ["#007A3D", "#35A66A", "#84CC9A", "#F4B740", "#E5484D", "#6B7C72"];

type SharedProps = {
  recommendations: AIRecommendation[];
  alerts: Alert[];
  decisions: DecisionLog[];
  onOpenClient: (client: Client) => void;
  onOpenRisk: (risk: RiskEvent) => void;
  onRecommendationStatus: (id: string, status: AIRecommendation["status"]) => void;
  onAlertReviewed: (id: string) => void;
  onAddDecision: (decision: Omit<DecisionLog, "id" | "date">) => void;
};

export function OverviewSection({ onOpenRisk, onAddDecision }: SharedProps) {
  const productDistribution = products.slice(0, 5).map((product, index) => ({
    label: product.name.split(" ")[0],
    value: Math.round((product.volume / products.reduce((sum, item) => sum + item.volume, 0)) * 100),
    color: palette[index]
  }));
  const industryDistribution = industries.map((industry, index) => ({
    label: industry.name,
    value: industry.portfolioShare,
    color: palette[index]
  }));

  return (
    <section className="content-stack">
      <SectionHeader
        title="Обзор EXIM"
        description="Исполнительный экран: что происходит сейчас, где отклонение, какой прогноз и кому нужно реагировать."
        action={<button className="primary-button">Сформировать карточку решения</button>}
      />

      <div className="situation-strip">
        <div>
          <span>Ситуация на 01.07.2026</span>
          <strong>Контролируемый рост при повышенном риске данных и маршрутов</strong>
        </div>
        <p>
          Система показывает рост портфеля EXIM, но фиксирует 18 критических событий. Основные зоны внимания:
          внешний источник логистики, документы по ЕС и высокая загрузка лимитов у отдельных клиентов.
        </p>
      </div>

      <div className="metric-grid">
        {kpis.map((kpi) => (
          <DashboardCard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            delta={kpi.delta}
            trend={kpi.trend}
            risk={kpi.riskLevel}
            explanation={kpi.explanation}
          />
        ))}
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Динамика портфеля EXIM" subtitle="Факт, млрд ₸; прогноз отображается в разделе сценариев.">
          <LineChart
            labels={monthlyPortfolio.map((point) => point.month)}
            series={monthlyPortfolio.map((point) => point.portfolio)}
            label="Линейный график динамики портфеля EXIM"
          />
        </ChartCard>
        <ChartCard title="Распределение по продуктам" subtitle="Доля в портфеле по активным продуктам.">
          <DonutChart items={productDistribution} label="Доля продуктов EXIM в портфеле" />
        </ChartCard>
        <ChartCard title="Распределение по отраслям" subtitle="Шесть отраслей периметра MVP.">
          <DonutChart items={industryDistribution} label="Доля отраслей EXIM в портфеле" />
        </ChartCard>
        <ChartCard title="Страны и маршруты" subtitle="Экспозиция и здоровье логистики.">
          <div className="country-cards">
            {countries.map((country) => (
              <article className="country-card" key={country.id}>
                <span>{country.name}</span>
                <strong>{formatMoney(country.exposure)}</strong>
                <MiniProgress value={country.routeHealth} label={`Здоровье маршрута ${country.name}`} />
                <small>{country.keySignal}</small>
                <StatusBadge value={country.riskLevel} />
              </article>
            ))}
          </div>
        </ChartCard>
      </div>

      <div className="three-column">
        <ChartCard title="Топ рисков" subtitle="События с владельцем и реакцией.">
          <div className="compact-list">
            {riskEvents.slice(0, 4).map((risk) => (
              <button className="list-button" key={risk.id} onClick={() => onOpenRisk(risk)}>
                <span>
                  <strong>{risk.title}</strong>
                  <small>{risk.owner} · {risk.source}</small>
                </span>
                <StatusBadge value={risk.severity} />
              </button>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Топ возможностей" subtitle="Где банк может усилить EXIM-бизнес.">
          <div className="opportunity-list">
            <article>
              <b>ОАЭ и оптовая торговля</b>
              <span>Высокий потенциал валютных операций и торгового финансирования.</span>
            </article>
            <article>
              <b>АПК и Турция</b>
              <span>Сезонный спрос поддерживает рост портфеля и комиссионного дохода.</span>
            </article>
            <article>
              <b>Аналитическое сопровождение</b>
              <span>Нефинансовый сервис повышает удержание клиентов и качество решений RM.</span>
            </article>
          </div>
        </ChartCard>
        <ChartCard title="Рекомендуемые действия" subtitle="Система предлагает, человек утверждает.">
          <div className="action-list">
            <button
              onClick={() =>
                onAddDecision({
                  decision: "Поручить Data owner включить резервный источник логистики",
                  owner: "Data owner",
                  sourceSignal: "Задержка внешней логистической платформы",
                  result: "Запись создана из обзора EXIM.",
                  status: "В работе"
                })
              }
            >
              <Icon name="data" /> Включить резервный источник
            </button>
            <button>
              <Icon name="clients" /> Связаться с клиентами высокого потенциала
            </button>
            <button>
              <Icon name="risk" /> Эскалировать события по документам ЕС
            </button>
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

export function ProductsSection() {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Продукты"
        description="Аналитика EXIM-продуктов: объём, доход, клиенты, рост, риск, план-факт и тренд."
      />

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="card-heading inline-heading">
              <h3>{product.name}</h3>
              <StatusBadge value={product.riskLevel} />
            </div>
            <div className="product-stats">
              <span>
                <b>{formatMoney(product.volume)}</b>
                объём
              </span>
              <span>
                <b>{formatMoney(product.income)}</b>
                доход
              </span>
              <span>
                <b>{product.clients}</b>
                клиентов
              </span>
            </div>
            <BulletChart value={product.fact} target={product.plan} label="План-факт" />
            <p>{product.explanation}</p>
          </article>
        ))}
      </div>

      <ChartCard title="Сравнение продуктов" subtitle="Детализация помогает понять, где рост, риск или недобор плана.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Продукт</th>
                <th>Объём</th>
                <th>Доход</th>
                <th>Клиенты</th>
                <th>Рост</th>
                <th>Риск</th>
                <th>План-факт</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{formatMoney(product.volume)}</td>
                  <td>{formatMoney(product.income)}</td>
                  <td>{product.clients}</td>
                  <td>{formatPercent(product.growth)}</td>
                  <td>
                    <StatusBadge value={product.riskLevel} />
                  </td>
                  <td>
                    {product.fact} / {product.plan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="two-column">
        <PortfolioPlanFact />
        <ProductOperationsSummary />
      </div>
    </section>
  );
}

export function ClientsSection({ onOpenClient }: SharedProps) {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("Все отрасли");
  const [country, setCountry] = useState("Все страны");
  const [risk, setRisk] = useState("Все риски");
  const [rm, setRm] = useState("Все RM");
  const [product, setProduct] = useState("Все продукты");

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase());
      const matchesIndustry = industry === "Все отрасли" || client.industry === industry;
      const matchesCountry = country === "Все страны" || client.country === country;
      const matchesRisk = risk === "Все риски" || client.riskLevel === risk;
      const matchesRm = rm === "Все RM" || client.rm === rm;
      const matchesProduct = product === "Все продукты" || client.products.includes(product);
      return matchesSearch && matchesIndustry && matchesCountry && matchesRisk && matchesRm && matchesProduct;
    });
  }, [country, industry, product, risk, rm, search]);

  return (
    <section className="content-stack">
      <SectionHeader
        title="Клиенты"
        description="Рабочее место RM и бизнеса: скоринг, потенциал, риск, продукты и следующее действие."
      />

      <div className="filter-bar">
        <SearchInput value={search} onChange={setSearch} placeholder="Поиск клиента" />
        <FilterSelect
          label="Отрасль"
          value={industry}
          onChange={setIndustry}
          options={["Все отрасли", ...industries.map((item) => item.name)]}
        />
        <FilterSelect
          label="Страна"
          value={country}
          onChange={setCountry}
          options={["Все страны", ...countries.map((item) => item.name)]}
        />
        <FilterSelect label="Риск" value={risk} onChange={setRisk} options={["Все риски", "Низкий", "Средний", "Высокий"]} />
        <FilterSelect label="RM" value={rm} onChange={setRm} options={["Все RM", ...Array.from(new Set(clients.map((item) => item.rm)))]} />
        <FilterSelect
          label="Продукт"
          value={product}
          onChange={setProduct}
          options={["Все продукты", ...products.map((item) => item.name)]}
        />
      </div>

      {filteredClients.length ? (
        <div className="client-table">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Клиент</th>
                  <th>Сегмент</th>
                  <th>Отрасль</th>
                  <th>Страна</th>
                  <th>Скоринг</th>
                  <th>Потенциал</th>
                  <th>Риск</th>
                  <th>RM</th>
                  <th>Тренд</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <button className="link-button" onClick={() => onOpenClient(client)}>
                        {client.name}
                      </button>
                    </td>
                    <td>{client.segment}</td>
                    <td>{client.industry}</td>
                    <td>{client.country}</td>
                    <td>{client.clientScore}</td>
                    <td>{client.potentialScore}</td>
                    <td>
                      <StatusBadge value={client.riskLevel} />
                    </td>
                    <td>{client.rm}</td>
                    <td>
                      <ClientMiniTrend values={client.turnover} />
                    </td>
                    <td>{client.recommendedAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Клиенты не найдены"
          text="Измените фильтры или очистите поиск, чтобы увидеть клиентскую базу EXIM."
        />
      )}
    </section>
  );
}

export function SupplyChainSection({ onOpenClient }: SharedProps) {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Цепочки поставок"
        description="Карта движения от поставщика сырья до финального покупателя с рисками маршрута, задержками и клиентами."
      />

      <div className="supply-chain-map">
        {supplyChainNodes.map((node, index) => (
          <div className="chain-step-wrap" key={node.id}>
            <article className={`chain-step ${node.riskLevel === "Высокий" ? "attention" : ""}`}>
              <span>{node.stage}</span>
              <strong>{node.label}</strong>
              <small>{node.country}</small>
              <div className="chain-meta">
                <StatusBadge value={node.riskLevel} />
                <b>{node.delayDays} дн. задержки</b>
              </div>
              <p>{formatMoney(node.financingVolume)} финансирования</p>
            </article>
            {index < supplyChainNodes.length - 1 ? (
              <div className="chain-arrow" aria-hidden="true">
                <Icon name="arrow" />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <ChartCard title="Проблемные участки" subtitle="Где задержка влияет на финансирование и клиентский опыт.">
          <div className="compact-list">
            {routes.map((route) => (
              <article className="route-card" key={route.id}>
                <div>
                  <strong>{route.name}</strong>
                  <span>{route.corridor} · {route.transportMode}</span>
                </div>
                <StatusBadge value={route.riskLevel} />
                <p>Средняя задержка: {route.averageDelayDays} дня. Пункты: {route.borderPoints.join(", ")}.</p>
                <b>{formatMoney(route.financingVolume)} в цепочке</b>
              </article>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Клиенты в цепочке" subtitle="Клик открывает профиль клиента и рекомендуемое действие.">
          <div className="compact-list">
            {clients.slice(0, 5).map((client) => (
              <button className="list-button" key={client.id} onClick={() => onOpenClient(client)}>
                <span>
                  <strong>{client.name}</strong>
                  <small>{client.supplyChain}</small>
                </span>
                <StatusBadge value={client.riskLevel} />
              </button>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

export function RisksSection({ alerts, onAlertReviewed, onOpenRisk, onAddDecision }: SharedProps) {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Риски и события"
        description="Центр оперативного контроля: матрица риска, события, владельцы, реакция и статус управленческого решения."
      />

      <div className="dashboard-grid">
        <ChartCard title="Матрица риска" subtitle="Вероятность 1-5 и влияние 1-3. Цвет показывает уровень внимания.">
          <RiskMatrix events={riskEvents} onSelect={(id) => onOpenRisk(riskEvents.find((risk) => risk.id === id)!)} />
        </ChartCard>
        <ChartCard title="Критические события" subtitle="Каждый сигнал имеет владельца и рекомендованный ответ.">
          <div className="compact-list">
            {riskEvents.map((risk) => (
              <button className="list-button" key={risk.id} onClick={() => onOpenRisk(risk)}>
                <span>
                  <strong>{risk.title}</strong>
                  <small>{risk.owner} · {risk.detectedAt}</small>
                </span>
                <StatusBadge value={risk.severity} />
              </button>
            ))}
          </div>
        </ChartCard>
      </div>

      <ChartCard title="События и реакции" subtitle="Кнопка эскалации создаёт запись в журнале решений.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Риск</th>
                <th>Фактор</th>
                <th>Вероятность</th>
                <th>Влияние</th>
                <th>Критичность</th>
                <th>Владелец</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {riskEvents.map((risk) => (
                <tr key={risk.id}>
                  <td>{risk.title}</td>
                  <td>{risk.factor}</td>
                  <td>{risk.probability}</td>
                  <td>{risk.impact}</td>
                  <td>
                    <StatusBadge value={risk.severity} />
                  </td>
                  <td>{risk.owner}</td>
                  <td>
                    <StatusBadge value={risk.status} />
                  </td>
                  <td>
                    <button
                      className="small-button"
                      onClick={() =>
                        onAddDecision({
                          decision: `Эскалация риска: ${risk.title}`,
                          owner: risk.owner,
                          sourceSignal: risk.factor,
                          result: "Событие направлено ответственному владельцу.",
                          status: "Эскалировано"
                        })
                      }
                    >
                      Эскалировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="two-column">
        <ChartCard title="Алерты" subtitle="Отметка просмотра сохраняется в состоянии прототипа.">
          <div className="compact-list">
            {alerts.map((alert) => (
              <article className="alert-card" key={alert.id}>
                <div>
                  <strong>{alert.title}</strong>
                  <span>{alert.source} · {alert.detectedAt}</span>
                  <p>{alert.response}</p>
                </div>
                <StatusBadge value={alert.severity} />
                <button className="small-button" onClick={() => onAlertReviewed(alert.id)}>
                  {alert.status === "Просмотрено" ? "Просмотрено" : "Отметить просмотр"}
                </button>
              </article>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Процесс от сигнала к действию" subtitle="Система поддерживает решение, но не принимает его вместо человека.">
          <ProcessFlow />
        </ChartCard>
      </div>

      <ChartCard title="Категории проектных и операционных рисков" subtitle="Перечень используется для классификации событий и планов снижения риска.">
        <div className="risk-category-grid">
          {riskCategories.map((category, index) => (
            <span key={category}>
              {index + 1}. {category}
            </span>
          ))}
        </div>
      </ChartCard>
    </section>
  );
}

export function ForecastsSection() {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Прогнозы и сценарии"
        description="Прогноз портфеля, клиентов, риска, стран, отраслей и задержек. Сценарии показывают ожидаемое влияние и решение."
      />

      <div className="dashboard-grid">
        {forecasts.map((forecast) => (
          <ChartCard
            key={forecast.id}
            title={forecast.name}
            subtitle={`Доверие прогноза ${forecast.confidence}%. ${forecast.explanation}`}
          >
            <LineChart
              labels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"]}
              series={forecast.values}
              forecast={forecast.forecastValues}
              label={`График прогноза: ${forecast.name}`}
            />
          </ChartCard>
        ))}
      </div>

      <ChartCard title="Страновая экспозиция и прогноз маршрутов" subtitle="Карточки помогают быстро понять, где риск логистики повышается.">
        <div className="country-cards wide">
          {countries.map((country) => (
            <article className="country-card" key={country.id}>
              <span>{country.name}</span>
              <strong>{formatMoney(country.exposure)}</strong>
              <MiniProgress value={country.routeHealth} label={`Индекс маршрута ${country.name}`} />
              <small>{country.keySignal}</small>
              <StatusBadge value={country.riskLevel} />
            </article>
          ))}
        </div>
      </ChartCard>

      <div className="scenario-grid">
        {scenarios.map((scenario) => (
          <article className="scenario-card" key={scenario.id}>
            <div className="card-heading inline-heading">
              <h3>{scenario.title}</h3>
              <StatusBadge value={scenario.riskLevel} />
            </div>
            <p>{scenario.expectedImpact}</p>
            <dl>
              <dt>Клиенты</dt>
              <dd>{scenario.affectedClients.join(", ")}</dd>
              <dt>Продукты</dt>
              <dd>{scenario.affectedProducts.join(", ")}</dd>
              <dt>Рекомендуемое решение</dt>
              <dd>{scenario.recommendedDecision}</dd>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AISection({ recommendations, onRecommendationStatus, onAddDecision }: SharedProps) {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Рекомендации ИИ"
        description="ИИ формирует подсказки на основе сигналов, но решения принимают только ответственные сотрудники."
      />

      <div className="advisory-banner">
        <Icon name="ai" />
        <div>
          <strong>Рекомендации ИИ имеют консультативный характер</strong>
          <p>Критические решения проходят проверку человеком: сотрудник принимает, отклоняет или отправляет рекомендацию на доработку, а результат фиксируется в журнале.</p>
        </div>
      </div>

      <div className="human-flow">
        {["ИИ предлагает", "Ответственный проверяет", "Решение принято или отклонено", "Результат записан"].map((step, index) => (
          <div className="human-flow-step" key={step}>
            <b>{index + 1}</b>
            <span>{step}</span>
          </div>
        ))}
      </div>

      <div className="recommendation-grid">
        {recommendations.map((recommendation) => (
          <article className="recommendation-card" key={recommendation.id}>
            <div className="card-heading inline-heading">
              <h3>{recommendation.title}</h3>
              <StatusBadge value={recommendation.status} />
            </div>
            <p>{recommendation.explanation}</p>
            <div className="confidence">
              <span>Уверенность {recommendation.confidence}%</span>
              <MiniProgress value={recommendation.confidence} label={`Уверенность рекомендации ${recommendation.title}`} />
            </div>
            <div className="chip-list">
              {recommendation.sourceSignals.map((signal) => (
                <span key={signal}>{signal}</span>
              ))}
            </div>
            <dl>
              <dt>Затронутая область</dt>
              <dd>{recommendation.relatedClient ?? recommendation.relatedRisk ?? "Портфель EXIM"}</dd>
              <dt>Действие</dt>
              <dd>{recommendation.suggestedAction}</dd>
              <dt>Ответственный</dt>
              <dd>{recommendation.responsibleRole}</dd>
            </dl>
            <div className="button-row">
              <button
                className="primary-button"
                onClick={() => {
                  onRecommendationStatus(recommendation.id, "Принято");
                  onAddDecision({
                    decision: `Принята рекомендация: ${recommendation.title}`,
                    owner: recommendation.responsibleRole,
                    sourceSignal: recommendation.sourceSignals.join(", "),
                    result: recommendation.suggestedAction,
                    status: "Принято"
                  });
                }}
              >
                <Icon name="check" /> Принять
              </button>
              <button className="secondary-button" onClick={() => onRecommendationStatus(recommendation.id, "Отклонено")}>
                <Icon name="x" /> Отклонить
              </button>
              <button className="secondary-button" onClick={() => onRecommendationStatus(recommendation.id, "На доработке")}>
                На проверку
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DataSourcesSection() {
  return (
    <section className="content-stack">
      <SectionHeader
        title="Источники данных"
        description="Мониторинг внутренних и внешних источников, качества данных, SLA, ошибок и резервных сценариев."
      />

      <div className="quality-grid">
        {dataQualityIssues.map((issue) => (
          <article className="quality-card" key={issue.id}>
            <div className="card-heading inline-heading">
              <h3>{issue.metric}</h3>
              <StatusBadge value={issue.status} />
            </div>
            <strong>
              {issue.value}
              {issue.metric === "Дубликаты" || issue.metric === "Ошибки" ? "%" : "%"}
            </strong>
            <MiniProgress value={issue.metric === "Дубликаты" || issue.metric === "Ошибки" ? 100 - issue.value * 10 : issue.value} label={issue.metric} />
            <p>{issue.explanation}</p>
            <small>Цель: {issue.target}%</small>
          </article>
        ))}
      </div>

      <ChartCard title="Каталог источников" subtitle="Каждый источник имеет владельца, периодичность, качество, SLA и резервный вариант.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Источник</th>
                <th>Тип</th>
                <th>Владелец</th>
                <th>Частота</th>
                <th>Статус</th>
                <th>Обновление</th>
                <th>Качество</th>
                <th>SLA</th>
                <th>Ошибки</th>
                <th>Резерв</th>
              </tr>
            </thead>
            <tbody>
              {dataSources.map((source) => (
                <tr key={source.id}>
                  <td>{source.name}</td>
                  <td>{source.type}</td>
                  <td>{source.owner}</td>
                  <td>{source.updateFrequency}</td>
                  <td>
                    <StatusBadge value={source.status} />
                  </td>
                  <td>{source.lastUpdate}</td>
                  <td>{source.qualityScore}%</td>
                  <td>{source.sla}</td>
                  <td>{source.errors}</td>
                  <td>{source.fallbackOption}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <ChartCard title="Статус интеграций" subtitle="Техническое состояние обменов, задержки и последние синхронизации.">
        <div className="integration-grid">
          {integrationStatuses.map((integration) => (
            <article className="integration-card" key={integration.id}>
              <div className="card-heading inline-heading">
                <h3>{integration.system}</h3>
                <StatusBadge value={integration.status} />
              </div>
              <p>{integration.notes}</p>
              <span>Владелец: {integration.owner}</span>
              <span>Задержка: {integration.latency}</span>
              <span>Последняя синхронизация: {integration.lastSync}</span>
            </article>
          ))}
        </div>
      </ChartCard>
    </section>
  );
}

export function RoadmapSection() {
  const milestones = [
    ["Июль 2026", "Старт проекта и утверждение рабочего плана"],
    ["Сентябрь 2026", "Согласованы требования, данные и архитектура"],
    ["Декабрь 2026", "MVP — первая рабочая версия системы с основными функциями"],
    ["Январь-март 2027", "Проверка безопасности, тестирование и исправления"],
    ["Апрель-май 2027", "Пилотный запуск и обучение пользователей"],
    ["Июнь 2027", "Подготовка к промышленному запуску"],
    ["Июль 2027", "Запуск в промышленную эксплуатацию и передача IT"]
  ];

  return (
    <section className="content-stack">
      <SectionHeader
        title="Дорожная карта"
        description="План внедрения с июля 2026 по июль 2027, PERT-оценка и контроль ключевых вех."
      />

      <div className="pert-summary">
        <article>
          <span>Оптимистично</span>
          <strong>8 месяцев</strong>
        </article>
        <article>
          <span>Наиболее вероятно</span>
          <strong>12 месяцев</strong>
        </article>
        <article>
          <span>Пессимистично</span>
          <strong>16 месяцев</strong>
        </article>
        <article>
          <span>Итог PERT</span>
          <strong>12 месяцев</strong>
        </article>
      </div>

      <ChartCard title="Таймлайн проекта" subtitle="Июль 2026 - июль 2027.">
        <div className="roadmap">
          {roadmapStages.map((stage) => (
            <article className="roadmap-stage" key={stage.id}>
              <div>
                <span>
                  {stage.start} - {stage.end}
                </span>
                <h3>{stage.name}</h3>
                <p>{stage.owner}</p>
              </div>
              <StatusBadge value={stage.status} />
              <MiniProgress value={stage.progress} label={`Прогресс ${stage.name}`} />
              <ul>
                {stage.deliverables.map((deliverable) => (
                  <li key={deliverable}>{deliverable}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </ChartCard>

      <div className="two-column">
        <ChartCard title="PERT-таблица" subtitle="Оценки указаны в месяцах.">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Этап</th>
                  <th>O</th>
                  <th>M</th>
                  <th>P</th>
                  <th>PERT</th>
                </tr>
              </thead>
              <tbody>
                {pertRows.map(([name, optimistic, mostLikely, pessimistic, pert]) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{optimistic}</td>
                    <td>{mostLikely}</td>
                    <td>{pessimistic}</td>
                    <td>{pert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        <ChartCard title="Ключевые вехи" subtitle="Контрольные точки для руководства и проектной команды.">
          <div className="milestone-list">
            {milestones.map(([date, text]) => (
              <article key={date}>
                <span>{date}</span>
                <strong>{text}</strong>
              </article>
            ))}
          </div>
        </ChartCard>
      </div>
    </section>
  );
}

export function AdminSection({ decisions }: SharedProps) {
  const areaAccess = (roleName: string, area: string) => {
    const rule = `${roleName}-${area}`;
    const full = ["Руководство банка-Обзор", "Администратор-Администрирование", "IT support-Источники"];
    if (full.includes(rule)) return "Полный";
    if (roleName === "Администратор") return "Полный";
    if (roleName === "RM" && ["Клиенты", "Рекомендации"].includes(area)) return "Свои клиенты";
    if (roleName === "Риск-менеджмент" && ["Риски", "Клиенты"].includes(area)) return "Полный";
    if (roleName === "Комплаенс" && ["Риски", "Источники"].includes(area)) return "Полный";
    if (roleName === "Data owner" && ["Источники", "Методики"].includes(area)) return "Полный";
    if (roleName === "Аналитик" && ["Обзор", "Методики", "Источники"].includes(area)) return "Настройка";
    if (roleName === "EXIM бизнес" && ["Обзор", "Клиенты", "Рекомендации"].includes(area)) return "Полный";
    if (roleName === "IT support" && ["Источники", "Администрирование"].includes(area)) return "Техподдержка";
    return "Просмотр";
  };

  return (
    <section className="content-stack">
      <SectionHeader
        title="Администрирование"
        description="Роли, доступы, настройки, аудит, справочники и методология KPI для управляемого запуска."
      />

      <div className="dashboard-grid">
        <ChartCard title="Пользователи и роли" subtitle="Ролевой доступ снижает риск несанкционированных действий.">
          <div className="compact-list">
            {users.map((user) => (
              <article className="user-row" key={user.id}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.role} · {user.department}</span>
                  <small>Последний вход: {user.lastLogin}</small>
                </div>
                <StatusBadge value={user.status} />
              </article>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Системные настройки" subtitle="В прототипе отображаются ключевые параметры промышленного контура.">
          <div className="settings-list">
            <label>
              <input type="checkbox" defaultChecked /> Требовать подтверждение ИИ-рекомендаций человеком
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Вести аудит действий пользователей
            </label>
            <label>
              <input type="checkbox" defaultChecked /> Показывать качество данных на всех дашбордах
            </label>
            <label>
              <input type="checkbox" /> Автоматически скрывать закрытые события
            </label>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Матрица доступа" subtitle="Логика доступа: руководство видит решения, RM - своих клиентов, риски и комплаенс - события, IT - интеграции.">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Роль</th>
                {accessAreas.map((area) => (
                  <th key={area}>{area}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  {accessAreas.map((area) => (
                    <td key={`${role.id}-${area}`}>{areaAccess(role.name, area)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <div className="two-column">
        <ChartCard title="Журнал аудита и решений" subtitle="Каждое действие фиксируется с владельцем, сигналом и результатом.">
          <div className="compact-list">
            {decisions.map((decision) => (
              <article className="compact-log" key={decision.id}>
                <span>{decision.date} · {decision.owner}</span>
                <strong>{decision.decision}</strong>
                <small>{decision.sourceSignal}</small>
                <StatusBadge value={decision.status} />
              </article>
            ))}
          </div>
        </ChartCard>
        <ChartCard title="Справочник методологии KPI" subtitle="Сложные термины объяснены простым языком для единой интерпретации.">
          <div className="method-list">
            <article>
              <strong>Портфель EXIM</strong>
              <span>Сумма активных продуктов, сделок и обязательств по экспортно-импортным операциям.</span>
            </article>
            <article>
              <strong>Детализация</strong>
              <span>Переход от общего показателя к клиенту, операции, продукту или маршруту.</span>
            </article>
            <article>
              <strong>Прогноз риска</strong>
              <span>Оценка вероятности ухудшения ситуации на горизонте 30 дней по текущим сигналам.</span>
            </article>
            <article>
              <strong>MVP</strong>
              <span>Первая рабочая версия системы с ключевыми функциями мониторинга и рекомендаций.</span>
            </article>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Бюджетные резервы" subtitle="Резерв нужен для ИБ-проверок, интеграций и доработок после пилота.">
        <div className="budget-grid">
          {budgetItems.map((item) => (
            <article className="budget-card" key={item.id}>
              <div className="card-heading inline-heading">
                <h3>{item.name}</h3>
                <StatusBadge value={item.status} />
              </div>
              <strong>{formatMoney(item.planned)}</strong>
              <span>Резерв: {formatMoney(item.reserved)}</span>
            </article>
          ))}
        </div>
      </ChartCard>
    </section>
  );
}

export function DecisionJournal({ decisions }: { decisions: DecisionLog[] }) {
  return (
    <aside className="decision-journal" aria-label="Журнал решений">
      <div className="card-heading inline-heading">
        <h3>Журнал решений</h3>
        <Icon name="log" />
      </div>
      {decisions.slice(0, 5).map((decision) => (
        <article key={decision.id}>
          <span>{decision.date}</span>
          <strong>{decision.decision}</strong>
          <small>{decision.result}</small>
        </article>
      ))}
    </aside>
  );
}

export function ProcessFlow() {
  const steps = [
    "Получены данные",
    "Найден сигнал",
    "Сигнал критичный?",
    "Рекомендация RM",
    "Проверка риска",
    "Нужна эскалация?",
    "Решение руководителя",
    "Действие выполнено",
    "Событие закрыто"
  ];

  return (
    <div className="process-flow">
      {steps.map((step, index) => (
        <div className="process-node" key={step}>
          <b>{index + 1}</b>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductOperationsSummary() {
  return (
    <ChartCard title="Последние операции" subtitle="Финансовые операции в периметре EXIM без реальных банковских данных.">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Клиент</th>
              <th>Продукт</th>
              <th>Страна</th>
              <th>Сумма</th>
              <th>Статус</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.date}</td>
                <td>{transaction.client}</td>
                <td>{transaction.product}</td>
                <td>{transaction.country}</td>
                <td>{formatMoney(transaction.amount)}</td>
                <td>
                  <StatusBadge value={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}

export function PortfolioPlanFact() {
  return (
    <ChartCard title="План-факт по продуктам" subtitle="План и факт в млрд ₸. Чёрная отметка показывает план.">
      <BarChart
        label="План-факт по продуктам"
        items={products.slice(0, 6).map((product) => ({
          label: product.name.split(" ").slice(0, 2).join(" "),
          value: product.fact,
          target: product.plan
        }))}
      />
    </ChartCard>
  );
}

export { seedRecommendations };
