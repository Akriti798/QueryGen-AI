import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Terminal,
  Database,
  TableProperties,
  History,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Server,
  Zap,
} from 'lucide-react';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
  const { activeTab, navigateTo, connectionStatus, dbConfig } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace', label: 'Query Workspace', icon: Terminal, badge: 'Core' },
    { id: 'database', label: 'Database Connection', icon: Database },
    { id: 'schema', label: 'Schema Explorer', icon: TableProperties },
    { id: 'history', label: 'Query History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (tabId) => {
    navigateTo(tabId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileOpen(false)} />
      )}

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="brand-container" onClick={() => handleNavClick('dashboard')}>
            <div className="brand-logo-icon">
              <Database size={20} className="logo-db" />
              <Sparkles size={11} className="logo-sparkle" />
            </div>
            {!isCollapsed && (
              <div className="brand-text">
                <span className="brand-title">QueryGen <span className="brand-ai">AI</span></span>
                <span className="brand-tagline">Text-to-SQL Studio</span>
              </div>
            )}
          </div>

          <button
            type="button"
            className="collapse-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label="Toggle sidebar collapse"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">
            {!isCollapsed ? 'MAIN MENU' : '•••'}
          </div>

          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="nav-item">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <Icon size={19} className="nav-icon" />
                    {!isCollapsed && (
                      <span className="nav-label">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Database Quick Status Card in Sidebar Footer */}
        <div className="sidebar-footer">
          <div
            className={`db-status-widget ${connectionStatus === 'connected' ? 'connected' : 'disconnected'}`}
            onClick={() => handleNavClick('database')}
            title="Click to view database connection details"
          >
            <div className="db-widget-icon">
              <Server size={17} />
              <span className={`db-pulse-dot ${connectionStatus}`} />
            </div>
            {!isCollapsed && (
              <div className="db-widget-content">
                <span className="db-widget-title">
                  {connectionStatus === 'connected' ? dbConfig.database : 'No Database'}
                </span>
                <span className="db-widget-sub">
                  {connectionStatus === 'connected' ? `${dbConfig.host}:${dbConfig.port}` : 'Click to connect'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="demo-banner">
              <Zap size={13} className="demo-icon" />
              <span>B.Tech Major Project • Demo Mode</span>
            </div>
          )}
        </div>
      </aside>

      <style>{`
        .sidebar {
          width: 260px;
          background-color: var(--bg-sidebar);
          border-right: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width var(--transition-normal);
          position: sticky;
          top: 0;
          height: 100vh;
          z-index: 50;
        }
        .sidebar.collapsed {
          width: 78px;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border-default);
          height: 70px;
        }
        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
          min-width: 0;
        }
        .brand-logo-icon {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
        }
        .logo-sparkle {
          position: absolute;
          top: 4px;
          right: 4px;
          color: #fde047;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
          overflow: hidden;
        }
        .brand-title {
          font-size: 1.125rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }
        .brand-ai {
          background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .brand-tagline {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .collapse-toggle-btn {
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-muted);
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
        }
        .collapse-toggle-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-card-subtle);
          border-color: var(--border-dark);
        }
        .sidebar-nav {
          flex: 1;
          padding: 1rem 0.75rem;
          overflow-y: auto;
        }
        .nav-section-label {
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.08em;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.25rem;
        }
        .nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .nav-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.65rem 0.75rem;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }
        .nav-link:hover {
          background-color: var(--bg-card-subtle);
          color: var(--text-primary);
        }
        .nav-link.active {
          background-color: var(--primary-light);
          color: var(--primary);
        }
        .nav-icon {
          flex-shrink: 0;
        }
        .nav-label {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-badge {
          font-size: 0.6875rem;
          font-weight: 700;
          padding: 0.125rem 0.4rem;
          border-radius: var(--radius-sm);
          background-color: var(--primary);
          color: white;
          text-transform: uppercase;
        }
        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid var(--border-default);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .db-status-widget {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .db-status-widget:hover {
          border-color: var(--border-dark);
          box-shadow: var(--shadow-xs);
        }
        .db-widget-icon {
          position: relative;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background-color: var(--bg-card);
          border: 1px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
        }
        .db-pulse-dot {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 2px solid var(--bg-sidebar);
        }
        .db-pulse-dot.connected {
          background-color: var(--success);
        }
        .db-pulse-dot.disconnected {
          background-color: var(--danger);
        }
        .db-pulse-dot.connecting {
          background-color: var(--warning);
        }
        .db-widget-content {
          display: flex;
          flex-direction: column;
          overflow: hidden;
          line-height: 1.25;
        }
        .db-widget-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .db-widget-sub {
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .demo-banner {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-weight: 600;
          justify-content: center;
          padding: 0.25rem 0;
        }
        .demo-icon {
          color: #f59e0b;
        }
        .mobile-backdrop {
          display: none;
        }

        @media (max-width: 900px) {
          .sidebar {
            position: fixed;
            left: -270px;
            top: 0;
            bottom: 0;
            z-index: 100;
            box-shadow: var(--shadow-xl);
          }
          .sidebar.mobile-open {
            left: 0;
          }
          .mobile-backdrop {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(2px);
            z-index: 90;
          }
        }
      `}</style>
    </>
  );
}
