import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ currentTheme, onThemeChange, onOpenSandbox, onModuleChange }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-logo" onClick={() => onModuleChange && onModuleChange('console')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">🤖</span>
          <span className="logo-text">AI Pods <span className="badge">Enterprise SaaS</span></span>
        </div>

        <nav className="nav-links">
          <button className="nav-link-btn" onClick={() => onModuleChange && onModuleChange('console')}>🤖 AI Console</button>
          <button className="nav-link-btn" onClick={() => onModuleChange && onModuleChange('vault')}>🛡️ Native Vault</button>
          <button className="nav-link-btn" onClick={() => onModuleChange && onModuleChange('team')}>👥 Equipo & Roles</button>
          <button className="nav-link-btn" onClick={() => onModuleChange && onModuleChange('billing')}>💳 Facturación</button>
          <button className="nav-link-btn" onClick={() => onModuleChange && onModuleChange('settings')}>👤 Mi Cuenta</button>
        </nav>

        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
          <button className="btn-primary" onClick={onOpenSandbox}>
            Iniciar Portal
          </button>
        </div>
      </div>
    </header>
  );
}

