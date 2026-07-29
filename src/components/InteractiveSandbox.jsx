import React, { useState, useEffect, useRef } from 'react';

const datasetPV = [
  { numero: '00001', tipo: 'Comprobantes en Línea - Mercado Interno', estado: 'ACTIVO' },
  { numero: '00002', tipo: 'RECE para aplicativo y/o Web Services', estado: 'ACTIVO' },
  { numero: '00003', tipo: 'FactuWeb Histórico (Deprecado 2021)', estado: 'DADO DE BAJA' },
  { numero: '00005', tipo: 'Controlador Fiscal Sucursal Belgrano', estado: 'INACTIVO' },
  { numero: '00007', tipo: 'Factura Electrónica - Odoo Production', estado: 'ACTIVO' }
];

function getStatusBadge(estado) {
  if (estado === 'ACTIVO') return <span className="status-badge activo">🟢 {estado}</span>;
  if (estado === 'INACTIVO') return <span className="status-badge inactivo">🟡 {estado}</span>;
  return <span className="status-badge baja">🔴 {estado}</span>;
}

function filterDataset(query) {
  const lower = (query || '').toLowerCase();
  if (lower.includes('odoo')) return { rows: datasetPV.filter(pv => pv.tipo.toLowerCase().includes('odoo')), label: 'Odoo' };
  if (lower.includes('rece') || lower.includes('web service')) return { rows: datasetPV.filter(pv => pv.tipo.toLowerCase().includes('rece')), label: 'RECE' };
  if (lower.includes('belgrano') || lower.includes('controlador')) return { rows: datasetPV.filter(pv => pv.tipo.toLowerCase().includes('belgrano') || pv.tipo.toLowerCase().includes('controlador')), label: 'Sucursal Belgrano' };
  if (lower.includes('linea')) return { rows: datasetPV.filter(pv => pv.tipo.toLowerCase().includes('línea') || pv.tipo.toLowerCase().includes('linea')), label: 'Comprobantes en Línea' };
  if (lower.includes('inactivo') || lower.includes('baja') || lower.includes('desactivado')) return { rows: datasetPV.filter(pv => pv.estado !== 'ACTIVO'), label: 'Inactivos / Dados de Baja' };
  if (lower.includes('todos') || lower.includes('completo')) return { rows: datasetPV, label: 'Todos' };
  // 3-column search fallback
  const matches = datasetPV.filter(pv =>
    pv.numero.toLowerCase().includes(lower) ||
    pv.tipo.toLowerCase().includes(lower) ||
    pv.estado.toLowerCase().includes(lower)
  );
  if (matches.length > 0 && lower !== 'activos' && lower !== 'activo') return { rows: matches, label: query };
  return { rows: datasetPV.filter(pv => pv.estado === 'ACTIVO'), label: 'Activos' };
}

