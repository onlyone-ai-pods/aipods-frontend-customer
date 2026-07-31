import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import CustomerPortalSidebar from './components/CustomerPortalSidebar.jsx';
import Hero from './components/Hero.jsx';
import ValuePillars from './components/ValuePillars.jsx';
import InteractiveSandbox from './components/InteractiveSandbox.jsx';
import NativeVaultView from './components/NativeVaultView.jsx';
import TeamPermissionsView from './components/TeamPermissionsView.jsx';
import BillingView from './components/BillingView.jsx';
import SettingsView from './components/SettingsView.jsx';
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

          {activeModule === 'vault' && <NativeVaultView />}

          {activeModule === 'team' && <TeamPermissionsView />}

          {activeModule === 'billing' && <BillingView />}

          {activeModule === 'settings' && <SettingsView />}
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
