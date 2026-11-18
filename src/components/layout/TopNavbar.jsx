import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Menu,
  Sun,
  Moon,
  Database,
  Terminal,
  ShieldCheck,
  User,
  Radio,
} from 'lucide-react';
import Badge from '../common/Badge';

export default function TopNavbar({ onMenuClick }) {
  const { activeTab, navigateTo, theme, toggleTheme, connectionStatus, dbConfig } = useApp();

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Dashboard', sub: 'Overview & Recent AI Query Activity' };
      case 'workspace':
        return { title: 'Query Workspace', sub: 'Natural Language to SQL Generation & Execution' };
      case 'database':
        return { title: 'Database Connection', sub: 'PostgreSQL Connection Management & Health' };
      case 'schema':
        return { title: 'Schema Explorer', sub: 'Interactive Tables, Keys & Introspection' };
      case 'history':
        return { title: 'Query History', sub: 'Audit Trail of Generated & Executed Queries' };
      case 'settings':
        return { title: 'Settings', sub: 'Application Configuration & Backend API Status' };
      default:
        return { title: 'QueryGen AI', sub: 'Text-to-SQL Studio' };
    }
  };

  const pageInfo = getPageTitle(activeTab);

  const getConnectionBadgeVariant = (status) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'connecting':
        return 'warning';
      case 'failed':
      case 'disconnected':
        return 'danger';
      default:
        return 'neutral';
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-left">
        <button
          type="button"
          onClick={onMenuClick}
          className="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="navbar-page-info">
          <h1 className="navbar-title">{pageInfo.title}</h1>
          <span className="navbar-subtitle">{pageInfo.sub}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* DB Connection Status Badge */}
        <div
          className="db-status-pill-container"
          onClick={() => navigateTo('database')}
          title="Click to view database connection status"
        >
          <Badge
            variant={getConnectionBadgeVariant(connectionStatus)}
            dot={true}
            className="navbar-status-badge"
          >
            <Database size={13} />
            <span>
              {connectionStatus === 'connected'
                ? `PostgreSQL (${dbConfig.database})`
                : connectionStatus === 'connecting'
                ? 'Connecting...'
                : 'Not Connected'}
            </span>
          </Badge>
        </div>

        {/* Demo Mode Pill */}
        <div className="mode-pill" title="QueryGen AI is operating in Client Demo Mode for Major Project evaluation">
          <Radio size={12} className="mode-pulse-icon" />
          <span>Demo Mode</span>
        </div>

        {/* Quick Action: New Query */}
        {activeTab !== 'workspace' && (
          <button
            type="button"
            onClick={() => navigateTo('workspace')}
            className="btn btn-primary btn-sm navbar-cta"
            title="Open Query Workspace"
          >
            <Terminal size={14} />
            <span className="navbar-cta-text">New Query</span>
          </button>
        )}

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="navbar-icon-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* User Profile Avatar Placeholder */}
        <div className="user-profile-widget" title="Demo Operator • B.Tech Major Project">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div className="user-details">
            <span className="user-name">Major Project</span>
            <span className="user-role">Lead Evaluator</span>
          </div>
        </div>
      </div>

      <style>{`
        .top-navbar {
          height: 70px;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-default);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 40;
          box-shadow: var(--shadow-xs);
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-primary);
          padding: 0.4rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
        }
        .navbar-page-info {
          display: flex;
          flex-direction: column;
        }
        .navbar-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.2;
        }
        .navbar-subtitle {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .db-status-pill-container {
          cursor: pointer;
          user-select: none;
          transition: transform var(--transition-fast);
        }
        .db-status-pill-container:hover {
          transform: translateY(-1px);
        }
        .navbar-status-badge {
          cursor: pointer;
          font-size: 0.75rem;
          padding: 0.35rem 0.75rem;
        }
        .mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.65rem;
          border-radius: 9999px;
          background-color: var(--accent-purple-light);
          color: var(--accent-purple);
          border: 1px solid rgba(124, 58, 237, 0.2);
          font-size: 0.75rem;
          font-weight: 700;
        }
        .mode-pulse-icon {
          animation: pulse 1.5s infinite;
        }
        .navbar-cta {
          display: inline-flex;
        }
        .navbar-icon-btn {
          background: transparent;
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .navbar-icon-btn:hover {
          background-color: var(--bg-card-subtle);
          color: var(--text-primary);
          border-color: var(--border-dark);
        }
        .user-profile-widget {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding-left: 0.5rem;
          border-left: 1px solid var(--border-default);
          cursor: pointer;
        }
        .user-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8125rem;
        }
        .user-details {
          display: flex;
          flex-direction: column;
          line-height: 1.2;
        }
        .user-name {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .user-role {
          font-size: 0.6875rem;
          color: var(--text-muted);
        }

        @media (max-width: 900px) {
          .top-navbar {
            padding: 0 1rem;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .navbar-subtitle,
          .user-details,
          .navbar-cta-text {
            display: none;
          }
          .mode-pill {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