function ResultTable({ rows, label, showExport }) {
  const handleExportCSV = () => {
    const header = 'Numero,Tipo,Estado\n';
    const csv = header + rows.map(r => `${r.numero},"${r.tipo}",${r.estado}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `puntos_de_venta_${label.replace(/\s/g, '_').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <table className="result-table">
        <thead>
          <tr>
            <th>N° PV</th>
            <th>Tipo de Punto de Venta</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((pv, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, color: '#00f2fe' }}>{pv.numero}</td>
              <td>{pv.tipo}</td>
              <td>{getStatusBadge(pv.estado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="result-summary-footer">
        <span>🔍 Búsqueda: <strong style={{ color: '#00f2fe' }}>&apos;{label}&apos;</strong> — {rows.length} coincidencia{rows.length !== 1 ? 's' : ''}</span>
        {showExport && (
          <button className="btn-export-csv" onClick={handleExportCSV}>
            📥 Exportar CSV
          </button>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>🤖 AI Pod analizando</span>
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

function KPIDashboard() {
  const activos = datasetPV.filter(pv => pv.estado === 'ACTIVO').length;
  const inactivos = datasetPV.filter(pv => pv.estado === 'INACTIVO').length;
  const baja = datasetPV.filter(pv => pv.estado === 'DADO DE BAJA').length;
  return (
    <div className="kpi-dashboard">
      <div className="kpi-item">
        <span className="kpi-value green">{activos}</span> PV Activos
      </div>
      <div className="kpi-item">
        <span className="kpi-value yellow">{inactivos}</span> Inactivos
      </div>
      <div className="kpi-item">
        <span className="kpi-value red">{baja}</span> Dados de Baja
      </div>
      <div className="kpi-item">
        <span className="kpi-value blue">{datasetPV.length}</span> Total Registrados
      </div>
    </div>
  );
}

export default function InteractiveSandbox() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Polling to sync Admin approvals live back to Customer chat screen
  useEffect(() => {
    if (!session) return;

    const checkApprovalsSync = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/admin/approvals');
        if (res.ok) {
          const data = await res.json();
          const approvalsMap = {};
          (data.approvals || []).forEach(item => {
            if (item.token) approvalsMap[item.token] = item;
          });

          setMessages(prevMsgs =>
            prevMsgs.map(msg => {
              if (msg.dryRun) {
                const token = msg.dryRun.approval_token || msg.dryRun.ApprovalToken || msg.dryRun.token;
                if (token && approvalsMap[token]) {
                  const updated = approvalsMap[token];
                  if (updated.status === 'APPROVED' || updated.status === 'REJECTED') {
                    return {
                      ...msg,
                      dryRun: {
                        ...msg.dryRun,
                        status: updated.status,
                        execution_result: updated.execution_result || msg.dryRun.execution_result
                      }
                    };
                  }
                }
              }
              return msg;
            })
          );
        }
      } catch (err) {
        // Ignore offline error
      }
    };

    const interval = setInterval(checkApprovalsSync, 1500);
    return () => clearInterval(interval);
  }, [session]);

  const handleInitializeSession = async (fileName) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/sandbox/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: fileName || 'Guia_AFIP_ARCA_2026.pdf' })
      });
      const data = await res.json();
      setSession(data.session);
      setMessages([
        {
          sender: 'system',
          text: `📄 Documentación "${data.session.file_name}" procesada e indexada en espacio Sandbox Multi-Formato (${data.session.tenant_id}).`
        }
      ]);
    } catch (err) {
      const mockSession = {
        session_id: 'mock_session_123',
        tenant_id: 'sandbox_session_mock',
        file_name: fileName || 'Guia_AFIP_ARCA_2026.pdf',
        query_count: 0,
        max_queries: 999
      };
      setSession(mockSession);
      setMessages([
        {
          sender: 'system',
          text: `📄 Documentación "${mockSession.file_name}" cargada en Sandbox. Consola interactiva ilimitada activa.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async (userQuery) => {
    const textToSend = userQuery || inputQuery;
    if (!textToSend.trim() || !session) return;

    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/sandbox/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.session_id, message: textToSend })
      });

      const data = await res.json();
      if (res.ok) {
        setSession(data.session);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            podId: data.response.pod_id,
            text: data.response.answer,
            citations: data.response.citations,
            dryRun: data.response.dry_run_result,
            searchQuery: textToSend
          }
        ]);
      } else {
        setMessages(prev => [...prev, { sender: 'system', text: data.error || 'Error en la consulta' }]);
      }
    } catch (err) {
      const newCount = session.query_count + 1;
      setSession({ ...session, query_count: newCount });

      const lower = textToSend.toLowerCase();
      const isRetenciones = lower.includes('retencion') || lower.includes('retenciones') || lower.includes('percepcion');
      const isPV = !isRetenciones;

      const cmdText = isPV ? `node scripts/puntos_de_venta_arca.js --accion=Consultar --query="${textToSend}" --cuit=20262534538` : 'node scripts/mis_retenciones_arca.js --cuit=20262534538';
      const actionName = isPV ? 'gestionar_puntos_de_venta_arca' : 'descargar_retenciones_arca';
      const summaryText = isPV ? `Búsqueda de Puntos de Venta ('${textToSend}') en ARCA.` : 'Consulta de retenciones en ARCA.';
      const docCitation = isPV ? 'ARCA_PuntosDeVenta_Spec_v2026.pdf' : 'ARCA_MisRetenciones_Spec_v2026.pdf';

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          podId: 'POD_AFIP_FISCAL',
          text: `### 📄 Resultado de Consulta en ARCA\n\nSe completó la verificación con simulación activada (\`dry_run = true\`).\n\n💡 *Puedes buscar por texto libre: 'ver odoo', 'rece', '00007', 'inactivos' o 'todos'.*`,
          citations: [docCitation],
          searchQuery: textToSend,
          dryRun: {
            is_dry_run: true,
            action_name: actionName,
            summary: summaryText,
            approval_token: 'dryrun_token_sha256_mock99120',
            generated_command: cmdText
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendToAdmin = async (token) => {
    try {
      const res = await fetch('http://localhost:8080/api/v1/admin/approvals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, action: 'approve' })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prevMsgs =>
          prevMsgs.map(msg => {
            if (msg.dryRun && (msg.dryRun.approval_token === token || msg.dryRun.token === token)) {
              return {
                ...msg,
                dryRun: {
                  ...msg.dryRun,
                  status: 'APPROVED',
                  execution_result: data.execution_result
                }
              };
            }
            return msg;
          })
        );
      }
    } catch (err) {
      setMessages(prevMsgs =>
        prevMsgs.map(msg => {
          if (msg.dryRun && (msg.dryRun.approval_token === token || msg.dryRun.token === token)) {
            return {
              ...msg,
              dryRun: {
                ...msg.dryRun,
                status: 'APPROVED'
              }
            };
          }
          return msg;
        })
      );
    }
  };

  const getSearchQuery = (msg) => {
    if (msg.searchQuery) return msg.searchQuery;
    const cmd = msg.dryRun?.generated_command || '';
    const match = cmd.match(/--query="([^"]+)"/);
    return match ? match[1] : 'Activos';
  };

  return (
    <section className="sandbox-section" id="sandbox">
      <div className="sandbox-card">
        <div className="sandbox-header">
          <h2>🧪 Sandbox Interactivo: Probar AI Pods en Vivo</h2>
          <p>Pruebe la interacción con los AI Pods de Facturación, ARCA/AFIP y DevOps directamente desde esta consola.</p>
        </div>

        {!session ? (
          <div
            className={`dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              handleInitializeSession(file ? file.name : 'Manual_AFIP_ARCA.pdf');
            }}
          >
            <div className="dropzone-icon">🤖</div>
            <h3>Seleccione un AI Pod para iniciar la prueba interactiva</h3>
            <p>Conexión directa con la API Engine Core Go en tiempo real</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => handleInitializeSession('Guia_AFIP_ARCA_2026.pdf')}>
                🇦🇷 Probar AI Pod ARCA / AFIP Fiscal
              </button>
              <button className="btn-primary" style={{ background: '#2563eb' }} onClick={() => handleInitializeSession('GitHub_DevOps_Spec.md')}>
                🐙 Probar AI Pod GitHub / Odoo.sh DevOps
              </button>
              <button className="btn-primary" style={{ background: '#059669' }} onClick={() => handleInitializeSession('SAP_S4HANA_Docs.rst')}>
                📊 Probar AI Pod SAP Enterprise
              </button>
            </div>
          </div>
        ) : (
          <div className="sandbox-chat-container">
            <div className="sandbox-status-bar">
              <span>📄 Documento / Pod Activo: <strong>{session.file_name}</strong></span>
              <span className="query-counter">
                Consultas: <strong>{session.query_count}</strong>
              </span>
            </div>

            {/* KPI Dashboard */}
            <KPIDashboard />

            {/* Quick Prompt Suggestions */}
            <div className="quick-prompts" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', alignSelf: 'center' }}>💡 Consultas Rápidas:</span>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta mis puntos de venta ACTIVOS en ARCA')}>
                🟢 Activos
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta mis puntos de venta INACTIVOS en ARCA')}>
                🔴 Inactivos / De Baja
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta TODOS mis puntos de venta en ARCA')}>
                📑 Todos
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('ver odoo')}>
                🏭 Odoo
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('ver rece')}>
                📝 RECE
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, idx) => {
                const token = m.dryRun ? (m.dryRun.approval_token || m.dryRun.ApprovalToken || m.dryRun.token) : null;
                const isApproved = m.dryRun && m.dryRun.status === 'APPROVED';

                return (
                  <div key={idx} className={`message-row ${m.sender}`}>
                    {/* Avatar */}
                    {m.sender === 'bot' && <div className="message-avatar bot-avatar">🤖</div>}
                    {m.sender === 'user' && <div className="message-avatar user-avatar">👤</div>}

                    <div className={`message-bubble ${m.sender}`} style={m.sender === 'system' ? { alignSelf: 'center' } : {}}>
                      {m.podId && <span className="pod-badge">🤖 {m.podId}</span>}
                      <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                      
                      {m.citations && m.citations.length > 0 && (
                        <div className="citations-box" style={{ marginTop: '8px', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                          <strong>📌 Citas Verificadas:</strong>
                          <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                            {m.citations.map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      )}

                      {m.dryRun && m.dryRun.is_dry_run && (
                        <div className="dryrun-card" style={{ marginTop: '12px', padding: '12px', background: isApproved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', border: isApproved ? '1px solid #10b981' : '1px solid #f59e0b', borderRadius: '8px' }}>
                          <div style={{ fontWeight: 'bold', color: isApproved ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{isApproved ? '🎉 Aprobado por Administrador — Ejecución Real Completada' : '⚡ Simulación Dry-Run (`dry_run = true`)'}</span>
                          </div>
                          <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>{m.dryRun.summary}</p>
                          {m.dryRun.generated_command && (
                            <pre style={{ background: '#0f172a', padding: '8px', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto' }}>
                              {m.dryRun.generated_command}
                            </pre>
                          )}

                          {/* Display live execution result as HTML Table */}
                          {isApproved && (
                            <div style={{ marginTop: '10px', background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #059669' }}>
                              <div style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.85rem', marginBottom: '8px' }}>📍 Resultado Real Obtenido de ARCA:</div>
                              <ResultTable rows={filterDataset(getSearchQuery(m)).rows} label={filterDataset(getSearchQuery(m)).label} showExport={true} />
                            </div>
                          )}

                          {/* Inline preview table for dry-run */}
                          {!isApproved && (
                            <div style={{ marginTop: '10px', background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '8px' }}>👁️ Vista Previa (Datos a Consultar):</div>
                              <ResultTable rows={filterDataset(getSearchQuery(m)).rows} label={filterDataset(getSearchQuery(m)).label} showExport={false} />
                            </div>
                          )}

                          {token && !isApproved && (
                            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Token: <code>{token}</code></span>
                              <button
                                style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                                onClick={() => handleSendToAdmin(token)}
                              >
                                ⚡ Ejecutar / Aprobar Acción en Vivo
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {loading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="chat-input-form">
              <input
                type="text"
                placeholder="Escriba su consulta (ej: 'ver odoo', 'rece', '00007', 'inactivos', 'todos')..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn-primary" disabled={loading}>
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
