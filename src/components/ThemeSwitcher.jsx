import React from 'react';

/**
 * ThemeSwitcher — Componente para conmutación de los 3 Temas Visuales (SPEC-CORE-22).
 *
 * Temas:
 *  - 'dark': Dark Neon / Cyber Glassmorphism (Default)
 *  - 'light': Light Clean Enterprise
 *  - 'accessible': High Contrast WCAG 2.1 AAA
 */
export default function ThemeSwitcher({ currentTheme, onThemeChange }) {
  return (
    <div className="theme-switcher-container" title="Seleccionar Tema Visual (SPEC-CORE-22)">
      <button
        className={`theme-btn ${currentTheme === 'dark' ? 'active' : ''}`}
        onClick={() => onThemeChange('dark')}
        aria-label="Modo Dark Neon"
      >
        🌙 Dark
      </button>
      <button
        className={`theme-btn ${currentTheme === 'light' ? 'active' : ''}`}
        onClick={() => onThemeChange('light')}
        aria-label="Modo Light Clean"
      >
        ☀️ Light
      </button>
      <button
        className={`theme-btn ${currentTheme === 'accessible' ? 'active' : ''}`}
        onClick={() => onThemeChange('accessible')}
        aria-label="Modo Alta Accesibilidad WCAG AAA"
      >
        ♿ Accesible
      </button>
    </div>
  );
}
