import React, { useState } from 'react';

const FEEDBACK_REASONS = [
  { id: 'INACCURATE_INFORMATION', icon: '❌', label: 'Información incorrecta o desactualizada' },
  { id: 'WRONG_CITATION', icon: '📎', label: 'Cita de documento o página equivocada' },
  { id: 'BAD_FORMAT_OR_TONE', icon: '⚠️', label: 'Formato/código mal formateado o tono inapropiado' }
];

/**
 * FeedbackButtons — Botones 👍👎 para cada mensaje del bot.
 *
 * SPEC-CORE-17: Sistema de Mejora Continua por Feedback de Usuarios
 *
 * MVP: Registra feedback en estado local del componente.
 * TODO [POST-MVP]: Enviar feedback via POST /api/v1/feedback al backend Go,
 *       que purgará la clave en Redis Semantic Cache y flaggeará audit_logs.
 *       Ver: SPEC-CORE-17 Capa 2 (Real-Time Reactive Layer)
 *       Ver: Semantic Cache Spec Regla 5.3 (Invalidación Reactiva por Feedback Negativo)
 *
 * Props:
 *  - messageId: string|number
 *  - podId: string
 *  - onFeedback: (messageId, type, reason?) => void
 */
export default function FeedbackButtons({ messageId, onFeedback }) {
  const [selected, setSelected] = useState(null); // 'up' | 'down' | null
  const [showReasons, setShowReasons] = useState(false);
  const [reasonSelected, setReasonSelected] = useState(null);

  const handleThumbUp = () => {
    setSelected('up');
    setShowReasons(false);
    setReasonSelected(null);
    if (onFeedback) onFeedback(messageId, 'THUMBS_UP');
  };

  const handleThumbDown = () => {
    setSelected('down');
    setShowReasons(true);
  };

  const handleReasonSelect = (reason) => {
    setReasonSelected(reason.id);
    setShowReasons(false);
    if (onFeedback) onFeedback(messageId, 'THUMBS_DOWN', reason.id);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-buttons">
        <button
          className={`feedback-btn ${selected === 'up' ? 'selected-up' : ''}`}
          onClick={handleThumbUp}
          disabled={selected !== null}
          title="Respuesta útil"
        >
          👍
        </button>
        <button
          className={`feedback-btn ${selected === 'down' ? 'selected-down' : ''}`}
          onClick={handleThumbDown}
          disabled={selected !== null}
          title="Respuesta no útil"
        >
          👎
        </button>
        {selected === 'up' && (
          <span className="feedback-thanks">¡Gracias por tu feedback!</span>
        )}
        {selected === 'down' && reasonSelected && (
          <span className="feedback-thanks negative">Feedback registrado. Se revisará.</span>
        )}
      </div>

      {showReasons && (
        <div className="feedback-reasons">
          <div className="feedback-reasons-header">¿Qué estuvo mal?</div>
          {FEEDBACK_REASONS.map(reason => (
            <button
              key={reason.id}
              className="feedback-reason-btn"
              onClick={() => handleReasonSelect(reason)}
            >
              <span>{reason.icon}</span>
              <span>{reason.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
