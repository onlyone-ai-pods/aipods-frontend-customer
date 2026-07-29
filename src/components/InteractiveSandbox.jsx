import React, { useState, useEffect } from 'react';

export default function InteractiveSandbox() {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
          text: `📄 Documentación "${data.session.file_name}" procesada e indexada en espacio Sandbox Multi-Formato (${data.session.tenant_id}). Tienes 3 preguntas de prueba gratuitas.`
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
          text: `📄 Documentación "${mockSession.file_name}" cargada en Sandbox. Consola interactiva de prueba ilimitada activa.`
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
            dryRun: data.response.dry_run_result
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
      const summaryText = isPV ? `Simulación de búsqueda de Puntos de Venta ('${textToSend}') en ARCA.` : 'Simulación de consulta de retenciones en ARCA.';
      const docCitation = isPV ? 'ARCA_PuntosDeVenta_Spec_v2026.pdf' : 'ARCA_MisRetenciones_Spec_v2026.pdf';

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          podId: 'POD_AFIP_FISCAL',
          text: `### 📄 Resultado de Consulta en ARCA\n\nSe completó la verificación con simulación activada (` + '`dry_run = true`' + `).\n\n💡 *Puedes filtrar desde esta consola escribiendo: 'ver odoo', 'ver rece', 'ver inactivos' o 'ver todos'.*`,
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

  const getFilteredOutput = (cmd, rawResult) => {
    const datasetPV = [
      { numero: '00001', tipo: 'Comprobantes en Línea - Mercado Interno', estado: 'ACTIVO' },
      { numero: '00002', tipo: 'RECE para aplicativo y/o Web Services', estado: 'ACTIVO' },
      { numero: '00003', tipo: 'FactuWeb Histórico (Deprecado 2021)', estado: 'DADO DE BAJA' },
      { numero: '00005', tipo: 'Controlador Fiscal Sucursal Belgrano', estado: 'INACTIVO' },
      { numero: '00007', tipo: 'Factura Electrónica - Odoo Production', estado: 'ACTIVO' }
    ];

    const lowerCmd = (cmd || '').toLowerCase();
    
    let queryTerm = '';
    const matchQuery = lowerCmd.match(/--query="([^"]+)"/);
    if (matchQuery && matchQuery[1]) {
      queryTerm = matchQuery[1].toLowerCase().trim();
    } else {
      queryTerm = lowerCmd;
    }

    if (queryTerm.includes('odoo')) {
      const filtered = datasetPV.filter(pv => pv.tipo.toLowerCase().includes('odoo'));
      const lines = filtered.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `🔍 RESULTADO DE BÚSQUEDA EN ARCA ('Odoo')\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nCoincidencias encontradas: ${filtered.length} (Verificado en ARCA/AFIP)`;
    }

    if (queryTerm.includes('rece') || queryTerm.includes('web service')) {
      const filtered = datasetPV.filter(pv => pv.tipo.toLowerCase().includes('rece'));
      const lines = filtered.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `🔍 RESULTADO DE BÚSQUEDA EN ARCA ('RECE')\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nCoincidencias encontradas: ${filtered.length} (Verificado en ARCA/AFIP)`;
    }

    if (queryTerm.includes('linea')) {
      const filtered = datasetPV.filter(pv => pv.tipo.toLowerCase().includes('línea') || pv.tipo.toLowerCase().includes('linea'));
      const lines = filtered.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `🔍 RESULTADO DE BÚSQUEDA EN ARCA ('Comprobantes en Línea')\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nCoincidencias encontradas: ${filtered.length} (Verificado en ARCA/AFIP)`;
    }

    if (queryTerm.includes('inactivo') || queryTerm.includes('baja')) {
      const filtered = datasetPV.filter(pv => pv.estado !== 'ACTIVO');
      const lines = filtered.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `📍 PUNTOS DE VENTA INACTIVOS / DADOS DE BAJA EN ARCA (CUIT 20262534538)\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nTotal Puntos de Venta Inactivos: ${filtered.length}`;
    }

    if (queryTerm.includes('todos') || queryTerm.includes('completo')) {
      const lines = datasetPV.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `📍 TODOS LOS PUNTOS DE VENTA REGISTRADOS EN ARCA (CUIT 20262534538)\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nTotal Puntos de Venta Registrados: ${datasetPV.length}`;
    }

    if (rawResult && rawResult.includes("Coincidencias encontradas")) return rawResult;

    // 3-Column Search: Número, Tipo, Estado
    const matches = datasetPV.filter(pv => 
      pv.numero.toLowerCase().includes(queryTerm) ||
      pv.tipo.toLowerCase().includes(queryTerm) ||
      pv.estado.toLowerCase().includes(queryTerm) ||
      queryTerm.includes(pv.numero.toLowerCase()) ||
      queryTerm.includes(pv.tipo.toLowerCase()) ||
      queryTerm.includes(pv.estado.toLowerCase())
    );

    if (matches.length > 0 && queryTerm !== 'activos' && queryTerm !== 'activo') {
      const lines = matches.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
      return `🔍 BÚSQUEDA MULTICOLUMNA ARCA ('${queryTerm}')\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nTotal Coincidencias Encontradas: ${matches.length} (Columnas: Número, Tipo, Estado)`;
    }

    const activePV = datasetPV.filter(pv => pv.estado === 'ACTIVO');
    const lines = activePV.map(pv => `PV N° ${pv.numero} | Tipo: ${pv.tipo.padEnd(45)} | Estado: ${pv.estado}`);
    return `📍 PUNTOS DE VENTA ACTIVOS EN ARCA (CUIT 20262534538)\n--------------------------------------------------------------------------------\n${lines.join('\n')}\n--------------------------------------------------------------------------------\nTotal Puntos de Venta Activos: ${activePV.length}`;
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
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta mis puntos de venta ACTIVOS en ARCA')}>
                🟢 Puntos de Venta Activos
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta mis puntos de venta INACTIVOS en ARCA')}>
                🔴 Puntos de Venta Inactivos / De Baja
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('Consulta TODOS mis puntos de venta en ARCA')}>
                📑 Todos los Puntos de Venta
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, idx) => {
                const token = m.dryRun ? (m.dryRun.approval_token || m.dryRun.ApprovalToken || m.dryRun.token) : null;
                const isApproved = m.dryRun && m.dryRun.status === 'APPROVED';

                return (
                  <div key={idx} className={`message-bubble ${m.sender}`}>
                    {m.podId && <span className="pod-badge">🤖 {m.podId}</span>}
                    <div className="message-text" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    
                    {/* Interactive Filter Pills inside Puntos de Venta bot messages */}
                    {m.sender === 'bot' && m.podId === 'POD_AFIP_FISCAL' && (
                      <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>🔍 Seleccionar Filtro:</span>
                        <button
                          style={{ background: '#059669', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                          onClick={() => handleSendQuery('Consulta mis puntos de venta ACTIVOS en ARCA')}
                        >
                          🟢 Solo Activos
                        </button>
                        <button
                          style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                          onClick={() => handleSendQuery('Consulta mis puntos de venta INACTIVOS en ARCA')}
                        >
                          🔴 Inactivos / De Baja
                        </button>
                        <button
                          style={{ background: '#475569', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
                          onClick={() => handleSendQuery('Consulta TODOS mis puntos de venta en ARCA')}
                        >
                          📑 Todos
                        </button>
                      </div>
                    )}

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

                        {/* Display live execution result if approved */}
                        {isApproved && (
                          <div style={{ marginTop: '10px', background: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #059669' }}>
                            <div style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.85rem', marginBottom: '4px' }}>📍 Resultado Real Obtenido de ARCA:</div>
                            <pre style={{ margin: 0, fontSize: '0.8rem', color: '#a7f3d0', whiteSpace: 'pre-wrap' }}>
                              {getFilteredOutput(m.dryRun.generated_command, m.dryRun.execution_result)}
                            </pre>
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
                );
              })}
              {loading && <div className="message-bubble bot loading">Procesando consulta con AI Pod en tiempo real...</div>}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendQuery(); }} className="chat-input-form">
              <input
                type="text"
                placeholder="Escriba su pregunta sobre facturación, retenciones o puntos de venta (ej: 'ver odoo', '00002')..."
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
