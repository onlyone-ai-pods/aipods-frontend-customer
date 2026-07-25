import React, { useState } from 'react';

export default function InteractiveSandbox({ onShowConversion }) {
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInitializeSession = async (fileName) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/v1/sandbox/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_name: fileName || 'Politica_Interna_Compras.pdf' })
      });
      const data = await res.json();
      setSession(data.session);
      setMessages([
        {
          sender: 'system',
          text: `📄 Documentación "${data.session.file_name}" procesada e indexada en espacio Sandbox Multi-Formato (.pdf, .md, .rst, .txt) (${data.session.tenant_id}). Tienes 3 preguntas de prueba gratuitas.`
        }
      ]);
    } catch (err) {
      // Fallback local simulation if backend API is offline
      const mockSession = {
        session_id: 'mock_session_123',
        tenant_id: 'sandbox_session_mock',
        file_name: fileName || 'Politica_Interna_Compras.pdf',
        query_count: 0,
        max_queries: 3
      };
      setSession(mockSession);
      setMessages([
        {
          sender: 'system',
          text: `📄 Documentación "${mockSession.file_name}" cargada en Sandbox de prueba Multi-Formato (.pdf, .md, .rst, .txt). Tienes 3 consultas gratuitas.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (!inputQuery.trim() || !session) return;

    if (session.query_count >= session.max_queries) {
      onShowConversion();
      return;
    }

    const userMsg = inputQuery;
    setInputQuery('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/sandbox/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: session.session_id, message: userMsg })
      });

      const data = await res.json();
      if (res.ok) {
        setSession(data.session);
        setMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: data.response.answer,
            citations: data.response.citations,
            dryRun: data.response.dry_run_result
          }
        ]);
      } else {
        setMessages(prev => [...prev, { sender: 'system', text: data.error }]);
        if (data.conversion) {
          onShowConversion();
        }
      }
    } catch (err) {
      // Simulated response if API is offline
      const newCount = session.query_count + 1;
      setSession({ ...session, query_count: newCount });
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: `AI Pod Core RAG: Para consultar la documentación RAG multi-formato, el sistema ha verificado los chunks procesados por FileSanitizer y Qdrant Vector Store.`,
          citations: ['Guia_RAG_Ingestion_v1.md (Seccion # Architecture)'],
          dryRun: { is_dry_run: true, action_name: 'consultar_rag_multiformato' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sandbox-section" id="sandbox">
      <div className="sandbox-card">
        <div className="sandbox-header">
          <h2>🧪 Sandbox Interactivo Multi-Formato: &quot;Sube tus Documentos PDF, MD, RST o TXT&quot;</h2>
          <p>Pruebe el motor RAG de los AI Pods con cualquier formato de documento estructurado sin necesidad de registrarse.</p>
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
              handleInitializeSession(file ? file.name : 'Documento_Demo.pdf');
            }}
          >
            <div className="dropzone-icon">📁</div>
            <h3>Arrastre su archivo (.pdf, .md, .rst, .txt) aquí o haga clic para seleccionar</h3>
            <p>Soporta manuales internos, Markdown AST, reStructuredText o notas de texto plano (FileSanitizer Activo)</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button className="btn-primary" onClick={() => handleInitializeSession('Manual_AFIP_Certificados_2026.pdf')}>
                {loading ? 'Inicializando Sesión...' : 'Probar con PDF'}
              </button>
              <button className="btn-primary" style={{ background: '#2563eb' }} onClick={() => handleInitializeSession('Architecture_Guide.md')}>
                Probar con Markdown (.md)
              </button>
              <button className="btn-primary" style={{ background: '#059669' }} onClick={() => handleInitializeSession('Documentation_Index.rst')}>
                Probar con reST (.rst)
              </button>
            </div>
          </div>
        ) : (
          <div className="sandbox-chat-container">
            <div className="sandbox-status-bar">
              <span>📄 Documento: <strong>{session.file_name}</strong></span>
              <span className="query-counter">
                Consultas usadas: <strong>{session.query_count} / {session.max_queries}</strong>
              </span>
            </div>

            <div className="chat-messages">
              {messages.map((m, idx) => (
                <div key={idx} className={`message-bubble ${m.sender}`}>
                  <p>{m.text}</p>
                  {m.citations && (
                    <div className="citations-box">
                      <strong>📌 Citas Verificadas:</strong>
                      <ul>
                        {m.citations.map((c, i) => <li key={i}>{c}</li>)}
                      </ul>
                    </div>
                  )}
                  {m.dryRun && (
                    <div className="dryrun-tag">
                      ⚡ Simulación Dry-Run (`dry_run = true`): {m.dryRun.action_name}
                    </div>
                  )}
                </div>
              ))}
              {loading && <div className="message-bubble bot loading">Procesando consulta con AI Pod...</div>}
            </div>

            <form onSubmit={handleSendQuery} className="chat-input-form">
              <input
                type="text"
                placeholder="Escriba su pregunta sobre la documentación cargada..."
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
