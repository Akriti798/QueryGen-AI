import React from 'react';

export default function Badge({ variant = 'neutral', dot = false, children, className = '' }) {
  const variantClass = `badge-${variant}`;
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
