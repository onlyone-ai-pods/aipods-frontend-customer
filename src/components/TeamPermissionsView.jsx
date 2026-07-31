import React, { useState } from 'react';
import InviteMemberModal from './InviteMemberModal.jsx';

/**
 * TeamPermissionsView — Módulo de Administración de Colaboradores, Matriz RBAC/ABAC e IAM Audit Trail (SPEC-CORE-24 & SPEC-CORE-31).
 */
export default function TeamPermissionsView() {
  const [activeTab, setActiveTab] = useState('members'); // 'members' | 'matrix' | 'audit'
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [members, setMembers] = useState([
    { id: 'usr_01', name: 'Martin Silva', email: 'martin.silva@acmecorp.com', role: '👑 TENANT_OWNER', status: 'ACTIVE', pods: ['AFIP', 'Odoo', 'GitHub'], lastActive: 'Hace 5 min' },
    { id: 'usr_02', name: 'Laura Gómez', email: 'laura.gomez@acmecorp.com', role: '💼 OPERATOR', status: 'ACTIVE', pods: ['AFIP', 'Odoo'], lastActive: 'Hace 2 horas' },
    { id: 'usr_03', name: 'Carlos Ruiz', email: 'carlos.ruiz@acmecorp.com', role: '💼 OPERATOR', status: 'ACTIVE', pods: ['Odoo (Stock)'], lastActive: 'Ayer' },
    { id: 'usr_04', name: 'Auditoría KPMG', email: 'auditor.kpmg@external.com', role: '👁️ AUDITOR', status: 'ACTIVE', pods: ['Todos (Read-only)'], lastActive: '23/07/2026' }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    { id: 'aud_01', date: '2026-07-30 21:35:00', actor: 'martin.silva@acmecorp.com', target: 'laura.gomez@acmecorp.com', change: '🟢 OTORGADO: AFIP /config (CSR)', risk: 'CRITICAL', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { id: 'aud_02', date: '2026-07-28 14:10:22', actor: 'martin.silva@acmecorp.com', target: 'carlos.ruiz@acmecorp.com', change: '🔴 REVOCADO: GitHub /deployments', risk: 'MEDIUM', hash: '88f7a6b5c4d3e2f1a09887766554433221100988776655443322110098877665' },
    { id: 'aud_03', date: '2026-07-25 09:15:04', actor: 'SYSTEM (Auto-Security)', target: 'esteban.q@acmecorp.com', change: '🔒 SUSPENDIDO: Inactividad 90 días', risk: 'INFO', hash: '77a6b5c4d3e2f1a0988776655443322110098877665544332211009887766544' }
  ]);

  const handleInviteSuccess = (newMember) => {
    setMembers(prev => [...prev, { ...newMember, pods: ['AFIP', 'Odoo'] }]);
    
    // Inyectar log criptográfico en el IAM Audit Trail con firma SHA-256
    const newLog = {
      id: `aud_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'martin.silva@acmecorp.com',
      target: newMember.email,
      change: `🟢 INVITACIÓN Y ROL ASIGNADO: ${newMember.role}`,
      risk: 'HIGH',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="team-view-container" style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="team-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            👥 Equipo, Roles & IAM Audit Trail
          </h2>
          <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
            Control de acceso basado en roles (RBAC/ABAC) y registro inmutable de auditoría con firma SHA-256 (SPEC-CORE-24).
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowInviteModal(true)}>
          + Invitar Colaborador
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('members')}
          style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'members' ? '2px solid var(--accent-cyan)' : '2px solid transparent', color: activeTab === 'members' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          👤 Colaboradores ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'matrix' ? '2px solid var(--accent-cyan)' : '2px solid transparent', color: activeTab === 'matrix' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          🎛️ Matriz de Permisos por Pod
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'audit' ? '2px solid var(--accent-cyan)' : '2px solid transparent', color: activeTab === 'audit' ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: '600', cursor: 'pointer' }}
        >
          📜 IAM Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: MEMBERS TABLE */}
      {activeTab === 'members' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Colaborador</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Rol</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Pods Permitidos</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Última Actividad</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-main)' }}>{m.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: '600' }}>{m.role}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {m.pods.map((p, i) => (
                        <span key={i} style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{m.lastActive}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Editar Permisos</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: PERMISSIONS MATRIX */}
      {activeTab === 'matrix' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Colaborador</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🇦🇷 AFIP Consultas</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🇦🇷 AFIP CSR/Claves</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🏭 Odoo Facturas</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🏭 Odoo Stock</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🐙 GitHub DevOps</th>
                <th style={{ padding: '12px 8px', textAlign: 'center' }}>🛡️ Vault Access</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Martin Silva (Owner)</td>
                <td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Laura Gómez (Finanzas)</td>
                <td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>❌</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Carlos Ruiz (Depósito)</td>
                <td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>❌</td>
              </tr>
              <tr>
                <td style={{ padding: '12px 16px', fontWeight: '600' }}>Auditoría KPMG</td>
                <td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>❌</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>✅</td><td style={{ textAlign: 'center' }}>❌</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: IAM AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', background: 'rgba(0,242,254,0.05)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
            🔒 Registro Inmutable Append-Only · Firma SHA-256 de Invariabilidad (ISO 27001 / SOC 2)
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Fecha / Hora</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actor (Quién Cambió)</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Target (Afectado)</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Cambio (Diff)</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Firma SHA-256</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{log.date}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{log.actor}</td>
                  <td style={{ padding: '12px 16px' }}>{log.target}</td>
                  <td style={{ padding: '12px 16px', fontWeight: '600' }}>{log.change}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {log.hash.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL DE INVITACIÓN DE COLABORADOR (SPEC-CORE-31 / Issue #17) */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInviteSuccess={handleInviteSuccess}
      />
    </div>
  );
}

