'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const DEMO_DATA = {
  winmark: { business_name: 'Winmark Corp', industry: 'Retail Franchising', employees: 90, annual_revenue: 85000000, net_income: 35000000, ebit: 45000000, interest_expense: 500000 },
  photronics: { business_name: 'Photronics Inc', industry: 'Technology / Semiconductor', employees: 1800, annual_revenue: 920000000, net_income: 110000000, ebit: 140000000, interest_expense: 2000000 },
  oildri: { business_name: 'Oil-Dri Corp', industry: 'Consumer Products', employees: 1200, annual_revenue: 380000000, net_income: 22000000, ebit: 32000000, interest_expense: 3000000 },
};

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    business_name: '',
    industry: '',
    employees: '',
    annual_revenue: '',
    net_income: '',
    ebit: '',
    interest_expense: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function loadDemo(key: keyof typeof DEMO_DATA) {
    const d = DEMO_DATA[key];
    setForm({
      business_name: d.business_name,
      industry: d.industry,
      employees: String(d.employees),
      annual_revenue: String(d.annual_revenue),
      net_income: String(d.net_income),
      ebit: String(d.ebit),
      interest_expense: String(d.interest_expense),
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Not authenticated.'); setLoading(false); return; }

    const { error } = await supabase.from('businesses').insert({
      user_id: user.id,
      business_name: form.business_name,
      industry: form.industry || null,
      employees: parseInt(form.employees) || 0,
      annual_revenue: parseFloat(form.annual_revenue) || 0,
      net_income: parseFloat(form.net_income) || 0,
      ebit: parseFloat(form.ebit) || 0,
      interest_expense: parseFloat(form.interest_expense) || 0,
    });

    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push('/');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: '1.5rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: 520 }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.375rem' }}>Set up your business profile</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter your financial data or load demo data to explore the platform.</p>
        </div>

        {/* Demo data buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', alignSelf: 'center' }}>Demo:</span>
          {(Object.keys(DEMO_DATA) as (keyof typeof DEMO_DATA)[]).map(key => (
            <button key={key} onClick={() => loadDemo(key)} className="btn-secondary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
              {DEMO_DATA[key].business_name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Business Name *</label>
              <input className="input" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} placeholder="Acme Corporation" required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="label">Industry</label>
              <input className="input" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} placeholder="e.g. SaaS, HVAC, Retail" />
            </div>
            <div>
              <label className="label">Employees</label>
              <input className="input" type="number" value={form.employees} onChange={e => setForm(f => ({ ...f, employees: e.target.value }))} placeholder="25" min="0" />
            </div>
            <div>
              <label className="label">Annual Revenue ($)</label>
              <input className="input" type="number" value={form.annual_revenue} onChange={e => setForm(f => ({ ...f, annual_revenue: e.target.value }))} placeholder="2500000" min="0" />
            </div>
            <div>
              <label className="label">Net Income ($)</label>
              <input className="input" type="number" value={form.net_income} onChange={e => setForm(f => ({ ...f, net_income: e.target.value }))} placeholder="400000" />
            </div>
            <div>
              <label className="label">EBIT ($)</label>
              <input className="input" type="number" value={form.ebit} onChange={e => setForm(f => ({ ...f, ebit: e.target.value }))} placeholder="500000" />
            </div>
            <div>
              <label className="label">Interest Expense ($)</label>
              <input className="input" type="number" value={form.interest_expense} onChange={e => setForm(f => ({ ...f, interest_expense: e.target.value }))} placeholder="50000" min="0" />
            </div>
          </div>

          {error && (
            <div style={{ marginTop: '1rem', background: 'var(--red-dim)', border: '1px solid var(--red-border)', borderRadius: '0.5rem', padding: '0.625rem', fontSize: '0.8rem', color: 'var(--red)' }}>
              {error}
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center', padding: '0.625rem' }}>
            {loading ? 'Saving...' : 'Launch Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
