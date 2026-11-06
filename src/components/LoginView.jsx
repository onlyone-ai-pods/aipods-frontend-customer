import React, { useState } from 'react';
import { login } from '../services/session.js';

/**
 * LoginView — Ingreso al portal de clientes (SPEC-CORE-67.R10).
 * El token queda en memoria (services/session.js); recargar pide login de nuevo.
 */
export default function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err.message);
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-main)',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: 'var(--bg-primary)', color: 'var(--text-main)' }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '18px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '2.4rem' }}>🤖</div>
          <h2 style={{ margin: '6px 0 4px', fontSize: '1.4rem' }}>AI Pods</h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>Ingresá con el usuario de tu empresa</p>
        </div>

        {error && (
          <div role="alert" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.35)', color: '#f87171', padding: '10px 12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '14px' }}>
          <label htmlFor="login-email" style={labelStyle}>Email</label>
          <input id="login-email" type="email" autoComplete="username" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>
        <div style={{ marginBottom: '22px' }}>
          <label htmlFor="login-password" style={labelStyle}>Contraseña</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}
