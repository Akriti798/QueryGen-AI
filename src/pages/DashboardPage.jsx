import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Database,
  Terminal,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Table2,
  Code2,
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function DashboardPage() {
  const { navigateTo, history, connectionStatus, dbConfig } = useApp();

  const totalQueriesCount = history.length > 0 ? history.length + 138 : 0;
  const successQueriesCount = history.filter(h => h.status === 'success').length + 135;
  const successRate = totalQueriesCount > 0 ? ((successQueriesCount / totalQueriesCount) * 100).toFixed(1) : '100';

  return (
    <div className="dashboard-page">
      {/* Hero Welcome Section */}
      <div className="card dashboard-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>AI-Powered Text-to-SQL Studio</span>
          </div>
          <h2 className="hero-title">Welcome to QueryGen AI</h2>
          <p className="hero-subtitle">
            Query your database using natural language. No SQL expertise required.
            Ask plain English questions, inspect AI-synthesized SQL, and execute queries in real-time.
          </p>
          <div className="hero-cta-group">
            <button
              type="button"
              onClick={() => navigateTo('workspace')}
              className="btn btn-primary btn-lg"
            >
              <Terminal size={18} />
              <span>Launch Query Workspace</span>
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('database')}
              className="btn btn-secondary btn-lg"
            >
              <Database size={18} />
              <span>Manage Connection</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics Row */}
      <div className="metrics-grid">
        {/* Card 1: Connected Database */}
        <div className="card metric-card" onClick={() => navigateTo('database')}>
          <div className="metric-header">
            <span className="metric-label">Connected Database</span>
            <div className="metric-icon-box bg-blue">
              <Database size={18} />
            </div>
          </div>
          <div className="metric-value">
            {connectionStatus === 'connected' ? dbConfig.database : 'Disconnected'}
          </div>
          <div className="metric-footer">
            <Badge variant={connectionStatus === 'connected' ? 'success' : 'danger'} dot>
              {connectionStatus === 'connected' ? `${dbConfig.type} • Port ${dbConfig.port}` : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Card 2: Total Queries */}
        <div className="card metric-card" onClick={() => navigateTo('history')}>
          <div className="metric-header">
            <span className="metric-label">Total Queries</span>
            <div className="metric-icon-box bg-purple">
              <Terminal size={18} />
            </div>
          </div>
          <div className="metric-value">{totalQueriesCount}</div>
          <div className="metric-footer">
            <span className="metric-sub-text">
              <TrendingUp size={14} className="text-success inline-icon" />
              <span>+18% from last session</span>
            </span>
          </div>
        </div>

        {/* Card 3: Successful Queries */}
        <div className="card metric-card" onClick={() => navigateTo('history')}>
          <div className="metric-header">
            <span className="metric-label">Success Rate</span>
            <div className="metric-icon-box bg-emerald">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="metric-value">{successRate}%</div>
          <div className="metric-footer">
            <span className="metric-sub-text">
              <span className="text-success font-bold">{successQueriesCount}</span> successful runs
            </span>
          </div>
        </div>

        {/* Card 4: Recent Activity */}
        <div className="card metric-card" onClick={() => navigateTo('schema')}>
          <div className="metric-header">
            <span className="metric-label">Introspected Schema</span>
            <div className="metric-icon-box bg-amber">
              <Activity size={18} />
            </div>
          </div>
          <div className="metric-value">6 Tables</div>
          <div className="metric-footer">
            <span className="metric-sub-text">
              <Table2 size={14} className="inline-icon text-muted" />
              <span>32 indexed attributes</span>
            </span>
          </div>
        </div>
      </div>

      {/* Recent Queries Section */}
      <div className="card recent-queries-card">
        <div className="section-header">
          <div className="section-title-group">
            <h3 className="section-title">Recent Query Activity</h3>
            <p className="section-desc">Audit stream of natural language questions and generated SQL</p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('history')}
            className="btn btn-outline btn-sm"
          >
            <span>View All History</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="table-responsive">
          <table className="recent-table">
            <thead>
              <tr>
                <th>Natural Language Prompt</th>
                <th>Generated SQL Preview</th>
                <th>Execution Status</th>
                <th>Execution Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(0, 4).map((item) => (
                <tr key={item.id} className="recent-row">
                  <td className="recent-question-cell">
                    <span className="question-text">{item.question}</span>
                  </td>
                  <td className="recent-sql-cell">
                    <code className="sql-snippet">
                      {item.sql.replace(/\s+/g, ' ').slice(0, 60)}...
                    </code>
                  </td>
                  <td>
                    <Badge variant={item.status === 'success' ? 'success' : 'danger'} dot>
                      {item.status === 'success' ? 'Executed' : 'Failed'}
                    </Badge>
                  </td>
                  <td className="recent-time-cell">
                    <span className="time-badge">
                      <Clock size={12} />
                      {item.executionTimeMs ? `${item.executionTimeMs}ms` : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => navigateTo('workspace', { prompt: item.question, sql: item.sql })}
                      className="btn btn-secondary btn-sm"
                      title="Load into Query Workspace"
                    >
                      <Code2 size={13} />
                      <span>Open</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guided Workflow Steps */}
      <div className="workflow-grid">
        <div className="card workflow-card" onClick={() => navigateTo('database')}>
          <div className="step-number">01</div>
          <h4 className="workflow-title">Connect PostgreSQL</h4>
          <p className="workflow-desc">
            Provide host, port and database credentials to inspect schema tables and relationships.
          </p>
        </div>
        <div className="card workflow-card" onClick={() => navigateTo('workspace')}>
          <div className="step-number">02</div>
          <h4 className="workflow-title">Enter Plain English</h4>
          <p className="workflow-desc">
            Ask complex queries, aggregations, joins or filters without writing manual SQL syntax.
          </p>
        </div>
        <div className="card workflow-card" onClick={() => navigateTo('workspace')}>
          <div className="step-number">03</div>
          <h4 className="workflow-title">Verify & Execute</h4>
          <p className="workflow-desc">
            Review the synthesized SQL, inspect safety boundaries, and export result sets as CSV.
          </p>
        </div>
      </div>

      <style>{`
        .dashboard-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .dashboard-hero {
          padding: 2.5rem;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%), var(--bg-card);
          border: 1px solid var(--primary-border);
          position: relative;
          overflow: hidden;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          background-color: var(--primary-light);
          color: var(--primary);
          font-size: 0.8125rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        .hero-badge-icon {
          color: #f59e0b;
        }
        .hero-title {
          font-size: 2.1rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.05rem;
          color: var(--text-secondary);
          max-width: 720px;
          margin-bottom: 1.75rem;
          line-height: 1.6;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .metric-card {
          padding: 1.5rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .metric-card:hover {
          transform: translateY(-2px);
        }
        .metric-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .metric-label {
          font-size: 0.8125rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .metric-icon-box {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-blue { background-color: rgba(59, 130, 246, 0.15); color: #2563eb; }
        .bg-purple { background-color: rgba(147, 51, 234, 0.15); color: #9333ea; }
        .bg-emerald { background-color: rgba(16, 185, 129, 0.15); color: #059669; }
        .bg-amber { background-color: rgba(245, 158, 11, 0.15); color: #d97706; }

        .metric-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
        }
        .metric-footer {
          display: flex;
          align-items: center;
        }
        .metric-sub-text {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .inline-icon {
          display: inline;
        }
        .font-bold {
          font-weight: 700;
        }
        .recent-queries-card {
          padding: 1.5rem;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .section-desc {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .table-responsive {
          overflow-x: auto;
        }
        .recent-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }
        .recent-table th {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-default);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .recent-row {
          border-bottom: 1px solid var(--border-default);
          transition: background-color var(--transition-fast);
        }
        .recent-row:hover {
          background-color: var(--bg-card-subtle);
        }
        .recent-row td {
          padding: 0.875rem 1rem;
          vertical-align: middle;
        }
        .recent-question-cell {
          font-weight: 600;
          color: var(--text-primary);
          max-width: 320px;
        }
        .recent-sql-cell {
          max-width: 300px;
        }
        .sql-snippet {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background-color: var(--bg-card-subtle);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          display: inline-block;
        }
        .time-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--text-muted);
        }
        .workflow-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .workflow-card {
          padding: 1.5rem;
          position: relative;
          cursor: pointer;
          transition: border-color var(--transition-fast), transform var(--transition-fast);
        }
        .workflow-card:hover {
          border-color: var(--primary);
          transform: translateY(-2px);
        }
        .step-number {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          opacity: 0.6;
          margin-bottom: 0.5rem;
          font-family: var(--font-mono);
        }
        .workflow-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .workflow-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .dashboard-hero {
            padding: 1.5rem;
          }
          .hero-title {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}
