import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Code2,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import SqlViewer from '../components/common/SqlViewer';

export default function QueryHistoryPage() {
  const { history, clearHistory, navigateTo, showToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'success' | 'failed'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  // Filter history items
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Status filter
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchQuestion = item.question?.toLowerCase().includes(term);
      const matchSql = item.sql?.toLowerCase().includes(term);
      return matchQuestion || matchSql;
    });
  }, [history, searchTerm, statusFilter]);

  // Reuse query into Query Workspace
  const handleReuseQuery = (item) => {
    navigateTo('workspace', {
      prompt: item.question,
      sql: item.sql,
    });
    showToast('Loaded query into Workspace', 'success');
  };

  // Confirm clear history
  const handleConfirmClear = () => {
    clearHistory();
    setIsClearModalOpen(false);
    showToast('Query history cleared', 'info');
  };

  const formatDate = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  return (
    <div className="history-page">
      {/* Header Bar */}
      <div className="card history-header-card">
        <div className="header-left">
          <div className="header-icon-box">
            <History size={20} />
          </div>
          <div>
            <h2 className="header-title">Query Execution History</h2>
            <p className="header-sub">
              Audit log of all synthesized SQL queries, execution metrics, and results
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            disabled={history.length === 0}
            className="btn btn-danger btn-sm"
            title="Clear all stored query history"
          >
            <Trash2 size={14} />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="history-controls">
        <div className="history-search-group">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="history-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by prompt keywords or SQL syntax..."
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="clear-search-btn"
            >
              &times;
            </button>
          )}
        </div>

        <div className="status-filter-pills">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
          >
            All ({history.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('success')}
            className={`filter-pill ${statusFilter === 'success' ? 'active' : ''}`}
          >
            Success ({history.filter((h) => h.status === 'success').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('failed')}
            className={`filter-pill ${statusFilter === 'failed' ? 'active' : ''}`}
          >
            Failed ({history.filter((h) => h.status === 'failed').length})
          </button>
        </div>
      </div>

      {/* History Items List */}
      <div className="history-list">
        {filteredHistory.length === 0 ? (
          <div className="card history-empty-card">
            <History size={40} className="empty-icon" />
            <h4 className="empty-title">
              {history.length === 0 ? 'No Queries in History' : 'No Queries Match Your Search'}
            </h4>
            <p className="empty-desc">
              {history.length === 0
                ? 'Queries generated and executed in the Query Workspace will be listed here automatically.'
                : `No history items found matching "${searchTerm}". Try adjusting your filters.`}
            </p>
            {history.length === 0 && (
              <button
                type="button"
                onClick={() => navigateTo('workspace')}
                className="btn btn-primary btn-sm mt-3"
              >
                Go to Query Workspace
              </button>
            )}
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div key={item.id} className="card history-item-card">
              <div className="item-main">
                <div className="item-top-row">
                  <span className="item-question">{item.question}</span>
                  <div className="item-badges">
                    <Badge variant={item.status === 'success' ? 'success' : 'danger'} dot>
                      {item.status === 'success' ? 'Success' : 'Error'}
                    </Badge>
                  </div>
                </div>

                <div className="item-sql-preview">
                  <code className="sql-box">
                    {item.sql}
                  </code>
                </div>

                <div className="item-meta-bar">
                  <span className="meta-time">
                    <Clock size={13} />
                    <span>{formatDate(item.timestamp)}</span>
                  </span>
                  {item.executionTimeMs && (
                    <span className="meta-stat">
                      Speed: <strong>{item.executionTimeMs}ms</strong>
                    </span>
                  )}
                  {item.rowCount !== undefined && (
                    <span className="meta-stat">
                      <Layers size={13} />
                      <span>{item.rowCount} {item.rowCount === 1 ? 'row' : 'rows'} returned</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="item-actions-column">
                <button
                  type="button"
                  onClick={() => handleReuseQuery(item)}
                  className="btn btn-primary btn-sm"
                  title="Open this prompt and SQL in Query Workspace"
                >
                  <RotateCcw size={13} />
                  <span>Reuse Query</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="btn btn-secondary btn-sm"
                  title="Inspect full details and copy SQL"
                >
                  <Eye size={13} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Query Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title="Query Audit Details"
          footer={
            <>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  handleReuseQuery(selectedItem);
                  setSelectedItem(null);
                }}
                className="btn btn-primary btn-sm"
              >
                <RotateCcw size={13} />
                <span>Open in Workspace</span>
              </button>
            </>
          }
        >
          <div className="details-modal-body">
            <div className="detail-field">
              <span className="detail-label">Natural Language Prompt</span>
              <p className="detail-question">{selectedItem.question}</p>
            </div>

            <div className="detail-field">
              <span className="detail-label">Synthesized PostgreSQL</span>
              <SqlViewer sql={selectedItem.sql} showActions={true} />
            </div>

            <div className="detail-stats-grid">
              <div className="stat-box">
                <span className="stat-label">Execution Status</span>
                <Badge variant={selectedItem.status === 'success' ? 'success' : 'danger'} dot>
                  {selectedItem.status === 'success' ? 'Success (200 OK)' : 'Failed'}
                </Badge>
              </div>
              <div className="stat-box">
                <span className="stat-label">Execution Latency</span>
                <span className="stat-val font-mono">{selectedItem.executionTimeMs || 'N/A'} ms</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Records Retrieved</span>
                <span className="stat-val font-mono">{selectedItem.rowCount || 0} rows</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Recorded Timestamp</span>
                <span className="stat-val text-xs">{formatDate(selectedItem.timestamp)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Clear History Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Confirm Clear Query History"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsClearModalOpen(false)}
              className="btn btn-secondary btn-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmClear}
              className="btn btn-danger btn-sm"
            >
              <Trash2 size={14} />
              <span>Yes, Clear History</span>
            </button>
          </>
        }
      >
        <div className="clear-confirm-content">
          <div className="confirm-icon-box">
            <AlertTriangle size={24} className="text-warning" />
          </div>
          <div>
            <h4 className="confirm-heading">Are you sure you want to delete all query logs?</h4>
            <p className="confirm-text">
              This action will permanently delete all {history.length} logged queries from your current session.
              This cannot be undone.
            </p>
          </div>
        </div>
      </Modal>

      <style>{`
        .history-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .history-header-card {
          padding: 1.5rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .header-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          background-color: var(--primary-light);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .header-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .header-sub {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .history-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .history-search-group {
          position: relative;
          flex: 1;
          min-width: 280px;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
        }
        .history-search-input {
          width: 100%;
          padding: 0.65rem 2.25rem 0.65rem 2.6rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }
        .history-search-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }
        .clear-search-btn {
          position: absolute;
          right: 0.85rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
        }
        .status-filter-pills {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--bg-card);
          padding: 0.25rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
        }
        .filter-pill {
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-sm);
          border: none;
          background: transparent;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .filter-pill:hover {
          color: var(--text-primary);
        }
        .filter-pill.active {
          background-color: var(--primary);
          color: white;
        }
        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .history-empty-card {
          padding: 3.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
          opacity: 0.5;
        }
        .empty-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .empty-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          max-width: 440px;
        }
        .mt-3 {
          margin-top: 1rem;
        }
        .history-item-card {
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          transition: border-color var(--transition-fast);
        }
        .history-item-card:hover {
          border-color: var(--border-dark);
        }
        .item-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          min-width: 0;
        }
        .item-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .item-question {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .item-sql-preview {
          overflow-x: auto;
        }
        .sql-box {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          background-color: var(--bg-card-subtle);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
          white-space: pre-wrap;
          max-height: 80px;
          overflow-y: hidden;
        }
        .item-meta-bar {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          font-size: 0.75rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }
        .meta-time,
        .meta-stat {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .item-actions-column {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }
        .details-modal-body {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .detail-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .detail-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }
        .detail-question {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
          padding: 0.75rem 1rem;
          background-color: var(--bg-card-subtle);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-default);
        }
        .detail-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-default);
        }
        .stat-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 0.65rem 0.85rem;
          background-color: var(--bg-card-subtle);
          border-radius: var(--radius-md);
        }
        .stat-val {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .font-mono {
          font-family: var(--font-mono);
        }
        .clear-confirm-content {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .confirm-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: var(--warning-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .confirm-heading {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.35rem;
        }
        .confirm-text {
          font-size: 0.84rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .history-item-card {
            flex-direction: column;
            align-items: stretch;
          }
          .item-actions-column {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
}
