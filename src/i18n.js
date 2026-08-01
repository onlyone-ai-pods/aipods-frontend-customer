import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Diccionarios de Traducción Multilingües (SPEC-CORE-44 / SPEC-CORE-45)
const resources = {
  es: {
    translation: {
      welcome: "Bienvenido a AI Pods Enterprise SaaS Platform",
      subtitle: "Plataforma de Inteligencia Artificial para Automatización Empresarial",
      nav_sandbox: "Sandbox Demo",
      nav_vault: "Bóveda de Secretos",
      nav_team: "Gestión de Equipo",
      nav_billing: "Facturación Odoo",
      nav_settings: "Configuración",
      profile_language: "Idioma Preferido",
      profile_region: "País / Región de Operación",
      profile_currency: "Moneda Principal",
      btn_save: "Guardar Preferencias",
      status_active: "Activo"
    }
  },
  pt: {
    translation: {
      welcome: "Bem-vindo ao AI Pods Enterprise SaaS Platform",
      subtitle: "Plataforma de Inteligência Artificial para Automação Empresarial",
      nav_sandbox: "Console Interativo",
      nav_vault: "Cofre de Segredos",
      nav_team: "Gestão de Equipe",
      nav_billing: "Faturamento Odoo",
      nav_settings: "Configurações",
      profile_language: "Idioma Preferido",
      profile_region: "País / Região de Operação",
      profile_currency: "Moeda Principal",
      btn_save: "Salvar Preferências",
      status_active: "Ativo"
    }
  },
  en: {
    translation: {
      welcome: "Welcome to AI Pods Enterprise SaaS Platform",
      subtitle: "AI Automation Platform for Enterprise Operations",
      nav_sandbox: "Interactive Console",
      nav_vault: "Secrets Vault",
      nav_team: "Team Management",
      nav_billing: "Odoo Billing",
      nav_settings: "Settings",
      profile_language: "Preferred Language",
      profile_region: "Country / Region of Operation",
      profile_currency: "Primary Currency",
      btn_save: "Save Preferences",
      status_active: "Active"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      // Orden de detección: Perfil guardado -> navigator.language -> Fallback 'en' (SPEC-CORE-45)
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
