import React from 'react';

/**
 * CustomerPortalSidebar — Barra de navegación lateral fija del Customer Portal (SPEC-CORE-24).
 *
 * Módulos:
 *  - 'console': Consola Interactiva Multi-Pod & Sandbox
 *  - 'vault': Vault Nativo de Credenciales & Secretos (AFIP, Odoo, GitHub)
 *  - 'team': Equipo, Permisos RBAC/ABAC & IAM Audit Trail
 *  - 'billing': Facturación, Consumo & Suscripción
 *  - 'settings': Perfil Personal, Seguridad 2FA & Ajustes
 */
export default function CustomerPortalSidebar({ activeModule, onModuleChange }) {
  const menuItems = [
    { id: 'console', label: 'AI Console', icon: '🤖', badge: 'Multi-Pod' },
    { id: 'vault', label: 'Native Vault', icon: '🛡️', badge: 'AES-256' },
    { id: 'team', label: 'Equipo & Roles', icon: '👥', badge: 'RBAC' },
    { id: 'billing', label: 'Facturación', icon: '💳', badge: 'SaaS' },
    { id: 'settings', label: 'Mi Cuenta', icon: '👤', badge: null }
  ];

  return (
    <aside className="portal-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">⚡</span>
          <div className="brand-text-wrap">
            <span className="brand-name">Be OnlyOne</span>
            <span className="brand-sub">Customer Portal v47.0</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-group-title">MÓDULOS DEL SAAS</div>
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${activeModule === item.id ? 'active' : ''}`}
            onClick={() => onModuleChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="tenant-info-card">
          <span className="tenant-icon">🏢</span>
          <div className="tenant-details">
            <span className="tenant-name">Acme Corp S.A.</span>
            <span className="tenant-plan">Plan Enterprise</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
