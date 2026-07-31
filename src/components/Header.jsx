import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header({ currentTheme, onThemeChange, onOpenSandbox }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">AI Pods <span className="badge">Enterprise SaaS</span></span>
        </div>

        <nav className="nav-links">
          <a href="#console">AI Console</a>
          <a href="#vault">Native Vault</a>
          <a href="#team">Equipo & Roles</a>
          <a href="#billing">Facturación</a>
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

