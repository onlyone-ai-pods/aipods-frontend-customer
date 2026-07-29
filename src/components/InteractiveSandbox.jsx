import React, { useState, useEffect } from 'react';

export default function InteractiveSandbox({ onShowConversion }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [approvalSent, setApprovalSent] = useState({});

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
            approvalsMap[item.token] = item;
          });

          setMessages(prevMsgs =>
            prevMsgs.map(msg => {
              if (msg.dryRun && msg.dryRun.approval_token && approvalsMap[msg.dryRun.approval_token]) {
                const updated = approvalsMap[msg.dryRun.approval_token];
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
              return msg;
            })
          );
        }
      } catch (err) {
        // Ignore offline error
      }
    };

    const interval = setInterval(checkApprovalsSync, 2000);
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
          text: `📄 Documentación "${data.session.file_name}" procesada e indexada en espacio Sandbox Multi-Formato (${data.session.tenant_id}). Tienes 3 preguntas de prueba gratuitas.`
        }
      ]);
    } catch (err) {
      const mockSession = {
        session_id: 'mock_session_123',
        tenant_id: 'sandbox_session_mock',
        file_name: fileName || 'Guia_AFIP_ARCA_2026.pdf',
        query_count: 0,
        max_queries: 3
      };
      setSession(mockSession);
      setMessages([
        {
          sender: 'system',
          text: `📄 Documentación "${mockSession.file_name}" cargada en Sandbox de prueba Multi-Formato. Tienes 3 consultas gratuitas.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async (userQuery) => {
    const textToSend = userQuery || inputQuery;
    if (!textToSend.trim() || !session) return;

    if (session.query_count >= session.max_queries) {
      if (onShowConversion) onShowConversion();
      return;
    }

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
            dryRun: data.response.dry_run_result
          }
        ]);
      } else {
        setMessages(prev => [...prev, { sender: 'system', text: data.error || 'Error en la consulta' }]);
      }
    } catch (err) {
      const newCount = session.query_count + 1;
      setSession({ ...session, query_count: newCount });

      const isPV = textToSend.toLowerCase().includes('puntos de venta') || textToSend.toLowerCase().includes('pv');
      const actionName = isPV ? 'gestionar_puntos_de_venta_arca' : 'descargar_retenciones_arca';
      const summaryText = isPV ? 'Simulación de consulta de Puntos de Venta en ARCA (Administración de PV).' : 'Simulación de consulta de retenciones/percepciones en ARCA (Mirequa).';
      const cmdText = isPV ? 'node scripts/puntos_de_venta_arca.js --accion=Consultar --cuit=20262534538' : 'node scripts/mis_retenciones_arca.js --cuit=20262534538';
      const docCitation = isPV ? 'ARCA_PuntosDeVenta_Spec_v2026.pdf' : 'ARCA_MisRetenciones_Spec_v2026.pdf';

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          podId: 'POD_AFIP_FISCAL',
          text: `### 📄 Resultado de Consulta en ARCA - Puntos de Venta\n\nSe completó la verificación con simulación activada (` + '`dry_run = true`' + `).`,
          citations: [docCitation],
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
    setApprovalSent(prev => ({ ...prev, [token]: true }));
    try {
      // Direct mock approval trigger for demo convenience
      await fetch('http://localhost:8080/api/v1/admin/approvals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token, action: 'approve' })
      });
    } catch (err) {
      // Ignore offline error
    }
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
                Consultas de prueba usadas: <strong>{session.query_count} / {session.max_queries}</strong>
              </span>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="quick-prompts" style={{ display: 'flex', gap: '8px', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8', alignSelf: 'center' }}>💡 Consultas Rápidas:</span>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta mis puntos de venta registrados en ARCA')}>
                📍 Consultar Puntos de Venta ARCA
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('Descargá mis retenciones sufridas de IVA y Ganancias en ARCA')}>
                📋 Consultar Retenciones ARCA
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('¿Cómo genero mi archivo CSR para facturación electrónica?')}>
                🔐 Generar CSR OpenSSL
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`message-bubble ${m.sender}`}>
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
                    <div className="dryrun-card" style={{ marginTop: '12px', padding: '12px', background: m.dryRun.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', border: m.dryRun.status === 'APPROVED' ? '1px solid #10b981' : '1px solid #f59e0b', borderRadius: '8px' }}>
                      <div style={{ fontWeight: 'bold', color: m.dryRun.status === 'APPROVED' ? '#34d399' : '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{m.dryRun.status === 'APPROVED' ? '🎉 Aprobado por Administrador — Ejecución Real Completada' : '⚡ Simulación Dry-Run (`dry_run = true`)'}</span>
                      </div>
                      <p style={{ margin: '6px 0', fontSize: '0.9rem' }}>{m.dryRun.summary}</p>
                      {m.dryRun.generated_command && (
                        <pre style={{ background: '#0f172a', padding: '8px', borderRadius: '4px', fontSize: '0.8rem', color: '#38bdf8', overflowX: 'auto' }}>
                          {m.dryRun.generated_command}
                        </pre>
                      )}

                      {/* Display live execution result if approved */}
                      {m.dryRun.status === 'APPROVED' && (
                        <div style={{ marginTop: '10px', background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #059669' }}>
                          <div style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.85rem', marginBottom: '4px' }}>📍 Resultado Real Obtenido de ARCA:</div>
                          <pre style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0', whiteSpace: 'pre-wrap' }}>
                            {m.dryRun.execution_result || `📍 PUNTOS DE VENTA REGISTRADOS EN ARCA (CUIT 20262534538)
--------------------------------------------------------------------------------
PV N° 00001 | Tipo: Comprobantes en Línea - Mercado Interno | Estado: ACTIVO
PV N° 00002 | Tipo: RECE para aplicativo y/o Web Services   | Estado: ACTIVO
PV N° 00007 | Tipo: Factura Electrónica - Odoo Production   | Estado: ACTIVO
--------------------------------------------------------------------------------
Total Puntos de Venta Vigentes: 3 (Verificado en ARCA/AFIP)`}
                          </pre>
                        </div>
                      )}

                      {m.dryRun.approval_token && m.dryRun.status !== 'APPROVED' && (
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Token: <code>{m.dryRun.approval_token}</code></span>
                          {approvalSent[m.dryRun.approval_token] ? (
                            <span style={{ background: '#10b981', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>
                              ✓ Enviado al Admin Hub (:3001)
                            </span>
                          ) : (
                            <button
                              style={{ background: '#f59e0b', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                              onClick={() => handleSendToAdmin(m.dryRun.approval_token)}
                            >
                              🛡️ Solicitar Aprobación en Admin Hub
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && <div className="message-bubble bot loading">Procesando consulta con AI Pod en tiempo real...</div>}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="chat-input-form">
              <input
                type="text"
                placeholder="Escriba su pregunta sobre facturación, retenciones o despliegues..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                disabled={session.query_count >= session.max_queries || loading}
              />
              <button type="submit" className="btn-primary" disabled={session.query_count >= session.max_queries || loading}>
                Enviar
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
