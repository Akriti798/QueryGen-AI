import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getDatabaseSchema } from '../services/api';
import {
  Table2,
  ChevronDown,
  ChevronRight,
  Key,
  Link2,
  Search,
  Sparkles,
  Layers,
  Database,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import Badge from '../components/common/Badge';

export default function SchemaExplorerPage() {
  const { navigateTo, dbConfig, connectionStatus } = useApp();
  const [schemaTables, setSchemaTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState({});

  useEffect(() => {
    async function loadSchema() {
      setLoading(true);
      try {
        const res = await getDatabaseSchema();
        if (res.success) {
          setSchemaTables(res.tables || []);
          // Expand first 2 tables by default for great initial view
          const initial = {};
          (res.tables || []).slice(0, 2).forEach((t) => {
            initial[t.name] = true;
          });
          setExpandedTables(initial);
        }
      } catch (err) {
        console.error('Failed to load schema:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSchema();
  }, []);

  const toggleTable = (tableName) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const expandAll = () => {
    const all = {};
    schemaTables.forEach((t) => {
      all[t.name] = true;
    });
    setExpandedTables(all);
  };

  const collapseAll = () => {
    setExpandedTables({});
  };

  // Filter tables and columns based on search term
  const filteredTables = useMemo(() => {
    if (!searchTerm.trim()) return schemaTables;
    const term = searchTerm.toLowerCase();

    return schemaTables.filter((table) => {
      const matchName = table.name.toLowerCase().includes(term);
      const matchDesc = table.description?.toLowerCase().includes(term);
      const matchColumns = table.columns.some((c) =>
        c.name.toLowerCase().includes(term) || c.type.toLowerCase().includes(term)
      );
      return matchName || matchDesc || matchColumns;
    });
  }, [schemaTables, searchTerm]);

  // Schema aggregates
  const totalColumns = schemaTables.reduce((acc, t) => acc + t.columns.length, 0);
  const totalPKs = schemaTables.reduce((acc, t) => acc + t.columns.filter((c) => c.isPrimary).length, 0);
  const totalFKs = schemaTables.reduce((acc, t) => acc + t.columns.filter((c) => c.isForeign).length, 0);

  // Jump to Workspace with query for table
  const handleQueryTable = (tableName) => {
    navigateTo('workspace', {
      prompt: `Show the first 10 records from the ${tableName} table`,
      sql: `SELECT * FROM ${tableName} LIMIT 10;`,
    });
  };

  return (
    <div className="schema-page">
      {/* Top Overview Bar */}
      <div className="card schema-hero-card">
        <div className="hero-details">
          <div className="schema-badge-row">
            <span className="schema-engine-badge">
              <Database size={13} />
              <span>{dbConfig.type} Introspection</span>
            </span>
            <Badge variant={connectionStatus === 'connected' ? 'success' : 'neutral'} dot>
              {connectionStatus === 'connected' ? dbConfig.database : 'Demo Mode'}
            </Badge>
          </div>
          <h2 className="schema-title">Database Schema Explorer</h2>
          <p className="schema-desc">
            Explore table hierarchies, primary key constraints, foreign key mappings, and attribute datatypes.
          </p>
        </div>

        <div className="schema-stats-pills">
          <div className="schema-stat-item">
            <span className="stat-number">{schemaTables.length}</span>
            <span className="stat-label">Tables</span>
          </div>
          <div className="schema-stat-item">
            <span className="stat-number">{totalColumns}</span>
            <span className="stat-label">Columns</span>
          </div>
          <div className="schema-stat-item">
            <span className="stat-number">{totalPKs}</span>
            <span className="stat-label">Primary Keys</span>
          </div>
          <div className="schema-stat-item">
            <span className="stat-number">{totalFKs}</span>
            <span className="stat-label">Foreign Keys</span>
          </div>
        </div>
      </div>

      {/* Search and Control Bar */}
      <div className="schema-controls-bar">
        <div className="schema-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="schema-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tables, columns, or datatypes (e.g., customer, order_id, INTEGER)..."
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

        <div className="expand-collapse-actions">
          <button
            type="button"
            onClick={expandAll}
            className="btn btn-secondary btn-sm"
            title="Expand all tables"
          >
            <Maximize2 size={13} />
            <span>Expand All</span>
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="btn btn-secondary btn-sm"
            title="Collapse all tables"
          >
            <Minimize2 size={13} />
            <span>Collapse All</span>
          </button>
        </div>
      </div>

      {/* Schema Tables Accordion List */}
      <div className="tables-accordion-list">
        {loading ? (
          <div className="card loading-card">
            <div className="animate-spin text-primary">
              <Layers size={28} />
            </div>
            <span>Introspecting relational catalogue...</span>
          </div>
        ) : filteredTables.length === 0 ? (
          <div className="card empty-schema-card">
            <Table2 size={36} className="text-muted" />
            <h4>No tables matching &quot;{searchTerm}&quot;</h4>
            <p>Try searching for a different table or column identifier.</p>
          </div>
        ) : (
          filteredTables.map((table) => {
            const isExpanded = !!expandedTables[table.name];
            return (
              <div key={table.name} className={`card table-accordion-card ${isExpanded ? 'expanded' : ''}`}>
                {/* Table Header Bar */}
                <div
                  className="table-card-header"
                  onClick={() => toggleTable(table.name)}
                >
                  <div className="header-left">
                    <button
                      type="button"
                      className="accordion-caret-btn"
                      aria-label="Toggle table details"
                    >
                      {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <div className="table-title-box">
                      <div className="table-name-row">
                        <Table2 size={16} className="table-icon" />
                        <span className="table-name">{table.name}</span>
                        <span className="table-row-count">~{table.rowCount?.toLocaleString()} rows</span>
                      </div>
                      <span className="table-desc">{table.description}</span>
                    </div>
                  </div>

                  <div className="header-right" onClick={(e) => e.stopPropagation()}>
                    <span className="columns-badge">
                      {table.columns.length} columns
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQueryTable(table.name)}
                      className="btn btn-secondary btn-sm query-table-btn"
                      title="Generate a query for this table in Workspace"
                    >
                      <Sparkles size={13} className="text-primary" />
                      <span>Query Table</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded Table Column Schema List */}
                {isExpanded && (
                  <div className="table-card-body">
                    <table className="columns-table">
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Column Name</th>
                          <th>Data Type</th>
                          <th>Constraints & References</th>
                          <th>Attribute Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((col) => (
                          <tr key={col.name} className="column-row">
                            <td className="key-cell">
                              {col.isPrimary && (
                                <span className="key-badge primary-key" title="Primary Key">
                                  <Key size={12} />
                                  <span>PK</span>
                                </span>
                              )}
                              {col.isForeign && (
                                <span className="key-badge foreign-key" title={`Foreign Key references ${col.references}`}>
                                  <Link2 size={12} />
                                  <span>FK</span>
                                </span>
                              )}
                            </td>
                            <td className="col-name-cell">
                              <span className="col-name">{col.name}</span>
                            </td>
                            <td className="datatype-cell">
                              <code className="datatype-code">{col.type}</code>
                            </td>
                            <td className="constraints-cell">
                              {col.references ? (
                                <span className="references-tag">
                                  &rarr; {col.references}
                                </span>
                              ) : col.isPrimary ? (
                                <span className="not-null-tag">NOT NULL, UNIQUE</span>
                              ) : (
                                <span className="text-muted text-xs">Standard Nullable</span>
                              )}
                            </td>
                            <td className="desc-cell">
                              <span className="col-desc-text">{col.description}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .schema-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .schema-hero-card {
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.04) 0%, var(--bg-card) 100%);
        }
        .schema-badge-row {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          margin-bottom: 0.5rem;
        }
        .schema-engine-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          background-color: var(--primary-light);
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
        }
        .schema-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }
        .schema-desc {
          font-size: 0.84rem;
          color: var(--text-secondary);
          max-width: 600px;
        }
        .schema-stats-pills {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .schema-stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          min-width: 80px;
        }
        .stat-number {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        .stat-label {
          font-size: 0.6875rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
        }
        .schema-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .schema-search-box {
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
        .schema-search-input {
          width: 100%;
          padding: 0.65rem 2.25rem 0.65rem 2.6rem;
          background-color: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
        }
        .schema-search-input:focus {
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
        .expand-collapse-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .tables-accordion-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .loading-card,
        .empty-schema-card {
          padding: 3rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }
        .table-accordion-card {
          overflow: hidden;
          transition: border-color var(--transition-fast);
        }
        .table-accordion-card.expanded {
          border-color: var(--primary-border);
        }
        .table-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          cursor: pointer;
          user-select: none;
          background-color: var(--bg-card);
          transition: background-color var(--transition-fast);
          gap: 1rem;
          flex-wrap: wrap;
        }
        .table-card-header:hover {
          background-color: var(--bg-card-subtle);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }
        .accordion-caret-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .table-title-box {
          display: flex;
          flex-direction: column;
        }
        .table-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .table-icon {
          color: var(--primary);
        }
        .table-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        .table-row-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          background-color: var(--bg-card-subtle);
          padding: 0.125rem 0.375rem;
          border-radius: var(--radius-sm);
        }
        .table-desc {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .columns-badge {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-secondary);
          background-color: var(--bg-card-subtle);
          border: 1px solid var(--border-default);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
        }
        .query-table-btn {
          font-size: 0.75rem;
        }
        .table-card-body {
          border-top: 1px solid var(--border-default);
          overflow-x: auto;
        }
        .columns-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8125rem;
          text-align: left;
        }
        .columns-table th {
          background-color: var(--bg-card-subtle);
          padding: 0.65rem 1rem;
          font-size: 0.6875rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--border-default);
        }
        .column-row {
          border-bottom: 1px solid var(--border-subtle);
        }
        .column-row:hover {
          background-color: var(--bg-card-subtle);
        }
        .column-row td {
          padding: 0.65rem 1rem;
          vertical-align: middle;
        }
        .key-cell {
          width: 70px;
        }
        .key-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 0.15rem 0.4rem;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
        }
        .primary-key {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        .foreign-key {
          background-color: #e0f2fe;
          color: #0369a1;
          border: 1px solid #bae6fd;
        }
        .col-name-cell {
          font-weight: 600;
          color: var(--text-primary);
          font-family: var(--font-mono);
        }
        .datatype-code {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          background-color: var(--bg-card-subtle);
          padding: 0.2rem 0.45rem;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          border: 1px solid var(--border-default);
        }
        .references-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--info-text);
          background-color: var(--info-bg);
          padding: 0.15rem 0.45rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--info-border);
        }
        .not-null-tag {
          font-size: 0.6875rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .text-xs {
          font-size: 0.6875rem;
        }
        .col-desc-text {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
