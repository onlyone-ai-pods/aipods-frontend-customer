import React, { useState } from 'react';

/**
 * InviteMemberModal — Modal interactivo para invitar colaboradores y asignar roles RBAC (SPEC-CORE-31 / Issue #17).
 */
export default function InviteMemberModal({ isOpen, onClose, onInviteSuccess }) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Operator');
  const [podPermissions, setPodPermissions] = useState({
    POD_AFIP_FISCAL: true,
    POD_ODOO_ENTERPRISE: true,
    POD_GITHUB_DEVOPS: false
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !fullName) return;

    const newMember = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: fullName,
      email: email,
      role: role,
      status: 'INVITED',
      joinedDate: 'Hoy (Pendiente)',
      avatar: fullName.substring(0, 2).toUpperCase()
    };

    onInviteSuccess(newMember);
    setEmail('');
    setFullName('');
    onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '24px', maxWidth: '500px', width: '90%', color: 'var(--text-main)' }}>
        <h3 style={{ margin: '0 0 6px 0', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          ➕ Invitar Nuevo Colaborador al equipo
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
          Asignación granular de roles RBAC y registro inmutable en el IAM Audit Trail (SPEC-CORE-31).
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Nombre Completo</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Carlos Mendoza"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Correo Electrónico Corporativo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="carlos.mendoza@empresa.com"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>Rol Asignado (RBAC)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem' }}
            >
              <option value="Admin">🔑 Admin (Acceso Total & Gestión de Roles)</option>
              <option value="Operator">⚡ Operator (Ejecución de Consultas & Dry-Run)</option>
              <option value="Viewer">👁️ Viewer (Solo Lectura sin Mutaciones)</option>
              <option value="Auditor">🛡️ Auditor (Acceso a IAM Audit Trail & Dossiers)</option>
            </select>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>🌐 Idioma Inicial de la Invitación (`i18n` SPEC-CORE-45)</label>
            <select
              defaultValue="es"
              style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
            >
              <option value="es">🇦🇷 / 🇲🇽 / 🇨🇱 / 🇵🇪 / 🇺Y — Español (Latam)</option>
              <option value="pt">🇧🇷 — Português (Brasil)</option>
              <option value="en">🇺🇸 — English (United States)</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px', background: 'var(--bg-input)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px' }}>Permisos de Acceso a AI Pods:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={podPermissions.POD_AFIP_FISCAL}
                  onChange={(e) => setPodPermissions(p => ({ ...p, POD_AFIP_FISCAL: e.target.checked }))}
                />
                🇦🇷 AI Pod ARCA / AFIP Fiscal
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={podPermissions.POD_ODOO_ENTERPRISE}
                  onChange={(e) => setPodPermissions(p => ({ ...p, POD_ODOO_ENTERPRISE: e.target.checked }))}
                />
                🏭 AI Pod Odoo Enterprise ERP
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={podPermissions.POD_GITHUB_DEVOPS}
                  onChange={(e) => setPodPermissions(p => ({ ...p, POD_GITHUB_DEVOPS: e.target.checked }))}
                />
                🐙 AI Pod GitHub / Odoo.sh DevOps
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '8px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '8px 20px' }}
            >
              ✉️ Enviar Invitación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
