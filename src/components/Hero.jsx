import React from 'react';

export default function Hero({ onOpenSandbox }) {
  return (
    <section className="hero-section" id="servicio">
      <div className="hero-content">
        <div className="paradigm-badge">
          ✨ Paradigma Transformador: Servicio como Software
        </div>
        
        <h1 className="hero-headline">
          Deje de Alquilar Herramientas.<br />
          Empiece a Contratar <span className="gradient-text">Resultados</span>.
        </h1>
        
        <p className="hero-description">
          Despliegue <strong>AI Pods</strong>: Agentes autónomos de Inteligencia Artificial especializados en AFIP/ARCA, Odoo, SAP, SCM y GitHub que ejecutan el trabajo complejo por su empresa en segundos.
        </p>

        <div className="hero-cta-group">
          <button className="btn-hero-primary" onClick={onOpenSandbox}>
            🚀 Probar Sandbox Sin Login (Sube tu PDF)
          </button>
          <a href="#sandbox" className="btn-hero-secondary">
            Ver Demostración en Vivo ↓
          </a>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">80%</span>
            <span className="stat-label">Reducción en Costos de Soporte</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">&lt; 3s</span>
            <span className="stat-label">Tiempo de Respuesta con Citas</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-label">Cero Alucinaciones Verificado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
