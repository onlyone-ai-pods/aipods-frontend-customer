import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ValuePillars from './components/ValuePillars.jsx';
import InteractiveSandbox from './components/InteractiveSandbox.jsx';
import ConversionModal from './components/ConversionModal.jsx';
import './index.css';

export default function App() {
  const [showConversionModal, setShowConversionModal] = useState(false);

  return (
    <div className="app-container">
      <Header onOpenSandbox={() => setShowConversionModal(true)} />
      
      <main>
        <Hero onOpenSandbox={() => setShowConversionModal(true)} />
        <ValuePillars />
        <InteractiveSandbox onShowConversion={() => setShowConversionModal(true)} />
      </main>

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
