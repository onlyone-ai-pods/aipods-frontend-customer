import React from 'react';

const POD_COMMANDS = {
  POD_AFIP_FISCAL: [
    { command: '/puntos_de_venta', label: 'Puntos de Venta', description: 'Consultar y gestionar PVs en ARCA', icon: '📍', category: 'Consultas', query: 'Consulta mis puntos de venta ACTIVOS en ARCA' },
    { command: '/monotributo', label: 'Estado de Cuenta Monotributo', description: 'Consultar cuotas, períodos y categoría', icon: '🧾', category: 'Consultas', query: 'estado de cuenta monotributo' },
    { command: '/retenciones', label: 'Mis Retenciones / Percepciones', description: 'Consultar retenciones sufridas en ARCA', icon: '📑', category: 'Consultas', query: 'retenciones sufridas' },
    { command: '/comprobantes', label: 'Mis Comprobantes', description: 'Consultar comprobantes emitidos o recibidos', icon: '📄', category: 'Consultas', query: 'comprobantes emitidos' },
    { command: '/certificado', label: 'Generar CSR / Certificado', description: 'Generar clave privada y CSR para AFIP', icon: '🔐', category: 'Configuración', query: 'certificado csr' },
    { command: '/ayuda', label: 'Ayuda del Pod', description: 'Ver todas las funcionalidades disponibles', icon: '❓', category: 'Sistema', query: null }
  ]
};

/**
 * SlashCommandPalette — Componente reutilizable para cualquier AI Pod.
 *
 * Props:
 *  - podId: string (ej: 'POD_AFIP_FISCAL') → selecciona el registro de comandos
 *  - filter: string (lo que el usuario escribió después de '/')
 *  - activeIndex: number (índice seleccionado con teclado)
 *  - onSelect: (cmd) => void (callback al seleccionar un comando)
 *  - visible: boolean
 *
 * Cada AI Pod puede registrar sus comandos en el objeto POD_COMMANDS.
 * En una futura versión, estos se cargarán via GET /api/v1/pods/{id}/commands.
 */
export default function SlashCommandPalette({ podId, filter, activeIndex, onSelect, visible }) {
  if (!visible) return null;

  const allCommands = POD_COMMANDS[podId] || POD_COMMANDS.POD_AFIP_FISCAL;
  const filterLower = (filter || '').toLowerCase().replace(/^\//, '');

  const filtered = filterLower
    ? allCommands.filter(cmd =>
        cmd.command.toLowerCase().includes(filterLower) ||
        cmd.label.toLowerCase().includes(filterLower) ||
        cmd.description.toLowerCase().includes(filterLower)
      )
    : allCommands;

  if (filtered.length === 0) return null;

  // Group by category
  const categories = {};
  filtered.forEach(cmd => {
    if (!categories[cmd.category]) categories[cmd.category] = [];
    categories[cmd.category].push(cmd);
  });

  let globalIndex = 0;

  return (
    <div className="slash-palette">
      <div className="slash-palette-header">
        <span className="slash-palette-title">⚡ Comandos del Pod</span>
        <span className="slash-palette-hint">↑↓ navegar · Enter seleccionar · Esc cerrar</span>
      </div>
      {Object.entries(categories).map(([catName, cmds]) => (
        <div key={catName}>
          <div className="slash-category">{catName}</div>
          {cmds.map(cmd => {
            const idx = globalIndex++;
            const isActive = idx === activeIndex;
            return (
              <div
                key={cmd.command}
                className={`slash-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(cmd)}
                onMouseEnter={() => {}}
              >
                <span className="slash-icon">{cmd.icon}</span>
                <div className="slash-item-content">
                  <span className="slash-command-name">{cmd.command}</span>
                  <span className="slash-command-desc">{cmd.description}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export { POD_COMMANDS };
