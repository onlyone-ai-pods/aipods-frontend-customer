import React from 'react';

const POD_COMMANDS = {
  POD_AFIP_FISCAL: [
    {
      command: '/puntos_de_venta',
      label: 'Puntos de Venta',
      description: 'Consultar y gestionar PVs en ARCA',
      icon: '📍',
      category: 'Consultas',
      query: 'Consulta mis puntos de venta ACTIVOS en ARCA',
      paramHint: '[odoo | rece | activos | inactivos | todos]',
      suggestedValues: [
        { value: 'odoo', label: 'Ver Punto de Venta Odoo Production (#00007)', badge: 'Filtro' },
        { value: 'rece', label: 'Ver RECE Web Services (#00002)', badge: 'Filtro' },
        { value: 'activos', label: 'Filtrar solo PVs Activos', badge: 'Estado' },
        { value: 'inactivos', label: 'Filtrar PVs Inactivos / De Baja', badge: 'Estado' },
        { value: 'todos', label: 'Ver listado completo de PVs', badge: 'Listado' }
      ]
    },
    {
      command: '/monotributo',
      label: 'Estado de Cuenta Monotributo',
      description: 'Consultar cuotas, períodos y categoría',
      icon: '🧾',
      category: 'Consultas',
      query: 'estado de cuenta monotributo',
      paramHint: '[07/2026 | julio | adeudado | pagado]',
      suggestedValues: [
        { value: '07/2026', label: 'Período Julio 2026 (Cuota Actual)', badge: 'Pendiente' },
        { value: '06/2026', label: 'Período Junio 2026', badge: 'Pagado' },
        { value: 'adeudado', label: 'Filtrar períodos con cuotas adeudadas', badge: 'Deuda' },
        { value: 'pagado', label: 'Filtrar períodos al día', badge: 'Pagado' }
      ]
    },
    {
      command: '/retenciones',
      label: 'Mis Retenciones / Percepciones',
      description: 'Consultar retenciones sufridas en ARCA',
      icon: '📑',
      category: 'Consultas',
      query: 'retenciones sufridas',
      paramHint: '[sicore | 2026 | iibb]',
      suggestedValues: [
        { value: 'sicore', label: 'Ver retenciones SICORE AFIP', badge: 'Filtro' },
        { value: '2026', label: 'Ver acumulado año 2026', badge: 'Año' }
      ]
    },
    {
      command: '/comprobantes',
      label: 'Mis Comprobantes',
      description: 'Consultar comprobantes emitidos o recibidos',
      icon: '📄',
      category: 'Consultas',
      query: 'comprobantes emitidos',
      paramHint: '[emitidos | recibidos]',
      suggestedValues: [
        { value: 'emitidos', label: 'Comprobantes Emitidos (Facturas A/B)', badge: 'Tipo' },
        { value: 'recibidos', label: 'Comprobantes Recibidos de Proveedores', badge: 'Tipo' }
      ]
    },
    {
      command: '/certificado',
      label: 'Generar CSR / Certificado',
      description: 'Generar clave privada y CSR para AFIP',
      icon: '🔐',
      category: 'Configuración',
      query: 'certificado csr',
      paramHint: '[alias | produccion | homologacion]',
      suggestedValues: [
        { value: 'produccion', label: 'Entorno Producción ARCA', badge: 'Env' },
        { value: 'homologacion', label: 'Entorno Homologación (Testing)', badge: 'Env' }
      ]
    },
    {
      command: '/ayuda',
      label: 'Ayuda del Pod',
      description: 'Ver todas las funcionalidades disponibles',
      icon: '❓',
      category: 'Sistema',
      query: null,
      suggestedValues: []
    }
  ]
};

/**
 * SlashCommandPalette — Componente con soporte para Autocompletado de Comandos y Parámetros.
 */
export default function SlashCommandPalette({ podId, filter, activeIndex, onSelect, onSelectParam, visible }) {
  if (!visible) return null;

  const allCommands = POD_COMMANDS[podId] || POD_COMMANDS.POD_AFIP_FISCAL;
  const rawInput = filter || '';
  
  // Detección de Sub-Contexto de Parámetros (Ej: "/monotributo ")
  const spaceIndex = rawInput.indexOf(' ');
  const isParamMode = spaceIndex !== -1;

  if (isParamMode) {
    const matchedCmdStr = rawInput.substring(0, spaceIndex).toLowerCase();
    const argFilter = rawInput.substring(spaceIndex + 1).toLowerCase();

    const matchedCmd = allCommands.find(c => c.command.toLowerCase() === matchedCmdStr);

    if (!matchedCmd || !matchedCmd.suggestedValues || matchedCmd.suggestedValues.length === 0) {
      return null;
    }

    const filteredValues = argFilter
      ? matchedCmd.suggestedValues.filter(sv =>
          sv.value.toLowerCase().includes(argFilter) ||
          sv.label.toLowerCase().includes(argFilter)
        )
      : matchedCmd.suggestedValues;

    if (filteredValues.length === 0) return null;

    let paramGlobalIdx = 0;

    return (
      <div className="slash-palette">
        <div className="slash-palette-header">
          <span className="slash-palette-title">💡 Sugerencias de Parámetros para {matchedCmd.command}</span>
          <span className="slash-palette-hint">Tab / Enter para autocompletar</span>
        </div>
        <div className="slash-category">Valores recomendados {matchedCmd.paramHint}</div>
        {filteredValues.map(sv => {
          const isActive = paramGlobalIdx++ === activeIndex;
          return (
            <div
              key={sv.value}
              className={`slash-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectParam(matchedCmd, sv.value)}
            >
              <span className="slash-icon">🔹</span>
              <div className="slash-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="slash-command-name">{sv.value}</span>
                  {sv.badge && <span className="param-badge">{sv.badge}</span>}
                </div>
                <span className="slash-command-desc">{sv.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // MODO STANDARD SLASH COMMAND SELECTION
  const filterLower = rawInput.toLowerCase().replace(/^\//, '');

  const filtered = filterLower
    ? allCommands.filter(cmd =>
        cmd.command.toLowerCase().includes(filterLower) ||
        cmd.label.toLowerCase().includes(filterLower) ||
        cmd.description.toLowerCase().includes(filterLower)
      )
    : allCommands;

  if (filtered.length === 0) return null;

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
              >
                <span className="slash-icon">{cmd.icon}</span>
                <div className="slash-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="slash-command-name">{cmd.command}</span>
                    {cmd.paramHint && <span className="param-hint">{cmd.paramHint}</span>}
                  </div>
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
