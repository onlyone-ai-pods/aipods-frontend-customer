# 🛡️ Matriz de Estándares Internacionales de UI/UX

Este documento define las salvaguardas normativas que la Skill **`ui-layout-governance`** audita antes de permitir cualquier modificación visual.

---

## 📋 Reglas de Alerta por Violación de Estándares

### 1. ISO 9241-210 (Ergonomía e Interacción Humano-Sistema)
- **Regla Táctil**: Todo botón o elemento interactivo debe tener una superficie útil de contacto de al menos **$44 \times 44\text{px}$** (cumplido en `[C1] SUB_SIDEBAR_CONTAINER`).
- **Regla de Fatiga Visual**: No forzar scroll vertical extenso en jornadas de 6 a 8 horas. Encapsular la información por pestañas o sub-paneles laterales.
- **Acción ante Violación**: `🛑 REJECT — Modificación viola ISO 9241-210 por superficie táctil insuficiente (<44px) o ruido cognitivo.`

### 2. WCAG 2.1 AAA (Accesibilidad Web)
- **Relación de Contraste de Color**: Todo texto principal sobre fondo oscuro o claro debe cumplir una relación de contraste mínima de **7:1** (cumplido en paleta `--accent-cyan: #00f2fe` sobre `--bg-primary: #0a0d14`).
- **Acción ante Violación**: `🛑 REJECT — Relación de contraste inferior a 7:1 en texto principal.`

- **Soporte Multi-Dispositivo Universal**: Aplica de forma fluida y adaptativa a tablets desde 8 pulgadas ($\ge 768\text{px}$), portátiles (**MacBook Air 13" / 15"**, MacBook Pro, Ultrabooks) y monitores de escritorio de 22", 24", 27", 32", 4K o UltraWide.
- **Acción ante Violación**: `🛑 REJECT — Reimposición de max-width rígido encajonado que desperdicie espacio de pantalla disponible.`

### 4. SOC 2 Type II & ISO 27001 (Monitoreo sin Puntos Ciegos)
- **Preservación de Alertas de Severidad**: Ningún rediseño puede eliminar o volver invisible los badges de alerta (🔴 Crítico, 🟡 Advertencia, 🟢 Normal).
- **Acción ante Violación**: `🛑 REJECT — Ocultamiento de badges de alerta de severidad en el layout.`
