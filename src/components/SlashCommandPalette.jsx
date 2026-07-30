import React from 'react';

// ─────────────────────────────────────────────────────────────────────
// POD REGISTRY — Every available AI Pod in the ecosystem
// ─────────────────────────────────────────────────────────────────────
const POD_REGISTRY = [
  { id: 'POD_AFIP_FISCAL', label: 'AFIP / ARCA Fiscal', shortcut: 'afip', icon: '🇦🇷', color: '#00f2fe' },
  { id: 'POD_ODOO_ENTERPRISE', label: 'Odoo Enterprise ERP', shortcut: 'odoo', icon: '🏭', color: '#714B67' },
  { id: 'POD_GITHUB_DEVOPS', label: 'GitHub & Odoo.sh DevOps', shortcut: 'github', icon: '🐙', color: '#238636' }
];

// ─────────────────────────────────────────────────────────────────────
// UNIVERSAL COMMANDS — Same syntax, different behavior per Pod
// ─────────────────────────────────────────────────────────────────────
const UNIVERSAL_COMMANDS = {
  POD_AFIP_FISCAL: [
    { command: '/facturas', label: 'Mis Comprobantes ARCA', description: 'Consultar comprobantes emitidos o recibidos en ARCA', icon: '📄', category: 'Consultas', paramHint: '[emitidas | recibidas]',
      suggestedValues: [
        { value: 'emitidas', label: 'Comprobantes emitidos (Facturas A/B)', badge: 'Tipo' },
        { value: 'recibidas', label: 'Comprobantes recibidos de proveedores', badge: 'Tipo' }
      ]
    },
    { command: '/estado', label: 'Estado de Cuenta Monotributo', description: 'Consultar cuotas, períodos y categoría', icon: '🧾', category: 'Consultas', paramHint: '[07/2026 | julio | adeudado | pagado]',
      suggestedValues: [
        { value: '07/2026', label: 'Período Julio 2026 (Cuota Actual)', badge: 'Pendiente' },
        { value: '06/2026', label: 'Período Junio 2026', badge: 'Pagado' },
        { value: 'adeudado', label: 'Filtrar períodos con deuda', badge: 'Deuda' },
        { value: 'pagado', label: 'Filtrar períodos al día', badge: 'OK' }
      ]
    },
    { command: '/buscar', label: 'Buscar en Puntos de Venta', description: 'Buscar PVs por nombre, número, tipo o estado', icon: '🔍', category: 'Consultas', paramHint: '[odoo | rece | activos | inactivos | todos]',
      suggestedValues: [
        { value: 'odoo', label: 'Odoo Production (#00007)', badge: 'Filtro' },
        { value: 'rece', label: 'RECE Web Services (#00002)', badge: 'Filtro' },
        { value: 'activos', label: 'Solo PVs en estado Activo', badge: 'Estado' },
        { value: 'inactivos', label: 'PVs Inactivos o Dados de Baja', badge: 'Estado' },
        { value: 'todos', label: 'Listado completo de PVs', badge: 'Listado' }
      ]
    },
    { command: '/retenciones', label: 'Mis Retenciones / Percepciones', description: 'Consultar retenciones sufridas en ARCA', icon: '📑', category: 'Consultas', paramHint: '[sicore | 2026]',
      suggestedValues: [
        { value: 'sicore', label: 'Retenciones SICORE AFIP', badge: 'Filtro' },
        { value: '2026', label: 'Acumulado año 2026', badge: 'Año' }
      ]
    },
    { command: '/config', label: 'Certificados CSR / AFIP', description: 'Generar clave privada y CSR para AFIP', icon: '🔐', category: 'Configuración', paramHint: '[produccion | homologacion]',
      suggestedValues: [
        { value: 'produccion', label: 'Entorno Producción ARCA', badge: 'Env' },
        { value: 'homologacion', label: 'Entorno Homologación (Testing)', badge: 'Env' }
      ]
    },
    { command: '/ayuda', label: 'Ayuda del Pod AFIP', description: 'Ver todas las funcionalidades disponibles', icon: '❓', category: 'Sistema', suggestedValues: [] }
  ],

  POD_ODOO_ENTERPRISE: [
    { command: '/facturas', label: 'Facturas Odoo', description: 'Consultar facturas de clientes y proveedores', icon: '📄', category: 'Consultas', paramHint: '[borrador | publicadas | adeudadas | hoy]',
      suggestedValues: [
        { value: 'borrador', label: 'Facturas en estado borrador', badge: 'Draft' },
        { value: 'publicadas', label: 'Facturas publicadas y enviadas', badge: 'Posted' },
        { value: 'adeudadas', label: 'Facturas pendientes de cobro', badge: 'Deuda' },
        { value: 'hoy', label: 'Facturas emitidas hoy', badge: 'Hoy' }
      ]
    },
    { command: '/estado', label: 'Partner Ledger', description: 'Estado de cuenta de clientes / proveedores', icon: '🧾', category: 'Consultas', paramHint: '[cliente_demo | saldo_pendiente | todos]',
      suggestedValues: [
        { value: 'cliente_demo', label: 'Cliente Demo SRL (ID: 42)', badge: 'Partner' },
        { value: 'saldo_pendiente', label: 'Partners con saldo pendiente', badge: 'Deuda' },
        { value: 'todos', label: 'Listado completo de Partners', badge: 'Listado' }
      ]
    },
    { command: '/ventas', label: 'Órdenes de Venta', description: 'Consultar presupuestos y órdenes confirmadas', icon: '🛒', category: 'Consultas', paramHint: '[presupuestos | confirmadas | este_mes]',
      suggestedValues: [
        { value: 'presupuestos', label: 'Presupuestos sin confirmar', badge: 'Draft' },
        { value: 'confirmadas', label: 'Órdenes de Venta confirmadas', badge: 'Sale' },
        { value: 'este_mes', label: 'Ventas del mes en curso', badge: 'Mes' }
      ]
    },
    { command: '/stock', label: 'Inventario y Productos', description: 'Consultar disponibilidad y alertas de stock', icon: '📦', category: 'Consultas', paramHint: '[disponible | bajo_minimo | sucursal]',
      suggestedValues: [
        { value: 'disponible', label: 'Productos con stock disponible', badge: 'OK' },
        { value: 'bajo_minimo', label: 'Productos bajo stock mínimo', badge: 'Alerta' },
        { value: 'sucursal', label: 'Stock por sucursal / almacén', badge: 'WH' }
      ]
    },
    { command: '/config', label: 'Configuración Odoo', description: 'Webhooks, API Keys y conexiones', icon: '⚙️', category: 'Configuración', paramHint: '[webhook | api_key]',
      suggestedValues: [
        { value: 'webhook', label: 'Configurar Webhooks de integración', badge: 'Hook' },
        { value: 'api_key', label: 'Gestionar API Keys de acceso', badge: 'Key' }
      ]
    },
    { command: '/ayuda', label: 'Ayuda del Pod Odoo', description: 'Ver todas las funcionalidades disponibles', icon: '❓', category: 'Sistema', suggestedValues: [] }
  ],

  POD_GITHUB_DEVOPS: [
    { command: '/repos', label: 'Repositorios', description: 'Listar repositorios e integraciones activas', icon: '📁', category: 'Consultas', paramHint: '[main | staging | desarrollo]',
      suggestedValues: [
        { value: 'main', label: 'Repos con branch main activo', badge: 'Branch' },
        { value: 'staging', label: 'Repos con entorno staging', badge: 'Env' },
        { value: 'desarrollo', label: 'Repos en desarrollo activo', badge: 'Dev' }
      ]
    },
    { command: '/deployments', label: 'Despliegues Odoo.sh', description: 'Consultar estado de despliegues en Odoo.sh', icon: '🚀', category: 'Consultas', paramHint: '[exitosos | fallidos | produccion]',
      suggestedValues: [
        { value: 'exitosos', label: 'Deploys exitosos recientes', badge: 'OK' },
        { value: 'fallidos', label: 'Deploys con errores', badge: 'Error' },
        { value: 'produccion', label: 'Estado de producción actual', badge: 'Prod' }
      ]
    },
    { command: '/pull_requests', label: 'Pull Requests', description: 'Consultar PRs pendientes de revisión', icon: '🔀', category: 'Consultas', paramHint: '[abiertos | aprobados | mi_usuario]',
      suggestedValues: [
        { value: 'abiertos', label: 'PRs abiertos pendientes de review', badge: 'Open' },
        { value: 'aprobados', label: 'PRs aprobados listos para merge', badge: 'Ready' },
        { value: 'mi_usuario', label: 'PRs asignados a mi usuario', badge: 'Mío' }
      ]
    },
    { command: '/ci_status', label: 'Estado CI/CD', description: 'Pipeline de integración continua GitHub Actions', icon: '⚡', category: 'Consultas', paramHint: '[running | passed | failed]',
      suggestedValues: [
        { value: 'running', label: 'Pipelines en ejecución ahora', badge: 'Run' },
        { value: 'passed', label: 'Pipelines exitosos recientes', badge: 'OK' },
        { value: 'failed', label: 'Pipelines fallidos', badge: 'Fail' }
      ]
    },
    { command: '/config', label: 'Configuración DevOps', description: 'Secrets, Webhooks y variables de entorno', icon: '⚙️', category: 'Configuración', paramHint: '[secrets | webhook]',
      suggestedValues: [
        { value: 'secrets', label: 'Gestionar GitHub Secrets', badge: 'Secret' },
        { value: 'webhook', label: 'Configurar Webhooks', badge: 'Hook' }
      ]
    },
    { command: '/ayuda', label: 'Ayuda del Pod DevOps', description: 'Ver todas las funcionalidades disponibles', icon: '❓', category: 'Sistema', suggestedValues: [] }
  ]
};

