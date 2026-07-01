import type { Client, DecisionLog, RiskEvent } from "../types";
import { formatMoney } from "../utils";
import { LineChart, Sparkline } from "./charts";
import { Icon, StatusBadge } from "./ui";

export function ClientDetailPanel({
  client,
  decisions,
  onClose
}: {
  client: Client | null;
  decisions: DecisionLog[];
  onClose: () => void;
}) {
  if (!client) return null;

  return (
    <aside className="detail-panel" aria-label="Карточка клиента">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Профиль клиента</span>
          <h2>{client.name}</h2>
          <p>
            {client.segment} · {client.industry} · {client.country}
          </p>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Закрыть карточку клиента">
          <Icon name="close" />
        </button>
      </div>

      <div className="panel-grid">
        <div className="panel-stat">
          <span>Портфель</span>
          <strong>{formatMoney(client.portfolioVolume)}</strong>
        </div>
        <div className="panel-stat">
          <span>Доход</span>
          <strong>{formatMoney(client.income)}</strong>
        </div>
        <div className="panel-stat">
          <span>Скоринг</span>
          <strong>{client.clientScore}/100</strong>
        </div>
        <div className="panel-stat">
          <span>Потенциал</span>
          <strong>{client.potentialScore}/100</strong>
        </div>
      </div>

      <div className="panel-section">
        <h3>Текущие продукты</h3>
        <div className="chip-list">
          {client.products.map((product) => (
            <span key={product}>{product}</span>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Оборот за 7 месяцев</h3>
        <LineChart
          labels={["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл"]}
          series={client.turnover}
          label={`Динамика оборота клиента ${client.name}`}
          unit=""
          height={180}
        />
      </div>

      <div className="panel-section">
        <h3>Индикаторы риска</h3>
        <ul className="signal-list">
          {client.riskIndicators.map((indicator) => (
            <li key={indicator}>
              <span />
              {indicator}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel-section">
        <h3>Связанная цепочка</h3>
        <p>{client.supplyChain}</p>
      </div>

      <div className="panel-section action-panel">
        <h3>Рекомендованное действие</h3>
        <p>{client.recommendedAction}</p>
        <button className="primary-button">
          <Icon name="log" /> Создать запись решения
        </button>
      </div>

      <div className="panel-section">
        <h3>История решений</h3>
        {decisions.slice(0, 3).map((decision) => (
          <article className="compact-log" key={decision.id}>
            <span>{decision.date}</span>
            <strong>{decision.decision}</strong>
            <small>{decision.result}</small>
          </article>
        ))}
      </div>
    </aside>
  );
}

export function RiskDetailPanel({
  risk,
  onClose,
  onDecision
}: {
  risk: RiskEvent | null;
  onClose: () => void;
  onDecision: (risk: RiskEvent) => void;
}) {
  if (!risk) return null;

  return (
    <aside className="detail-panel" aria-label="Карточка риска">
      <div className="panel-header">
        <div>
          <span className="panel-kicker">Событие риска</span>
          <h2>{risk.title}</h2>
          <p>{risk.category}</p>
        </div>
        <button className="icon-button" onClick={onClose} aria-label="Закрыть карточку риска">
          <Icon name="close" />
        </button>
      </div>

      <div className="panel-grid">
        <div className="panel-stat">
          <span>Вероятность</span>
          <strong>{risk.probability}/5</strong>
        </div>
        <div className="panel-stat">
          <span>Влияние</span>
          <strong>{risk.impact}/3</strong>
        </div>
        <div className="panel-stat">
          <span>Критичность</span>
          <StatusBadge value={risk.severity} />
        </div>
        <div className="panel-stat">
          <span>Статус</span>
          <StatusBadge value={risk.status} />
        </div>
      </div>

      <div className="panel-section">
        <h3>Фактор риска</h3>
        <p>{risk.factor}</p>
      </div>

      <div className="panel-section">
        <h3>Ответственный</h3>
        <p>
          {risk.owner} · обнаружено {risk.detectedAt} · источник: {risk.source}
        </p>
      </div>

      {risk.affectedClient ? (
        <div className="panel-section">
          <h3>Затронутый клиент</h3>
          <p>{risk.affectedClient}</p>
        </div>
      ) : null}

      <div className="panel-section action-panel">
        <h3>Рекомендованная реакция</h3>
        <p>{risk.recommendation}</p>
        <div className="button-row">
          <button className="primary-button" onClick={() => onDecision(risk)}>
            <Icon name="log" /> Записать решение
          </button>
          <button className="secondary-button">
            <Icon name="arrow" /> Эскалировать
          </button>
        </div>
      </div>
    </aside>
  );
}

export function ClientMiniTrend({ values }: { values: number[] }) {
  return (
    <div className="mini-trend">
      <Sparkline values={values} />
      <span>{values[values.length - 1].toFixed(1)}</span>
    </div>
  );
}
