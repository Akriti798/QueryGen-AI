import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
          animation: fadeIn 0.15s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-dialog {
          background-color: var(--bg-card);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          width: 100%;
          max-width: 600px;
          box-shadow: var(--shadow-xl);
          overflow: hidden;
          animation: zoomIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--border-default);
        }
        .modal-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.375rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          transition: all var(--transition-fast);
        }
        .modal-close-btn:hover {
          color: var(--text-primary);
          background-color: var(--bg-card-subtle);
        }
        .modal-body {
          padding: 1.5rem;
          max-height: 70vh;
          overflow-y: auto;
        }
        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          background-color: var(--bg-card-subtle);
          border-top: 1px solid var(--border-default);
        }
      `}</style>
    </div>
  );
}
