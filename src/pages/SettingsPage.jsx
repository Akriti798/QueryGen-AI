import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Sun,
  Moon,
  Database,
  Sliders,
  CheckCircle2,
  Info,
  Server,
  Code2,
  Cpu,
  Layers,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme, dbConfig, showToast } = useApp();

  // Basic query execution preferences
  const [preferences, setPreferences] = useState({
    defaultTimeoutSec: 30,
    maxRowsLimit: 100,
    autoFormatSql: true,
    enableExplainPlan: false,
    readOnlyEnforcement: true,
  });

  const handleTogglePreference = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    showToast('Preference updated', 'info', 2000);
  };

  const handleSavePreferences = (e) => {
    e.preventDefault();
    showToast('Application preferences saved', 'success');
  };

  return (
    <div className="settings-page">
      {/* Header Card */}
      <div className="card settings-hero-card">
        <div className="hero-icon-box">
          <Settings size={22} />
        </div>
        <div>
          <h2 className="settings-title">System Settings & Configuration</h2>
          <p className="settings-sub">
            Query preferences, visual theme, database defaults, and backend integration parameters
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* Left Column: Preferences Form */}
        <div className="settings-main-col">
          {/* Card 1: Appearance & Theme */}
          <div className="card settings-card">
            <div className="card-header">
              <h3 className="section-title">Interface Appearance</h3>
              <span className="section-hint">Customize theme colors and layout</span>
            </div>

            <div className="theme-toggle-row">
              <div className="theme-text">
                <span className="theme-name">Current Theme: {theme === 'light' ? 'Light Theme (Default)' : 'Dark Theme'}</span>
                <span className="theme-sub">High-contrast, professional developer interface</span>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="btn btn-secondary btn-sm"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={15} />
                    <span>Switch to Dark</span>
                  </>
                ) : (
                  <>
                    <Sun size={15} />
                    <span>Switch to Light</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Card 2: Query Execution Preferences */}
          <div className="card settings-card">
            <div className="card-header">
              <h3 className="section-title">Query Execution Safety</h3>
              <span className="section-hint">Default parameters enforced on generated SQL</span>
            </div>

            <form onSubmit={handleSavePreferences} className="settings-form">
              <div className="form-group">
                <label className="form-label">
                  Max Result Rows Limit (LIMIT clause default)
                  <span className="form-hint">Prevents memory overflow in browser table</span>
                </label>
                <select
                  className="form-control"
                  value={preferences.maxRowsLimit}
                  onChange={(e) => setPreferences({ ...preferences, maxRowsLimit: Number(e.target.value) })}
                >
                  <option value={25}>25 rows</option>
                  <option value={50}>50 rows</option>
                  <option value={100}>100 rows (Default)</option>
                  <option value={500}>500 rows</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Query Execution Timeout
                  <span className="form-hint">Maximum seconds before aborting long-running queries</span>
                </label>
                <select
                  className="form-control"
                  value={preferences.defaultTimeoutSec}
                  onChange={(e) => setPreferences({ ...preferences, defaultTimeoutSec: Number(e.target.value) })}
                >
                  <option value={10}>10 seconds</option>
                  <option value={30}>30 seconds (Default)</option>
                  <option value={60}>60 seconds</option>
                </select>
              </div>

              <div className="toggle-list">
                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Strict Read-Only SELECT Mode</span>
                    <span className="toggle-desc">Blocks destructive INSERT, UPDATE, DELETE, and DROP queries</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.readOnlyEnforcement}
                    onChange={() => handleTogglePreference('readOnlyEnforcement')}
                    className="toggle-checkbox"
                  />
                </label>

                <label className="toggle-row">
                  <div className="toggle-info">
                    <span className="toggle-label">Auto-Format Generated SQL</span>
                    <span className="toggle-desc">Automatically format SQL keywords in UPPERCASE with indentation</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoFormatSql}
                    onChange={() => handleTogglePreference('autoFormatSql')}
                    className="toggle-checkbox"
                  />
                </label>
              </div>

              <div className="form-submit-row">
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={14} />
                  <span>Save Preferences</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: App Information & FastAPI Backend Roadmap */}
        <div className="settings-side-col">
          {/* Card 3: App Information */}
          <div className="card info-card">
            <h4 className="info-title">
              <Code2 size={16} className="text-primary" />
              <span>Project Information</span>
            </h4>
            <div className="info-table">
              <div className="info-row">
                <span className="info-k">Application:</span>
                <span className="info-v font-bold">QueryGen AI</span>
              </div>
              <div className="info-row">
                <span className="info-k">Release Version:</span>
                <span className="info-v font-mono">v1.0.0 (Major Project)</span>
              </div>
              <div className="info-row">
                <span className="info-k">Frontend Framework:</span>
                <span className="info-v font-mono">React 18 + Vite (JS)</span>
              </div>
              <div className="info-row">
                <span className="info-k">Target Backend:</span>
                <span className="info-v font-mono">Python / FastAPI</span>
              </div>
              <div className="info-row">
                <span className="info-k">AI Pipeline:</span>
                <span className="info-v">LLMs + LangChain + SQL</span>
              </div>
              <div className="info-row">
                <span className="info-k">Database Target:</span>
                <span className="info-v">PostgreSQL 14+</span>
              </div>
              <div className="info-row">
                <span className="info-k">Operating Mode:</span>
                <span className="info-v badge badge-info">Client Demo Mode</span>
              </div>
            </div>
          </div>

          {/* Card 4: Backend Contract Specifications */}
          <div className="card backend-contract-card">
            <h4 className="info-title">
              <Server size={16} className="text-primary" />
              <span>FastAPI Endpoints Contract</span>
            </h4>
            <p className="contract-intro">
              The frontend is already configured to consume the following REST endpoints once the FastAPI backend is launched:
            </p>
            <div className="endpoints-list">
              <div className="endpoint-item">
                <span className="method-pill post">POST</span>
                <span className="endpoint-url">/api/v1/database/test</span>
              </div>
              <div className="endpoint-item">
                <span className="method-pill post">POST</span>
                <span className="endpoint-url">/api/v1/database/connect</span>
              </div>
              <div className="endpoint-item">
                <span className="method-pill get">GET</span>
                <span className="endpoint-url">/api/v1/database/schema</span>
              </div>
              <div className="endpoint-item">
                <span className="method-pill post">POST</span>
                <span className="endpoint-url">/api/v1/query/generate</span>
              </div>
              <div className="endpoint-item">
                <span className="method-pill post">POST</span>
                <span className="endpoint-url">/api/v1/query/execute</span>
              </div>
              <div className="endpoint-item">
                <span className="method-pill get">GET</span>
                <span className="endpoint-url">/api/v1/query/history</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-hero-card {
          padding: 1.5rem 1.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hero-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .settings-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .settings-sub {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
        .settings-main-col,
        .settings-side-col {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .settings-card,
        .info-card,
        .backend-contract-card {
          padding: 1.5rem;
        }
        .card-header {
          margin-bottom: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-default);
        }
        .section-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .section-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .theme-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
        }
        .theme-text {
          display: flex;
          flex-direction: column;
        }
        .theme-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .theme-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-default);
        }
        .toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
        }
        .toggle-info {
          display: flex;
          flex-direction: column;
        }
        .toggle-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .toggle-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .toggle-checkbox {
          width: 18px;
          height: 18px;
          accent-color: var(--primary);
          cursor: pointer;
        }
        .form-submit-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.25rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-default);
        }
        .info-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .info-table {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .info-k {
          color: var(--text-muted);
        }
        .info-v {
          color: var(--text-primary);
        }
        .contract-intro {
          font-size: 0.78rem;
          color: var(--text-secondary);
          margin-bottom: 0.85rem;
          line-height: 1.4;
        }
        .endpoints-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .endpoint-item {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.45rem 0.65rem;
          background-color: var(--bg-card-subtle);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          border: 1px solid var(--border-default);
        }
        .method-pill {
          padding: 0.125rem 0.35rem;
          border-radius: var(--radius-sm);
          font-weight: 800;
          font-size: 0.6875rem;
        }
        .method-pill.get {
          background-color: #dbeafe;
          color: #1d4ed8;
        }
        .method-pill.post {
          background-color: #d1fae5;
          color: #047857;
        }
        .endpoint-url {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
