import React, { useCallback, useEffect, useState } from 'react';
import InviteMemberModal from './InviteMemberModal.jsx';
import { apiFetch, getSession, hasRole } from '../services/session.js';

/**
 * TeamPermissionsView: equipo del tenant y su auditoría, leídos del core
 * (SPEC-CORE-67.R12, R13, R16, R17). Solo un tenant_admin gestiona el equipo.
 */
const ROLE_LABELS = {
  customer: 'Usuario',
  tenant_admin: 'Administrador',
  auditor: 'Auditor (staff)',
  platform_admin: 'Admin de plataforma (staff)',
};
const STAFF = ['auditor', 'platform_admin'];
const ACTION_LABELS = {
  'user.create': 'Alta de usuario',
  'user.roles': 'Cambio de rol',
  'user.activate': 'Usuario activado',
  'user.deactivate': 'Usuario desactivado',
  'user.password_reset': 'Contraseña reseteada por un admin',
  'auth.password_change': 'Cambio de contraseña propia',
  'auth.login': 'Inicio de sesión',
  'vault.store': 'Secreto guardado en el vault',
  'vault.reveal': 'Secreto revelado del vault',
  'approval.approve': 'Aprobación concedida',
  'approval.reject': 'Aprobación rechazada',
};

const th = { padding: '12px 16px', textAlign: 'left' };
const td = { padding: '12px 16px' };
const small = { padding: '4px 10px', fontSize: '0.75rem' };

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}

async function readJSON(res, fallback) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || fallback);
  return data;
}

