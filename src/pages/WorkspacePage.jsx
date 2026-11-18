import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateSQL, executeSQL } from '../services/api';
import { EXAMPLE_PROMPTS } from '../services/mockService';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Database,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import SqlViewer from '../components/common/SqlViewer';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';

export default function WorkspacePage() {
  const {
    workspacePrompt,
    setWorkspacePrompt,
    workspaceSql,
    setWorkspaceSql,
    workspaceResults,
    setWorkspaceResults,
    addHistoryItem,
    connectionStatus,
    dbConfig,
    showToast,
  } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [generationInfo, setGenerationInfo] = useState({
    explanation: 'Finds top 5 customers sorted by cumulative monetary spending.',
    generatedAt: null,
  });
  const [executionStats, setExecutionStats] = useState({
    status: 'idle', // 'idle' | 'success' | 'error'
    timeMs: 24.6,
    rowCount: 5,
    message: '',
  });

  // Handle Natural Language to SQL Generation
  const handleGenerate = async (overridePrompt) => {
    const promptToUse = typeof overridePrompt === 'string' ? overridePrompt : workspacePrompt;
    if (!promptToUse.trim()) {
      showToast('Please type a question or select an example prompt', 'warning');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await generateSQL(promptToUse);
      if (response.success) {
        setWorkspaceSql(response.sql);
        setGenerationInfo({
          explanation: response.explanation || 'SQL successfully synthesized from plain text.',
          generatedAt: response.generatedAt || new Date().toISOString(),
        });
        showToast('SQL query generated successfully!', 'success');
      } else {
        showToast(response.message || 'Failed to generate SQL', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Generation error occurred', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Clear Input
  const handleClear = () => {
    setWorkspacePrompt('');
    showToast('Input cleared', 'info', 2000);
  };

  // Handle Prompt Chip Click
  const handleSelectPrompt = (promptText) => {
    setWorkspacePrompt(promptText);
    // Optionally auto-generate or let the user review
    handleGenerate(promptText);
  };

  // Handle Query Execution (Strictly Separate from Generation)
  const handleExecute = async () => {
    if (!workspaceSql.trim()) {
      showToast('No SQL query to execute. Generate or write one first.', 'warning');
      return;
    }

    if (connectionStatus !== 'connected') {
      showToast('No active database connected. Please connect in Database Connection page.', 'error');
      return;
    }

    setIsExecuting(true);
    try {
      const response = await executeSQL(workspaceSql);
      if (response.success) {
        setWorkspaceResults({
          columns: response.columns,
          rows: response.rows,
          rowCount: response.rowCount,
          executionTimeMs: response.executionTimeMs,
        });

        setExecutionStats({
          status: 'success',
          timeMs: response.executionTimeMs,
          rowCount: response.rowCount,
          message: response.message,
        });

        // Add to query history
        addHistoryItem({
          question: workspacePrompt || 'Custom SQL Execution',
          sql: workspaceSql,
          status: 'success',
          rowCount: response.rowCount,
          executionTimeMs: response.executionTimeMs,
        });

        showToast(`Executed in ${response.executionTimeMs}ms (${response.rowCount} rows)`, 'success');
      } else {
        setExecutionStats({
          status: 'error',
          timeMs: 0,
          rowCount: 0,
          message: response.message || 'Query execution failed',
        });
        showToast('Query execution failed', 'error');
      }
    } catch (err) {
      setExecutionStats({
        status: 'error',
        timeMs: 0,
        rowCount: 0,
        message: err.message,
      });
      showToast(err.message || 'Execution error', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="workspace-page">
      {/* DB Connection Alert if Disconnected */}
      {connectionStatus !== 'connected' && (
        <div className="card connection-warning-banner">
          <AlertCircle size={20} className="text-warning flex-shrink-0" />
          <div className="banner-content">
            <span className="banner-title">Database Disconnected</span>
            <span className="banner-text">
              Connect to your PostgreSQL database to execute SQL queries. You can still generate and review queries.
            </span>
          </div>
        </div>
      )}

      {/* SECTION A: Natural Language Input Card */}
      <div className="card nl-input-card">
        <div className="card-header-row">
          <div className="card-title-group">
            <div className="title-icon-wrapper">
              <Sparkles size={17} />
            </div>
            <div>
              <h3 className="section-heading">Natural Language Query Prompt</h3>
              <p className="section-subtext">Type your question in plain English. QueryGen AI converts it into PostgreSQL syntax.</p>
            </div>
          </div>
          <span className="database-pill">
            <Database size={13} />
            <span>Target: {connectionStatus === 'connected' ? dbConfig.database : 'Demo Database'}</span>
          </span>
        </div>

        {/* Large Textarea */}
        <div className="prompt-textarea-wrapper">
          <textarea
            className="prompt-textarea"
            rows={4}
            value={workspacePrompt}
            onChange={(e) => setWorkspacePrompt(e.target.value)}
            placeholder="Ask anything about your database... (e.g., Show me the top 5 customers who have spent the most money)"
          />
        </div>

        {/* Buttons: Generate SQL & Clear Input */}
        <div className="input-toolbar">
          <div className="toolbar-left">
            <span className="char-count">{workspacePrompt.length} characters</span>
          </div>
          <div className="toolbar-right">
            <button
              type="button"
              onClick={handleClear}
              disabled={isGenerating || !workspacePrompt}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={14} />
              <span>Clear Input</span>
            </button>
            <button
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating || !workspacePrompt.trim()}
              className="btn btn-primary"
            >
              <Sparkles size={16} className={isGenerating ? 'animate-spin' : ''} />
              <span>{isGenerating ? 'Generating SQL...' : 'Generate SQL'}</span>
            </button>
          </div>
        </div>

        {/* Example Prompts Shelf */}
        <div className="example-prompts-shelf">
          <div className="example-header">
            <HelpCircle size={14} className="text-muted" />
            <span>Try these example prompts:</span>
          </div>
          <div className="prompts-chips-list">
            {EXAMPLE_PROMPTS.map((promptText, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectPrompt(promptText)}
                className={`prompt-chip ${workspacePrompt === promptText ? 'active' : ''}`}
              >
                <span className="chip-index">{index + 1}</span>
                <span className="chip-text">{promptText}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION B & C: SQL Generation & Execution */}
      <div className="card sql-section-card">
        <div className="sql-card-header">
          <div className="sql-title-group">
            <div className="title-icon-wrapper purple">
              <Terminal size={17} />
            </div>
            <div>
              <h3 className="section-heading">Generated SQL Query</h3>
              <p className="section-subtext">
                Review, modify, or regenerate the query before execution against the PostgreSQL engine.
              </p>
            </div>
          </div>

          {/* CRITICAL: Execute Query Button (Kept separate from SQL Generation) */}
          <div className="sql-execute-actions">
            <button
              type="button"
              onClick={handleExecute}
              disabled={isExecuting || !workspaceSql.trim()}
              className="btn btn-primary btn-execute"
              title="Execute SQL against connected PostgreSQL database"
            >
              <Play size={16} className={isExecuting ? 'animate-spin' : ''} />
              <span>{isExecuting ? 'Executing Query...' : 'Execute Query'}</span>
            </button>
          </div>
        </div>

        {/* SQL Code Viewer with Copy, Edit, and Regenerate options */}
        <SqlViewer
          sql={workspaceSql}
          onSqlChange={setWorkspaceSql}
          onRegenerate={() => handleGenerate()}
          isRegenerating={isGenerating}
        />

        {/* Safety & Execution Indicator Bar */}
        <div className="sql-footer-bar">
          <div className="footer-status-item">
            <ShieldCheck size={16} className="text-success" />
            <span className="safety-text">
              Safety Verification: <strong>Read-Only SELECT</strong> query mode active
            </span>
          </div>

          {executionStats.status === 'success' && (
            <div className="execution-summary-badge">
              <CheckCircle2 size={15} className="text-success" />
              <span>Executed in <strong>{executionStats.timeMs}ms</strong></span>
              <span className="badge-divider">•</span>
              <span><strong>{executionStats.rowCount}</strong> rows returned</span>
            </div>
          )}

          {executionStats.status === 'error' && (
            <div className="execution-error-badge">
              <AlertCircle size={15} className="text-danger" />
              <span>{executionStats.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION D: Query Results Data Table */}
      <div className="results-section">
        {workspaceResults ? (
          <DataTable
            columns={workspaceResults.columns}
            rows={workspaceResults.rows}
            rowCount={workspaceResults.rowCount}
            executionTimeMs={workspaceResults.executionTimeMs}
            title="Database Query Results"
          />
        ) : (
          <DataTable columns={[]} rows={[]} />
        )}
      </div>

      <style>{`
        .workspace-page {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .connection-warning-banner {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          background-color: var(--warning-bg);
          border: 1px solid var(--warning-border);
        }
        .banner-content {
          display: flex;
          flex-direction: column;
          line-height: 1.3;
        }
        .banner-title {
          font-weight: 700;
          font-size: 0.875rem;
          color: var(--warning-text);
        }
        .banner-text {
          font-size: 0.8125rem;
          color: var(--warning-text);
          opacity: 0.9;
        }
        .nl-input-card,
        .sql-section-card {
          padding: 1.5rem;
        }
        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .card-title-group,
        .sql-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .title-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .title-icon-wrapper.purple {
          background-color: var(--accent-purple-light);
          color: var(--accent-purple);
        }
        .section-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .section-subtext {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .database-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.3rem 0.65rem;
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .prompt-textarea-wrapper {
          margin-bottom: 1rem;
        }
        .prompt-textarea {
          width: 100%;
          padding: 1rem 1.25rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          color: var(--text-primary);
          font-size: 0.95rem;
          line-height: 1.5;
          outline: none;
          resize: vertical;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.03);
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .prompt-textarea:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }
        .input-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }
        .char-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }
        .example-prompts-shelf {
          border-top: 1px solid var(--border-default);
          padding-top: 1.25rem;
        }
        .example-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 0.75rem;
        }
        .prompts-chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .prompt-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.85rem;
          border-radius: 9999px;
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          color: var(--text-secondary);
          font-size: 0.8125rem;
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: left;
        }
        .prompt-chip:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary-border);
        }
        .prompt-chip.active {
          background-color: var(--primary-light);
          color: var(--primary);
          border-color: var(--primary);
          font-weight: 600;
        }
        .chip-index {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: var(--bg-card);
          color: var(--text-muted);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6875rem;
          font-weight: 700;
        }
        .sql-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .btn-execute {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          border-color: #059669;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        .btn-execute:hover:not(:disabled) {
          background: linear-gradient(135deg, #047857 0%, #059669 100%);
          border-color: #047857;
        }
        .sql-footer-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1rem;
          padding: 0.75rem 1rem;
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          font-size: 0.8125rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer-status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
        }
        .safety-text {
          font-size: 0.8125rem;
        }
        .execution-summary-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--success);
          font-weight: 500;
        }
        .execution-error-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--danger);
          font-weight: 500;
        }
        .badge-divider {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
