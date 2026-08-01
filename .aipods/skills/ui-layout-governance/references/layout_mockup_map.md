# 🗺️ Mapa Canónico de Nomenclatura del Layout (Mockup Map)

Este documento es la **fuente autoritativa de verdad** para la nomenclatura y estructura visual de los componentes de la plataforma **AI Pods Enterprise SaaS**.

---

## 📐 Diagrama Mockup ASCII de la Interfaz (Admin Hub & Customer Portal)

```
+-----------------------------------------------------------------------------------------------------------------------------------------+
| [A1] BRAND_HEADER_CONTAINER (Full-Width Fluid 100%)                                                                                      |
| 🛡️ [A2] BRAND_LOGO  [A3] BRAND_TITLES  |  [A4] TENANT_SELECTOR_BOX  |  [A5] USER_ROLE_BADGE  |  [A6] BTN_ADMIN_LOGOUT                 |
+-----------------------------------------------------------------------------------------------------------------------------------------+
| [B1] MAIN_TAB_NAVIGATION_BAR (5 Pestañas Modulares)                                                                                     |
|  [B2] TAB_REVIEW (🔴)  |  [B3] TAB_AUDIT (🟢)  |  [B4] TAB_TENANTS (🟡)  |  [B5] TAB_TELEMETRY (🟢)  |  [B6] TAB_ONBOARDING (🟡)          |
+-----------------------------------------------------------------------------------------------------------------------------------------+
| [C1] SUB_SIDEBAR_CONTAINER (Colapsable 210px / 64px)   | [D1] MAIN_CONTENT_PANEL (Full-Width Fluid 100%)                                |
|  [C2] BTN_TOGGLE_COLLAPSE (◀/▶)                        |                                                                                |
|  [C3] SUB_TAB_ITEM_1 (📊 OpenTelemetry)                |  [D2] SECTION_HEADER_TITLE & DESCRIPTION                                       |
|  [C4] SUB_TAB_ITEM_2 (🤖 AI Pods Sidecars)             |  [D3] METRICS_KPI_GRID (4 Columnas Panorámicas)                                |
|  [C5] SUB_TAB_ITEM_3 (💰 FinOps Tokens)                |  [D4] DATA_TABLE / APPROVALS_LIST / AUDIT_TRAIL                                |
|                                                        |                                                                                |
|                                                        |  [E1] CASCADE_ALERT_FLOATING_TOAST (Esquina Superior Derecha 🔴)                |
+--------------------------------------------------------+--------------------------------------------------------------------------------+
| [F1] ADMIN_FOOTER (Copyright & Versión de Plataforma)                                                                                   |
+-----------------------------------------------------------------------------------------------------------------------------------------+
```

---

## 🏷️ Diccionario Canónico de Componentes

| Código Elemento | Nombre Canónico | Archivo React / CSS Asociado | Función Operativa |
|---|---|---|---|
| `[A1]` | `BRAND_HEADER_CONTAINER` | `Header.jsx` / `.header-container` | Cabecera superior fija en el 100% del ancho del viewport. |
| `[A4]` | `TENANT_SELECTOR_BOX` | `Header.jsx` / `.tenant-selector-box` | Selector dinámico del cliente/tenant activo (`GLOBAL` o ID). |
| `[A6]` | `BTN_ADMIN_LOGOUT` | `Header.jsx` / `button` | Botón de cierre de sesión seguro con purga de `sessionStorage`. |
| `[B1]` | `MAIN_TAB_NAVIGATION_BAR` | `AdminTabNavigation.jsx` | Barra superior de 5 pestañas modulares con indicadores de severidad. |
| `[C1]` | `SUB_SIDEBAR_CONTAINER` | `AdminSubSidebar.jsx` | Sub-menú lateral colapsable (210px expandido / 64px compacto). |
| `[D1]` | `MAIN_CONTENT_PANEL` | `App.jsx` / `.admin-main` | Panel principal fluido al 100% donde se renderiza la pestaña activa. |
| `[D3]` | `METRICS_KPI_GRID` | `TelemetryDashboard.jsx` | Grid panorámico de 4 columnas auto-adaptativo en monitores de 27". |
| `[E1]` | `CASCADE_ALERT_FLOATING_TOAST` | `AdminTabNavigation.jsx` | Banner flotante persistente de alerta en la esquina superior derecha. |
