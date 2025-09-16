"use client";
import React from 'react';

export default function PageHeader({ title, subtitle, icon = 'fas fa-folder-open', right = null }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 className="display-6 fw-bold text-dark mb-1">
          {icon && <i className={`${icon} text-primary me-3`}></i>}
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted mb-0">{subtitle}</p>
        )}
      </div>
      {right && (
        <div className="d-flex align-items-center gap-2">
          {right}
        </div>
      )}
    </div>
  );
}

