import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon text-success" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon text-danger" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon text-warning" />;
      default:
        return <Info size={18} className="toast-icon text-info" />;
    }
  };

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item toast-${toast.type}`}>
          <div className="toast-content">
            {getIcon(toast.type)}
            <span className="toast-message">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="toast-close-btn"
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 420px;
          width: calc(100% - 3rem);
          pointer-events: none;
        }
        .toast-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          border: 1px solid var(--border-default);
          box-shadow: var(--shadow-lg);
          pointer-events: auto;
          animation: slideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .toast-content {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-primary);
        }
        .toast-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
          border-radius: var(--radius-sm);
          transition: color var(--transition-fast);
        }
        .toast-close-btn:hover {
          color: var(--text-primary);
        }
        .toast-success { border-left: 4px solid var(--success); }
        .toast-error { border-left: 4px solid var(--danger); }
        .toast-warning { border-left: 4px solid var(--warning); }
        .toast-info { border-left: 4px solid var(--primary); }
      `}</style>
    </div>
  );
}
