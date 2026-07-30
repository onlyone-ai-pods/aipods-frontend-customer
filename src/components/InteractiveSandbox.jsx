import React, { useState, useEffect, useRef, useCallback } from 'react';
import SlashCommandPalette, { POD_COMMANDS } from './SlashCommandPalette';
import FeedbackButtons from './FeedbackButtons';

const datasetPV = [
  { numero: '00001', tipo: 'Comprobantes en Línea - Mercado Interno', estado: 'ACTIVO' },
  { numero: '00002', tipo: 'RECE para aplicativo y/o Web Services', estado: 'ACTIVO' },
  { numero: '00003', tipo: 'FactuWeb Histórico (Deprecado 2021)', estado: 'DADO DE BAJA' },
  { numero: '00005', tipo: 'Controlador Fiscal Sucursal Belgrano', estado: 'INACTIVO' },
  { numero: '00007', tipo: 'Factura Electrónica - Odoo Production', estado: 'ACTIVO' }
];

function getStatusBadge(estado) {
  if (estado === 'ACTIVO' || estado === 'PAGADO') return <span className="status-badge activo">🟢 {estado}</span>;
  if (estado === 'INACTIVO' || estado === 'PENDIENTE') return <span className="status-badge inactivo">🟡 {estado}</span>;
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
  const matches = datasetPV.filter(pv =>
    pv.numero.toLowerCase().includes(lower) ||
    pv.tipo.toLowerCase().includes(lower) ||
    pv.estado.toLowerCase().includes(lower)
  );
  if (matches.length > 0 && lower !== 'activos' && lower !== 'activo') return { rows: matches, label: query };
  return { rows: datasetPV.filter(pv => pv.estado === 'ACTIVO'), label: 'Activos' };
}

// --- Monotributo Dataset ---
const datasetMonotributo = [
  { periodo: '07/2026', cuota: '$52.530,48', estado: 'PENDIENTE', fechaPago: '—' },
  { periodo: '06/2026', cuota: '$52.530,48', estado: 'PAGADO', fechaPago: '18/06/2026' },
  { periodo: '05/2026', cuota: '$52.530,48', estado: 'PAGADO', fechaPago: '20/05/2026' },
  { periodo: '04/2026', cuota: '$48.920,00', estado: 'PAGADO', fechaPago: '19/04/2026' },
  { periodo: '03/2026', cuota: '$48.920,00', estado: 'PAGADO', fechaPago: '20/03/2026' },
  { periodo: '02/2026', cuota: '$48.920,00', estado: 'ADEUDADO', fechaPago: '—' }
];

const monotributoInfo = {
  cuit: '20-26253453-8',
  categoria: 'K — Servicios',
  actividad: '620100 - Servicios de consultoría informática',
  cuotaMensual: '$52.530,48',
  estado: 'Activo',
  fechaAlta: '01/03/2015'
};

const mesesNombre = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre'
};

function filterMonotributo(query) {
  const lower = (query || '').toLowerCase();

  // Check for specific MM/YYYY
  for (const p of datasetMonotributo) {
    if (lower.includes(p.periodo.toLowerCase())) return { rows: [p], label: p.periodo, suggestion: '' };
  }

  // Check month names
  const mesesMap = { enero:'01', febrero:'02', marzo:'03', abril:'04', mayo:'05', junio:'06', julio:'07', agosto:'08', septiembre:'09', octubre:'10', noviembre:'11', diciembre:'12', ene:'01', feb:'02', mar:'03', abr:'04', may:'05', jun:'06', jul:'07', ago:'08', sep:'09', oct:'10', nov:'11', dic:'12' };
  for (const [nombre, num] of Object.entries(mesesMap)) {
    if (lower.includes(nombre)) {
      const periodo = num + '/2026';
      const found = datasetMonotributo.filter(p => p.periodo === periodo);
      if (found.length > 0) return { rows: found, label: periodo, suggestion: '' };
      return { rows: datasetMonotributo, label: 'Todos', suggestion: `⚠️ El período ${periodo} no está en el estado de cuenta. Períodos disponibles: 02/2026 a 07/2026.` };
    }
  }

  // Check for "adeudado" or "pendiente" or "pagado"
  if (lower.includes('adeudado') || lower.includes('deuda') || lower.includes('debe')) {
    return { rows: datasetMonotributo.filter(p => p.estado === 'ADEUDADO'), label: 'Adeudados', suggestion: '' };
  }
  if (lower.includes('pendiente')) {
    return { rows: datasetMonotributo.filter(p => p.estado === 'PENDIENTE'), label: 'Pendientes', suggestion: '' };
  }
  if (lower.includes('pagado') || lower.includes('al dia') || lower.includes('al día')) {
    return { rows: datasetMonotributo.filter(p => p.estado === 'PAGADO'), label: 'Pagados', suggestion: '' };
  }

  return { rows: datasetMonotributo, label: 'Todos', suggestion: '' };
}

