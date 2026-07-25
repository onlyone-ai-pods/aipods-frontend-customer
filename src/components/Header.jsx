import React from 'react';

export default function Header({ onOpenSandbox }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="brand-logo">
          <span className="logo-icon">🤖</span>
          <span className="logo-text">AI Pods <span className="badge">Enterprise</span></span>
        </div>

        <nav className="nav-links">
          <a href="#servicio">Servicio como Software</a>
          <a href="#sandbox">Sandbox Interactivo</a>
          <a href="#pods">AI Pods</a>
          <a href="#precios">Precios</a>
        </nav>

        <div className="nav-actions">
          <button className="btn-secondary" onClick={onOpenSandbox}>
            Iniciar Sesión
          </button>
          <button className="btn-primary" onClick={onOpenSandbox}>
            Probar Gratis
          </button>
        </div>
      </div>
    </header>
  );
}
