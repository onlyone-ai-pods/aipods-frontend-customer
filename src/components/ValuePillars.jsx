import React from 'react';

export default function ValuePillars() {
  const pillars = [
    {
      icon: "🎯",
      title: "Compras Resultados, no Horas-Hombre",
      desc: "En lugar de facturar horas/hombre por soporte o desarrollo, pagas por el output completado. El software (IA) hace el trabajo pesado a velocidad exponencial."
    },
    {
      icon: "🧠",
      title: "Conocimiento Senior Empaquetado",
      desc: "Las mejores prácticas de AFIP, fiscalidad, Odoo y WMS ya están pre-entrenadas e institucionalizadas en el AI Pod por nuestros socios consultores Seniors."
    },
    {
      icon: "⚡",
      title: "Escalabilidad Instantánea",
      desc: "Si necesitas acelerar la operación de tu empresa, no necesitas contratar ni entrenar más personal. Simplemente multiplicas la capacidad de tus AI Pods."
    }
  ];

  return (
    <section className="pillars-section">
      <h2 className="section-title">¿Por qué &apos;Servicio como Software&apos;?</h2>
      <p className="section-subtitle">Tres pilares comerciales que revolucionan la productividad empresarial</p>
      
      <div className="pillars-grid">
        {pillars.map((p, idx) => (
          <div className="pillar-card" key={idx}>
            <div className="pillar-icon">{p.icon}</div>
            <h3 className="pillar-title">{p.title}</h3>
            <p className="pillar-desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
