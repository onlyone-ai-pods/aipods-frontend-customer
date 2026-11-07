import React, { useState } from 'react';
import { apiFetch, getSession } from '../services/session.js';

/**
 * InviteMemberModal: da de alta un usuario del tenant en el core (SPEC-CORE-67.R16).
 * No hay envío de emails: el admin le pasa la contraseña inicial a la persona,
 * que después la cambia desde Configuración.
 */
const input = { width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' };

export default function InviteMemberModal({ isOpen, onClose, onCreated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const close = () => {
    setEmail('');
    setPassword('');
    setRole('customer');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await apiFetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, roles: [role], tenant_id: getSession()?.user.tenant_id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) throw new Error('Ese email ya está registrado.');
      if (!res.ok) throw new Error(data.error || 'No se pudo crear el usuario.');
      onCreated();
      close();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', maxWidth: '460px', width: '90%', color: 'var(--text-main)' }}>
        <h3 style={{ margin: '0 0 6px 0', color: 'var(--accent-cyan)' }}>➕ Agregar colaborador</h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
          No se envía ningún email: pasale la contraseña inicial a la persona y pedile que la cambie en Configuración.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle} htmlFor="invite-email">Email</label>
            <input id="invite-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="persona@empresa.com" style={input} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle} htmlFor="invite-password">Contraseña inicial</label>
            <input id="invite-password" type="password" required minLength={12} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 12 caracteres" style={input} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle} htmlFor="invite-role">Rol</label>
            <select id="invite-role" value={role} onChange={(e) => setRole(e.target.value)} style={input}>
              <option value="customer">Usuario (usa los pods)</option>
              <option value="tenant_admin">Administrador (además gestiona el equipo)</option>
            </select>
          </div>
          {error && <p role="alert" style={{ color: '#f87171', fontSize: '0.82rem', margin: '0 0 12px 0' }}>{error}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="btn-secondary" onClick={close}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creando…' : 'Crear usuario'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
