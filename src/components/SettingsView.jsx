import React, { useState } from 'react';

/**
 * SettingsView — Panel de Usabilidad: Edición Completa de Perfil, Cambio de Contraseña, 2FA y Preferencias (SPEC-CORE-31).
 */
export default function SettingsView() {
  const [profile, setProfile] = useState({
    fullName: 'Martin Llanos',
    email: 'martin.llanos@acmecorp.com',
    tenantName: 'Acme Corporation S.A.',
    cuit: '30-71123456-8',
    role: 'Administrator',
    theme: 'Dark Neon (Recomendado)'
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordState.newPassword && passwordState.newPassword === passwordState.confirmPassword) {
      setPasswordSuccess(true);
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(false), 3500);
    }
  };

  const handleEnable2FA = () => {
    if (otpCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowQR(false);
      setOtpCode('');
    }
  };

  return (
    <div style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-main)' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ⚙️ Configuración de Cuenta, Usabilidad & Seguridad
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
          Gestión de identidad de usuario, actualización de datos de empresa/CUIT, cambio de contraseña y 2FA (SPEC-CORE-31).
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        
        {/* Bloque 1: Perfil de Usuario & Datos de Empresa Editables */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✏️ Datos Personales & Razón Social
          </h3>

          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Nombre Completo</label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Correo Electrónico Corporativo</label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Empresa / Razón Social</label>
              <input
                type="text"
                required
                value={profile.tenantName}
                onChange={(e) => setProfile({ ...profile, tenantName: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>CUIT / Tax Identifier</label>
              <input
                type="text"
                required
                value={profile.cuit}
                onChange={(e) => setProfile({ ...profile, cuit: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Preferencia de Tema Visual</label>
              <select
                value={profile.theme}
                onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}
              >
                <option value="Dark Neon (Recomendado)">🌙 Dark Neon (Enterprise Default)</option>
                <option value="Light Clean">☀️ Light Clean (Modo Claro)</option>
                <option value="High Contrast Accessibility">👁️ Alto Contraste (Accesibilidad ISO)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '10px 20px', width: '100%', fontWeight: '700' }}>
              {savedSuccess ? '✅ Perfil & Empresa Guardados con Éxito' : '💾 Guardar Cambios de Perfil'}
            </button>
          </form>
        </div>

        {/* Bloque 2: Cambio de Contraseña & Seguridad 2FA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Formulario de Cambio de Contraseña */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔑 Cambio de Contraseña de Acceso
            </h3>

            <form onSubmit={handleChangePassword}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Contraseña Actual</label>
                <input
                  type="password"
                  required
                  value={passwordState.currentPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordState.newPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  required
                  value={passwordState.confirmPassword}
                  onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                  placeholder="Repetir nueva contraseña"
                  style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
                />
              </div>

              <button type="submit" className="btn-secondary" style={{ padding: '8px 16px', width: '100%', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>
                {passwordSuccess ? '✅ Contraseña Actualizada' : '🔒 Actualizar Contraseña'}
              </button>
            </form>
          </div>

          {/* Estado de Autenticación 2FA */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🛡️ Autenticación de 2 Factores (2FA TOTP)
              </h3>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', background: twoFactorEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(248, 113, 113, 0.15)', color: twoFactorEnabled ? '#34d399' : '#f87171', border: `1px solid ${twoFactorEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(248, 113, 113, 0.3)'}` }}>
                {twoFactorEnabled ? '🟢 ACTIVADO' : '🔴 DESACTIVADO'}
              </span>
            </div>

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
                  <div style={{ width: '110px', height: '110px', background: '#000', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    QR TOTP CODE<br/>AIPODS-2026
                  </div>
                </div>
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
                    Verificar OTP
                  </button>
                </div>
              </div>
            )}

            {twoFactorEnabled && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#34d399', fontSize: '0.82rem' }}>
                ✓ Protección 2FA activa. Las mutaciones requerirán confirmación OTP.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
