---
name: ui-layout-governance
description: |
  Skill obligatoria de Gobernanza de Layout, Theme & Design System. Se ejecuta ANTES de aplicar cambios en HTML/CSS, estructura visual o componentes de interfaz.
  
  Garantiza:
  - Preservación de estándares internacionales (ISO 9241-210, WCAG 2.1 AAA, SOC 2 Type II, ISO 27001).
  - Consulta del Mapa Canónico de Nomenclatura del Layout (layout_mockup_map.md).
  - Generación automatizada de la Matriz de Evaluación de Impacto de Layout (LIEP).
---

# 🛡️ Skill: UI/UX Layout Governance (`ui-layout-governance`)

## 📌 Cuándo Usar Esta Skill
**MANDATORIO**: Ejecutar esta Skill siempre que el usuario o el agente proponga:
1. Modificar archivos CSS (`index.css`), tokens de color o temas gráficos (*Dark / Light Mode*).
2. Alterar estructuras de layout (*Header, Tab Navigation, Sub-Sidebar, Main Panel*).
3. Cambiar dimensiones de botones, padding, espaciados o breakpoints responsivos.

---

## 🛠️ Pasos del Protocolo LIEP (Layout Impact Evaluation Protocol)

### Paso 1: Consultar el Mapa Canónico de Nomenclatura del Layout
Antes de renombrar o modificar clases CSS o componentes, verificar el nombre oficial del elemento en [layout_mockup_map.md](file:///home/martin/server/aipods-docs/.aipods/skills/ui-layout-governance/references/layout_mockup_map.md).

### Paso 2: Evaluar la Matriz de Estándares Internacionales
Verificar que la modificación propuesta NO viole ninguna regla de [industry_standards_matrix.md](file:///home/martin/server/aipods-docs/.aipods/skills/ui-layout-governance/references/industry_standards_matrix.md):
- ❌ **ISO 9241-210**: No reducir botones/targets táctiles por debajo de $44\text{px}$. No reimponer scroll vertical masivo en turnos de 6-8h.
- ❌ **WCAG 2.1 AAA**: Mantener relación de contraste de color $\ge 7:1$.
- ❌ **Full-Width Fluid Adaptativo**: No reinstaurar `max-width` rígidos encajonados que desperdicien pantalla útil (aplica a tablets de 8"+, laptops y monitores de 22", 24", 27", 4K o UltraWide).
- ❌ **SOC 2 Type II**: No eliminar ni ocultar los **Badges de Alerta de Severidad** (🔴 Crítico, 🟡 Advertencia).

### Paso 3: Generar la Matriz de Evaluación de Impacto en la Spec

### 📊 Matriz de Evaluación de Impacto de Layout (Protocolo LIEP)

| Código Elemento | Componente del Layout | Estándar Evaluado | Estado / Resultado | Justificación Técnica & Salvaguarda |
|:---:|---|---|:---:|---|
| `[C1]` | `SUB_SIDEBAR_CONTAINER` | **ISO 9241-210** | ✅ `COMPLIANT` | Superficie útil táctil mantenida a $\ge 44\text{px}$. |
| `[B1]` | `MAIN_TAB_NAVIGATION_BAR` | **SOC 2 Type II** | ✅ `COMPLIANT` | Preservación de badges de alerta de severidad (🔴 Crítico). |
| `[D1]` | `MAIN_CONTENT_PANEL` | **Full-Width Fluid** | ✅ `COMPLIANT` | Ancho fluido adaptativo al 100% (Tablets 8"+, 22", 24", 27"+). |
| `[A1]` | `BRAND_HEADER_CONTAINER` | **WCAG 2.1 AAA** | ✅ `COMPLIANT` | Relación de contraste de color $\ge 7:1$ en tema oscuro. |
