import React, { useState } from 'react';

/**
 * NativeVaultView — Módulo completo del Vault de Credenciales & Secretos (SPEC-CORE-24 & SPEC-CORE-29).
 */
export default function NativeVaultView() {
  const [vaultMode, setVaultMode] = useState('native'); // 'native' | 'byov'
  const [bitwardenToken, setBitwardenToken] = useState('bwm_sa_9f8a7b6c5d4e3f2a1b');
  const [showSecret, setShowSecret] = useState({});

  const secrets = [
    {
      id: 'sec_afip_01',
      pod: '🇦🇷 AI Pod AFIP / ARCA Fiscal',
      name: 'Clave Fiscal & Certificado CRT/KEY',
      cuit: '30-71123456-8',
      status: 'VALID',
      expires: '2027-05-15',
      fields: [
        { label: 'CUIT Empresa', value: '30-71123456-8', secret: false },
        { label: 'Clave Fiscal AFIP (Nivel 3)', value: 'ClaveFiscalSuperSegura2026!', secret: true },
        { label: 'Certificado CRT', value: '-----BEGIN CERTIFICATE-----\nMIID3zCCAsegAwIBAgIU...\n-----END CERTIFICATE-----', secret: true }
      ]
    },
    {
      id: 'sec_odoo_01',
      pod: '🏭 AI Pod Odoo Enterprise ERP',
      name: 'API Key & Credenciales Instancia Odoo',
      cuit: 'odoo-prod.acmecorp.com',
      status: 'VALID',
      expires: '2026-12-31',
      fields: [
        { label: 'URL Instancia Odoo', value: 'https://odoo-prod.acmecorp.com', secret: false },
        { label: 'Database Name', value: 'acme_production_db', secret: false },
        { label: 'User Admin / API User', value: 'bot.aipods@acmecorp.com', secret: false },
        { label: 'API Key Odoo (v16+)', value: 'odoo_api_key_88f7a6b5c4d3e2f1', secret: true }
      ]
    },
    {
      id: 'sec_github_01',
      pod: '🐙 AI Pod GitHub & Odoo.sh DevOps',
      name: 'GitHub Personal Access Token (PAT)',
      cuit: 'github.com/onlyone-ai-pods',
      status: 'VALID',
      expires: '2026-09-30',
      fields: [
        { label: 'Organización GitHub', value: 'onlyone-ai-pods', secret: false },
        { label: 'Personal Access Token', value: 'ghp_x9K2mL4nP7qR1sT0vW3xY5zA6bC8dE9fG0hI', secret: true },
        { label: 'Odoo.sh API Token', value: 'odoosh_token_77a6b5c4d3e2f1a0', secret: true }
      ]
    }
  ];

  const [revealedData, setRevealedData] = useState({});

  const toggleSecret = async (fieldId, keyName) => {
    if (showSecret[fieldId]) {
      setShowSecret(prev => ({ ...prev, [fieldId]: false }));
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/v1/vault/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_name: keyName || 'ODOO_ENTERPRISE_API_KEY' })
      });
      if (res.ok) {
        const data = await res.json();
        setRevealedData(prev => ({ ...prev, [fieldId]: data.plain_text }));
      }
    } catch (err) {
      console.log('[VAULT REVEAL NOTE]', err.message);
    }

    setShowSecret(prev => ({ ...prev, [fieldId]: true }));

    // Auto-purga de memoria RAM a los 15 segundos (SPEC-CORE-29 Zero-Trust Standard)
    setTimeout(() => {
      setShowSecret(prev => ({ ...prev, [fieldId]: false }));
      setRevealedData(prev => ({ ...prev, [fieldId]: null }));
    }, 15000);
  };

  return (
    <div className="vault-view-container" style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="vault-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🛡️ Native Vault de Credenciales & Secretos
            </h2>
            <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
              Gestión centralizada de credenciales por Tenant con cifrado simétrico AES-256 GCM y custodia BYOV (SPEC-CORE-29).
            </p>
          </div>

          {/* Mode Selector */}
          <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-color)', padding: '4px', borderRadius: '10px', display: 'flex', gap: '4px' }}>
            <button
              className={`btn-secondary ${vaultMode === 'native' ? 'active' : ''}`}
              onClick={() => setVaultMode('native')}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', background: vaultMode === 'native' ? 'var(--accent-cyan)' : 'transparent', color: vaultMode === 'native' ? '#000' : 'var(--text-muted)', fontWeight: vaultMode === 'native' ? '700' : '500' }}
            >
              🛡️ Vault Nativo (AES-256)
            </button>
            <button
              className={`btn-secondary ${vaultMode === 'byov' ? 'active' : ''}`}
              onClick={() => setVaultMode('byov')}
              style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: '6px', background: vaultMode === 'byov' ? 'var(--accent-cyan)' : 'transparent', color: vaultMode === 'byov' ? '#000' : 'var(--text-muted)', fontWeight: vaultMode === 'byov' ? '700' : '500' }}
            >
              🔐 BYOV (Bitwarden Secrets)
            </button>
          </div>
        </div>
      </div>

      {/* BYOV Configuration Panel */}
      {vaultMode === 'byov' && (
        <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid var(--accent-cyan)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Bring Your Own Vault (Bitwarden Secrets Manager)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
            Las credenciales no se persisten en disco. El motor consulta la API de Bitwarden en memoria RAM volátil en tiempo de ejecución.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              type="password"
              value={bitwardenToken}
              onChange={(e) => setBitwardenToken(e.target.value)}
              placeholder="bwm_sa_..."
              style={{ flexGrow: 1, padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.85rem' }}
            />
            <button className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Validar Conexión BYOV
            </button>
          </div>
        </div>
      )}

      {/* Secrets List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {secrets.map(sec => (
          <div key={sec.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0, 242, 254, 0.25)' }}>
                  {sec.pod}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: '600', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🟢 {sec.status}
                </span>
              </div>

              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-main)' }}>
                {sec.name}
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                ID / Dominio: <strong>{sec.cuit}</strong>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                {sec.fields.map((f, i) => (
                  <div key={i} style={{ fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: '600' }}>{f.label}</div>
                    <div style={{ fontFamily: 'monospace', color: 'var(--text-main)', wordBreak: 'break-all', marginTop: '2px' }}>
                      {f.secret && !showSecret[sec.id] ? '••••••••••••••••' : (revealedData[sec.id] || f.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Expira: {sec.expires}
              </span>
              <button
                className="btn-secondary"
                onClick={() => toggleSecret(sec.id)}
                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
              >
                {showSecret[sec.id] ? '🙈 Ocultar' : '👁️ Revelar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
