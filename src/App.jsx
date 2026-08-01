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
  const [theme, setTheme] = useState(() => localStorage.getItem('aipods_theme') || 'dark');
  
  // Obtener módulo inicial desde Hash de URL (ej. #settings) o LocalStorage (SPEC-CORE-31)
  const getInitialModule = () => {
    const hash = window.location.hash.replace('#', '');
    const validModules = ['console', 'vault', 'team', 'billing', 'settings', 'sandbox'];
    if (validModules.includes(hash)) return hash;
    return localStorage.getItem('aipods_active_module') || 'console';
  };

  const [activeModule, setActiveModuleState] = useState(getInitialModule);
  const [showConversionModal, setShowConversionModal] = useState(false);

  // Función envolvente para cambiar de módulo y perservar en Hash + LocalStorage
  const handleModuleChange = (moduleKey) => {
    setActiveModuleState(moduleKey);
    window.location.hash = moduleKey;
    localStorage.setItem('aipods_active_module', moduleKey);
  };

  // Escuchar cambios de hash en la ventana (botón Atrás/Adelante del navegador)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validModules = ['console', 'vault', 'team', 'billing', 'settings', 'sandbox'];
      if (validModules.includes(hash)) {
        setActiveModuleState(hash);
        localStorage.setItem('aipods_active_module', hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Aplicar atributo data-theme al root HTML y guardar en localStorage (SPEC-CORE-22)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('aipods_theme', theme);
  }, [theme]);

  return (
    <div className="app-container" data-theme={theme}>
      <Header
        currentTheme={theme}
        activeModule={activeModule}
        onThemeChange={setTheme}
        onOpenSandbox={() => setShowConversionModal(true)}
        onModuleChange={handleModuleChange}
      />
      
      <div className="portal-layout">
        {/* Sidebar Fija Navegación SaaS (SPEC-CORE-24) */}
        <CustomerPortalSidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
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

          {activeModule === 'settings' && <SettingsView currentTheme={theme} onThemeChange={setTheme} />}
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
