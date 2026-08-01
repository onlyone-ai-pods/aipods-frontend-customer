import React from 'react';

/**
 * ThemeSwitcher — Switcher Discreto de Temas Visuales (SPEC-CORE-22 / SPEC-CORE-45).
 */
export default function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value)}
        aria-label="Seleccionar Tema Visual"
        style={{
          background: 'var(--bg-input)',
          color: 'var(--text-main)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          padding: '6px 12px',
          fontSize: '0.82rem',
          fontWeight: '700',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
      >
        <option value="dark">🌙 Oscuro</option>
        <option value="light">☀️ Claro</option>
        <option value="accessible">👁️ Accesible</option>
      </select>
    </div>
  );
}
