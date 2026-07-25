import React from 'react';

export default function ConversionModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-header">
          <div className="modal-icon">🎉</div>
          <h2>¿Te gustó la precisión de tu AI Pod?</h2>
          <p>Crea tu cuenta gratis en 1 clic para guardar este AI Pod permanentemente y obtener 50,000 tokens en tu Trial de 14 días.</p>
        </div>

        <div className="modal-body">
          <button className="btn-sso google" onClick={() => alert('Registrándose con Google Workspace SSO...')}>
            <span className="sso-icon">🌐</span> Registrarse con Google Workspace
          </button>
          
          <button className="btn-sso microsoft" onClick={() => alert('Registrándose con Microsoft 365 SSO...')}>
            <span className="sso-icon">🪟</span> Registrarse con Microsoft 365
          </button>

          <div className="modal-divider"><span>O mediante Magic Link</span></div>

          <form onSubmit={(e) => { e.preventDefault(); alert('Magic Link enviado a su correo electrónico.'); onClose(); }}>
            <input type="email" placeholder="tu-email@empresa.com" required className="modal-input" />
            <button type="submit" className="btn-primary full-width">Enviar Magic Link Instantáneo</button>
          </form>
        </div>

        <div className="modal-footer">
          🔒 Sin tarjeta de crédito requerida • Aprovisionamiento en &lt; 2 segundos
        </div>
      </div>
    </div>
  );
}
