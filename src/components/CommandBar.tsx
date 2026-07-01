import React, { useState, useEffect, useRef } from "react";
import type { Client, RiskEvent, Product, Route } from "../types";

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  risks: RiskEvent[];
  products: Product[];
  routes: Route[];
  onOpenClient: (client: Client) => void;
  onOpenRisk: (risk: RiskEvent) => void;
  onSwitchSection: (sectionId: any) => void;
  toggleTheme: () => void;
  generateCriticalRisk: () => void;
  generateManualDecision: () => void;
}

export function CommandBar({
  isOpen,
  onClose,
  clients,
  risks,
  products,
  routes,
  onOpenClient,
  onOpenRisk,
  onSwitchSection,
  toggleTheme,
  generateCriticalRisk,
  generateManualDecision
}: CommandBarProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle escape and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build items lists
  const staticCommands = [
    { type: "cmd", title: "Переключить темную/светлую тему", action: () => { toggleTheme(); onClose(); } },
    { type: "cmd", title: "Сгенерировать критическое событие риска", action: () => { generateCriticalRisk(); onClose(); } },
    { type: "cmd", title: "Записать экстренное решение по лимитам", action: () => { generateManualDecision(); onClose(); } },
    { type: "cmd", title: "Открыть журнал решений и аудит", action: () => { onSwitchSection("decisions"); onClose(); } },
    { type: "cmd", title: "Открыть панель качества данных", action: () => { onSwitchSection("data"); onClose(); } }
  ];

  const filteredClients = clients
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 4);

  const filteredRisks = risks
    .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 4);

  const filteredProducts = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 4);

  const filteredCmds = staticCommands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = [
    ...filteredCmds.map((item) => ({ ...item, category: "Команды и Действия" })),
    ...filteredClients.map((item) => ({ type: "client", title: item.name, category: "Клиентские Группы", original: item })),
    ...filteredRisks.map((item) => ({ type: "risk", title: item.title, category: "События Риска", original: item })),
    ...filteredProducts.map((item) => ({ type: "product", title: item.name, category: "EXIM Продукты", original: item }))
  ];

  const handleSelectItem = (item: any) => {
    if (item.type === "cmd") {
      item.action?.();
    } else if (item.type === "client" && item.original) {
      onOpenClient(item.original as any);
      onClose();
    } else if (item.type === "risk" && item.original) {
      onOpenRisk(item.original as any);
      onClose();
    } else if (item.type === "product") {
      onSwitchSection("portfolio");
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(totalItems.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + totalItems.length) % Math.max(totalItems.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = totalItems[selectedIndex];
      if (selected) {
        handleSelectItem(selected);
      }
    }
  };

  let lastCategory = "";

  return (
    <div className="cmd-scrim" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()} onKeyDown={handleKeyDown}>
        <div className="cmd-input-wrap">
          <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск клиентов, рисков, продуктов или команд..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
          />
        </div>

        <div className="cmd-results">
          {totalItems.length > 0 ? (
            <div>
              {totalItems.map((item, idx) => {
                const showCat = item.category !== lastCategory;
                lastCategory = item.category;
                return (
                  <div key={`${item.type}-${idx}`}>
                    {showCat && <div className="cmd-group-title">{item.category}</div>}
                    <button
                      className={`cmd-item ${idx === selectedIndex ? "selected" : ""}`}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                    >
                      <span>{item.title}</span>
                      <small>
                        {item.type === "cmd" ? "Выполнить" : item.type === "client" ? "Открыть профиль" : "Перейти"}
                      </small>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Ничего не найдено по запросу "{search}"
            </div>
          )}
        </div>

        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> Навигация</span>
          <span><kbd>Enter</kbd> Выбрать</span>
          <span><kbd>ESC</kbd> Закрыть</span>
        </div>
      </div>
    </div>
  );
}
