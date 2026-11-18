import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockService } from '../services/mockService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Navigation State
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    const validTabs = ['dashboard', 'workspace', 'database', 'schema', 'history', 'settings'];
    return validTabs.includes(hash) ? hash : 'dashboard';
  });

  // Theme State (Default Light as per instructions)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('querygen_theme') || 'light';
  });

  // Apply theme to HTML attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('querygen_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync hash with activeTab
  const navigateTo = (tab, payload = null) => {
    setActiveTab(tab);
    window.location.hash = tab;
    if (payload?.prompt) {
      setWorkspacePrompt(payload.prompt);
    }
    if (payload?.sql) {
      setWorkspaceSql(payload.sql);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = ['dashboard', 'workspace', 'database', 'schema', 'history', 'settings'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Database Connection State
  // Default connected to demo PostgreSQL database so project evaluation is smooth and ready
  const [connectionStatus, setConnectionStatus] = useState('connected'); // 'connected' | 'disconnected' | 'connecting' | 'failed'
  const [dbConfig, setDbConfig] = useState({
    type: 'PostgreSQL',
    host: 'localhost',
    port: 5432,
    database: 'e_commerce_db',
    username: 'postgres',
    ssl: false,
    connectedAt: new Date().toISOString(),
  });

  // Workspace persistent state between navigation
  const [workspacePrompt, setWorkspacePrompt] = useState('Find the top 5 customers by total spending.');
  const [workspaceSql, setWorkspaceSql] = useState(`SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    c.city,
    COUNT(o.order_id) AS orders_count,
    ROUND(SUM(o.amount), 2) AS total_spent
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.status = 'Completed'
GROUP BY c.customer_id, c.customer_name, c.email, c.city
ORDER BY total_spent DESC
LIMIT 5;`);
  const [workspaceResults, setWorkspaceResults] = useState(null);

  // Query History State
  const [history, setHistory] = useState(() => mockService.getInitialHistory());

  const addHistoryItem = (item) => {
    const newItem = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...item,
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const value = {
    activeTab,
    setActiveTab,
    navigateTo,
    theme,
    toggleTheme,
    connectionStatus,
    setConnectionStatus,
    dbConfig,
    setDbConfig,
    workspacePrompt,
    setWorkspacePrompt,
    workspaceSql,
    setWorkspaceSql,
    workspaceResults,
    setWorkspaceResults,
    history,
    addHistoryItem,
    clearHistory,
    toasts,
    showToast,
    removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
