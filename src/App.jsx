import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import CustomerPortalSidebar from './components/CustomerPortalSidebar.jsx';
import Hero from './components/Hero.jsx';
import ValuePillars from './components/ValuePillars.jsx';
import InteractiveSandbox from './components/InteractiveSandbox.jsx';
import ConversionModal from './components/ConversionModal.jsx';
import './index.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeModule, setActiveModule] = useState('console');
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Aplicar atributo data-theme al root HTML (SPEC-CORE-22)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container" data-theme={theme}>
      <Header
        currentTheme={theme}
        onThemeChange={setTheme}
        onOpenSandbox={() => setShowConversionModal(true)}
      />
      
      <div className="portal-layout">
        {/* Sidebar Fija Navegación SaaS (SPEC-CORE-24) */}
        <CustomerPortalSidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />

        {/* Ámbito de Contenido del Módulo Seleccionado */}
        <main className="portal-content-area">
          {activeModule === 'console' && (
            <>
              <Hero onOpenSandbox={() => setShowConversionModal(true)} />
              <ValuePillars />
              <InteractiveSandbox onShowConversion={() => setShowConversionModal(true)} />
            </>
          )}

          {activeModule === 'vault' && (
            <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>🛡️ Native Vault de Credenciales & Secretos</h2>
              <p style={{ color: 'var(--text-muted)' }}>Cifrado simétrico AES-256 GCM en reposo y custodia efímera BYOV Bitwarden (SPEC-CORE-29).</p>
              <div style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <h3>🔑 Secreto Aprovisionado: AFIP / ARCA Fiscal</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>CUIT: 30-71123456-8 · Certificado Homologación `.crt` Cargado</p>
                <button className="btn-secondary" style={{ marginTop: '12px' }}>Ver Detalle del Vault</button>
              </div>
            </section>
          )}

          {activeModule === 'team' && (
            <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>👥 Equipo, Roles RBAC & IAM Audit Trail</h2>
              <p style={{ color: 'var(--text-muted)' }}>Matriz de permisos de Pods y registro inmutable de auditoría con firma SHA-256 (SPEC-CORE-24).</p>
              <div style={{ marginTop: '24px', padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                <h3>👤 Administrador Principal: Martin Silva</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)' }}>Rol: TENANT_OWNER · Permisos Totales en todos los AI Pods</p>
              </div>
            </section>
          )}

          {activeModule === 'billing' && (
            <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>💳 Facturación, Suscripción & Métricas</h2>
              <p style={{ color: 'var(--text-muted)' }}>Plan Enterprise Multi-Pod activo · Tokens consumidos del mes.</p>
            </section>
          )}

          {activeModule === 'settings' && (
            <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
              <h2>👤 Mi Cuenta & Preferencias</h2>
              <p style={{ color: 'var(--text-muted)' }}>Configuración de 2FA/MFA, datos personales y preferencia de tema.</p>
            </section>
          )}
        </main>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 Martin Llanos. Todos los derechos reservados. AI Pods Enterprise SaaS Platform.</p>
        </div>
      </footer>

      <ConversionModal
        isOpen={showConversionModal}
        onClose={() => setShowConversionModal(false)}
      />
    </div>
  );
}

