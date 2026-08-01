---
name: frontend-ui-architect
description: Guía experta de desarrollo web moderno en React 18, Vite y Vanilla CSS para AI Pods Enterprise.
---

# 🎨 Skill: Frontend UI Architect

Esta habilidad instruye a asistentes de IA para desarrollar aplicaciones web en **React 18 / Vite** en `aipods-frontend-customer` y `aipods-frontend-admin`:

## 1. Gobernanza de Layout & Trazabilidad SDD (Pre-Code Gate)
- **Gobernanza de Layout Mandatoria:** Antes de modificar cualquier archivo CSS (`index.css`), tema gráfico o estructura visual, DEBE consultarse e invocarse la Skill [ui-layout-governance](file:///home/martin/server/aipods-docs/.aipods/skills/ui-layout-governance/SKILL.md) y verificar el nombre oficial del elemento en `layout_mockup_map.md`.
- **Trazabilidad SDD:** Consultar las especificaciones en `specs/`. Garantizar el cumplimiento del paradigma "Servicio como Software", Sandbox interactivo y modales SSO.

## 2. Gate Mandatorio de Auditoría NPM & Seguridad (Post-Code Quality Gate)
Antes de finalizar cualquier tarea de código en React, el asistente DEBE ejecutar automáticamente:
```bash
npm audit
npx eslint "src/**/*.{js,jsx}"
npm run build
```
Si `npm audit` reporta vulnerabilidades en paquetes, ejecutar la remediación y asegurar `found 0 vulnerabilities`.

## 3. Principios de Diseño Visual
- **Aesthetic First:** Usar tokens de color HSL tailoreados, glassmorphism (`backdrop-filter: blur(12px)`), tipografía Inter y micro-animaciones en hover.
- **Vanilla CSS Puro:** Utilizar archivos `.css` estructurados, evitando ad-hoc utilities frágiles.
- **Sanitización & Clean Code:** Evitar `dangerouslySetInnerHTML` o patrones vulnerables a XSS.