export default function TeamPermissionsView() {
  const [activeTab, setActiveTab] = useState('members');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resetFor, setResetFor] = useState(null);
  const [resetPassword, setResetPassword] = useState('');

  const session = getSession();
  const isAdmin = hasRole('tenant_admin', 'platform_admin');

  const load = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const [u, a] = await Promise.all([
        apiFetch('/api/v1/admin/users').then((r) => readJSON(r, 'No se pudo leer el equipo.')),
        apiFetch('/api/v1/admin/audit/log').then((r) => readJSON(r, 'No se pudo leer la auditoría.')),
      ]);
      setMembers(u.users || []);
      setEvents(a.events || []);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (promise, okText) => {
    setNotice('');
    try {
      await promise;
      setNotice(okText);
      setError('');
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeRole = (m, role) =>
    act(
      apiFetch(`/api/v1/admin/users/${m.id}/roles`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roles: [role] }),
      }).then((r) => readJSON(r, 'No se pudo cambiar el rol.')),
      `${m.email} ahora es ${ROLE_LABELS[role]}. Sus sesiones abiertas se cerraron.`,
    );

  const toggleActive = (m) =>
    act(
      apiFetch(`/api/v1/admin/users/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !m.active }),
      }).then((r) => readJSON(r, 'No se pudo cambiar el estado.')),
      m.active ? `${m.email} quedó desactivado y sus sesiones se cerraron.` : `${m.email} quedó activo.`,
    );

  const submitReset = (e) => {
    e.preventDefault();
    const m = resetFor;
    act(
      apiFetch(`/api/v1/admin/users/${m.id}/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: resetPassword }),
      }).then((r) => readJSON(r, 'No se pudo resetear la contraseña.')),
      `Contraseña de ${m.email} cambiada. Sus sesiones abiertas se cerraron.`,
    ).then(() => {
      setResetFor(null);
      setResetPassword('');
    });
  };

  const tabStyle = (id) => ({
    padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600',
    borderBottom: activeTab === id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
    color: activeTab === id ? 'var(--accent-cyan)' : 'var(--text-muted)',
  });
  const panel = { background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflowX: 'auto' };
  const headRow = { background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--text-muted)' };

  return (
    <div className="team-view-container" style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem' }}>👥 Equipo & Roles</h2>
          <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Usuarios de tu organización y el registro de auditoría de sus cambios.
          </p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowInviteModal(true)}>+ Agregar colaborador</button>
        )}
      </div>

      {!session && (
        <p style={{ color: 'var(--text-muted)' }}>La gestión del equipo necesita iniciar sesión, y el core está corriendo sin login.</p>
      )}
      {session && !isAdmin && (
        <p style={{ color: 'var(--text-muted)' }}>Solo los administradores de tu organización pueden ver y gestionar el equipo. Pedile a uno que te cambie el rol si lo necesitás.</p>
      )}

      {isAdmin && (
        <>
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <button onClick={() => setActiveTab('members')} style={tabStyle('members')}>👤 Colaboradores ({members.length})</button>
            <button onClick={() => setActiveTab('audit')} style={tabStyle('audit')}>📜 Auditoría ({events.length})</button>
          </div>

          {error && <p role="alert" style={{ color: '#f87171', fontSize: '0.85rem' }}>{error}</p>}
          {notice && <p role="status" style={{ color: '#34d399', fontSize: '0.85rem' }}>{notice}</p>}

          {resetFor && (
            <form onSubmit={submitReset} style={{ ...panel, padding: '16px', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem' }}>Nueva contraseña para <b>{resetFor.email}</b>:</span>
              <input type="password" required minLength={12} autoComplete="new-password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} placeholder="Mínimo 12 caracteres"
                style={{ padding: '8px 10px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)' }} />
              <button type="submit" className="btn-primary" style={small}>Guardar</button>
              <button type="button" className="btn-secondary" style={small} onClick={() => { setResetFor(null); setResetPassword(''); }}>Cancelar</button>
            </form>
          )}

          {activeTab === 'members' && (
            <div style={panel}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={headRow}>
                    <th style={th}>Colaborador</th>
                    <th style={th}>Rol</th>
                    <th style={th}>Estado</th>
                    <th style={th}>Alta</th>
                    <th style={{ ...th, textAlign: 'right' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => {
                    const role = (m.roles || []).includes('tenant_admin') ? 'tenant_admin' : 'customer';
                    const self = session && m.id === session.user.id;
                    const staff = (m.roles || []).some((r) => STAFF.includes(r));
                    const editable = !self && !staff;
                    return (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ ...td, fontWeight: '600' }}>{m.email}{self && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> (vos)</span>}</td>
                        <td style={td}>
                          {editable ? (
                            <select aria-label={`Rol de ${m.email}`} value={role} onChange={(e) => changeRole(m, e.target.value)}
                              style={{ padding: '6px 8px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--text-main)' }}>
                              <option value="customer">{ROLE_LABELS.customer}</option>
                              <option value="tenant_admin">{ROLE_LABELS.tenant_admin}</option>
                            </select>
                          ) : (m.roles || []).map((r) => ROLE_LABELS[r] || r).join(', ')}
                        </td>
                        <td style={{ ...td, color: m.active ? '#34d399' : '#f87171', fontWeight: '600' }}>{m.active ? 'Activo' : 'Desactivado'}</td>
                        <td style={{ ...td, color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(m.created_at)}</td>
                        <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {editable && (
                            <>
                              <button className="btn-secondary" style={{ ...small, marginRight: '6px' }} onClick={() => setResetFor(m)}>Resetear contraseña</button>
                              <button className="btn-secondary" style={small} onClick={() => toggleActive(m)}>{m.active ? 'Desactivar' : 'Activar'}</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {members.length === 0 && !error && (
                    <tr><td colSpan={5} style={{ ...td, color: 'var(--text-muted)' }}>Cargando equipo…</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'audit' && (
            <div style={panel}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={headRow}>
                    <th style={th}>Fecha</th>
                    <th style={th}>Quién</th>
                    <th style={th}>Acción</th>
                    <th style={th}>Sobre</th>
                    <th style={th}>Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ ...td, color: 'var(--text-muted)' }}>{formatDate(ev.created_at)}</td>
                      <td style={{ ...td, fontWeight: '600' }}>{ev.actor}</td>
                      <td style={td}>{ACTION_LABELS[ev.action] || ev.action}</td>
                      <td style={td}>{ev.target || '—'}</td>
                      <td style={{ ...td, color: ev.outcome === 'success' ? '#34d399' : '#f87171' }}>{ev.outcome === 'success' ? 'OK' : ev.outcome}</td>
                    </tr>
                  ))}
                  {events.length === 0 && (
                    <tr><td colSpan={5} style={{ ...td, color: 'var(--text-muted)' }}>Sin eventos registrados todavía.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onCreated={() => { setNotice('Usuario creado.'); load(); }}
      />
    </div>
  );
}
