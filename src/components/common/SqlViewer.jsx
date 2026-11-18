import React, { useState } from 'react';
import { Copy, Check, Edit3, RotateCw, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SqlViewer({
  sql,
  onSqlChange,
  onRegenerate,
  isRegenerating = false,
  showActions = true,
  className = '',
}) {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editBuffer, setEditBuffer] = useState(sql);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      showToast('SQL query copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleStartEdit = () => {
    setEditBuffer(sql);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onSqlChange?.(editBuffer);
    setIsEditing(false);
    showToast('SQL query updated', 'info');
  };

  const handleCancelEdit = () => {
    setEditBuffer(sql);
    setIsEditing(false);
  };

  // Syntax highlighting helper for PostgreSQL keywords
  const highlightSql = (code) => {
    if (!code) return '';
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
      'FULL OUTER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'AS', 'COUNT', 'SUM', 'AVG', 'MIN',
      'MAX', 'ROUND', 'COALESCE', 'DATE_TRUNC', 'TO_CHAR', 'CURRENT_DATE', 'ILIKE',
      'LIKE', 'DESC', 'ASC', 'UNION', 'ALL', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
    ];

    // Split line by line for line numbering
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      // Escape HTML
      let formatted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Comments
      if (formatted.trim().startsWith('--')) {
        return (
          <div key={idx} className="sql-line">
            <span className="line-num">{idx + 1}</span>
            <span className="sql-comment">{line}</span>
          </div>
        );
      }

      // Strings in quotes
      formatted = formatted.replace(/'([^']*)'/g, '<span class="sql-string">\'$1\'</span>');

      // Keywords
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
        formatted = formatted.replace(regex, (m) => `<span class="sql-keyword">${m.toUpperCase()}</span>`);
      });

      return (
        <div key={idx} className="sql-line">
          <span className="line-num">{idx + 1}</span>
          <span className="sql-content" dangerouslySetInnerHTML={{ __html: formatted }} />
        </div>
      );
    });
  };

  return (
    <div className={`sql-viewer-container ${className}`}>
      <div className="sql-viewer-toolbar">
        <div className="sql-viewer-tag">
          <span className="sql-lang-dot" />
          <span className="sql-lang-text">PostgreSQL</span>
          <span className="sql-dialect-badge">ANSI SQL</span>
        </div>

        {showActions && (
          <div className="sql-viewer-buttons">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="btn btn-sm btn-primary"
                  title="Apply changes to query"
                >
                  <CheckSquare size={14} />
                  <span>Apply Edits</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="sql-tool-btn"
                  title="Modify the SQL query directly"
                >
                  <Edit3 size={14} />
                  <span>Edit SQL</span>
                </button>

                {onRegenerate && (
                  <button
                    type="button"
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="sql-tool-btn"
                    title="Regenerate SQL response"
                  >
                    <RotateCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
                    <span>Regenerate</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`sql-tool-btn ${copied ? 'copied' : ''}`}
                  title="Copy SQL to clipboard"
                >
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="sql-viewer-body">
        {isEditing ? (
          <div className="sql-edit-wrapper">
            <textarea
              className="sql-edit-textarea"
              value={editBuffer}
              onChange={(e) => setEditBuffer(e.target.value)}
              rows={Math.max(6, (editBuffer.match(/\n/g) || []).length + 2)}
              placeholder="Enter or modify your SQL query here..."
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="sql-code-render">
            {highlightSql(sql)}
          </div>
        )}
      </div>

      <style>{`
        .sql-viewer-container {
          background-color: var(--bg-code);
          border: 1px solid #1e293b;
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .sql-viewer-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 1rem;
          background-color: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .sql-viewer-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sql-lang-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #3b82f6;
        }
        .sql-lang-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .sql-dialect-badge {
          background-color: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          font-size: 0.6875rem;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
        }
        .sql-viewer-buttons {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .sql-tool-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.3125rem 0.625rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .sql-tool-btn:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }
        .sql-tool-btn.copied {
          color: #34d399;
          border-color: rgba(52, 211, 153, 0.3);
          background: rgba(52, 211, 153, 0.1);
        }
        .sql-viewer-body {
          position: relative;
          background-color: var(--bg-code);
        }
        .sql-code-render {
          padding: 1rem 0.5rem;
          font-family: var(--font-mono);
          font-size: 0.84rem;
          line-height: 1.6;
          overflow-x: auto;
        }
        .sql-line {
          display: flex;
          align-items: flex-start;
          min-width: 100%;
        }
        .line-num {
          user-select: none;
          width: 3rem;
          text-align: right;
          padding-right: 1.25rem;
          color: #475569;
          font-size: 0.75rem;
          flex-shrink: 0;
          padding-top: 1px;
        }
        .sql-content {
          color: #f1f5f9;
          white-space: pre;
          flex: 1;
        }
        .sql-comment {
          color: #64748b;
          font-style: italic;
          white-space: pre;
        }
        .sql-keyword {
          color: #818cf8;
          font-weight: 600;
        }
        .sql-string {
          color: #34d399;
        }
        .sql-edit-wrapper {
          padding: 0.75rem 1rem;
        }
        .sql-edit-textarea {
          width: 100%;
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #334155;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.875rem;
          line-height: 1.6;
          padding: 0.75rem 1rem;
          outline: none;
          resize: vertical;
        }
        .sql-edit-textarea:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }
      `}</style>
    </div>
  );
}
