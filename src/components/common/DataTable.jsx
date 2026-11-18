import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, ArrowUp, ArrowDown, Database, Clock, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DataTable({
  columns = [],
  rows = [],
  rowCount = 0,
  executionTimeMs = 0,
  title = 'Query Results',
}) {
  const { showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter rows based on search input across all columns
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const term = searchTerm.toLowerCase();
    return rows.filter((row) =>
      columns.some((col) => {
        const val = row[col];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      })
    );
  }, [rows, columns, searchTerm]);

  // Sort rows based on sort column
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      // Check numeric
      const aNum = Number(String(aVal).replace(/[^0-9.-]+/g, ''));
      const bNum = Number(String(bVal).replace(/[^0-9.-]+/g, ''));
      if (!isNaN(aNum) && !isNaN(bNum) && String(aVal).match(/[0-9]/)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // String fallback
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
  }, [filteredRows, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        if (prev.direction === 'asc') return { key: columnKey, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  // Pure JavaScript CSV Export (RFC 4180 Compliant)
  const handleExportCSV = () => {
    if (!rows || rows.length === 0) {
      showToast('No records available to export', 'warning');
      return;
    }

    try {
      const escapeCsvValue = (val) => {
        if (val === null || val === undefined) return '';
        const str = String(val);
        // If string contains comma, newline or quotes, quote and escape
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      };

      const headerLine = columns.map(escapeCsvValue).join(',');
      const rowLines = sortedRows.map((row) =>
        columns.map((col) => escapeCsvValue(row[col])).join(',')
      );

      const csvContent = [headerLine, ...rowLines].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `querygen_export_${new Date().toISOString().slice(0, 10)}.csv`;

      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Exported ${sortedRows.length} rows to ${filename}`, 'success');
    } catch {
      showToast('Failed to export CSV file', 'error');
    }
  };

  if (!columns || columns.length === 0) {
    return (
      <div className="card datatable-empty-card">
        <Database size={40} className="datatable-empty-icon" />
        <h4 className="datatable-empty-title">No Query Executed Yet</h4>
        <p className="datatable-empty-text">
          Generate an SQL query and click &quot;Execute Query&quot; to inspect database records here.
        </p>
      </div>
    );
  }

  return (
    <div className="card datatable-wrapper">
      {/* Table Header Bar */}
      <div className="datatable-header">
        <div className="datatable-info">
          <div className="datatable-title-group">
            <h3 className="datatable-title">{title}</h3>
            <span className="datatable-badge">
              <Layers size={13} />
              {sortedRows.length} {sortedRows.length === 1 ? 'row' : 'rows'}
            </span>
            {executionTimeMs > 0 && (
              <span className="datatable-badge execution-badge">
                <Clock size={13} />
                {executionTimeMs} ms
              </span>
            )}
          </div>
          <span className="datatable-subtitle">
            Live query execution returned from active database session
          </span>
        </div>

        <div className="datatable-actions">
          {/* Search Input */}
          <div className="datatable-search">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search in results..."
              className="search-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="search-clear-btn"
                title="Clear filter"
              >
                &times;
              </button>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="btn btn-secondary btn-sm"
            title="Download records as RFC 4180 CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Scrollable Data Table */}
      <div className="datatable-scroll-container">
        <table className="datatable-table">
          <thead>
            <tr>
              <th className="th-index">#</th>
              {columns.map((col) => {
                const isSorted = sortConfig.key === col;
                return (
                  <th
                    key={col}
                    onClick={() => handleSort(col)}
                    className={`th-sortable ${isSorted ? 'th-active' : ''}`}
                    title={`Click to sort by ${col}`}
                  >
                    <div className="th-content">
                      <span className="th-label">{col}</span>
                      <span className="th-sort-icon">
                        {isSorted ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp size={13} />
                          ) : (
                            <ArrowDown size={13} />
                          )
                        ) : (
                          <ArrowUpDown size={13} className="opacity-40" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="td-empty">
                  No records matching &quot;{searchTerm}&quot;
                </td>
              </tr>
            ) : (
              sortedRows.map((row, idx) => (
                <tr key={idx} className="datatable-row">
                  <td className="td-index">{idx + 1}</td>
                  {columns.map((col) => {
                    const value = row[col];
                    const isNull = value === null || value === undefined;
                    return (
                      <td key={col} className="td-cell">
                        {isNull ? (
                          <span className="null-indicator">NULL</span>
                        ) : (
                          <span>{String(value)}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="datatable-footer">
        <span>
          Showing {sortedRows.length} of {rowCount || rows.length} records
          {searchTerm && ` (filtered from ${rows.length})`}
        </span>
        <span className="text-muted">PostgreSQL Query Engine • Client Data Table</span>
      </div>

      <style>{`
        .datatable-empty-card {
          padding: 3.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-card);
        }
        .datatable-empty-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
          opacity: 0.6;
        }
        .datatable-empty-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }
        .datatable-empty-text {
          color: var(--text-secondary);
          font-size: 0.875rem;
          max-width: 420px;
        }
        .datatable-wrapper {
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .datatable-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-default);
          gap: 1rem;
          flex-wrap: wrap;
        }
        .datatable-title-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.25rem;
        }
        .datatable-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .datatable-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.2rem 0.5rem;
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .execution-badge {
          color: var(--success);
          background-color: var(--success-bg);
          border-color: var(--success-border);
        }
        .datatable-subtitle {
          font-size: 0.8125rem;
          color: var(--text-muted);
        }
        .datatable-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .datatable-search {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--text-muted);
          pointer-events: none;
        }
        .search-input {
          padding: 0.45rem 1.75rem 0.45rem 2.25rem;
          font-size: 0.8125rem;
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          background-color: var(--bg-input);
          color: var(--text-primary);
          outline: none;
          width: 220px;
          transition: border-color var(--transition-fast), width var(--transition-fast);
        }
        .search-input:focus {
          border-color: var(--border-focus);
          width: 260px;
        }
        .search-clear-btn {
          position: absolute;
          right: 0.6rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: 1.1rem;
          line-height: 1;
        }
        .datatable-scroll-container {
          overflow-x: auto;
          max-height: 520px;
        }
        .datatable-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
          text-align: left;
        }
        .datatable-table thead {
          position: sticky;
          top: 0;
          z-index: 10;
          background-color: var(--bg-card-subtle);
        }
        .th-index {
          width: 50px;
          padding: 0.75rem 1rem;
          font-weight: 600;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-bottom: 1px solid var(--border-default);
          text-align: center;
        }
        .th-sortable {
          padding: 0.75rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border-default);
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          transition: background-color var(--transition-fast), color var(--transition-fast);
        }
        .th-sortable:hover {
          background-color: var(--border-subtle);
          color: var(--text-primary);
        }
        .th-active {
          color: var(--primary);
        }
        .th-content {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .opacity-40 {
          opacity: 0.4;
        }
        .datatable-row {
          border-bottom: 1px solid var(--border-default);
          transition: background-color var(--transition-fast);
        }
        .datatable-row:hover {
          background-color: var(--bg-card-subtle);
        }
        .td-index {
          padding: 0.75rem 1rem;
          text-align: center;
          color: var(--text-muted);
          font-size: 0.75rem;
          font-family: var(--font-mono);
        }
        .td-cell {
          padding: 0.85rem 1.25rem;
          color: var(--text-primary);
          white-space: nowrap;
        }
        .td-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
          font-style: italic;
        }
        .null-indicator {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-card-subtle);
          color: var(--text-muted);
          border: 1px dashed var(--border-default);
        }
        .datatable-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.5rem;
          border-top: 1px solid var(--border-default);
          background-color: var(--bg-card-subtle);
          font-size: 0.75rem;
          color: var(--text-secondary);
          flex-wrap: wrap;
          gap: 0.5rem;
        }
      `}</style>
    </div>
  );
}
