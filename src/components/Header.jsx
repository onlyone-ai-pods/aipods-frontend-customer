import React from 'react';

export default function Header({ onOpenSandbox, onModuleChange, activeModule = 'console', session, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-logo" onClick={() => onModuleChange && onModuleChange('console')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🤖</span>
          <span className="logo-text">AI Pods <span className="badge">Enterprise SaaS</span></span>
        </div>

        <nav className="nav-links">
          <button className={`nav-link-btn ${activeModule === 'console' ? 'active' : ''}`} onClick={() => onModuleChange && onModuleChange('console')}>🤖 AI Console</button>
          <button className={`nav-link-btn ${activeModule === 'vault' ? 'active' : ''}`} onClick={() => onModuleChange && onModuleChange('vault')}>🛡️ Native Vault</button>
          <button className={`nav-link-btn ${activeModule === 'team' ? 'active' : ''}`} onClick={() => onModuleChange && onModuleChange('team')}>👥 Equipo & Roles</button>
          <button className={`nav-link-btn ${activeModule === 'billing' ? 'active' : ''}`} onClick={() => onModuleChange && onModuleChange('billing')}>💳 Facturación</button>
          <button className={`nav-link-btn ${activeModule === 'settings' ? 'active' : ''}`} onClick={() => onModuleChange && onModuleChange('settings')}>👤 Mi Cuenta</button>
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-primary" onClick={onOpenSandbox} style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            🚀 Iniciar Portal
          </button>
          {session && (
            <>
              <span title={session.user.tenant_id} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {session.user.email}
              </span>
              <button className="nav-link-btn" onClick={onLogout} style={{ whiteSpace: 'nowrap' }}>
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

