import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { testDatabaseConnection, connectDatabase, disconnectDatabase } from '../services/api';
import {
  Database,
  Server,
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  Power,
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function DatabaseConnectionPage() {
  const { connectionStatus, setConnectionStatus, dbConfig, setDbConfig, showToast } = useApp();

  // Form state (Password is kept strictly in local component memory, never saved to localStorage!)
  const [formData, setFormData] = useState({
    type: 'PostgreSQL',
    host: dbConfig.host || 'localhost',
    port: dbConfig.port || 5432,
    database: dbConfig.database || 'e_commerce_db',
    username: dbConfig.username || 'postgres',
    password: '••••••••••', // Placeholder mask
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Test Connection
  const handleTestConnection = async (e) => {
    e?.preventDefault();
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await testDatabaseConnection(formData);
      setTestResult(res);
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Connection test failed' });
      showToast('Connection test failed', 'error');
    } finally {
      setIsTesting(false);
    }
  };

  // Connect Database
  const handleConnect = async (e) => {
    e?.preventDefault();
    if (!formData.host || !formData.database || !formData.username) {
      showToast('Please specify host, database name and username', 'warning');
      return;
    }

    setIsConnecting(true);
    setConnectionStatus('connecting');

    try {
      const res = await connectDatabase(formData);
      if (res.success) {
        setDbConfig({
          type: 'PostgreSQL',
          host: formData.host,
          port: Number(formData.port),
          database: formData.database,
          username: formData.username,
          ssl: false,
          connectedAt: new Date().toISOString(),
        });
        setConnectionStatus('connected');
        showToast(`Connected to PostgreSQL database "${formData.database}"`, 'success');
      } else {
        setConnectionStatus('failed');
        showToast(res.message || 'Connection failed', 'error');
      }
    } catch (err) {
      setConnectionStatus('failed');
      showToast(err.message || 'Connection error', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect Database
  const handleDisconnect = async () => {
    try {
      await disconnectDatabase();
      setConnectionStatus('disconnected');
      showToast('Database disconnected safely', 'info');
    } catch (err) {
      showToast(err.message || 'Disconnection error', 'error');
    }
  };

  // Quick Preset Helper for College Project Demo
  const loadDemoPreset = () => {
    setFormData({
      type: 'PostgreSQL',
      host: 'localhost',
      port: 5432,
      database: 'e_commerce_db',
      username: 'postgres',
      password: 'demo_secure_pass_2026',
    });
    showToast('Loaded demo e-commerce database credentials', 'info');
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="success" dot>Connected</Badge>;
      case 'connecting':
        return <Badge variant="warning" dot>Connecting...</Badge>;
      case 'failed':
        return <Badge variant="danger" dot>Connection Failed</Badge>;
      default:
        return <Badge variant="neutral" dot>Not Connected</Badge>;
    }
  };

  return (
    <div className="db-page">
      {/* Active Status Overview Banner */}
      <div className={`card status-hero ${connectionStatus}`}>
        <div className="status-hero-left">
          <div className="status-icon-bubble">
            <Server size={24} />
          </div>
          <div className="status-hero-text">
            <div className="status-title-row">
              <h2 className="status-title">
                {connectionStatus === 'connected'
                  ? `Connected to ${dbConfig.database}`
                  : connectionStatus === 'connecting'
                  ? 'Establishing Database Handshake...'
                  : connectionStatus === 'failed'
                  ? 'Connection Attempt Failed'
                  : 'PostgreSQL Database Offline'}
              </h2>
              {getStatusBadge()}
            </div>
            <p className="status-description">
              {connectionStatus === 'connected'
                ? `Active session on ${dbConfig.host}:${dbConfig.port} via user ${dbConfig.username}. Mock demo pool running.`
                : 'Connect to an existing PostgreSQL database instance to enable schema introspection and query execution.'}
            </p>
          </div>
        </div>

        <div className="status-hero-actions">
          {connectionStatus === 'connected' ? (
            <button
              type="button"
              onClick={handleDisconnect}
              className="btn btn-danger btn-sm"
            >
              <Power size={14} />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={loadDemoPreset}
              className="btn btn-secondary btn-sm"
              title="Populate recommended sample database connection credentials"
            >
              <Zap size={14} />
              <span>Use Demo Preset</span>
            </button>
          )}
        </div>
      </div>

      <div className="db-layout-grid">
        {/* Left Column: Connection Form Card */}
        <div className="card connection-form-card">
          <div className="card-header-bar">
            <div className="header-title-box">
              <Database size={18} className="text-primary" />
              <div>
                <h3 className="card-heading">PostgreSQL Connection Parameters</h3>
                <span className="card-sub">Configure connection credentials for your database engine</span>
              </div>
            </div>
            <span className="badge badge-info">v16.x Compatible</span>
          </div>

          <form onSubmit={handleConnect} className="connection-form">
            {/* Database Engine Type */}
            <div className="form-group">
              <label className="form-label">
                Database Engine Type
                <span className="form-hint">Standard ANSI SQL</span>
              </label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                <option value="PostgreSQL">PostgreSQL (Primary Supported Engine)</option>
              </select>
            </div>

            {/* Host and Port Row */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">
                  Host / Server Address
                  <span className="form-hint">e.g. localhost or RDS</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="localhost"
                  value={formData.host}
                  onChange={(e) => handleInputChange('host', e.target.value)}
                  required
                />
              </div>

              <div className="form-group form-group-sm">
                <label className="form-label">
                  Port
                  <span className="form-hint">Default: 5432</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="5432"
                  value={formData.port}
                  onChange={(e) => handleInputChange('port', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Database Name */}
            <div className="form-group">
              <label className="form-label">
                Database Name
                <span className="form-hint">Target catalogue</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e_commerce_db"
                value={formData.database}
                onChange={(e) => handleInputChange('database', e.target.value)}
                required
              />
            </div>

            {/* Username & Password */}
            <div className="form-row-2">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="postgres"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control password-input"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Test Connection Output Alert */}
            {testResult && (
              <div className={`test-feedback-box ${testResult.success ? 'success' : 'error'}`}>
                {testResult.success ? (
                  <CheckCircle2 size={16} className="text-success flex-shrink-0" />
                ) : (
                  <XCircle size={16} className="text-danger flex-shrink-0" />
                )}
                <div className="feedback-content">
                  <span className="feedback-message">{testResult.message}</span>
                  {testResult.latencyMs && (
                    <span className="feedback-latency">Ping: {testResult.latencyMs}ms • {testResult.serverVersion}</span>
                  )}
                </div>
              </div>
            )}

            {/* Form Action Buttons */}
            <div className="form-actions-toolbar">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="btn btn-secondary"
              >
                <RotateCw size={14} className={isTesting ? 'animate-spin' : ''} />
                <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
              </button>

              {connectionStatus === 'connected' ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="btn btn-danger"
                >
                  <Power size={15} />
                  <span>Disconnect Database</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isConnecting}
                  className="btn btn-primary"
                >
                  <Database size={15} className={isConnecting ? 'animate-spin' : ''} />
                  <span>{isConnecting ? 'Connecting...' : 'Connect Database'}</span>
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Connection Diagnostics & Security Guidelines */}
        <div className="db-side-info">
          {/* Active Session Diagnostics */}
          <div className="card diagnostics-card">
            <h4 className="diagnostics-title">
              <Layers size={16} className="text-primary" />
              <span>Active Session Telemetry</span>
            </h4>
            <div className="diagnostics-list">
              <div className="diag-row">
                <span className="diag-label">Dialect:</span>
                <span className="diag-val">PostgreSQL 16.2</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Host:</span>
                <span className="diag-val">{dbConfig.host}</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Port:</span>
                <span className="diag-val">{dbConfig.port}</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Active Database:</span>
                <span className="diag-val font-semibold">{dbConfig.database}</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Auth Principal:</span>
                <span className="diag-val">{dbConfig.username}</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">Connection Pool:</span>
                <span className="diag-val">10 Max (Demo Mode)</span>
              </div>
              <div className="diag-row">
                <span className="diag-label">SSL Mode:</span>
                <span className="diag-val">prefer / unencrypted (local)</span>
              </div>
            </div>
          </div>

          {/* Security Notice Card */}
          <div className="card security-notice-card">
            <div className="sec-header">
              <ShieldCheck size={18} className="text-success" />
              <h4 className="sec-title">Security & Credential Integrity</h4>
            </div>
            <ul className="sec-points">
              <li>
                <strong>Zero Local Storage:</strong> Database passwords are never written to localStorage or cookies.
              </li>
              <li>
                <strong>Read-Only Sandbox:</strong> Generated SQL queries default strictly to non-destructive SELECT operations.
              </li>
              <li>
                <strong>Backend Security Decoupled:</strong> Actual authentication and query authorization will be enforced inside the FastAPI backend.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .db-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .status-hero {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.75rem 2rem;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .status-hero.connected {
          border-left: 5px solid var(--success);
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-card) 100%);
        }
        .status-hero.disconnected,
        .status-hero.failed {
          border-left: 5px solid var(--danger);
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, var(--bg-card) 100%);
        }
        .status-hero.connecting {
          border-left: 5px solid var(--warning);
        }
        .status-hero-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .status-icon-bubble {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .status-hero.connected .status-icon-bubble {
          background-color: var(--success-bg);
          color: var(--success);
        }
        .status-hero.disconnected .status-icon-bubble {
          background-color: var(--danger-bg);
          color: var(--danger);
        }
        .status-title-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
        }
        .status-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .status-description {
          font-size: 0.84rem;
          color: var(--text-secondary);
          max-width: 600px;
        }
        .db-layout-grid {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.5rem;
        }
        @media (max-width: 1024px) {
          .db-layout-grid {
            grid-template-columns: 1fr;
          }
        }
        .connection-form-card {
          padding: 1.75rem;
        }
        .card-header-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-default);
          margin-bottom: 1.5rem;
        }
        .header-title-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .card-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .card-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
        }
        .form-group-sm {
          min-width: 90px;
        }
        .password-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .password-input {
          padding-right: 2.5rem;
        }
        .password-toggle-btn {
          position: absolute;
          right: 0.75rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }
        .password-toggle-btn:hover {
          color: var(--text-primary);
        }
        .test-feedback-box {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          margin-bottom: 1.25rem;
        }
        .test-feedback-box.success {
          background-color: var(--success-bg);
          border: 1px solid var(--success-border);
          color: var(--success-text);
        }
        .test-feedback-box.error {
          background-color: var(--danger-bg);
          border: 1px solid var(--danger-border);
          color: var(--danger-text);
        }
        .feedback-content {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .feedback-message {
          font-weight: 600;
        }
        .feedback-latency {
          font-size: 0.75rem;
          opacity: 0.85;
          font-family: var(--font-mono);
        }
        .form-actions-toolbar {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-default);
        }
        .db-side-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .diagnostics-card,
        .security-notice-card {
          padding: 1.5rem;
        }
        .diagnostics-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .diagnostics-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
        .diag-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8125rem;
          padding-bottom: 0.4rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .diag-label {
          color: var(--text-muted);
        }
        .diag-val {
          font-family: var(--font-mono);
          color: var(--text-primary);
        }
        .sec-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }
        .sec-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .sec-points {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
