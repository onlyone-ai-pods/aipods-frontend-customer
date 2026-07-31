import React, { useState, useEffect } from 'react';

/**
 * BillingView — Módulo de Facturación, Suscripción & Integración Odoo Billing (SPEC-CORE-26 / Issue #8).
 */
export default function BillingView() {
  const [sub, setSub] = useState({
    tenant_id: 'TENANT_DEMO_001',
    plan_name: 'Enterprise Multi-Pod Plan',
    status: 'PROD_ACTIVE',
    tokens_consumed: 142500,
    tokens_limit: 1000000,
    monthly_cost_usd: 299.0,
    next_billing_date: '2026-08-30',
    last_invoice_number: 'INV/2026/00742'
  });

  const [invoices] = useState([
    { id: 'INV/2026/00742', date: '30/07/2026', amount: '$299.00 USD', status: 'PAGADA', method: 'Tarjeta de Crédito (•••• 4242)' },
    { id: 'INV/2026/00511', date: '30/06/2026', amount: '$299.00 USD', status: 'PAGADA', method: 'Transferencia Bancaria Directa' },
    { id: 'INV/2026/00302', date: '30/05/2026', amount: '$299.00 USD', status: 'PAGADA', method: 'MercadoPago Auto-Debit' }
  ]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/billing/subscription?tenant_id=TENANT_DEMO_001');
        if (res.ok) {
          const data = await res.json();
          setSub(data);
        }
      } catch (err) {
        console.log('[BILLING FETCH NOTE]', err.message);
      }
    };
    fetchSubscription();
  }, []);

  const tokenPercent = Math.round((sub.tokens_consumed / sub.tokens_limit) * 100);

  return (
    <div className="billing-view-container" style={{ padding: '30px 24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div className="billing-header" style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          💳 Facturación, Suscripción & Odoo ERP Billing
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: '6px 0 0 0', fontSize: '0.9rem' }}>
          Sincronización en tiempo real vía JSON-RPC con Odoo Billing y estado de aprovisionamiento de AI Pods (SPEC-CORE-26).
        </p>
      </div>

      {/* Grid de Estado & Consumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Card 1: Subscription Status */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suscripción Actual</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', padding: '3px 10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              🟢 {sub.status}
            </span>
          </div>

          <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: 'var(--text-main)' }}>{sub.plan_name}</h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
            ${sub.monthly_cost_usd} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ mes</span>
          </p>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div>📄 Última Factura Odoo: <strong>{sub.last_invoice_number}</strong></div>
            <div>🗓️ Próximo Ciclo de Cobro: <strong>{typeof sub.next_billing_date === 'string' ? sub.next_billing_date.substring(0, 10) : '2026-08-30'}</strong></div>
          </div>
        </div>

        {/* Card 2: Token Meter */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Bolsa de Tokens del Mes</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>{tokenPercent}% Consumido</span>
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-main)' }}>
            {sub.tokens_consumed.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ {sub.tokens_limit.toLocaleString()} Tokens</span>
          </div>

          {/* Progress Bar */}
          <div style={{ width: '100%', height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden', margin: '12px 0 16px 0' }}>
            <div style={{ width: `${tokenPercent}%`, height: '100%', background: 'linear-gradient(90deg, #00f2fe, #4facfe)', borderRadius: '4px' }}></div>
          </div>

          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            💡 Incluye inferencias RAG, ejecuciones Dry-Run y llamadas a los Pods AFIP/Odoo.
          </p>
        </div>
      </div>

      {/* Historial de Comprobantes Odoo */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📑 Historial de Facturas Sincronizadas (Odoo ERP)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>N° Factura</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Fecha Emitida</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Monto Total</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Método de Pago</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Descargar</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--accent-cyan)' }}>{inv.id}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{inv.date}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--text-main)' }}>{inv.amount}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>{inv.method}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: '700', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>📄 PDF</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