function MonotributoTable({ rows, label, showExport, suggestion }) {
  const handleExportCSV = () => {
    const header = 'Periodo,Cuota,Estado,Fecha Pago\n';
    const csv = header + rows.map(r => `${r.periodo},"${r.cuota}",${r.estado},${r.fechaPago}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monotributo_estado_cuenta_${label.replace(/\//g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Info Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px', fontSize: '0.78rem' }}>
        <span style={{ color: '#94a3b8' }}>CUIT: <strong style={{ color: '#e2e8f0' }}>{monotributoInfo.cuit}</strong></span>
        <span style={{ color: '#94a3b8' }}>Categoría: <strong style={{ color: '#00f2fe' }}>{monotributoInfo.categoria}</strong></span>
        <span style={{ color: '#94a3b8' }}>Actividad: <strong style={{ color: '#e2e8f0' }}>{monotributoInfo.actividad}</strong></span>
        <span style={{ color: '#94a3b8' }}>Cuota Mensual: <strong style={{ color: '#34d399' }}>{monotributoInfo.cuotaMensual}</strong></span>
      </div>

      {suggestion && <div style={{ padding: '8px 12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '6px', marginBottom: '8px', fontSize: '0.82rem', color: '#fbbf24', whiteSpace: 'pre-wrap' }}>{suggestion}</div>}

      <table className="result-table">
        <thead>
          <tr>
            <th>Período</th>
            <th>Cuota</th>
            <th>Estado</th>
            <th>Fecha Pago</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <tr key={i}>
              <td style={{ fontWeight: 600, color: '#00f2fe' }}>{mesesNombre[p.periodo.split('/')[0]]} {p.periodo.split('/')[1]}</td>
              <td>{p.cuota}</td>
              <td>{getStatusBadge(p.estado)}</td>
              <td style={{ color: p.fechaPago === '—' ? '#64748b' : '#e2e8f0' }}>{p.fechaPago}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="result-summary-footer">
        <span>🧾 Estado de Cuenta: <strong style={{ color: '#00f2fe' }}>&apos;{label}&apos;</strong> — {rows.length} período{rows.length !== 1 ? 's' : ''}</span>
        {showExport && <button className="btn-export-csv" onClick={handleExportCSV}>📥 Exportar CSV</button>}
      </div>
    </div>
  );
}

function isMonotributoQuery(query) {
  const lower = (query || '').toLowerCase();
  return lower.includes('monotributo') || lower.includes('estado de cuenta') || lower.includes('cuota') || lower.includes('categoria') || lower.includes('categoría') || lower.includes('periodo') || lower.includes('período');
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
  const pagados = datasetMonotributo.filter(p => p.estado === 'PAGADO').length;
  const adeudados = datasetMonotributo.filter(p => p.estado === 'ADEUDADO' || p.estado === 'PENDIENTE').length;
  return (
    <div className="kpi-dashboard">
      <div className="kpi-item">
        <span className="kpi-value green">{activos}</span> PV Activos
      </div>
      <div className="kpi-item">
        <span className="kpi-value yellow">{inactivos}</span> Inactivos
      </div>
      <div className="kpi-item">
        <span className="kpi-value red">{baja}</span> De Baja
      </div>
      <div className="kpi-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '14px' }}>
        <span className="kpi-value green">{pagados}</span> Cuotas OK
      </div>
      <div className="kpi-item">
        <span className="kpi-value red">{adeudados}</span> Pendientes
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
  const [showSlashPalette, setShowSlashPalette] = useState(false);
  const [slashActiveIndex, setSlashActiveIndex] = useState(0);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Slash palette: detect '/' at start of input
  const handleInputChange = useCallback((e) => {
    const val = e.target.value;
    setInputQuery(val);
    if (val.startsWith('/')) {
      setShowSlashPalette(true);
      setSlashActiveIndex(0);
    } else {
      setShowSlashPalette(false);
    }
  }, []);

  // Get filtered commands count for keyboard nav
  const getFilteredCommands = useCallback(() => {
    const allCmds = POD_COMMANDS.POD_AFIP_FISCAL || [];
    const filterLower = inputQuery.toLowerCase().replace(/^\//, '');
    return filterLower
      ? allCmds.filter(c => c.command.toLowerCase().includes(filterLower) || c.label.toLowerCase().includes(filterLower) || c.description.toLowerCase().includes(filterLower))
      : allCmds;
  }, [inputQuery]);

  // Keyboard navigation for slash palette
  const handleKeyDown = useCallback((e) => {
    if (!showSlashPalette) return;
    const cmds = getFilteredCommands();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSlashActiveIndex(prev => (prev + 1) % cmds.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSlashActiveIndex(prev => (prev - 1 + cmds.length) % cmds.length);
    } else if (e.key === 'Enter' && cmds.length > 0) {
      e.preventDefault();
      handleSlashSelect(cmds[slashActiveIndex]);
    } else if (e.key === 'Escape') {
      setShowSlashPalette(false);
      setInputQuery('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSlashPalette, slashActiveIndex, getFilteredCommands]);

  // Handle slash command selection
  const handleSlashSelect = (cmd) => {
    if (cmd.suggestedValues && cmd.suggestedValues.length > 0) {
      // Put command + space into input for parameter autocomplete mode
      setInputQuery(`${cmd.command} `);
      setShowSlashPalette(true);
      setSlashActiveIndex(0);
      if (inputRef.current) inputRef.current.focus();
    } else {
      setShowSlashPalette(false);
      setInputQuery('');
      if (cmd.query) {
        handleSendQuery(cmd.query);
      } else {
        // /ayuda → show all commands as a system message
        const allCmds = POD_COMMANDS.POD_AFIP_FISCAL || [];
        const helpText = allCmds.map(c => `${c.icon} **${c.command}** ${c.paramHint || ''} — ${c.description}`).join('\n');
        setMessages(prev => [...prev, { sender: 'system', text: `📋 Comandos disponibles del Pod AFIP/ARCA:\n\n${helpText}\n\nEscribí / para ver esta lista en cualquier momento.` }]);
      }
    }
  };

  // Handle parameter suggestion selection
  const handleSelectParam = (cmd, paramVal) => {
    setShowSlashPalette(false);
    setInputQuery('');
    const fullQuery = `${cmd.command} ${paramVal}`;
    handleSendQuery(fullQuery);
  };

  // Feedback handler (SPEC-CORE-17)
  // TODO [POST-MVP]: POST /api/v1/feedback → Redis cache purge + audit_logs flag
  const handleFeedback = (messageId, type, reason) => {
    console.log('[FEEDBACK]', { messageId, type, reason, timestamp: new Date().toISOString() });
  };

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
      const isMono = isMonotributoQuery(textToSend);
      const isRetenciones = !isMono && (lower.includes('retencion') || lower.includes('retenciones') || lower.includes('percepcion'));

      let cmdText, actionName, summaryText, docCitation, answerText;

      if (isMono) {
        const mono = filterMonotributo(textToSend);
        cmdText = `node scripts/monotributo_estado_cuenta.js --cuit=20262534538 --periodo=${mono.label}`;
        actionName = 'consultar_monotributo_estado_cuenta';
        summaryText = `Consulta de Estado de Cuenta Monotributo (Período: ${mono.label}).`;
        docCitation = 'ARCA_Monotributo_Spec_v2026.pdf';
        answerText = mono.suggestion
          ? `### 🧾 Estado de Cuenta Monotributo\n\n${mono.suggestion}\n\n💡 *Puedes filtrar: 'julio', '07/2026', 'adeudado', 'pagado' o 'pendiente'.*`
          : `### 🧾 Estado de Cuenta Monotributo\n\nSe completó la verificación con simulación activada (\`dry_run = true\`).\n\n💡 *Puedes filtrar por período: 'julio', '07/2026', 'adeudado', 'pagado' o 'pendiente'.*`;
      } else if (isRetenciones) {
        cmdText = 'node scripts/mis_retenciones_arca.js --cuit=20262534538';
        actionName = 'descargar_retenciones_arca';
        summaryText = 'Consulta de retenciones en ARCA.';
        docCitation = 'ARCA_MisRetenciones_Spec_v2026.pdf';
        answerText = `### 📄 Resultado de Consulta en ARCA\n\nSe completó la verificación con simulación activada (\`dry_run = true\`).`;
      } else {
        cmdText = `node scripts/puntos_de_venta_arca.js --accion=Consultar --query="${textToSend}" --cuit=20262534538`;
        actionName = 'gestionar_puntos_de_venta_arca';
        summaryText = `Búsqueda de Puntos de Venta ('${textToSend}') en ARCA.`;
        docCitation = 'ARCA_PuntosDeVenta_Spec_v2026.pdf';
        answerText = `### 📄 Resultado de Consulta en ARCA\n\nSe completó la verificación con simulación activada (\`dry_run = true\`).\n\n💡 *Puedes buscar: 'ver odoo', 'rece', '00007', 'inactivos' o 'todos'.*`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          podId: 'POD_AFIP_FISCAL',
          text: answerText,
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
              <span style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }}></span>
              <button className="prompt-pill" onClick={() => handleSendQuery('estado de cuenta monotributo')}>
                🧾 Monotributo
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('monotributo periodo julio')}>
                📅 Julio 2026
              </button>
              <button className="prompt-pill" onClick={() => handleSendQuery('monotributo adeudado')}>
                🔴 Adeudado
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
                              <div style={{ fontWeight: 'bold', color: '#34d399', fontSize: '0.85rem', marginBottom: '8px' }}>{isMonotributoQuery(getSearchQuery(m)) ? '🧾 Estado de Cuenta Monotributo — Resultado Real:' : '📍 Resultado Real Obtenido de ARCA:'}</div>
                              {isMonotributoQuery(getSearchQuery(m))
                                ? <MonotributoTable rows={filterMonotributo(getSearchQuery(m)).rows} label={filterMonotributo(getSearchQuery(m)).label} showExport={true} suggestion={filterMonotributo(getSearchQuery(m)).suggestion} />
                                : <ResultTable rows={filterDataset(getSearchQuery(m)).rows} label={filterDataset(getSearchQuery(m)).label} showExport={true} />
                              }
                            </div>
                          )}

                          {/* Inline preview table for dry-run */}
                          {!isApproved && (
                            <div style={{ marginTop: '10px', background: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              <div style={{ fontWeight: 'bold', color: '#fbbf24', fontSize: '0.85rem', marginBottom: '8px' }}>{isMonotributoQuery(getSearchQuery(m)) ? '👁️ Vista Previa — Estado de Cuenta Monotributo:' : '👁️ Vista Previa (Datos a Consultar):'}</div>
                              {isMonotributoQuery(getSearchQuery(m))
                                ? <MonotributoTable rows={filterMonotributo(getSearchQuery(m)).rows} label={filterMonotributo(getSearchQuery(m)).label} showExport={false} suggestion={filterMonotributo(getSearchQuery(m)).suggestion} />
                                : <ResultTable rows={filterDataset(getSearchQuery(m)).rows} label={filterDataset(getSearchQuery(m)).label} showExport={false} />
                              }
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

                      {/* Feedback Buttons — SPEC-CORE-17 */}
                      {m.sender === 'bot' && (
                        <FeedbackButtons
                          messageId={idx}
                          podId={m.podId}
                          onFeedback={handleFeedback}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              {loading && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-wrapper">
              <SlashCommandPalette
                podId="POD_AFIP_FISCAL"
                filter={inputQuery}
                activeIndex={slashActiveIndex}
                onSelect={handleSlashSelect}
                onSelectParam={handleSelectParam}
                visible={showSlashPalette}
              />
              <form onSubmit={(e) => { e.preventDefault(); if (showSlashPalette) { const cmds = getFilteredCommands(); if (cmds.length > 0) handleSlashSelect(cmds[slashActiveIndex]); } else { handleSendQuery(); } }} className="chat-input-form">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Escribí / para ver comandos, o su consulta directamente..."
                  value={inputQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                />
                <button type="submit" className="btn-primary" disabled={loading}>
                  Enviar
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