/**
 * SlashCommandPalette — Multi-Pod Context Switcher + Universal Commands.
 *
 * Flow:
 *   1. User types "/" → Shows POD_REGISTRY (pod selector)
 *   2. User selects a pod OR already has activePod → Shows UNIVERSAL_COMMANDS
 *   3. User types "/command " → Shows suggestedValues for that command
 *
 * Props:
 *  - activePod: string|null — Currently active pod ID
 *  - filter: string — Current input value
 *  - activeIndex: number
 *  - onSelectPod: (pod) => void — Switch pod context
 *  - onSelectCommand: (cmd) => void — Select a command (enter param mode)
 *  - onSelectParam: (cmd, paramVal) => void — Execute with parameter
 *  - visible: boolean
 */
export default function SlashCommandPalette({ activePod, filter, activeIndex, onSelectPod, onSelectCommand, onSelectParam, visible }) {
  if (!visible) return null;

  const rawInput = filter || '';
  const spaceIndex = rawInput.indexOf(' ');
  const isParamMode = spaceIndex !== -1;

  // ── LAYER 3: Parameter Suggestions ──
  if (isParamMode && activePod) {
    const matchedCmdStr = rawInput.substring(0, spaceIndex).toLowerCase();
    const argFilter = rawInput.substring(spaceIndex + 1).toLowerCase();
    const podCmds = UNIVERSAL_COMMANDS[activePod] || [];
    const matchedCmd = podCmds.find(c => c.command.toLowerCase() === matchedCmdStr);

    if (!matchedCmd || !matchedCmd.suggestedValues || matchedCmd.suggestedValues.length === 0) return null;

    const filteredValues = argFilter
      ? matchedCmd.suggestedValues.filter(sv => sv.value.toLowerCase().includes(argFilter) || sv.label.toLowerCase().includes(argFilter))
      : matchedCmd.suggestedValues;

    if (filteredValues.length === 0) return null;

    let idx = 0;
    return (
      <div className="slash-palette">
        <div className="slash-palette-header">
          <span className="slash-palette-title">💡 Parámetros para {matchedCmd.command}</span>
          <span className="slash-palette-hint">Tab / Enter autocompletar</span>
        </div>
        <div className="slash-category">Valores recomendados {matchedCmd.paramHint}</div>
        {filteredValues.map(sv => {
          const isActive = idx++ === activeIndex;
          return (
            <div key={sv.value} className={`slash-item ${isActive ? 'active' : ''}`} onClick={() => onSelectParam(matchedCmd, sv.value)}>
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

  // ── LAYER 2: Universal Commands (if Pod is selected) ──
  if (activePod) {
    const podCmds = UNIVERSAL_COMMANDS[activePod] || [];
    const filterLower = rawInput.toLowerCase().replace(/^\//, '');
    const podMeta = POD_REGISTRY.find(p => p.id === activePod);

    const filtered = filterLower
      ? podCmds.filter(cmd => cmd.command.toLowerCase().includes(filterLower) || cmd.label.toLowerCase().includes(filterLower) || cmd.description.toLowerCase().includes(filterLower))
      : podCmds;

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
          <span className="slash-palette-title">
            {podMeta && <span className="pod-context-badge" style={{ background: podMeta.color + '22', borderColor: podMeta.color, color: podMeta.color }}>{podMeta.icon} {podMeta.label}</span>}
          </span>
          <span className="slash-palette-hint">↑↓ navegar · Enter seleccionar · Esc cerrar</span>
        </div>
        {/* Pod switcher shortcut */}
        <div className="slash-pod-switch-hint" onClick={() => onSelectPod(null)}>
          🔄 Cambiar de Pod (backspace para volver)
        </div>
        {Object.entries(categories).map(([catName, cmds]) => (
          <div key={catName}>
            <div className="slash-category">{catName}</div>
            {cmds.map(cmd => {
              const isActive = globalIndex++ === activeIndex;
              return (
                <div key={cmd.command} className={`slash-item ${isActive ? 'active' : ''}`} onClick={() => onSelectCommand(cmd)}>
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

  // ── LAYER 1: Pod Selector (No pod active yet) ──
  const filterLower = rawInput.toLowerCase().replace(/^\//, '');
  const filteredPods = filterLower
    ? POD_REGISTRY.filter(p => p.shortcut.includes(filterLower) || p.label.toLowerCase().includes(filterLower))
    : POD_REGISTRY;

  if (filteredPods.length === 0) return null;

  let podIdx = 0;
  return (
    <div className="slash-palette">
      <div className="slash-palette-header">
        <span className="slash-palette-title">🤖 Seleccionar AI Pod Activo</span>
        <span className="slash-palette-hint">Elegí con cuál Pod querés interactuar</span>
      </div>
      <div className="slash-category">Pods Disponibles</div>
      {filteredPods.map(pod => {
        const isActive = podIdx++ === activeIndex;
        return (
          <div key={pod.id} className={`slash-item ${isActive ? 'active' : ''}`} onClick={() => onSelectPod(pod)}>
            <span className="slash-icon" style={{ fontSize: '1.3rem' }}>{pod.icon}</span>
            <div className="slash-item-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="slash-command-name">/{pod.shortcut}</span>
                <span className="param-badge" style={{ background: pod.color + '22', borderColor: pod.color, color: pod.color }}>{pod.label}</span>
              </div>
              <span className="slash-command-desc">Activar contexto de {pod.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { POD_REGISTRY, UNIVERSAL_COMMANDS };
