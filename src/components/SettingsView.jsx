import React, { useState } from 'react';

/**
 * SettingsView — Panel de Perfil de Usuario, Seguridad 2FA y Preferencias (SPEC-CORE-31).
 */
export default function SettingsView() {
  const [profile, setProfile] = useState({
    fullName: 'Martin Llanos',
    email: 'martin.llanos@acmecorp.com',
    tenantName: 'Acme Corporation S.A.',
    cuit: '30-71123456-8',
    role: 'Administrator'
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleEnable2FA = () => {
    if (otpCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQR(false);
      setOtpCode('');
    }
  };

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          👤 Mi Cuenta, Seguridad 2FA & Preferencias
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
          Administración de identidad personal, vinculación de autenticadores 2FA y datos de empresa (SPEC-CORE-31).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Card 1: Perfil de Usuario */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✏️ Datos Personales & Empresa
          </h3>

          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Nombre Completo</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Correo Electrónico</label>
              <input
                type="email"
                disabled
                value={profile.email}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'not-allowed' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Empresa / Tenant Activo</label>
              <input
                type="text"
                disabled
                value={`${profile.tenantName} (CUIT: ${profile.cuit})`}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'not-allowed' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '8px 20px', width: '100%' }}>
              {savedSuccess ? '✅ Cambios Guardados' : '💾 Guardar Preferencias'}
            </button>
          </form>
        </div>

        {/* Card 2: Autenticación 2FA TOTP */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔐 Autenticación de 2 Factores (2FA)
            </h3>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', background: twoFactorEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: twoFactorEnabled ? '#34d399' : '#f87171', border: `1px solid ${twoFactorEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(248, 113, 113, 0.3)'}` }}>
              {twoFactorEnabled ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'}
            </span>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
            Proteja las mutaciones en producción y la gestión del Native Vault mediante un código TOTP de 6 dígitos.
          </p>

          {!twoFactorEnabled && !showQR && (
            <button
              onClick={() => setShowQR(true)}
              className="btn-primary"
              style={{ padding: '10px 16px', width: '100%', background: '#2563eb' }}
            >
              📲 Vincular Google Authenticator / Authy
            </button>
          )}

          {showQR && (
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ background: '#fff', padding: '12px', display: 'inline-block', borderRadius: '8px', marginBottom: '12px' }}>
                <div style={{ width: '120px', height: '120px', background: '#000', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  QR TOTP CODE<br/>AIPODS-2026
                </div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                Escanee el código QR e ingrese el token de 6 dígitos:
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  style={{ width: '120px', textAlign: 'center', padding: '8px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent-cyan)', fontWeight: '800', letterSpacing: '4px' }}
                />
                <button
                  onClick={handleEnable2FA}
                  className="btn-primary"
                  style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                >
                  Verificar & Activar
                </button>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.82rem' }}>
              ✓ Su cuenta cuenta con protección 2FA de nivel bancario. Todas las mutaciones requerirán confirmación OTP.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
